let CONFIG = {
    LAT: 37.84799164,
    LON: 126.881304329,
    OPENWEATHER_API_KEY: '91fff999310c2bdea1978b3f0925fb38',
    AIRKOREA_API_KEY: 'LpbxvHd66SUzZo6IHfnUEMOQD8lwIi8HwVLL3p07Nm2g1SVDXKp2d8PjtTuGRVme2OptAd8ZFNvT7IzmuaSNdg%3D%3D',
    AIR_QUALITY_SIDO: '경기',
    AIR_QUALITY_STATION: '기흥'
};

// ──────────────────────────────────────────────
// 시간 및 날짜 표시
// ──────────────────────────────────────────────
function updateDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekDay = weekDays[now.getDay()];

    // 위치명 업데이트
    updateLocationTitle();

    const dateTimeEl = document.getElementById('date-time');
    if (dateTimeEl) {
        const dateStr = `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
        // 역지오코딩으로 현재 좌표의 도시명 가져오기
        getLocationNameFromCoordinates().then(locationName => {
            const locationStr = `${weekDay} | ${locationName}`;
            dateTimeEl.innerHTML = `${dateStr}<br>${locationStr}`;
        });
    }

    // 매 초마다 업데이트
    setTimeout(updateDateTime, 1000);
}

// 좌표에서 도시명 가져오기 (캐싱 포함)
let cachedLocationName = null;
let lastLocationCoords = null;

async function getLocationNameFromCoordinates() {
    // 좌표가 변경되지 않으면 캐시된 값 사용
    if (lastLocationCoords && 
        lastLocationCoords.lat === CONFIG.LAT && 
        lastLocationCoords.lon === CONFIG.LON &&
        cachedLocationName) {
        return cachedLocationName;
    }

    try {
        const res = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${CONFIG.LAT}&lon=${CONFIG.LON}&limit=1&appid=${CONFIG.OPENWEATHER_API_KEY}`
        );
        const data = await res.json();
        if (data.length > 0) {
            const location = data[0];
            const country = location.country || '';
            const cityName = location.name || '현재 위치';
            cachedLocationName = `${cityName}, ${country}`;
            lastLocationCoords = { lat: CONFIG.LAT, lon: CONFIG.LON };
            return cachedLocationName;
        }
    } catch (error) {
        console.error('위치명 조회 실패:', error);
    }
    return '현재 위치';
}

// 제목에 위치명 업데이트 (측정소명 기반)
function updateLocationTitle() {
    const locationTitle = document.getElementById('location-title');
    if (!locationTitle) return;
    
    if (typeof CONFIG !== 'undefined' && CONFIG.AIR_QUALITY_STATION) {
        locationTitle.textContent = CONFIG.AIR_QUALITY_STATION;
    } else {
        locationTitle.textContent = '현재 위치';
    }
}

// ──────────────────────────────────────────────
// 날씨 데이터 가져오기
// ──────────────────────────────────────────────
async function getCurrentWeather() {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${CONFIG.LAT}&lon=${CONFIG.LON}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=metric&lang=en`
        );
        const data = await res.json();
        displayCurrentWeather(data);
        return data;
    } catch (error) {
        console.error('날씨 정보 가져오기 실패:', error);
        return null;
    }
}

function displayCurrentWeather(data) {
    // 현재 온도
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    
    document.getElementById('current-temp').innerHTML = `${temp}<span>°C</span>`;
    document.getElementById('feels-like').textContent = `Feels like ${feelsLike}°C`;

    // 날씨 상태
    const weatherDesc = data.weather[0].main;
    const weatherDescText = {
        'Clear': 'Mostly Sunny',
        'Clouds': 'Mostly Sunny',
        'Overcast': 'Overcast',
        'Rain': 'Rainy',
        'Drizzle': 'Drizzle',
        'Thunderstorm': 'Thunderstorm',
        'Snow': 'Snowy',
        'Mist': 'Misty'
    };
    
    document.getElementById('weather-status').textContent = weatherDescText[weatherDesc] || weatherDesc;

    // 풍속
    const windSpeed = data.wind.speed.toFixed(2);
    document.getElementById('wind-speed').textContent = `${windSpeed} m/s`;

    // 습도
    const humidity = data.main.humidity;
    document.getElementById('humidity').innerHTML = `${humidity}<span>%</span>`;

    // 날씨 아이콘
    updateWeatherIcon(data.weather[0].icon, data.weather[0].main);
}

function updateWeatherIcon(iconCode, weatherMain) {
    const iconMap = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️'
    };
    
    // 이미지 파일 맵핑
    const imageMap = {
        'Clear': 'images/1main.png',
        'Clouds': 'images/2main.png',
        'Rain': 'images/4main.png',
        'Drizzle': 'images/2main.png',
        'Thunderstorm': 'images/6.png',
        'Snow': 'images/7main.png',
        'Mist': 'images/3main.png'
    };
    
    const weatherImg = document.getElementById('weather-icon');
    if (weatherImg) {
        // 이미지가 있으면 사용, 없으면 이모지 사용
        const imagePath = imageMap[weatherMain];
        if (imagePath) {
            weatherImg.src = imagePath;
            weatherImg.alt = weatherMain;
            weatherImg.style.fontSize = 'inherit';
        }
    }
}

// ──────────────────────────────────────────────
// 7일 예보
// ──────────────────────────────────────────────
async function getForecastWeather() {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${CONFIG.LAT}&lon=${CONFIG.LON}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=metric&lang=en`
        );
        const data = await res.json();
        displayForecast(data);
        updateTodayFromForecast(data);
        return data;
    } catch (error) {
        console.error('예보 정보 가져오기 실패:', error);
        return null;
    }
}

function updateTodayFromForecast(data) {
    const today = new Date();
    const todayForecasts = data.list.filter(item => {
        const itemDate = new Date(item.dt * 1000);
        return itemDate.toDateString() === today.toDateString();
    });

    if (todayForecasts.length === 0) return;

    let todayData = todayForecasts.find(item => {
        const hour = new Date(item.dt * 1000).getHours();
        return hour >= 12 && hour <= 15;
    });
    
    if (!todayData) {
        todayData = todayForecasts[Math.floor(todayForecasts.length / 2)];
    }

    if (todayData) {
        const tempMin = Math.round(todayData.main.temp_min);
        const tempMax = Math.round(todayData.main.temp_max);
        document.getElementById('daily-range').textContent = `${tempMax}° /${tempMin}°`;
    }
}

function displayForecast(data) {
    const forecastList = document.getElementById('forecast-list');
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // 이미지 맵핑
    const weatherImages = {
        'Clear': 'images/1.png',
        'Clouds': 'images/2.png',
        'Rain': 'images/3.png',
        'Drizzle': 'images/2.png',
        'Thunderstorm': 'images/4.png',
        'Snow': 'images/7.png',
        'Mist': 'images/3.png'
    };

    // 모든 아이템 제거
    forecastList.innerHTML = '';

    // 5일 예보 (내일부터 5일, 일일 최고/최저 기온 포함)
    for (let i = 1; i <= 5; i++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + i);

        const dayForecasts = data.list.filter(item => {
            const itemDate = new Date(item.dt * 1000);
            return itemDate.toDateString() === targetDate.toDateString();
        });

        if (dayForecasts.length === 0) continue;
        
        // 해당 날짜의 최고/최저 기온 계산
        let tempHigh = Math.max(...dayForecasts.map(f => f.main.temp_max));
        let tempLow = Math.min(...dayForecasts.map(f => f.main.temp_min));

        let forecast = dayForecasts.find(item => {
            const hour = new Date(item.dt * 1000).getHours();
            return hour >= 12 && hour <= 15;
        });
        if (!forecast) {
            forecast = dayForecasts[Math.floor(dayForecasts.length / 2)];
        }

        if (forecast) {
            const dayOfWeek = dayNames[targetDate.getDay()];
            const weatherMain = forecast.weather[0].main;
            const imagePath = weatherImages[weatherMain] || 'images/1.png';

            const li = document.createElement('li');
            li.className = 'forecast-item';
            li.innerHTML = `
                <h5>${dayOfWeek}</h5>
                <div class="forecast-icon"><img src="${imagePath}" alt="${weatherMain}"></div>
                <div class="forecast-temp">
                    <span class="high">${Math.round(tempHigh)}°</span>
                    <span class="low">${Math.round(tempLow)}°</span>
                </div>
            `;
            forecastList.appendChild(li);
        }
    }
}

// ──────────────────────────────────────────────
// 대기질 정보
// ──────────────────────────────────────────────
async function getAirQuality() {
    try {
        if (!CONFIG.AIRKOREA_API_KEY || CONFIG.AIRKOREA_API_KEY.trim() === '') {
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
                displayAirQualityData({
                    pm10Value: bestItem.pm10Value,
                    pm25Value: bestItem.pm25Value
                });
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
        pm10Value: 22,
        pm25Value: 8
    };
    displayAirQualityData(mockData);
}

function displayAirQualityData(data) {
    const pm10Value = data.pm10Value === "-" || data.pm10Value === null ? 0 : parseFloat(data.pm10Value);
    const pm25Value = data.pm25Value === "-" || data.pm25Value === null ? 0 : parseFloat(data.pm25Value);

    // PM10 표시
    const pm10Rounded = Math.round(pm10Value);
    document.getElementById('pm10-value').textContent = pm10Rounded;
    
    // PM2.5 표시
    const pm25Rounded = Math.round(pm25Value);
    document.getElementById('pm25-value').textContent = pm25Rounded;
    
    // PM10 등급 및 스타일 적용
    const pm10Grade = getAirQualityGrade(pm10Value, 'pm10');
    applyAirQualityStyle('pm10-card', pm10Grade);
    
    // PM2.5 등급 및 스타일 적용
    const pm25Grade = getAirQualityGrade(pm25Value, 'pm25');
    applyAirQualityStyle('pm25-card', pm25Grade);
}

// 미세먼지 등급 판정
function getAirQualityGrade(value, type) {
    let good, normal, bad;
    
    if (type === 'pm10') {
        // PM10 기준 (µg/m³)
        good = 30;      // 좋음
        normal = 80;    // 보통
        bad = 150;      // 나쁨
    } else {
        // PM2.5 기준 (µg/m³)
        good = 15;      // 좋음
        normal = 35;    // 보통
        bad = 75;       // 나쁨
    }
    
    if (value <= good) return 'good';
    if (value <= normal) return 'normal';
    if (value <= bad) return 'bad';
    return 'very-bad';
}

// 미세먼지 등급에 따른 스타일 및 텍스트 적용
function applyAirQualityStyle(cardId, grade) {
    const card = document.getElementById(cardId);
    if (!card) return;
    
    // 기존 클래스 제거
    card.classList.remove('good', 'normal', 'bad', 'very-bad');
    
    // 새 클래스 추가
    card.classList.add(grade);
    
    // 상태 텍스트 업데이트
    const statusEl = card.querySelector('.pm-status');
    if (statusEl) {
        const gradeTexts = {
            'good': '좋음',
            'normal': '보통',
            'bad': '나쁨',
            'very-bad': '매우나쁨'
        };
        statusEl.textContent = gradeTexts[grade] || '좋음';
    }
}

// ──────────────────────────────────────────────
// 초기화 및 로드
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async function() {
    // location-loader.js가 CONFIG를 업데이트할 때까지 대기
    let retries = 0;
    while ((!CONFIG.LAT || CONFIG.LAT === 37.84799164) && retries < 50) {
        await new Promise(resolve => setTimeout(resolve, 50));
        retries++;
    }
    
    // 시간 및 날짜 업데이트
    updateDateTime();

    // 날씨 데이터 로드
    await getCurrentWeather();
    await getForecastWeather();
    
    // 대기질 정보 로드
    await getAirQuality();

    // 주기적 업데이트 (10분마다)
    setInterval(async () => {
        await getCurrentWeather();
        await getForecastWeather();
        await getAirQuality();
    }, 10 * 60 * 1000);
    
    // 예보 카드 인터랙티브 기능
    addForecastInteractivity();
    
    // 정보 카드 인터랙티브 기능
    addInfoCardInteractivity();
});

// ──────────────────────────────────────────────
// 예보 카드 인터랙티브 기능
// ──────────────────────────────────────────────
function addForecastInteractivity() {
    // 관상용 페이지이므로 인터랙티브 기능 비활성화
    // 자동 애니메이션만 CSS에서 처리
}

// ──────────────────────────────────────────────
// 정보 카드 애니메이션 강화
// ──────────────────────────────────────────────
function addInfoCardInteractivity() {
    // 관상용 페이지이므로 인터랙티브 기능 비활성화
    // 자동 애니메이션만 CSS에서 처리
}

// ──────────────────────────────────────────────
// 온도 단위 변환 함수 (향후 기능)
// ──────────────────────────────────────────────
function toggleTemperatureUnit() {
    // 이 함수는 향후 기능 추가시 사용
    const currentTemp = document.getElementById('current-temp');
    // 섭씨를 화씨로 변환하거나 그 반대로
}

// ──────────────────────────────────────────────
// 새로고침 애니메이션
// ──────────────────────────────────────────────
function addRefreshAnimation() {
    const refreshBtn = document.querySelector('[data-refresh]');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.style.animation = 'spin 1s linear';
            setTimeout(() => {
                this.style.animation = '';
            }, 1000);
        });
    }
}
