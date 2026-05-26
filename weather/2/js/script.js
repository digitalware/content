let CONFIG = {
        LAT: 37.84799164,
        LON: 126.881304329,
        OPENWEATHER_API_KEY: '91fff999310c2bdea1978b3f0925fb38',
        AIRKOREA_API_KEY: 'LpbxvHd66SUzZo6IHfnUEMOQD8lwIi8HwVLL3p07Nm2g1SVDXKp2d8PjtTuGRVme2OptAd8ZFNvT7IzmuaSNdg%3D%3D',
        AIR_QUALITY_SIDO: '경기',
        AIR_QUALITY_STATION: '기흥'
    };

    // location-loader.js에서 CONFIG가 자동 업데이트됨

    console.log('페이지 2 초기 설정:', {
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

    // OpenWeatherMap API 2.5와 커스텀 날씨 아이콘 매핑
    function getWeatherInfo(weatherMain, weatherDescription, iconCode, isDay = true) {
        // 메인 날씨 조건별 매핑
        const mainWeatherMap = {
            'Clear': { 
                text: '맑음', 
                icon: isDay ? 'images/1.png' : 'images/15.png' // 태양/달 아이콘
            },
            'Clouds': {
                text: '구름',
                icon: getCloudIcon(weatherDescription, isDay) // 구름 정도에 따라 다른 아이콘
            },
            'Rain': {
                text: '비',
                icon: getRainIcon(weatherDescription) // 비의 강도에 따라 다른 아이콘
            },
            'Drizzle': {
                text: '이슬비',
                icon: 'images/14.png' // 물방울 아이콘
            },
            'Thunderstorm': {
                text: '뇌우',
                icon: 'images/7.png' // 번개 아이콘
            },
            'Snow': {
                text: '눈',
                icon: 'images/5.png' // 눈송이 아이콘
            },
            'Mist': {
                text: '안개',
                icon: 'images/16.png' // 안개 아이콘
            },
            'Fog': {
                text: '짙은 안개',
                icon: 'images/16.png' // 안개 아이콘
            },
            'Smoke': {
                text: '연기',
                icon: 'images/16.png' // 안개 아이콘 (비슷한 시야 제한)
            },
            'Haze': {
                text: '실안개',
                icon: 'images/16.png' // 안개 아이콘
            },
            'Dust': {
                text: '먼지',
                icon: 'images/11.png' // 바람 아이콘
            },
            'Sand': {
                text: '모래바람',
                icon: 'images/11.png' // 바람 아이콘
            },
            'Ash': {
                text: '화산재',
                icon: 'images/16.png' // 안개 아이콘
            },
            'Squall': {
                text: '돌풍',
                icon: 'images/11.png' // 바람 아이콘
            },
            'Tornado': {
                text: '토네이도',
                icon: 'images/11.png' // 바람 아이콘
            }
        };

        // 구름 상태에 따른 아이콘 선택
        function getCloudIcon(description, isDay) {
            const desc = description.toLowerCase();
            if (desc.includes('few clouds')) {
                return isDay ? 'images/3.png' : 'images/15.png'; // 부분적으로 구름 낀 맑은 날씨
            } else if (desc.includes('scattered clouds') || desc.includes('broken clouds')) {
                return 'images/2.png'; // 구름 많음
            } else if (desc.includes('overcast')) {
                return 'images/8.png'; // 완전히 흐림
            }
            return 'images/2.png'; // 기본 구름 아이콘
        }

        // 비의 강도에 따른 아이콘 선택
        function getRainIcon(description) {
            const desc = description.toLowerCase();
            if (desc.includes('light rain') || desc.includes('drizzle')) {
                return 'images/14.png'; // 가벼운 비 (물방울)
            } else if (desc.includes('heavy rain') || desc.includes('extreme rain')) {
                return 'images/6.png'; // 폭우
            } else if (desc.includes('thunderstorm')) {
                return 'images/7.png'; // 천둥번개를 동반한 비
            }
            return 'images/4.png'; // 기본 비 아이콘
        }

        // 메인 날씨 정보 가져오기
        let weatherInfo = mainWeatherMap[weatherMain] || { 
            text: weatherMain, 
            icon: 'images/1.png' 
        };

        return weatherInfo;
    }

    // 날씨 아이콘 URL (기존 함수를 새로운 함수로 대체)
    function getWeatherIconUrl(iconCode) {
        // OpenWeatherMap 아이콘 코드를 기반으로 낮/밤 판단
        const isDay = iconCode.endsWith('d');
        
        // 아이콘 코드를 기반으로 날씨 타입 추정
        let weatherMain = 'Clear';
        let weatherDescription = '맑음';
        
        if (iconCode.startsWith('01')) {
            weatherMain = 'Clear';
            weatherDescription = '맑음';
        } else if (iconCode.startsWith('02')) {
            weatherMain = 'Clouds';
            weatherDescription = '구름 조금';
        } else if (iconCode.startsWith('03')) {
            weatherMain = 'Clouds';
            weatherDescription = '구름 많음';
        } else if (iconCode.startsWith('04')) {
            weatherMain = 'Clouds';
            weatherDescription = '흐림';
        } else if (iconCode.startsWith('09')) {
            weatherMain = 'Rain';
            weatherDescription = '가벼운 비';
        } else if (iconCode.startsWith('10')) {
            weatherMain = 'Rain';
            weatherDescription = '비';
        } else if (iconCode.startsWith('11')) {
            weatherMain = 'Thunderstorm';
            weatherDescription = '뇌우';
        } else if (iconCode.startsWith('13')) {
            weatherMain = 'Snow';
            weatherDescription = '눈';
        } else if (iconCode.startsWith('50')) {
            weatherMain = 'Mist';
            weatherDescription = '안개';
        }
        
        const weatherInfo = getWeatherInfo(weatherMain, weatherDescription, iconCode, isDay);
        return weatherInfo.icon;
    }

    // 대기질 등급 및 색상
    function getAirQualityGrade(value, type) {
        let grade = 'GOOD', className = 'grade-good', desc = '';
        
        switch(type) {
            case 'pm10':
                if(value > 150) { grade = 'VERY BAD'; className = 'grade-very-bad'; desc = ''; }
                else if(value > 80) { grade = 'BAD'; className = 'grade-bad'; desc = ''; }
                else if(value > 30) { grade = 'MODERATE'; className = 'grade-moderate'; desc = ''; }
                break;
            case 'pm25':
                if(value > 75) { grade = 'VERY BAD'; className = 'grade-very-bad'; desc = ''; }
                else if(value > 35) { grade = 'BAD'; className = 'grade-bad'; desc = ''; }
                else if(value > 15) { grade = 'MODERATE'; className = 'grade-moderate'; desc = ''; }
                break;
        }
        return {grade, className, desc};
    }

    // 현재 날씨 정보
    async function getCurrentWeather() {
        try {
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${CONFIG.LAT}&lon=${CONFIG.LON}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=metric&lang=kr`);
            const data = await res.json();
            document.getElementById('current-temp').textContent = `${Math.round(data.main.temp)}°`;
            document.getElementById('current-weather').textContent = (data.weather[0].description || '').replace('온흐림', '흐림');
            document.getElementById('current-feels-like').textContent = `${Math.round(data.main.feels_like)}°C`;
            document.getElementById('current-wind').textContent = `${data.wind.speed} m/s`;
            document.getElementById('current-humidity').textContent = `${data.main.humidity}%`;
            document.getElementById('current-clouds').textContent = `${data.clouds?.all ?? 0}%`;
            document.getElementById('current-temp-min').textContent = `${Math.round(data.main.temp_min)}°C`;
            document.getElementById('current-temp-max').textContent = `${Math.round(data.main.temp_max)}°C`;
            document.getElementById('current-temp-min-2').textContent = `${Math.round(data.main.temp_min)}°C`;
            document.getElementById('current-temp-max-2').textContent = `${Math.round(data.main.temp_max)}°C`;
            document.getElementById('current-weather-icon').src = getWeatherIconUrl(data.weather[0].icon);
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
            for(let i=1; i<=5; i++) {
                const targetDate = new Date(today);
                targetDate.setDate(today.getDate() + i);
                
                // 해당 날짜의 모든 예보 데이터 찾기
                const dayForecasts = data.list.filter(item => {
                    const itemDate = new Date(item.dt * 1000);
                    return itemDate.getDate() === targetDate.getDate();
                });
                
                // 낮 시간대(9시~18시)의 데이터를 우선적으로 찾기
                let forecast = dayForecasts.find(item => {
                    const itemDate = new Date(item.dt * 1000);
                    const hour = itemDate.getHours();
                    return hour >= 9 && hour <= 18;
                });
                
                // 낮 시간대 데이터가 없으면 첫 번째 데이터 사용
                if (!forecast && dayForecasts.length > 0) {
                    forecast = dayForecasts[0];
                }
                
                if(forecast) {
                    document.getElementById(`forecast${idx}-date`).textContent = targetDate.toLocaleDateString('ko-KR', {month:'long', day:'numeric', weekday:'short'});
                    document.getElementById(`forecast${idx}-icon`).src = getWeatherIconUrl(forecast.weather[0].icon);
                    document.getElementById(`forecast${idx}-temp`).textContent = `${Math.round(forecast.main.temp)}°C`;
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
    // 대기질 데이터를 화면에 표시하는 함수
    function displayAirQualityData(data) {
        // 측정소 이름 표시
        document.getElementById('station-name').setAttribute('data-station', data.stationName || CONFIG.AIR_QUALITY_STATION);

        // PM10
        const pm10Value = (data.pm10Value === "-" || data.pm10Value === null) ? 0 : parseFloat(data.pm10Value);
        const pm10Info = getAirQualityGrade(pm10Value, 'pm10');
        const pm10Style = getAirQualityStyle(pm10Info.grade);
        const isPm10Valid = pm10Value > 0 && !isNaN(pm10Value);

        document.getElementById('pm10').textContent = isPm10Valid ? `${pm10Value}` : '측정 중';
        document.getElementById('pm10-desc').textContent = isPm10Valid ? pm10Info.desc : '측정 중입니다';
        document.getElementById('pm10-img').src = pm10Style.img;
        document.querySelector('#pm10-card figure').style.background = pm10Style.bg;
        document.getElementById('pm10-grade').textContent = pm10Style.text;
        document.getElementById('pm10-grade').style.background = pm10Style.textBg;
        document.getElementById('pm10-card').className = `air-quality-card ${isPm10Valid ? pm10Info.className : ''}`;

        // PM2.5
        const pm25Value = (data.pm25Value === "-" || data.pm25Value === null) ? 0 : parseFloat(data.pm25Value);
        const pm25Info = getAirQualityGrade(pm25Value, 'pm25');
        const pm25Style = getAirQualityStyle(pm25Info.grade);
        const isPm25Valid = pm25Value > 0 && !isNaN(pm25Value);

        document.getElementById('pm25').textContent = isPm25Valid ? `${pm25Value}` : '측정 중';
        document.getElementById('pm25-img').src = pm25Style.img;
        document.querySelector('#pm25-card figure').style.background = pm25Style.bg;
        document.getElementById('pm25-grade').textContent = pm25Style.text;
        document.getElementById('pm25-grade').style.background = pm25Style.textBg;
        document.getElementById('pm25-card').className = `air-quality-card ${isPm25Valid ? pm25Info.className : ''}`;
    }

    // 등급별 스타일 반환 함수
    function getAirQualityStyle(grade) {
        switch (grade) {
            case 'GOOD':
                return {
                    img: 'images/good.png',
                    bg: '##085F9A',
                    text: 'GOOD',
                    textBg: '#085F9A'
                };
            case 'MODERATE':
                return {
                    img: 'images/moderate.png',
                    bg: '#D1FAE5',
                    text: 'MODERATE',
                    textBg: '#10B981'
                };
            case 'BAD':
                return {
                    img: 'images/bad.png',
                    bg: '#f8dac7',
                    text: 'BAD',
                    textBg: '#E8732A'
                };
            case 'VERY BAD':
                return {
                    img: 'images/verybad.png',
                    bg: '#FEDCDC',
                    text: 'VERY BAD',
                    textBg: '#B31B25'
                };
            default:
                return {
                    img: 'images/good.png',
                    bg: '#4FA2DA',
                    text: '-',
                    textBg: '#999'
                };
        }
    }

    // 대기질 정보 (시도별 실시간 측정정보 조회)
    async function getAirQuality() {
        try {
            // API 키가 없으면 모의 데이터 사용
            if (!CONFIG.AIRKOREA_API_KEY || CONFIG.AIRKOREA_API_KEY.trim() === '') {
                console.warn('대기질 API 키가 설정되지 않았습니다. 모의 데이터를 사용합니다.');
                const mockData = generateMockAirQualityData();
                saveAirQualityDataToCache(mockData);
                return;
            }
            
            // 시도별 실시간 측정정보 조회 API
            const baseUrl = 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty';
            
            // API 키 인코딩
            let serviceKey = CONFIG.AIRKOREA_API_KEY;
            if (!serviceKey.includes('%')) {
                serviceKey = encodeURIComponent(serviceKey);
            }
            
            // URLSearchParams로 쿼리 파라미터 구성
            const queryParams = new URLSearchParams({
                returnType: 'json',
                numOfRows: '100',
                pageNo: '1',
                sidoName: CONFIG.AIR_QUALITY_SIDO,
                ver: '1.0'
            });
            
            const url = `${baseUrl}?serviceKey=${serviceKey}&${queryParams}`;
            
            console.log(`${CONFIG.AIR_QUALITY_SIDO} 시도 대기질 데이터 요청 중 (측정소: ${CONFIG.AIR_QUALITY_STATION})...`);
            
            const res = await fetch(url);
            
            // 응답 상태 확인
            if (!res.ok) {
                if (res.status === 401) {
                    console.warn('API 인증 실패 (401). API 키를 확인하세요. 모의 데이터를 사용합니다.');
                    throw new Error('API 키 인증 실패');
                }
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            // 응답 텍스트 먼저 확인
            const responseText = await res.text();
            
            // XML 오류 응답인지 확인
            if (responseText.includes('SERVICE_KEY_IS_NOT_REGISTERED_ERROR')) {
                console.warn('API 키가 등록되지 않았습니다. 모의 데이터를 사용합니다.');
                throw new Error('API 키 인증 실패');
            }
            
            if (responseText.includes('LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR')) {
                console.warn('API 요청 한도가 초과되었습니다. 모의 데이터를 사용합니다.');
                throw new Error('API 요청 한도 초과');
            }
            
            if (responseText.includes('SERVICE ERROR')) {
                console.warn('서비스 오류가 발생했습니다. 모의 데이터를 사용합니다.');
                throw new Error('서비스 오류');
            }
            
            // JSON 파싱
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error('JSON 파싱 실패:', parseError);
                throw new Error('서버가 유효한 JSON을 반환하지 않았습니다');
            }
            
            if(data.response && data.response.body && data.response.body.items && data.response.body.items.length > 0) {
                const items = data.response.body.items;
                // 저장된 측정소가 있으면 해당 측정소만 사용 (고정)
                let bestItem = items.find(item => item.stationName === CONFIG.AIR_QUALITY_STATION);
                
                if (!bestItem) {
                    // 해당 측정소가 없으면 기존 로직으로 fallback
                    let bestScore = -1;
                    for (const item of items) {
                        let score = 0;
                        if (item.pm10Value && item.pm10Value !== "-" && item.pm10Flag !== "통신장애" && item.pm10Flag !== "점검및교정") score += 2;
                        if (item.pm25Value && item.pm25Value !== "-" && item.pm25Flag !== "통신장애" && item.pm25Flag !== "점검및교정") score += 2;
                        if (item.mangName === "도시대기") score += 1;
                        if (score > bestScore) { bestScore = score; bestItem = item; }
                    }
                }
                
                if (bestItem) {
                    console.log(`사용할 데이터: ${bestItem.stationName} (${bestItem.mangName})`);
                    
                    // 시도별 API 응답 형식에 맞게 데이터 변환
                    const transformedData = {
                        stationName: bestItem.stationName,
                        dataTime: bestItem.dataTime,
                        pm10Value: bestItem.pm10Value,
                        pm25Value: bestItem.pm25Value,
                        pm10Flag: bestItem.pm10Flag,
                        pm25Flag: bestItem.pm25Flag
                    };
                    
                    displayAirQualityData(transformedData);
                    saveAirQualityDataToCache(transformedData);
                } else {
                    console.log('유효한 대기질 데이터를 찾을 수 없습니다. 모의 데이터를 사용합니다.');
                    const mockData = generateMockAirQualityData();
                    saveAirQualityDataToCache(mockData);
                }
            } else {
                console.log('대기질 데이터를 찾을 수 없습니다. 모의 데이터를 사용합니다.');
                const mockData = generateMockAirQualityData();
                saveAirQualityDataToCache(mockData);
            }
        } catch (error) {
            console.error('대기질 정보 가져오기 실패:', error);
            
            // API 오류인 경우 모의 데이터 사용
            console.log('API 오류로 인해 모의 데이터를 사용합니다.');
            const mockData = generateMockAirQualityData();
            saveAirQualityDataToCache(mockData);
        }
    }

    // 모의 대기질 데이터 생성 (API 오류 시 사용)
    function generateMockAirQualityData() {
        const now = new Date();
        const mockData = {
            stationName: `${CONFIG.AIR_QUALITY_STATION} 지역`,
            dataTime: now.toLocaleString('ko-KR') + ' (모의 데이터)',
            pm10Value: Math.floor(Math.random() * 20) + 5,  // 5-25 범위 (좋음)
            pm25Value: Math.floor(Math.random() * 10) + 2   // 2-12 범위 (좋음)
        };
        
        // 데이터를 화면에 표시
        displayAirQualityData(mockData);
        
        console.log('모의 대기질 데이터 사용 중:', mockData);
        return mockData;
    }

    // 데이터가 없을 때 표시
    function setNoDataDisplay() {
        const pollutants = ['pm10', 'pm25'];
        pollutants.forEach(pollutant => {
            document.getElementById(pollutant).textContent = '데이터 없음';
            document.getElementById(`${pollutant}-grade`).textContent = '-';
            document.getElementById(`${pollutant}-desc`).textContent = '측정 데이터가 없습니다';
            document.getElementById(`${pollutant}-card`).className = 'air-quality-card';
        });
        
        document.getElementById('station-name').textContent = CONFIG.AIR_QUALITY_STATION;
    }

    // 캐시 키 상수
    const AIR_QUALITY_CACHE_KEY = 'airQualityData';
    const AIR_QUALITY_TIMESTAMP_KEY = 'airQualityTimestamp';
    const AIR_QUALITY_UPDATE_INTERVAL = 5 * 60 * 1000; // 5분 (밀리초) - 테스트용으로 짧게 설정
    
    const WEATHER_CACHE_KEY = 'weatherData';
    const WEATHER_TIMESTAMP_KEY = 'weatherTimestamp';
    const WEATHER_UPDATE_INTERVAL = 5 * 60 * 1000; // 5분 (밀리초) - 테스트용으로 짧게 설정

    function hasValidAirQualityData(data) {
        if (!data || typeof data !== 'object') return false;

        const pm10 = Number.parseFloat(data.pm10Value);
        const pm25 = Number.parseFloat(data.pm25Value);

        return (Number.isFinite(pm10) && pm10 > 0) || (Number.isFinite(pm25) && pm25 > 0);
    }

    // 캐시에서 데이터 가져오기
    function getCachedAirQualityData() {
        try {
            const cachedData = localStorage.getItem(AIR_QUALITY_CACHE_KEY);
            const timestamp = localStorage.getItem(AIR_QUALITY_TIMESTAMP_KEY);
            
            if (!cachedData || !timestamp) {
                return null;
            }

            const data = JSON.parse(cachedData);
            const lastUpdate = parseInt(timestamp, 10);
            const now = Date.now();

            if (now - lastUpdate >= AIR_QUALITY_UPDATE_INTERVAL) {
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

            console.log('캐시된 대기질 데이터 사용 중...');
            return data;
        } catch (error) {
            localStorage.removeItem(AIR_QUALITY_CACHE_KEY);
            localStorage.removeItem(AIR_QUALITY_TIMESTAMP_KEY);
            console.error('캐시 데이터 읽기 실패:', error);
        }
        return null;
    }

    // 데이터를 캐시에 저장하기
    function saveAirQualityDataToCache(data) {
        try {
            localStorage.setItem(AIR_QUALITY_CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(AIR_QUALITY_TIMESTAMP_KEY, Date.now().toString());
            console.log('대기질 데이터가 캐시에 저장되었습니다.');
        } catch (error) {
            console.error('캐시 저장 실패:', error);
        }
    }

    // 대기질 정보 업데이트 함수 (2시간마다)
    async function updateAirQualityIfNeeded() {
        // 먼저 캐시에서 데이터 확인
        const cachedData = getCachedAirQualityData();
        if (cachedData) {
            // 캐시가 유효하면 표시 함수 호출하지 않음 (이미 표시되어 있음)
            console.log('캐시된 대기질 데이터가 유효합니다.');
            return;
        }
        
        // 캐시에 데이터가 없거나 만료된 경우에만 API 호출
        console.log('대기질 정보 업데이트 중...');
        await getAirQuality();
    }

    // 날씨 캐시에서 데이터 가져오기
    function getCachedWeatherData() {
        try {
            const cachedData = localStorage.getItem(WEATHER_CACHE_KEY);
            const timestamp = localStorage.getItem(WEATHER_TIMESTAMP_KEY);
            
            if (cachedData && timestamp) {
                const data = JSON.parse(cachedData);
                const lastUpdate = parseInt(timestamp);
                const now = Date.now();
                
                // 1시간이 지나지 않았다면 캐시된 데이터 사용
                if (now - lastUpdate < WEATHER_UPDATE_INTERVAL) {
                    console.log('캐시된 날씨 데이터 사용 중...');
                    return data;
                }
            }
        } catch (error) {
            console.error('날씨 캐시 데이터 읽기 실패:', error);
        }
        return null;
    }

    // 날씨 데이터를 캐시에 저장하기
    function saveWeatherDataToCache(currentData, forecastData) {
        try {
            const weatherData = {
                current: currentData,
                forecast: forecastData,
                timestamp: Date.now()
            };
            localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(weatherData));
            localStorage.setItem(WEATHER_TIMESTAMP_KEY, Date.now().toString());
            console.log('날씨 데이터가 캐시에 저장되었습니다.');
        } catch (error) {
            console.error('날씨 캐시 저장 실패:', error);
        }
    }

    // 날씨 데이터를 화면에 표시하는 함수
    function displayWeatherData(weatherData) {
        // 현재 날씨 표시
        if (weatherData.current) {
            const current = weatherData.current;
            document.getElementById('current-temp').textContent = `${Math.round(current.main.temp)}°`;
            document.getElementById('current-weather').textContent = (current.weather[0].description || '').replace('온흐림', '흐림');
            document.getElementById('current-feels-like').textContent = `${Math.round(current.main.feels_like)}°C`;
            document.getElementById('current-wind').textContent = `${current.wind.speed} m/s`;
            document.getElementById('current-humidity').textContent = `${current.main.humidity}%`;
            document.getElementById('current-clouds').textContent = `${current.clouds?.all ?? 0}%`;
            document.getElementById('current-temp-max').textContent = `${Math.round(current.main.temp_max)}°`;
            document.getElementById('current-temp-min').textContent = `${Math.round(current.main.temp_min)}°`;
            document.getElementById('current-temp-max-2').textContent = `${Math.round(current.main.temp_max)}°`;
            document.getElementById('current-temp-min-2').textContent = `${Math.round(current.main.temp_min)}°`;
            document.getElementById('current-weather-icon').src = getWeatherIconUrl(current.weather[0].icon);
        }

        // 예보 표시
        if (weatherData.forecast) {
            const today = new Date();
            let idx = 1;
            for(let i=1; i<=5; i++) {
                const targetDate = new Date(today);
                targetDate.setDate(today.getDate() + i);
                
                // 해당 날짜의 모든 예보 데이터 찾기
                const dayForecasts = weatherData.forecast.list.filter(item => {
                    const itemDate = new Date(item.dt * 1000);
                    return itemDate.getDate() === targetDate.getDate();
                });
                
                // 낮 시간대(9시~18시)의 데이터를 우선적으로 찾기
                let forecast = dayForecasts.find(item => {
                    const itemDate = new Date(item.dt * 1000);
                    const hour = itemDate.getHours();
                    return hour >= 9 && hour <= 18;
                });
                
                // 낮 시간대 데이터가 없으면 첫 번째 데이터 사용
                if (!forecast && dayForecasts.length > 0) {
                    forecast = dayForecasts[0];
                }
                
                if(forecast) {
                    document.getElementById(`forecast${idx}-date`).textContent = targetDate.toLocaleDateString('en-EN', {weekday:'short'});
                    document.getElementById(`forecast${idx}-icon`).src = getWeatherIconUrl(forecast.weather[0].icon);
                    document.getElementById(`forecast${idx}-temp`).textContent = `${Math.round(forecast.main.temp)}°`;
                    document.getElementById(`forecast${idx}-desc`).textContent = (forecast.weather[0].description || '').replace('온흐림', '흐림');
                    idx++;
                }
            }
        }
    }

    // 날씨 정보 업데이트 함수 (1시간마다)
    async function updateWeatherIfNeeded() {
        // 먼저 캐시에서 데이터 확인
        const cachedData = getCachedWeatherData();
        if (cachedData) {
            // 캐시가 유효하면 표시 함수 호출하지 않음 (이미 표시되어 있음)
            console.log('캐시된 날씨 데이터가 유효합니다.');
            return;
        }
        
        // 캐시에 데이터가 없거나 만료된 경우에만 API 호출
        console.log('날씨 정보 업데이트 중...');
        const currentData = await getCurrentWeather();
        const forecastData = await getForecastWeather();
        
        // 성공적으로 데이터를 가져왔다면 캐시에 저장
        if (currentData && forecastData) {
            saveWeatherDataToCache(currentData, forecastData);
        }
    }

    // 캐시 초기화 함수
    function clearAllCache() {
        try {
            localStorage.removeItem(AIR_QUALITY_CACHE_KEY);
            localStorage.removeItem(AIR_QUALITY_TIMESTAMP_KEY);
            localStorage.removeItem(WEATHER_CACHE_KEY);
            localStorage.removeItem(WEATHER_TIMESTAMP_KEY);
            console.log('모든 캐시가 초기화되었습니다.');
        } catch (error) {
            console.error('캐시 초기화 실패:', error);
        }
    }

    // 초기 데이터 로드 함수 (캐시 확인 후 표시 또는 API 호출)
    async function loadInitialData() {
        // 테스트를 위해 캐시 강제 초기화 (필요시 주석 처리)
        //clearAllCache();
        
        // 날씨 데이터 로드
        const cachedWeatherData = getCachedWeatherData();
        if (cachedWeatherData) {
            console.log('캐시된 날씨 데이터로 초기 로드 중...');
            displayWeatherData(cachedWeatherData);
        } else {
            console.log('날씨 데이터 초기 로드 중...');
            const currentData = await getCurrentWeather();
            const forecastData = await getForecastWeather();
            if (currentData && forecastData) {
                saveWeatherDataToCache(currentData, forecastData);
            }
        }
        
        // 대기질 데이터 로드
        const cachedAirQualityData = getCachedAirQualityData();
        if (cachedAirQualityData) {
            console.log('캐시된 대기질 데이터로 초기 로드 중...');
            displayAirQualityData(cachedAirQualityData);
        } else {
            console.log('대기질 데이터 초기 로드 중...');
            await getAirQuality();
        }
    }

    function initializePage() {
        updateDateTime();
        setInterval(updateDateTime, 1000);

        loadInitialData();

        setInterval(updateWeatherIfNeeded, 5 * 60 * 1000);
        setInterval(updateAirQualityIfNeeded, 5 * 60 * 1000);

        window.addEventListener('focus', function() {
            updateWeatherIfNeeded();
            updateAirQualityIfNeeded();
        });

        document.addEventListener('visibilitychange', function() {
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

