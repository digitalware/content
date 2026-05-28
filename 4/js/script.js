let CONFIG = {
    LAT: 37.84799164,
    LON: 126.881304329,
    OPENWEATHER_API_KEY: '91fff999310c2bdea1978b3f0925fb38',
    AIRKOREA_API_KEY: 'LpbxvHd66SUzZo6IHfnUEMOQD8lwIi8HwVLL3p07Nm2g1SVDXKp2d8PjtTuGRVme2OptAd8ZFNvT7IzmuaSNdg%3D%3D',
    AIR_QUALITY_SIDO: '경기',
    AIR_QUALITY_STATION: '기흥'
};

// location-loader.js에서 CONFIG가 자동 업데이트됨

console.log('페이지 4 초기 설정:', {
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
 
 if (iconCode.startsWith('01')) {
        weatherMain = 'Clear';
        weatherDescription = '맑음';
    }

    else if (iconCode.startsWith('02')) {
        weatherMain = 'Clouds';
        weatherDescription = '구름 조금';
    }

    else if (iconCode.startsWith('03')) {
        weatherMain = 'Clouds';
        weatherDescription = '구름 많음';
    }

    else if (iconCode.startsWith('04')) {
        weatherMain = 'Clouds';
        weatherDescription = '흐림';
    }

    else if (iconCode.startsWith('09')) {
        weatherMain = 'Rain';
        weatherDescription = '가벼운 비';
    }

    else if (iconCode.startsWith('10')) {
        weatherMain = 'Rain';
        weatherDescription = '비';
    }

    else if (iconCode.startsWith('11')) {
        weatherMain = 'Thunderstorm';
        weatherDescription = '뇌우';
    }

    else if (iconCode.startsWith('13')) {
        weatherMain = 'Snow';
        weatherDescription = '눈';
    }

    else if (iconCode.startsWith('50')) {
        weatherMain = 'Mist';
        weatherDescription = '안개';
    }

    return getWeatherInfo(weatherMain, weatherDescription, iconCode, isDay).icon;
}
 /* =========================
   MAIN WEATHER IMAGE
========================= */

function getMainWeatherImage(iconCode){
    console.log('getMainWeatherImage 호출됨, iconCode:', iconCode);
    
    /* 맑음 */
    if(iconCode.startsWith('01')){
        console.log('맑음 - 1main.png 반환');
        return 'images/1main.png';
    }

    /* 구름 조금 */
    else if(iconCode.startsWith('02')){
        console.log('구름 조금 - 2main.png 반환');
        return 'images/2main.png';
    }

    /* 흐림 */
    else if(
        iconCode.startsWith('03') ||
        iconCode.startsWith('04')
    ){
        console.log('흐림 - 3main.png 반환');
        return 'images/3main.png';
    }

    /* 비 */
    else if(
        iconCode.startsWith('09') ||
        iconCode.startsWith('10')
    ){
        console.log('비 - 4main.png 반환');
        return 'images/4main.png';
    }

    /* 안개 */
    else if(iconCode.startsWith('50')){
        console.log('안개 - 2main.png 반환');
        return 'images/2main.png';
    }

    /* 천둥 */
    else if(iconCode.startsWith('11')){
        console.log('천둥 - 7main.png 반환');
        return 'images/7main.png';
    }

    /* 눈 */
    else if(iconCode.startsWith('13')){
        console.log('눈 - 5main.png 반환');
        return 'images/5main.png';
    }

    /* 기본 */
    console.log('기본값 - 3main.png 반환');
    return 'images/3main.png';
}

// 애니메이션과 함께 이미지 업데이트
function updateWeatherImageWithAnimation(imagePath) {
    const imgElement = document.getElementById('current-weather-icon');
    
    // 애니메이션 클래스 제거 (리셋)
    imgElement.classList.remove('show');
    
    // 짧은 딜레이 후 이미지 변경
    setTimeout(() => {
        imgElement.src = imagePath + '?t=' + Date.now();
        
        // 리플로우를 강제로 트리거하여 애니메이션 재시작
        void imgElement.offsetWidth;
        
        // 애니메이션 클래스 추가
        imgElement.classList.add('show');
    }, 50);
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
 

 
// 현재 날씨 정보
async function getCurrentWeather() {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${CONFIG.LAT}&lon=${CONFIG.LON}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=metric&lang=kr`);
        const data = await res.json();
        console.log('날씨 데이터:', data);
        console.log('날씨 코드:', data.weather[0].icon);
        const mainImg = getMainWeatherImage(data.weather[0].icon);
        console.log('변경할 이미지:', mainImg);
        
        document.getElementById('current-temp').textContent = `${Math.round(data.main.temp)}`;
        document.getElementById('current-weather').textContent = (data.weather[0].description || '').replace('온흐림', '흐림');
        document.getElementById('current-wind').textContent = `${data.wind.speed} m/s`;
        document.getElementById('current-humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('current-clouds').textContent = `${data.clouds?.all ?? 0}%`;
        document.getElementById('feels-like').textContent = `${Math.round(data.main.feels_like)}`;
        document.getElementById('temp-high').textContent = `H:${Math.round(data.main.temp_max)}°`;
        document.getElementById('temp-low').textContent = `L:${Math.round(data.main.temp_min)}°`;
        
        // 이미지 변경 시 애니메이션 트리거
        updateWeatherImageWithAnimation(mainImg);
        
        console.log('이미지 변경 완료:', mainImg);
        return data;
    } catch (error) {
        console.error('날씨 정보 가져오기 실패:', error);
        return null;
    }
}
 
// 5일 예보
async function getForecastWeather() {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${CONFIG.LAT}&lon=${CONFIG.LON}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=metric&lang=kr`);
        const data = await res.json();
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
            
            // 해당 날짜의 최고/최저 기온 계산
            let maxTemp = Math.max(...dayForecasts.map(f => f.main.temp_max));
            let minTemp = Math.min(...dayForecasts.map(f => f.main.temp_min));
            
            let forecast = dayForecasts.find(item => {
                const hour = new Date(item.dt * 1000).getHours();
                return hour >= 9 && hour <= 18;
            });
            if (!forecast) forecast = dayForecasts[Math.floor(dayForecasts.length / 2)];
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
        console.log('캐시에서 날씨 데이터 복원:', current);
        console.log('캐시에서 날씨 코드:', current.weather[0].icon);
        const mainImg = getMainWeatherImage(current.weather[0].icon);
        console.log('변경할 이미지:', mainImg);
        
        document.getElementById('current-temp').textContent = `${Math.round(current.main.temp)}`;
        document.getElementById('current-weather').textContent = (current.weather[0].description || '').replace('온흐림', '흐림');
        document.getElementById('current-wind').textContent = `${current.wind.speed} m/s`;
        document.getElementById('current-humidity').textContent = `${current.main.humidity}%`;
        document.getElementById('current-clouds').textContent = `${current.clouds?.all ?? 0}%`;
        document.getElementById('feels-like').textContent = `${Math.round(current.main.feels_like)}`;
        document.getElementById('temp-high').textContent = `H:${Math.round(current.main.temp_max)}°`;
        document.getElementById('temp-low').textContent = `L:${Math.round(current.main.temp_min)}°`;
        
        // 이미지 변경 시 애니메이션 트리거
        updateWeatherImageWithAnimation(mainImg);
        
        console.log('이미지 변경 완료');
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
            let forecast = dayForecasts.find(item => {
                const hour = new Date(item.dt * 1000).getHours();
                return hour >= 9 && hour <= 18;
            });
            if (!forecast && dayForecasts.length > 0) forecast = dayForecasts[0];
            if (forecast) {
                document.getElementById(`forecast${idx}-date`).textContent = targetDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
                document.getElementById(`forecast${idx}-icon`).src = getWeatherIconUrl(forecast.weather[0].icon);
                document.getElementById(`forecast${idx}-temp`).textContent = `${Math.round(forecast.main.temp)}°C`;
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
 
function hasValidAirQualityData(data) {
    if (!data || typeof data !== 'object') return false;

    const pm10 = Number.parseFloat(data.pm10Value);
    const pm25 = Number.parseFloat(data.pm25Value);

    return (Number.isFinite(pm10) && pm10 > 0) || (Number.isFinite(pm25) && pm25 > 0);
}
 
function getCachedAirQualityData() {
    try {
        const cachedData = localStorage.getItem(AIR_QUALITY_CACHE_KEY);
        const timestamp = localStorage.getItem(AIR_QUALITY_TIMESTAMP_KEY);
        if (!cachedData || !timestamp) {
            return null;
        }

        const data = JSON.parse(cachedData);
        const lastUpdate = parseInt(timestamp, 10);

        if ((Date.now() - lastUpdate) >= AIR_QUALITY_UPDATE_INTERVAL) {
            localStorage.removeItem(AIR_QUALITY_CACHE_KEY);
            localStorage.removeItem(AIR_QUALITY_TIMESTAMP_KEY);
            return null;
        }

        if (!hasValidAirQualityData(data)) {
            localStorage.removeItem(AIR_QUALITY_CACHE_KEY);
            localStorage.removeItem(AIR_QUALITY_TIMESTAMP_KEY);
            console.warn('저장된 대기질 데이터가 유효하지 않아 캐시를 삭제했습니다.');
            return null;
        }

        return data;
    } catch (e) {
        localStorage.removeItem(AIR_QUALITY_CACHE_KEY);
        localStorage.removeItem(AIR_QUALITY_TIMESTAMP_KEY);
        console.error('캐시 읽기 실패:', e);
    }
    return null;
}
 
function saveAirQualityDataToCache(data) {
    try {
        localStorage.setItem(AIR_QUALITY_CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(AIR_QUALITY_TIMESTAMP_KEY, Date.now().toString());
    } catch (e) { console.error('캐시 저장 실패:', e); }
}
 
function getCachedWeatherData() {
    try {
        const cachedData = localStorage.getItem(WEATHER_CACHE_KEY);
        const timestamp = localStorage.getItem(WEATHER_TIMESTAMP_KEY);
        if (cachedData && timestamp && (Date.now() - parseInt(timestamp)) < WEATHER_UPDATE_INTERVAL) {
            return JSON.parse(cachedData);
        }
    } catch (e) { console.error('날씨 캐시 읽기 실패:', e); }
    return null;
}
 
function saveWeatherDataToCache(currentData, forecastData) {
    try {
        localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({ current: currentData, forecast: forecastData }));
        localStorage.setItem(WEATHER_TIMESTAMP_KEY, Date.now().toString());
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
    // 캐시 초기화 - 항상 새로운 날씨 데이터 받아오기
    localStorage.removeItem('weatherData');
    localStorage.removeItem('weatherTimestamp');
    
    const currentData = await getCurrentWeather();
    const forecastData = await getForecastWeather();
    if (currentData && forecastData) saveWeatherDataToCache(currentData, forecastData);

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






/* =========================
   CIRCLE ANIMATION
========================= */

function animateCircle(selector, value, maxValue, textSelector){

    const circle =
    document.querySelector(selector);

    if(!circle) return;

    const radius =
    circle.r.baseVal.value;

    const circumference =
    2 * Math.PI * radius;

    circle.style.strokeDasharray =
    circumference;

    circle.style.strokeDashoffset =
    circumference;

    let percent = value / maxValue;

    if(percent > 1){
        percent = 1;
    }

    const offset =
    circumference - (percent * circumference);

    circle.getBoundingClientRect();

    setTimeout(()=>{

        circle.style.strokeDashoffset =
        offset;

    },100);

    /* COUNT */

    const textEl =
    document.querySelector(textSelector);

    let current = 0;

    const duration = 1200;

    const increment =
    value / (duration / 16);

    const counter = setInterval(()=>{

        current += increment;

        if(current >= value){

            current = value;

            clearInterval(counter);
        }

        textEl.textContent =
        Math.round(current);

    },16);
}

/* =========================
   COLOR
========================= */

function setCircleColor(selector, grade){

    const circle =
    document.querySelector(selector);

    const colorMap = {

        '좋음':'#7BE0AB',
        '보통':'#F2C94C',
        '나쁨':'#F2994A',
        '매우나쁨':'#EB5757'
    };

    circle.style.stroke =
    colorMap[grade];
}

/* =========================
   GRADE
========================= */

function getAirGrade(value, type){

    if(type === 'pm10'){

        if(value <= 30) return '좋음';
        if(value <= 80) return '보통';
        if(value <= 150) return '나쁨';

        return '매우나쁨';
    }

    else{

        if(value <= 15) return '좋음';
        if(value <= 35) return '보통';
        if(value <= 75) return '나쁨';

        return '매우나쁨';
    }
}

/* =========================
   DISPLAY
========================= */

function displayAirQualityData(data){

    const rawPm10 = parseFloat(data.pm10Value);
    const rawPm25 = parseFloat(data.pm25Value);
    
    const isPm10Valid = !isNaN(rawPm10) && rawPm10 > 0;
    const isPm25Valid = !isNaN(rawPm25) && rawPm25 > 0;
    
    const pm10Value = isPm10Valid ? rawPm10 : 0;
    const pm25Value = isPm25Valid ? rawPm25 : 0;

    /* TEXT */

    document.getElementById('pm10')
    .textContent = isPm10Valid ? pm10Value : '측정 중';

    document.getElementById('pm25')
    .textContent = isPm25Valid ? pm25Value : '측정 중';

    /* GRADE */

    const pm10Grade =
    getAirGrade(pm10Value,'pm10');

    const pm25Grade =
    getAirGrade(pm25Value,'pm25');

    /* CIRCLE */

    animateCircle(
        '.pm10-progress',
        pm10Value,
        150,
        '#pm10-circle-value'
    );

    animateCircle(
        '.pm25-progress',
        pm25Value,
        75,
        '#pm25-circle-value'
    );

    /* COLOR */

    setCircleColor(
        '.pm10-progress',
        pm10Grade
    );

    setCircleColor(
        '.pm25-progress',
        pm25Grade
    );
}

