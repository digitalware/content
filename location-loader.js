// ====================================================
// 공통 위치 로더 - 모든 페이지에서 사용
// 각 탭이 독립적으로 localStorage의 위치값을 읽어서
// sessionStorage에 저장하고 사용
// ====================================================

(function() {
    const LOCATION_SESSION_KEY = 'pageLocationData';

    // sessionStorage에서 이 탭의 위치값 가져오기
    function getTabLocation() {
        try {
            const sessionData = sessionStorage.getItem(LOCATION_SESSION_KEY);
            if (sessionData) {
                const locationData = JSON.parse(sessionData);
                console.log('위치 로더: sessionStorage에서 읽음', locationData);
                return locationData;
            }
        } catch (error) {
            console.error('위치 로더: sessionStorage 읽기 실패', error);
        }
        return null;
    }

    // localStorage에서 현재 위치값 읽기
    function getStorageLocation() {
        try {
            const saved = localStorage.getItem('weatherLocation');
            console.log('위치 로더: localStorage 값:', saved);
            
            if (saved) {
                const locationData = JSON.parse(saved);
                const lat = Number(locationData.lat);
                const lon = Number(locationData.lon);
                
                if (Number.isFinite(lat) && Number.isFinite(lon)) {
                    console.log('위치 로더: 유효한 위치 데이터', locationData);
                    return locationData;
                }
            }
        } catch (error) {
            console.error('위치 로더: localStorage 읽기 실패', error);
        }
        return null;
    }

    // 페이지가 로드될 때마다 위치값 체크
    function initializePageLocation() {
        console.log('위치 로더: 페이지 위치 초기화 시작');
        
        const FORCE_UPDATE_KEY = 'forceLocationUpdate';
        
        // sessionStorage에 이미 저장된 값 (이 탭의 독립 저장소)
        const tabLocation = getTabLocation();
        
        // localStorage에서 현재 위치값 읽기
        const storageLocation = getStorageLocation();
        
        // 강제 업데이트 플래그 확인
        const forceUpdate = sessionStorage.getItem(FORCE_UPDATE_KEY);
        console.log('위치 로더: 강제 업데이트 플래그:', forceUpdate);
        
        // 플래그 제거 (한 번만 사용)
        if (forceUpdate) {
            sessionStorage.removeItem(FORCE_UPDATE_KEY);
        }
        
        console.log('위치 로더: 현재 상태', {
            tabLocation: tabLocation,
            storageLocation: storageLocation,
            forceUpdate: forceUpdate
        });
        
        // 첫 방문 (sessionStorage가 비어있음)
        if (!tabLocation && storageLocation) {
            console.log('위치 로더: 첫 방문, localStorage → sessionStorage');
            sessionStorage.setItem(LOCATION_SESSION_KEY, JSON.stringify(storageLocation));
            return storageLocation;
        }
        
        // 강제 업데이트 플래그 있을 때만 (명시적으로 "적용" 버튼 클릭했을 때)
        if (forceUpdate && storageLocation) {
            console.log('위치 로더: 강제 업데이트로 위치 변경', {
                이전: tabLocation,
                현재: storageLocation
            });
            sessionStorage.setItem(LOCATION_SESSION_KEY, JSON.stringify(storageLocation));
            return storageLocation;
        }
        
        // 정상 상황: sessionStorage 유지 (다른 탭의 영향 무시)
        if (tabLocation) {
            console.log('위치 로더: sessionStorage 유지, 다른 탭 무시');
            return tabLocation;
        }

        console.log('위치 로더: 저장된 위치 없음');
        return null;
    }

    // CONFIG에 위치값 적용
    function applySavedLocation() {
        if (typeof CONFIG === 'undefined') {
            console.warn('위치 로더: CONFIG가 정의되지 않음, 100ms 후 재시도');
            setTimeout(applySavedLocation, 100);
            return;
        }

        const locationData = initializePageLocation();
        if (!locationData) {
            console.log('위치 로더: 위치값 없음, 기본값 사용');
            return false;
        }

        CONFIG.LAT = Number(locationData.lat);
        CONFIG.LON = Number(locationData.lon);
        if (locationData.sido) CONFIG.AIR_QUALITY_SIDO = locationData.sido;
        if (locationData.station) CONFIG.AIR_QUALITY_STATION = locationData.station;
        
        console.log('위치 로더: CONFIG 업데이트', {
            위도: CONFIG.LAT,
            경도: CONFIG.LON,
            측정소: CONFIG.AIR_QUALITY_STATION
        });
        
        updatePageTitle();
        return true;
    }

    // 페이지 제목 업데이트
    function updatePageTitle() {
        let titleElement = document.querySelector('header h1');
        if (!titleElement) titleElement = document.querySelector('h1.school-name');
        if (!titleElement) titleElement = document.querySelector('header h1.school-name');
        if (!titleElement) titleElement = document.querySelector('article h3');
        if (!titleElement) titleElement = document.querySelector('h3');
        
        if (titleElement && typeof CONFIG !== 'undefined' && CONFIG.AIR_QUALITY_STATION) {
            titleElement.textContent = CONFIG.AIR_QUALITY_STATION;
            console.log('위치 로더: 제목 업데이트:', CONFIG.AIR_QUALITY_STATION);
        }
    }

    // 초기화
    function initialize() {
        console.log('위치 로더: DOM 준비 완료, 초기화 시작');
        applySavedLocation();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 50);
    }

    window.LocationLoader = {
        getTabLocation: getTabLocation,
        getStorageLocation: getStorageLocation,
        initializePageLocation: initializePageLocation,
        applySavedLocation: applySavedLocation
    };
    
    console.log('위치 로더: 스크립트 로드 완료');
})();
