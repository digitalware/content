let CONFIG = {
    LAT: 37.84799164,
    LON: 126.881304329,
    OPENWEATHER_API_KEY: '91fff999310c2bdea1978b3f0925fb38',
    AIRKOREA_API_KEY: 'LpbxvHd66SUzZo6IHfnUEMOQD8lwIi8HwVLL3p07Nm2g1SVDXKp2d8PjtTuGRVme2OptAd8ZFNvT7IzmuaSNdg%3D%3D',
    AIR_QUALITY_SIDO: '경기',
    AIR_QUALITY_STATION: '기흥'
};
function safeStorageGetItem(key) {
    try {
        return window.localStorage.getItem(key);
    } catch (error) {
        console.warn('Storage access blocked:', key, error);
        return null;
    }
}

function safeStorageSetItem(key, value) {
    try {
        window.localStorage.setItem(key, value);
    } catch (error) {
        console.warn('Storage access blocked:', key, error);
    }
}

function safeStorageRemoveItem(key) {
    try {
        window.localStorage.removeItem(key);
    } catch (error) {
        console.warn('Storage access blocked:', key, error);
    }
}

function getLocationData() {
    if (window.LocationLoader && typeof window.LocationLoader.getLocationData === 'function') {
        return window.LocationLoader.getLocationData();
    }

    const params = new URLSearchParams(window.location.search);

    const urlLat = params.get('lat');
    const urlLon = params.get('lon');
    const urlName = params.get('name');

    if (urlLat && urlLon) {
        const lat = parseFloat(urlLat);
        const lon = parseFloat(urlLon);

        if (Number.isFinite(lat) && Number.isFinite(lon)) {
            return {
                lat,
                lon,
                name: urlName || 'SEOUL',
                sido: params.get('sido') || '서울',
                station: params.get('station') || urlName || '중구'
            };
        }
    }

    const storageKeys = ['weatherLocation', 'weather-location'];

    for (const key of storageKeys) {
        const saved = safeStorageGetItem(key);
        if (!saved) continue;

        try {
            const parsed = JSON.parse(saved);
            const lat = Number(parsed.lat);
            const lon = Number(parsed.lon);

            if (Number.isFinite(lat) && Number.isFinite(lon)) {
                const name = parsed.name || parsed.station || 'SEOUL';

                return {
                    lat,
                    lon,
                    name,
                    sido: parsed.sido || '서울',
                    station: parsed.station || name
                };
            }
        } catch (error) {
            console.warn('Storage parse error:', error);
        }
    }

    return {
        lat: 37.5665,
        lon: 126.9780,
        name: 'SEOUL',
        sido: '서울',
        station: '중구'
    };
}

function hasUrlLocationData() {
    const params = new URLSearchParams(window.location.search);
    return Boolean(params.get('lat') && params.get('lon'));
}

const LOCATION_DATA = getLocationData();
const LAT = LOCATION_DATA.lat;
const LON = LOCATION_DATA.lon;

CONFIG.LAT = LAT;
CONFIG.LON = LON;
CONFIG.AIR_QUALITY_SIDO = LOCATION_DATA.sido || CONFIG.AIR_QUALITY_SIDO;
CONFIG.AIR_QUALITY_STATION = LOCATION_DATA.station || LOCATION_DATA.name || CONFIG.AIR_QUALITY_STATION;

const locationElement = document.querySelector('.location');

if (locationElement) {
    locationElement.textContent = (LOCATION_DATA.name || CONFIG.AIR_QUALITY_STATION || 'SEOUL').toUpperCase();
}

const locationTitleElement = document.getElementById('location-title');

if (locationTitleElement) {
    locationTitleElement.textContent = (LOCATION_DATA.name || CONFIG.AIR_QUALITY_STATION || 'SEOUL').toUpperCase();
}

// location-loader.js에서 CONFIG가 자동 업데이트됨

console.log('페이지 8 초기 설정:', {
    위도: CONFIG.LAT,
    경도: CONFIG.LON,
    측정소: CONFIG.AIR_QUALITY_STATION
});
 
// 시간 표시
function updateDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekDay = weekDays[now.getDay()];
 
    let hours = now.getHours();
    const ampm = hours >= 12 ? '오후' : '오전';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const displayHours = String(hours).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
 
    const dateString = `${year}년 ${month}월 ${day}일 ${weekDay}요일`;
    const timeString = `${ampm} ${displayHours}:${minutes}`;
 
    document.getElementById('date-time').innerHTML = `${dateString} ${timeString}`;

}
 
// 날씨 아이콘 매핑
function getWeatherInfo(weatherMain, weatherDescription, iconCode, isDay = true) {
    const mainWeatherMap = {
        'Clear': { text: '맑음', icon: isDay ? 'images/1.png' : 'images/15.png' },
        'Clouds': { text: '구름', icon: getCloudIcon(weatherDescription, isDay) },
        'Rain': { text: '비', icon: getRainIcon(weatherDescription) },
        'Drizzle': { text: '이슬비', icon: 'images/14.png' },
        'Thunderstorm': { text: '뇌우', icon: 'images/7.png' },
        'Snow': { text: '눈', icon: 'images/5.png' },
        'Mist': { text: '안개', icon: 'images/16.png' },
        'Fog': { text: '짙은 안개', icon: 'images/16.png' },
        'Smoke': { text: '연기', icon: 'images/16.png' },
        'Haze': { text: '실안개', icon: 'images/16.png' },
        'Dust': { text: '먼지', icon: 'images/11.png' },
        'Sand': { text: '모래바람', icon: 'images/11.png' },
        'Ash': { text: '화산재', icon: 'images/16.png' },
        'Squall': { text: '돌풍', icon: 'images/11.png' },
        'Tornado': { text: '토네이도', icon: 'images/11.png' }
    };
 
    function getCloudIcon(description, isDay) {
        const desc = description.toLowerCase();
        if (desc.includes('few clouds')) return isDay ? 'images/3.png' : 'images/15.png';
        if (desc.includes('scattered clouds') || desc.includes('broken clouds')) return 'images/2.png';
        if (desc.includes('overcast')) return 'images/8.png';
        return 'images/2.png';
    }
 
    function getRainIcon(description) {
        const desc = description.toLowerCase();
        if (desc.includes('light rain') || desc.includes('drizzle')) return 'images/14.png';
        if (desc.includes('heavy rain') || desc.includes('extreme rain')) return 'images/6.png';
        if (desc.includes('thunderstorm')) return 'images/7.png';
        return 'images/4.png';
    }
 
    return mainWeatherMap[weatherMain] || { text: weatherMain, icon: 'images/1.png' };
}
 
function getWeatherIconUrl(iconCode) {
    const isDay = iconCode.endsWith('d');
    let weatherMain = 'Clear';
    let weatherDescription = '맑음';
 
    if (iconCode.startsWith('01')) { weatherMain = 'Clear'; weatherDescription = '맑음'; }
    else if (iconCode.startsWith('02')) { weatherMain = 'Clouds'; weatherDescription = '구름 조금'; }
    else if (iconCode.startsWith('03')) { weatherMain = 'Clouds'; weatherDescription = '구름 많음'; }
    else if (iconCode.startsWith('04')) { weatherMain = 'Clouds'; weatherDescription = '흐림'; }
    else if (iconCode.startsWith('09')) { weatherMain = 'Rain'; weatherDescription = '가벼운 비'; }
    else if (iconCode.startsWith('10')) { weatherMain = 'Rain'; weatherDescription = '비'; }
    else if (iconCode.startsWith('11')) { weatherMain = 'Thunderstorm'; weatherDescription = '뇌우'; }
    else if (iconCode.startsWith('13')) { weatherMain = 'Snow'; weatherDescription = '눈'; }
    else if (iconCode.startsWith('50')) { weatherMain = 'Mist'; weatherDescription = '안개'; }
 
    return getWeatherInfo(weatherMain, weatherDescription, iconCode, isDay).icon;
}

function getCurrentWeatherIconUrl(iconCode) {
    const iconPath = getWeatherIconUrl(iconCode);
    const mainIconMap = {
        'images/1.png': 'images/1main.png',
        'images/2.png': 'images/2main.png',
        'images/3.png': 'images/3main.png',
        'images/4.png': 'images/4main.png',
        'images/5.png': 'images/5main.png',
        'images/7.png': 'images/7main.png',
        'images/15.png': 'images/15main.png'
    };

    return mainIconMap[iconPath] || iconPath;
}
 
// ──────────────────────────────────────────────
// 대기질 등급 설정
// ──────────────────────────────────────────────
const gradeConfig = {
    '좋음':    { priority: 1, className: 'grade-good',     desc: '공기가 매우 깨끗합니다 😊' },
    '보통':    { priority: 2, className: 'grade-moderate', desc: '큰 문제는 없지만 민감군은 주의하세요' },
    '나쁨':    { priority: 3, className: 'grade-bad',      desc: '마스크 착용을 권장합니다' },
    '매우나쁨': { priority: 4, className: 'grade-very-bad', desc: '외출을 자제하세요 🚨' }
};
 
function getAirQualityGrade(value, type) {
    let grade = '좋음';
    if (type === 'pm10') {
        if (value > 150) grade = '매우나쁨';
        else if (value > 80) grade = '나쁨';
        else if (value > 30) grade = '보통';
    } else if (type === 'pm25') {
        if (value > 75) grade = '매우나쁨';
        else if (value > 35) grade = '나쁨';
        else if (value > 15) grade = '보통';
    }
    return { grade, ...gradeConfig[grade] };
}
 
// ──────────────────────────────────────────────
// [FIX] 중복 함수 제거 후 단일 displayAirQualityData
// - 등급 텍스트(p)에 grade 클래스 적용 → CSS로 색상 처리
// ──────────────────────────────────────────────
function displayAirQualityData(data) {
    const pm10Value = data.pm10Value === "-" || data.pm10Value === null ? 0 : parseFloat(data.pm10Value);
    const pm25Value = data.pm25Value === "-" || data.pm25Value === null ? 0 : parseFloat(data.pm25Value);

    const pm10Info = getAirQualityGrade(pm10Value, 'pm10');
    const pm25Info = getAirQualityGrade(pm25Value, 'pm25');

    const isPm10Valid = pm10Value > 0 && !isNaN(pm10Value);
    const isPm25Valid = pm25Value > 0 && !isNaN(pm25Value);
    const pm10Display = Number.isInteger(pm10Value) ? String(pm10Value) : pm10Value.toFixed(1);
    const pm25Display = Number.isInteger(pm25Value) ? String(pm25Value) : pm25Value.toFixed(1);

    // 수치 표시
    document.getElementById('pm10').innerHTML = isPm10Valid ? `${pm10Display} <em>㎍/㎥</em>` : '측정 중';
    document.getElementById('pm25').innerHTML = isPm25Valid ? `${pm25Display} <em>㎍/㎥</em>` : '측정 중';

    const pm10NumberEl = document.getElementById('pm10-number');
    if (pm10NumberEl) pm10NumberEl.textContent = isPm10Valid ? Math.round(pm10Value) : '--';

    const pm25NumberEl = document.getElementById('pm25-number');
    if (pm25NumberEl) pm25NumberEl.textContent = isPm25Valid ? Math.round(pm25Value) : '--';

    // 등급 텍스트 + 색상 클래스 적용 (article > p)
    const pm10GradeEl = document.getElementById('pm10-grade');
    pm10GradeEl.textContent = isPm10Valid ? pm10Info.grade : '-';
    pm10GradeEl.className = isPm10Valid ? pm10Info.className : '';   // CSS에서 색상 지정

    const pm25GradeEl = document.getElementById('pm25-grade');
    pm25GradeEl.textContent = isPm25Valid ? pm25Info.grade : '-';
    pm25GradeEl.className = isPm25Valid ? pm25Info.className : '';

    // 카드 배경색 클래스 적용
    document.getElementById('pm10-card').className = `air-quality-card ${isPm10Valid ? pm10Info.className : ''}`;
    document.getElementById('pm25-card').className = `air-quality-card ${isPm25Valid ? pm25Info.className : ''}`;
}
 
// 현재 날씨 정보
async function getCurrentWeather() {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=metric&lang=kr`);
        const data = await res.json();
        if (!res.ok || !data?.main || !data?.weather?.length) {
            throw new Error(data?.message || `OpenWeather current weather error: ${res.status}`);
        }

        document.getElementById('current-temp').textContent = `${Math.round(data.main.temp)}°`;
        document.getElementById('current-weather').textContent = (data.weather[0].description || '').replace('온흐림', '흐림');
        document.getElementById('current-wind').textContent = `${data.wind.speed} m/s`;
        document.getElementById('current-humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('current-clouds').textContent = `${data.clouds?.all ?? 0}%`;
        document.getElementById('current-temp-max').textContent = `${Math.round(data.main.feels_like ?? data.main.temp)}°`;
        document.getElementById('current-weather-icon').src = getCurrentWeatherIconUrl(data.weather[0].icon);
        return data;
    } catch (error) {
        console.error('날씨 정보 가져오기 실패:', error);
        return null;
    }
}
 
// 5일 예보
async function getForecastWeather() {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=metric&lang=kr`);
        const data = await res.json();
        if (!res.ok || !Array.isArray(data?.list)) {
            throw new Error(data?.message || `OpenWeather forecast error: ${res.status}`);
        }

        const today = new Date();
        let idx = 1;
        for (let i = 1; i <= 5; i++) {
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + i);
            const dayForecasts = data.list.filter(item => {
                const itemDate = new Date(item.dt * 1000);
                return itemDate.getDate() === targetDate.getDate();
            });
            if (dayForecasts.length === 0) continue;

            const maxTemp = Math.max(...dayForecasts.map(f => f.main.temp_max));
            const minTemp = Math.min(...dayForecasts.map(f => f.main.temp_min));

            let forecast = dayForecasts.find(item => {
                const hour = new Date(item.dt * 1000).getHours();
                return hour >= 9 && hour <= 18;
            });
            if (!forecast && dayForecasts.length > 0) forecast = dayForecasts[0];
            if (forecast) {
                document.getElementById(`forecast${idx}-date`).textContent = targetDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
                document.getElementById(`forecast${idx}-icon`).src = getWeatherIconUrl(forecast.weather[0].icon);
                document.getElementById(`forecast${idx}-temp`).textContent = `${Math.round(maxTemp)}° / ${Math.round(minTemp)}°`;
                document.getElementById(`forecast${idx}-desc`).textContent = (forecast.weather[0].description || '').replace('온흐림', '흐림');
                idx++;
            }
        }
        return data;
    } catch (error) {
        console.error('예보 정보 가져오기 실패:', error);
        return null;
    }
}
 
// 날씨 데이터를 화면에 표시 (캐시 복원용)
function displayWeatherData(weatherData) {
    if (weatherData.current) {
        const current = weatherData.current;
        document.getElementById('current-temp').textContent = `${Math.round(current.main.temp)}°`;
        document.getElementById('current-weather').textContent = (current.weather[0].description || '').replace('온흐림', '흐림');
        document.getElementById('current-wind').textContent = `${current.wind.speed} m/s`;
        document.getElementById('current-humidity').textContent = `${current.main.humidity}%`;
        document.getElementById('current-clouds').textContent = `${current.clouds?.all ?? 0}%`;
        document.getElementById('current-temp-max').textContent = `${Math.round(current.main.feels_like ?? current.main.temp)}°`;
        document.getElementById('current-weather-icon').src = getCurrentWeatherIconUrl(current.weather[0].icon);
    }
    if (weatherData.forecast) {
        const today = new Date();
        let idx = 1;
        for (let i = 1; i <= 5; i++) {
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + i);
            const dayForecasts = weatherData.forecast.list.filter(item => {
                return new Date(item.dt * 1000).getDate() === targetDate.getDate();
            });
            if (dayForecasts.length === 0) continue;

            const maxTemp = Math.max(...dayForecasts.map(f => f.main.temp_max));
            const minTemp = Math.min(...dayForecasts.map(f => f.main.temp_min));

            let forecast = dayForecasts.find(item => {
                const hour = new Date(item.dt * 1000).getHours();
                return hour >= 9 && hour <= 18;
            });
            if (!forecast && dayForecasts.length > 0) forecast = dayForecasts[0];
            if (forecast) {
                document.getElementById(`forecast${idx}-date`).textContent = targetDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
                document.getElementById(`forecast${idx}-icon`).src = getWeatherIconUrl(forecast.weather[0].icon);
                document.getElementById(`forecast${idx}-temp`).textContent = `${Math.round(maxTemp)}° / ${Math.round(minTemp)}°`;
                document.getElementById(`forecast${idx}-desc`).textContent = (forecast.weather[0].description || '').replace('온흐림', '흐림');
                idx++;
            }
        }
    }
}
 
// 대기질 API
async function getAirQuality() {
    try {
        if (!CONFIG.AIRKOREA_API_KEY || CONFIG.AIRKOREA_API_KEY.trim() === '') {
            console.warn('대기질 API 키가 설정되지 않았습니다. 모의 데이터를 사용합니다.');
            generateMockAirQualityData();
            return;
        }
 
        let serviceKey = CONFIG.AIRKOREA_API_KEY;
        if (!serviceKey.includes('%')) serviceKey = encodeURIComponent(serviceKey);
 
        const queryParams = new URLSearchParams({
            returnType: 'json',
            numOfRows: '100',
            pageNo: '1',
            sidoName: CONFIG.AIR_QUALITY_SIDO,
            ver: '1.0'
        });
 
        const url = `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=${serviceKey}&${queryParams}`;
        const res = await fetch(url);
 
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
 
        const responseText = await res.text();
        if (responseText.includes('SERVICE_KEY_IS_NOT_REGISTERED_ERROR') ||
            responseText.includes('LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR') ||
            responseText.includes('SERVICE ERROR')) {
            throw new Error('API 오류');
        }
 
        const data = JSON.parse(responseText);
 
        if (data.response?.body?.items?.length > 0) {
            const items = data.response.body.items;
            let bestItem = items.find(item => item.stationName === CONFIG.AIR_QUALITY_STATION);
            if (!bestItem) {
                let bestScore = -1;
                for (const item of items) {
                    let score = 0;
                    if (item.pm10Value && item.pm10Value !== "-" && item.pm10Flag !== "통신장애") score += 2;
                    if (item.pm25Value && item.pm25Value !== "-" && item.pm25Flag !== "통신장애") score += 2;
                    if (item.mangName === "도시대기") score += 1;
                    if (score > bestScore) { bestScore = score; bestItem = item; }
                }
            }
            if (bestItem) {
                const transformedData = {
                    stationName: bestItem.stationName,
                    dataTime: bestItem.dataTime,
                    pm10Value: bestItem.pm10Value,
                    pm25Value: bestItem.pm25Value
                };
                displayAirQualityData(transformedData);
                saveAirQualityDataToCache(transformedData);
            } else {
                generateMockAirQualityData();
            }
        } else {
            generateMockAirQualityData();
        }
    } catch (error) {
        console.error('대기질 정보 가져오기 실패:', error);
        generateMockAirQualityData();
    }
}
 
function generateMockAirQualityData() {
    const mockData = {
        stationName: `${CONFIG.AIR_QUALITY_STATION} 지역`,
        dataTime: new Date().toLocaleString('ko-KR'),
        pm10Value: Math.floor(Math.random() * 20) + 5,
        pm25Value: Math.floor(Math.random() * 10) + 2
    };
    displayAirQualityData(mockData);
    return mockData;
}
 
// ── 캐시 ──────────────────────────────────────
const AIR_QUALITY_CACHE_KEY = 'airQualityData';
const AIR_QUALITY_TIMESTAMP_KEY = 'airQualityTimestamp';
const AIR_QUALITY_UPDATE_INTERVAL = 5 * 60 * 1000;
const WEATHER_CACHE_KEY = 'weatherData';
const WEATHER_TIMESTAMP_KEY = 'weatherTimestamp';
const WEATHER_UPDATE_INTERVAL = 5 * 60 * 1000;

function getLocationSnapshot() {
    return {
        lat: Number(CONFIG.LAT),
        lon: Number(CONFIG.LON),
        sido: CONFIG.AIR_QUALITY_SIDO,
        station: CONFIG.AIR_QUALITY_STATION
    };
}

function hasMatchingLocation(data) {
    if (!data || typeof data !== 'object' || !data.location) return false;

    const location = data.location;
    return Number(location.lat) === Number(CONFIG.LAT) &&
        Number(location.lon) === Number(CONFIG.LON) &&
        location.sido === CONFIG.AIR_QUALITY_SIDO &&
        location.station === CONFIG.AIR_QUALITY_STATION;
}
 
function hasValidAirQualityData(data) {
    if (!data || typeof data !== 'object') return false;

    const pm10 = Number.parseFloat(data.pm10Value);
    const pm25 = Number.parseFloat(data.pm25Value);

    return (Number.isFinite(pm10) && pm10 > 0) || (Number.isFinite(pm25) && pm25 > 0);
}
 
function getCachedAirQualityData() {
    if (hasUrlLocationData()) return null;
    try {
        const cachedData = safeStorageGetItem(AIR_QUALITY_CACHE_KEY);
        const timestamp = safeStorageGetItem(AIR_QUALITY_TIMESTAMP_KEY);
        if (!cachedData || !timestamp) {
            return null;
        }

        const data = JSON.parse(cachedData);
        const lastUpdate = parseInt(timestamp, 10);

        if ((Date.now() - lastUpdate) >= AIR_QUALITY_UPDATE_INTERVAL) {
            safeStorageRemoveItem(AIR_QUALITY_CACHE_KEY);
            safeStorageRemoveItem(AIR_QUALITY_TIMESTAMP_KEY);
            return null;
        }

        if (!hasValidAirQualityData(data) || !hasMatchingLocation(data)) {
            safeStorageRemoveItem(AIR_QUALITY_CACHE_KEY);
            safeStorageRemoveItem(AIR_QUALITY_TIMESTAMP_KEY);
            console.warn('저장된 대기질 데이터가 유효하지 않아 캐시를 삭제했습니다.');
            return null;
        }

        return data;
    } catch (e) {
        safeStorageRemoveItem(AIR_QUALITY_CACHE_KEY);
        safeStorageRemoveItem(AIR_QUALITY_TIMESTAMP_KEY);
        console.error('캐시 읽기 실패:', e);
    }
    return null;
}
 
function saveAirQualityDataToCache(data) {
    try {
        safeStorageSetItem(AIR_QUALITY_CACHE_KEY, JSON.stringify({ ...data, location: getLocationSnapshot() }));
        safeStorageSetItem(AIR_QUALITY_TIMESTAMP_KEY, Date.now().toString());
    } catch (e) { console.error('캐시 저장 실패:', e); }
}
 
function getCachedWeatherData() {
    if (hasUrlLocationData()) return null;
    try {
        const cachedData = safeStorageGetItem(WEATHER_CACHE_KEY);
        const timestamp = safeStorageGetItem(WEATHER_TIMESTAMP_KEY);
        if (cachedData && timestamp && (Date.now() - parseInt(timestamp)) < WEATHER_UPDATE_INTERVAL) {
            const data = JSON.parse(cachedData);
            if (!hasMatchingLocation(data)) {
                safeStorageRemoveItem(WEATHER_CACHE_KEY);
                safeStorageRemoveItem(WEATHER_TIMESTAMP_KEY);
                return null;
            }
            return data;
        }
    } catch (e) { console.error('날씨 캐시 읽기 실패:', e); }
    return null;
}
 
function saveWeatherDataToCache(currentData, forecastData) {
    try {
        safeStorageSetItem(WEATHER_CACHE_KEY, JSON.stringify({ current: currentData, forecast: forecastData, location: getLocationSnapshot() }));
        safeStorageSetItem(WEATHER_TIMESTAMP_KEY, Date.now().toString());
    } catch (e) { console.error('날씨 캐시 저장 실패:', e); }
}
 
async function updateWeatherIfNeeded() {
    if (getCachedWeatherData()) return;
    const currentData = await getCurrentWeather();
    const forecastData = await getForecastWeather();
    if (currentData && forecastData) saveWeatherDataToCache(currentData, forecastData);
}
 
async function updateAirQualityIfNeeded() {
    if (getCachedAirQualityData()) return;
    await getAirQuality();
}
 
async function loadInitialData() {
    const cachedWeather = getCachedWeatherData();
    if (cachedWeather) {
        displayWeatherData(cachedWeather);
    } else {
        const currentData = await getCurrentWeather();
        const forecastData = await getForecastWeather();
        if (currentData && forecastData) saveWeatherDataToCache(currentData, forecastData);
    }
 
    const cachedAir = getCachedAirQualityData();
    if (cachedAir) {
        displayAirQualityData(cachedAir);
    } else {
        await getAirQuality();
    }
}
 
function initializePage() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
 
    loadInitialData();
 
    setInterval(updateWeatherIfNeeded, 5 * 60 * 1000);
    setInterval(updateAirQualityIfNeeded, 5 * 60 * 1000);
 
    window.addEventListener('focus', function () {
        updateWeatherIfNeeded();
        updateAirQualityIfNeeded();
    });
 
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
            updateWeatherIfNeeded();
            updateAirQualityIfNeeded();
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}





