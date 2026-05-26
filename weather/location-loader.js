// ====================================================
// 공통 위치 로더 - 모든 페이지에서 사용
// index.html에서 저장한 위치를 자동으로 로드
// ====================================================

(function() {
    // localStorage에서 저장된 위치 읽기
    function getStoredLocation() {
        try {
            const savedLocation = localStorage.getItem('weatherLocation');
            if (!savedLocation) return null;
            const locationData = JSON.parse(savedLocation);
            const lat = Number(locationData.lat);
            const lon = Number(locationData.lon);
            if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
            return locationData;
        } catch (error) {
            localStorage.removeItem('weatherLocation');
            return null;
        }
    }

    // CONFIG에 저장된 위치 적용
    function applySavedLocation() {
        // CONFIG가 정의될 때까지 대기
        if (typeof CONFIG === 'undefined') {
            console.warn('위치 로더: CONFIG가 아직 정의되지 않음, 100ms 후 재시도');
            setTimeout(applySavedLocation, 100);
            return;
        }

        const locationData = getStoredLocation();
        if (!locationData) {
            console.log('위치 로더: 저장된 위치 없음, 기본값 사용');
            return false;
        }

        CONFIG.LAT = Number(locationData.lat);
        CONFIG.LON = Number(locationData.lon);
        if (locationData.sido) CONFIG.AIR_QUALITY_SIDO = locationData.sido;
        if (locationData.station) CONFIG.AIR_QUALITY_STATION = locationData.station;
        
        console.log('위치 로더: 저장된 위치 적용 완료', {
            위도: CONFIG.LAT,
            경도: CONFIG.LON,
            측정소: CONFIG.AIR_QUALITY_STATION
        });
        
        updatePageTitle();
        return true;
    }

    // 페이지 준비 후 제목 업데이트
    function updatePageTitle() {
        // h1 요소 찾기 (다양한 선택자 시도)
        let titleElement = document.querySelector('header h1');
        if (!titleElement) titleElement = document.querySelector('h1.school-name');
        if (!titleElement) titleElement = document.querySelector('header h1.school-name');
        // 2페이지처럼 h3를 사용하는 경우
        if (!titleElement) titleElement = document.querySelector('article h3');
        if (!titleElement) titleElement = document.querySelector('h3');
        
        if (titleElement && typeof CONFIG !== 'undefined' && CONFIG.AIR_QUALITY_STATION) {
            titleElement.textContent = CONFIG.AIR_QUALITY_STATION;
            console.log('위치 로더: 페이지 제목 업데이트:', CONFIG.AIR_QUALITY_STATION);
        }
    }

    // DOM 준비 후 위치 적용 및 제목 업데이트
    function initializeLocation() {
        applySavedLocation();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeLocation);
    } else {
        // 약간의 지연을 두고 실행 (script.js가 로드될 시간 확보)
        setTimeout(initializeLocation, 50);
    }

    // 전역으로 함수 공개 (필요시 외부에서 호출 가능)
    window.LocationLoader = {
        getStoredLocation: getStoredLocation,
        applySavedLocation: applySavedLocation,
        updatePageTitle: updatePageTitle
    };
})();
