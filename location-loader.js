// ====================================================
// 공통 위치 로더
// 우선순위: URL 파라미터 -> localStorage/sessionStorage -> 기본값
// Signalink iframe처럼 Storage가 막힌 환경에서도 URL만으로 동작한다.
// ====================================================

(function() {
    const LOCATION_SESSION_KEY = 'pageLocationData';
    const FORCE_UPDATE_KEY = 'forceLocationUpdate';
    const DEFAULT_LOCATION_DATA = {
        lat: 37.5665,
        lon: 126.9780,
        name: 'SEOUL',
        sido: '서울',
        station: '중구'
    };

    function safeGetStorage(storageName, key) {
        try {
            const storage = window[storageName];
            return storage.getItem(key);
        } catch (error) {
            console.warn('Storage access blocked:', key, error);
            return null;
        }
    }

    function safeSetStorage(storageName, key, value) {
        try {
            const storage = window[storageName];
            storage.setItem(key, value);
            return true;
        } catch (error) {
            console.warn('Storage access blocked:', key, error);
            return false;
        }
    }

    function safeRemoveStorage(storageName, key) {
        try {
            const storage = window[storageName];
            storage.removeItem(key);
            return true;
        } catch (error) {
            console.warn('Storage access blocked:', key, error);
            return false;
        }
    }

    function normalizeLocationData(source) {
        if (!source || typeof source !== 'object') return null;

        const lat = Number(source.lat ?? source.latitude);
        const lon = Number(source.lon ?? source.lng ?? source.longitude);

        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

        const name =
            source.name ||
            source.station ||
            source.stationName ||
            DEFAULT_LOCATION_DATA.name;

        return {
            lat,
            lon,
            name,
            sido: source.sido || source.admin1 || DEFAULT_LOCATION_DATA.sido,
            station: source.station || source.stationName || name
        };
    }

    function getUrlLocation() {
        const params = new URLSearchParams(window.location.search);

        const urlLat = params.get('lat');
        const urlLon = params.get('lon');
        const urlName = params.get('name');

        if (urlLat && urlLon) {
            return normalizeLocationData({
                lat: urlLat,
                lon: urlLon,
                name: urlName || DEFAULT_LOCATION_DATA.name,
                sido: params.get('sido') || DEFAULT_LOCATION_DATA.sido,
                station: params.get('station') || urlName || DEFAULT_LOCATION_DATA.station
            });
        }

        return null;
    }

    function parseStoredLocation(saved, key) {
        if (!saved) return null;

        try {
            return normalizeLocationData(JSON.parse(saved));
        } catch (error) {
            console.warn('Storage parse error:', key, error);
            return null;
        }
    }

    function getTabLocation() {
        const sessionData = safeGetStorage('sessionStorage', LOCATION_SESSION_KEY);
        const locationData = parseStoredLocation(sessionData, LOCATION_SESSION_KEY);

        if (locationData) {
            console.log('위치 로더: sessionStorage에서 읽음', locationData);
        }

        return locationData;
    }

    function getStorageLocation() {
        const storageKeys = ['weatherLocation', 'weather-location'];

        for (const key of storageKeys) {
            const locationData = parseStoredLocation(
                safeGetStorage('localStorage', key),
                key
            );

            if (locationData) {
                console.log('위치 로더: localStorage에서 읽음', locationData);
                return locationData;
            }
        }

        return null;
    }

    function initializePageLocation() {
        const urlLocation = getUrlLocation();
        if (urlLocation) {
            console.log('위치 로더: URL 파라미터 우선 적용', urlLocation);
            return urlLocation;
        }

        const tabLocation = getTabLocation();
        const storageLocation = getStorageLocation();
        const forceUpdate = safeGetStorage('sessionStorage', FORCE_UPDATE_KEY);

        if (forceUpdate) {
            safeRemoveStorage('sessionStorage', FORCE_UPDATE_KEY);
        }

        if (!tabLocation && storageLocation) {
            safeSetStorage('sessionStorage', LOCATION_SESSION_KEY, JSON.stringify(storageLocation));
            return storageLocation;
        }

        if (forceUpdate && storageLocation) {
            safeSetStorage('sessionStorage', LOCATION_SESSION_KEY, JSON.stringify(storageLocation));
            return storageLocation;
        }

        if (tabLocation) {
            return tabLocation;
        }

        return null;
    }

    function getLocationData() {
        return initializePageLocation() || { ...DEFAULT_LOCATION_DATA };
    }

    function applySavedLocation() {
        if (typeof CONFIG === 'undefined') {
            console.warn('위치 로더: CONFIG가 아직 없어 100ms 후 다시 시도합니다.');
            setTimeout(applySavedLocation, 100);
            return false;
        }

        const locationData = getLocationData();

        CONFIG.LAT = Number(locationData.lat);
        CONFIG.LON = Number(locationData.lon);
        CONFIG.AIR_QUALITY_SIDO = locationData.sido || CONFIG.AIR_QUALITY_SIDO;
        CONFIG.AIR_QUALITY_STATION =
            locationData.station ||
            locationData.name ||
            CONFIG.AIR_QUALITY_STATION;

        console.log('위치 로더: CONFIG 업데이트', {
            위도: CONFIG.LAT,
            경도: CONFIG.LON,
            측정소: CONFIG.AIR_QUALITY_STATION
        });

        updatePageTitle(locationData);
        return true;
    }

    function updatePageTitle(locationData) {
        const displayName =
            locationData?.name ||
            locationData?.station ||
            (typeof CONFIG !== 'undefined' ? CONFIG.AIR_QUALITY_STATION : '');

        const titleElement =
            document.querySelector('.location') ||
            document.getElementById('location-title') ||
            document.querySelector('header h1') ||
            document.querySelector('h1.school-name') ||
            document.querySelector('header h1.school-name') ||
            document.querySelector('article h3') ||
            document.querySelector('h3');

        if (titleElement && displayName) {
            titleElement.textContent = displayName.toUpperCase();
            console.log('위치 로더: 지역명 업데이트:', displayName);
        }
    }

    function initialize() {
        console.log('위치 로더: 초기화 시작');
        applySavedLocation();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 50);
    }

    window.LocationLoader = {
        getLocationData,
        getUrlLocation,
        getTabLocation,
        getStorageLocation,
        initializePageLocation,
        applySavedLocation
    };

    console.log('위치 로더: 스크립트 로드 완료');
})();
