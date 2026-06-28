<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>香港 AI 行山路線搜尋</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        /* 全局變數：清新綠白與黑夜模式 */
        :root {
            --bg-color: #f7f9f7;
            --text-color: #333333;
            --card-bg: #ffffff;
            --card-border: #eef2ee;
            --box-shadow: rgba(0,0,0,0.05);
            --label-color: #444444;
            --secondary-text: #666666;
            --badge-bg: #f0f4f0;
            --input-bg: #fafafa;
            --input-border: #e0e0e0;
        }

        [data-theme="dark"] {
            --bg-color: #121212;
            --text-color: #e0e0e0;
            --card-bg: #1e1e1e;
            --card-border: #2c2c2c;
            --box-shadow: rgba(0,0,0,0.3);
            --label-color: #bbbbbb;
            --secondary-text: #aaaaaa;
            --badge-bg: #2d372d;
            --input-bg: #252525;
            --input-border: #444444;
        }

        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
            background-color: var(--bg-color); 
            margin: 0; 
            padding: 15px; 
            color: var(--text-color);
            transition: background-color 0.3s, color 0.3s;
        }
        
        .top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .theme-toggle-btn {
            background-color: var(--card-bg);
            color: var(--text-color);
            border: 1px solid var(--input-border);
            padding: 8px 12px;
            font-size: 13px;
            border-radius: 20px;
            cursor: pointer;
            width: auto;
            margin-top: 0;
            box-shadow: 0 2px 4px var(--box-shadow);
            font-weight: 600;
        }

        .favorite-badge {
            font-size: 13px;
            color: #2e7d32;
            background-color: #e8f5e9;
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: bold;
        }
        [data-theme="dark"] .favorite-badge {
            color: #81c784;
            background-color: #1b3820;
        }

        h1 {
            font-size: 24px;
            color: #2e7d32;
            text-align: center;
            margin-top: 10px;
            margin-bottom: 5px;
        }
        [data-theme="dark"] h1 { color: #81c784; }
        
        #subtitle {
            font-size: 14px;
            color: var(--secondary-text);
            text-align: center;
            margin-bottom: 25px;
        }

        .search-box { 
            background: var(--card-bg); 
            padding: 20px; 
            border-radius: 16px; 
            box-shadow: 0 4px 12px var(--box-shadow); 
            margin-bottom: 20px;
            border: 1px solid var(--card-border);
        }

        .filter-group { margin-bottom: 15px; }

        label { 
            display: block; 
            margin-bottom: 8px; 
            font-weight: 600; 
            font-size: 15px;
            color: var(--label-color);
        }

        input[type="text"] {
            width: 100%;
            padding: 14px;
            font-size: 16px;
            border-radius: 10px;
            border: 1px solid var(--input-border);
            background-color: var(--input-bg);
            color: var(--text-color);
            box-sizing: border-box;
        }

        /* 歷史搜尋紀錄小樣式 */
        .history-container {
            margin-top: 8px;
            font-size: 13px;
            color: var(--secondary-text);
        }
        .history-tag {
            display: inline-block;
            background: var(--badge-bg);
            padding: 3px 8px;
            border-radius: 12px;
            margin-right: 6px;
            cursor: pointer;
            font-size: 12px;
            border: 1px solid var(--input-border);
        }

        /* 功能 4：多重標籤過濾 UI 列 */
        .tags-cloud {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 5px;
        }
        .filter-tag-btn {
            background-color: var(--card-bg);
            color: var(--text-color);
            border: 1px solid var(--input-border);
            padding: 6px 14px;
            font-size: 13px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
        }
        .filter-tag-btn.active {
            background-color: #2e7d32;
            color: white;
            border-color: #2e7d32;
        }
        [data-theme="dark"] .filter-tag-btn.active {
            background-color: #81c784;
            color: #121212;
            border-color: #81c784;
        }

        select, .main-search-btn, .gps-btn { 
            width: 100%; 
            padding: 14px; 
            font-size: 16px; 
            border-radius: 10px; 
            border: 1px solid var(--input-border); 
            background-color: var(--input-bg);
            color: var(--text-color);
            -webkit-appearance: none; 
            box-sizing: border-box;
        }

        .main-search-btn { 
            background-color: #2e7d32; 
            color: white; 
            border: none; 
            font-weight: bold;
            cursor: pointer; 
            margin-top: 15px;
            box-shadow: 0 4px 6px rgba(46, 125, 50, 0.2);
        }

        .gps-btn {
            background-color: #0288d1;
            color: white;
            border: none;
            font-weight: bold;
            cursor: pointer;
            margin-bottom: 15px;
            box-shadow: 0 4px 6px rgba(2, 136, 209, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .route-card {
            position: relative; 
            background: var(--card-bg);
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 15px;
            box-shadow: 0 2px 8px var(--box-shadow);
            border: 1px solid var(--card-border);
        }
        .route-title {
            font-size: 18px;
            font-weight: bold;
            color: #2e7d32;
            margin: 0 0 8px 0;
            padding-right: 35px; 
        }
        [data-theme="dark"] .route-title { color: #81c784; }

        .love-btn {
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            font-size: 22px;
            cursor: pointer;
        }

        .route-details {
            font-size: 14px;
            color: var(--secondary-text);
            margin-bottom: 16px;
        }
        .route-details span {
            display: inline-block;
            background: var(--badge-bg);
            color: var(--text-color);
            padding: 4px 8px;
            border-radius: 4px;
            margin-right: 5px;
            margin-bottom: 5px;
            font-size: 12px;
        }

        .gps-distance-tag {
            background-color: #e1f5fe !important;
            color: #0288d1 !important;
            font-weight: 600;
        }

        .card-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            width: 100%;
        }

        .ask-ai-btn, .nav-btn, .map-btn {
            display: inline-block;
            flex: 1 1 calc(50% - 4px); 
            padding: 12px 8px;
            font-size: 13px;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            text-align: center;
            box-sizing: border-box;
            border: none;
            cursor: pointer;
        }

        .ask-ai-btn {
            background-color: #e8f5e9;
            color: #2e7d32;
            border: 1px solid #c8e6c9;
        }
        [data-theme="dark"] .ask-ai-btn {
            background-color: #1b3820;
            color: #81c784;
            border: 1px solid #2d5a32;
        }

        .nav-btn {
            background-color: #1a73e8;
            color: white;
        }

        .map-btn {
            background-color: var(--card-bg);
            color: var(--text-color);
            border: 1px solid var(--input-border);
            flex: 1 1 100%; 
            font-size: 14px;
        }

        /* 離線警告橫幅與危險警告 */
        .danger-alert {
            color: #d9381e !important;
            font-weight: bold;
            background-color: #fff0f0;
            padding: 4px 8px;
            border-radius: 4px;
            border: 1px solid #ffcccc;
            display: inline-block;
            margin-top: 5px;
        }
        .offline-alert {
            background-color: #ff9800 !important;
            color: white !important;
            font-weight: bold;
            padding: 6px 12px;
            border-radius: 6px;
            display: block;
            margin-bottom: 10px;
            text-align: center;
        }

        /* 圖表渲染畫布外框 */
        .chart-container {
            background-color: var(--input-bg);
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 15px;
            border: 1px solid var(--input-border);
        }
    </style>
</head>
<body>

    <div class="top-bar">
        <button id="theme-toggle" class="theme-toggle-btn">🌙 切換黑夜模式</button>
        <div id="favorite-count" class="favorite-badge">已收藏 0 條路線</div>
    </div>

    <h1>⛰️ HikingRice 香港行山搜尋</h1>
    <p id="subtitle">尋找你的下一條行山路線 x AI 裝備教練</p>

    <div class="search-box">
        <button id="gps-btn" class="gps-btn">📍 獲取我的位置計算距離</button>

        <div class="filter-group">
            <label for="keyword-input">關鍵字搜尋：</label>
            <input type="text" id="keyword-input" placeholder="搜尋景觀、起點或關鍵字（如：芒草）...">
            <div id="history-box" class="history-container">最近搜尋：<span id="history-list">無</span></div>
        </div>

        <div class="filter-group">
            <label>熱門路線標籤 (可多選)：</label>
            <div id="tags-cloud" class="tags-cloud"></div>
        </div>

        <div class="filter-group">
            <label for="region-select">選擇地區：</label>
            <select id="region-select">
                <option value="all">-- 所有地區 --</option>
                <option value="sai-kung">西貢 (例如：麥理浩徑)</option>
                <option value="hk-island">港島 (例如：龍脊)</option>
                <option value="lantau">大嶼山 (例如：大東山)</option>
            </select>
        </div>

        <div class="filter-group">
            <label for="diff-select">難度級別：</label>
            <select id="diff-select">
                <option value="all">-- 所有難度 --</option>
                <option value="1">★☆☆☆☆ 新手入門</option>
                <option value="3">★★★☆☆ 中等難度</option>
                <option value="5">★★★★★ 挑戰極限</option>
            </select>
        </div>

        <div class="filter-group">
            <label for="sort-select">結果排序：</label>
            <select id="sort-select">
                <option value="default">預設排序</option>
                <option value="distance-asc">距離：由短到長</option>
                <option value="diff-asc">難度：由低到高</option>
            </select>
        </div>

        <button id="search-btn" class="main-search-btn">搜尋路線</button>
    </div>

    <div id="results-list" style="margin-top: 25px;"></div>

    <div id="ai-suggestion-box" style="margin-top: 20px; padding: 18px; background-color: var(--card-bg); border-left: 6px solid #2e7d32; border-radius: 4px 16px 16px 4px; box-shadow: 0 4px 12px var(--box-shadow); display: none; border: 1px solid var(--card-border); border-left: 6px solid #2e7d32;">
        
        <div id="offline-banner" class="offline-alert" style="display: none;">📴 當前處於離線狀態，正顯示緩存天氣</div>

        <h3 style="margin-top: 0; color: #2e7d32;">🤖 AI 行山教練建議：</h3>
        
        <div id="weather-banner" style="background: #f1f8ff; border: 1px solid #c8e1ff; padding: 12px; border-radius: 8px; margin-bottom: 15px; font-size: 14px; color: #0366d6; display: none;">
            📊 <strong>天文台實時天氣：</strong> <span id="weather-metrics">🌡️ 氣候：--°C | 💧 濕度：--% | ☀️ 紫外線：--</span>
            <div id="weather-warning" style="margin-top: 7px;"></div>
        </div>

        <div class="chart-container">
            <h4 style="margin: 0 0 10px 0; font-size: 14px; color: var(--text-color);">📅 未來 3 天氣溫趨勢 (天文台九天預報)</h4>
            <canvas id="weatherChart" style="max-height: 200px; width: 100%;"></canvas>
        </div>

        <div id="ai-loading" style="color: var(--secondary-text); font-style: italic;">AI 教練正在分析實時天氣與未來預報... 🕒</div>
        <p id="ai-text" style="white-space: pre-line; line-height: 1.7; font-size: 15px; color: var(--text-color);"></p>
    </div>

    <script>
        // 1. 數據庫擴充：加上標籤 (Tags) 陣列
        const hikingRoutes = [
            { 
                name: "麥理浩徑第一、二段", 
                region: "sai-kung", 
                difficulty: "3", 
                start: "北潭涌", 
                end: "北潭凹", 
                distance: "24km", 
                distanceNum: 24,
                views: "海景/萬宜水庫",
                tags: ['海景', '萬宜水庫', '長途挑戰'],
                startCoords: "22.3957,114.3233",
                endCoords: "22.4289,114.3314"
            },
            { 
                name: "西灣亭至北潭凹", 
                region: "sai-kung", 
                difficulty: "3", 
                start: "西灣亭", 
                end: "北潭凹", 
                distance: "12km", 
                distanceNum: 12,
                views: "海景/大浪西灣",
                tags: ['海景', '大浪西灣', '新手推薦'],
                startCoords: "22.3994,114.3582",
                endCoords: "22.4289,114.3314"
            },
            { 
                name: "龍脊", 
                region: "hk-island", 
                difficulty: "1", 
                start: "土地灣", 
                end: "大浪灣", 
                distance: "8.5km", 
                distanceNum: 8.5,
                views: "海景/石澳",
                tags: ['海景', '石澳', '新手推薦', '落日'],
                startCoords: "22.2312,114.2384",
                endCoords: "22.2435,114.2505"
            },
            { 
                name: "大東山", 
                region: "lantau", 
                difficulty: "5", 
                start: "伯公坳", 
                end: "梅窩", 
                distance: "9km", 
                distanceNum: 9,
                views: "山景/芒草",
                tags: ['山景', '芒草', '高難度'],
                startCoords: "22.2562,113.9298",
                endCoords: "22.2576,113.9622"
            },
            { 
                name: "鳳凰山", 
                region: "lantau", 
                difficulty: "5", 
                start: "伯公坳", 
                end: "昂坪", 
                distance: "7km", 
                distanceNum: 7,
                views: "山景/日出",
                tags: ['山景', '日出', '高難度'],
                startCoords: "22.2562,113.9298",
                endCoords: "22.2559,113.9048"
            }
        ];

        // 狀態變數
        let userLocation = null; 
        let selectedTags = [];
        let myChartInstance = null; // 儲存 Chart.js 實例避免重疊重繪
        let savedFavorites = JSON.parse(localStorage.getItem('hikingFavorites')) || [];
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

        // DOM 元素
        const searchBtn = document.getElementById('search-btn');
        const gpsBtn = document.getElementById('gps-btn');
        const keywordInput = document.getElementById('keyword-input');
        const historyListSpan = document.getElementById('history-list');
        const tagsCloudDiv = document.getElementById('tags-cloud');
        const resultsList = document.getElementById('results-list');
        const aiBox = document.getElementById('ai-suggestion-box');
        const aiLoading = document.getElementById('ai-loading');
        const aiText = document.getElementById('ai-text');
        const offlineBanner = document.getElementById('offline-banner');
        
        const weatherBanner = document.getElementById('weather-banner');
        const weatherMetricsSpan = document.getElementById('weather-metrics');
        const weatherWarningSpan = document.getElementById('weather-warning');
        const favoriteCountSpan = document.getElementById('favorite-count');
        const themeToggleBtn = document.getElementById('theme-toggle');

        // 初始化：動態建立標籤按鈕
        function initTagsUI() {
            const allTags = new Set();
            hikingRoutes.forEach(r => r.tags.forEach(t => allTags.add(t)));
            tagsCloudDiv.innerHTML = '';
            allTags.forEach(tag => {
                const btn = document.createElement('button');
                btn.className = 'filter-tag-btn';
                btn.innerText = `# ${tag}`;
                btn.addEventListener('click', () => {
                    if (selectedTags.includes(tag)) {
                        selectedTags = selectedTags.filter(t => t !== tag);
                        btn.classList.remove('active');
                    } else {
                        selectedTags.push(tag);
                        btn.classList.add('active');
                    }
                });
                tagsCloudDiv.appendChild(btn);
            });
        }

        // 初始化：更新與顯示歷史搜尋紀錄 (功能 4)
        function renderHistoryUI() {
            if (searchHistory.length === 0) {
                historyListSpan.innerHTML = '無';
                return;
            }
            historyListSpan.innerHTML = '';
            searchHistory.forEach(word => {
                const span = document.createElement('span');
                span.className = 'history-tag';
                span.innerText = word;
                span.addEventListener('click', () => {
                    keywordInput.value = word;
                    searchBtn.click();
                });
                historyListSpan.appendChild(span);
            });
        }

        function saveSearchWord(word) {
            if (!word) return;
            searchHistory = searchHistory.filter(w => w !== word); // 移除重複
            searchHistory.unshift(word); // 推到最前
            if (searchHistory.length > 3) searchHistory.pop(); // 限制 3 個
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            renderHistoryUI();
        }

        // Haversine GPS 計算公式
        function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
            const R = 6371; 
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
            return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))); 
        }

        // 定位按鈕
        gpsBtn.addEventListener('click', () => {
            if (!navigator.geolocation) return;
            gpsBtn.innerText = "⏳ 定位中...";
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    gpsBtn.innerText = "✅ 定位成功";
                    searchBtn.click();
                },
                () => { gpsBtn.innerText = "❌ 定位失敗"; },
                { timeout: 5000 }
            );
        });

        // 搜尋主邏輯（結合多選標籤與關鍵字比對）
        searchBtn.addEventListener('click', function() {
            const keyword = keywordInput.value.trim().toLowerCase();
            const selectedRegion = document.getElementById('region-select').value;
            const selectedDiff = document.getElementById('diff-select').value;
            const sortOption = document.getElementById('sort-select').value;
            
            saveSearchWord(keyword);
            aiBox.style.display = 'none';
            resultsList.innerHTML = '';

            let results = hikingRoutes.filter(route => {
                const matchRegion = (selectedRegion === 'all' || route.region === selectedRegion);
                const matchDiff = (selectedDiff === 'all' || route.difficulty === selectedDiff);
                
                // 關鍵字模糊比對
                let matchKeyword = true;
                if (keyword !== '') {
                    matchKeyword = route.name.toLowerCase().includes(keyword) || 
                                   route.views.toLowerCase().includes(keyword) || 
                                   route.start.toLowerCase().includes(keyword);
                }

                // 功能 4：多重標籤過濾陣列判定 (必須包含所有勾選的標籤)
                let matchTags = true;
                if (selectedTags.length > 0) {
                    matchTags = selectedTags.every(tag => route.tags.includes(tag));
                }
                
                return matchRegion && matchDiff && matchKeyword && matchTags;
            });

            if (sortOption === 'distance-asc') results.sort((a, b) => a.distanceNum - b.distanceNum);
            else if (sortOption === 'diff-asc') results.sort((a, b) => parseInt(a.difficulty) - parseInt(b.difficulty));

            if (results.length > 0) {
                results.forEach(route => {
                    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${route.startCoords}&destination=${route.endCoords}&travelmode=walking`;
                    const transitUrl = `https://www.google.com/maps/dir/?api=1&destination=${route.startCoords}&travelmode=transit`;
                    const isFavorited = savedFavorites.includes(route.name);

                    let distanceString = "未知 (請點擊定位)";
                    let distanceClass = "";
                    if (userLocation) {
                        const startParts = route.startCoords.split(',');
                        const km = calculateHaversineDistance(userLocation.lat, userLocation.lng, parseFloat(startParts[0]), parseFloat(startParts[1]));
                        distanceString = `${km.toFixed(2)} km`;
                        distanceClass = "gps-distance-tag";
                    }

                    // 渲染卡片內部的標籤樣式
                    const tagBadges = route.tags.map(t => `<span style="background:#e8f5e9; color:#2e7d32;">#${t}</span>`).join('');

                    const card = document.createElement('div');
                    card.className = 'route-card';
                    card.innerHTML = `
                        <p class="route-title">📍 ${route.name}</p>
                        <button class="love-btn">${isFavorited ? '❤️' : '🤍'}</button>
                        <div class="route-details">
                            <span>🏃 全程 ${route.distance}</span>
                            <span>🏁 ${route.start} → ${route.end}</span>
                            ${tagBadges}
                            <span class="${distanceClass}">📍 距離你: ${distanceString}</span>
                        </div>
                        <div class="card-actions">
                            <button class="ask-ai-btn">🤖 AI 天氣與未來預報</button>
                            <a href="${transitUrl}" target="_blank" class="nav-btn">🚌 交通導航</a>
                            <a href="${googleMapsUrl}" target="_blank" class="map-btn">📍 路線完整地圖</a>
                        </div>
                    `;

                    card.querySelector('.ask-ai-btn').addEventListener('click', () => { triggerAI(route); });
                    card.querySelector('.love-btn').addEventListener('click', function() {
                        const idx = savedFavorites.indexOf(route.name);
                        if (idx === -1) { savedFavorites.push(route.name); this.innerText = '❤️'; }
                        else { savedFavorites.splice(idx, 1); this.innerText = '🤍'; }
                        localStorage.setItem('hikingFavorites', JSON.stringify(savedFavorites));
                        favoriteCountSpan.innerText = `已收藏 ${savedFavorites.length} 條路線`;
                    });

                    resultsList.appendChild(card);
                });
            } else {
                resultsList.innerHTML = `<p style="text-align:center; color:#999; margin-top:20px;">未搵到符合條件的路線。</p>`;
            }
        });

        // 功能 2 & 3：同時抓取天文台「即時天氣」與「九天預報 API」，內建離線緩存備載機制
        async function fetchHKWeatherAndForecast() {
            let isOffline = false;
            let currentData = null;
            let forecastData = null;

            // 1. 抓取即時天氣 (rhrread)
            try {
                const res = await fetch('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc');
                currentData = await res.json();
                localStorage.setItem('cache_current_weather', JSON.stringify(currentData)); // 快取起來
            } catch (e) {
                console.warn("即時天氣獲取失敗，啟動離線快取數據替代");
                isOffline = true;
                currentData = JSON.parse(localStorage.getItem('cache_current_weather')) || { temperature: { data: [{ value: 25 }] }, humidity: { data: [{ value: 75 }] }, uvIndex: "" };
            }

            // 2. 抓取九天天氣預報 (fnd)
            try {
                const res = await fetch('https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=tc');
                forecastData = await res.json();
                localStorage.setItem('cache_forecast_weather', JSON.stringify(forecastData)); // 快取起來
            } catch (e) {
                console.warn("九天預報獲取失敗，啟動離線快取數據替代");
                isOffline = true;
                forecastData = JSON.parse(localStorage.getItem('cache_forecast_weather')) || { weatherForecast: [] };
            }

            // 數據解析清洗
            let hkTemp = currentData.temperature?.data[0]?.value || 25;
            let hkHumidity = currentData.humidity?.data[0]?.value || 75;
            let hkUvIndex = currentData.uvIndex?.data?.[0]?.value || 0;
            
            let warningTexts = [];
            if (currentData.warningMessage) {
                currentData.warningMessage.forEach(msg => warningTexts.push(msg));
            }

            // 提取未來三天的天氣標籤、最高與最低氣溫
            let labels = [];
            let maxTemps = [];
            let minTemps = [];
            let futureRainAlert = false;

            if (forecastData.weatherForecast && forecastData.weatherForecast.length >= 3) {
                for (let i = 0; i < 3; i++) {
                    const day = forecastData.weatherForecast[i];
                    labels.push(day.forecastDate.substring(4, 6) + '/' + day.forecastDate.substring(6, 8)); // 格式化為 MM/DD
                    maxTemps.push(day.forecastMaxTemp.value);
                    minTemps.push(day.forecastMinTemp.value);
                    // 檢查未來三天內是否有雨
                    if (day.forecastWeather.includes('雨') || day.forecastWeather.includes('驟雨')) {
                        futureRainAlert = true;
                    }
                }
            }

            return {
                temp: hkTemp, humidity: hkHumidity, uv: hkUvIndex,
                warningRaw: warningTexts.join('、'), isOffline: isOffline,
                chart: { labels, maxTemps, minTemps },
                futureRainAlert: futureRainAlert
            };
        }

        // 功能 1：使用 Chart.js 動態繪製折線圖
        function drawWeatherChart(chartData) {
            const ctx = document.getElementById('weatherChart').getContext('2d');
            
            // 如果已存在舊的圖表實例，必須先銷毀，避免移動滑鼠時發生圖表跳動閃爍
            if (myChartInstance) {
                myChartInstance.destroy();
            }

            myChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartData.labels,
                    datasets: [
                        {
                            label: '最高氣溫 (°C)',
                            data: chartData.maxTemps,
                            borderColor: '#d9381e',
                            backgroundColor: 'rgba(217, 56, 30, 0.1)',
                            borderWidth: 2,
                            tension: 0.3
                        },
                        {
                            label: '最低氣溫 (°C)',
                            data: chartData.minTemps,
                            borderColor: '#1a73e8',
                            backgroundColor: 'rgba(26, 115, 232, 0.1)',
                            borderWidth: 2,
                            tension: 0.3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { ticks: { font: { size: 10 } } },
                        x: { ticks: { font: { size: 10 } } }
                    },
                    plugins: { legend: { labels: { font: { size: 11 } } } }
                }
            });
        }

        // 觸發 AI 看板與圖表工作流
        async function triggerAI(route) {
            aiBox.style.display = 'block';
            aiLoading.style.display = 'block';
            weatherBanner.style.display = 'none';
            aiText.innerText = '';
            aiBox.scrollIntoView({ behavior: 'smooth' });

            const weather = await fetchHKWeatherAndForecast();

            // PWA 離線容災：如果斷網，則高亮顯示離線緩存 Banner
            offlineBanner.style.display = weather.isOffline ? 'block' : 'none';

            // 更新天氣數據文字
            weatherMetricsSpan.innerHTML = `實時 🌡️ 氣候：${weather.temp}°C | 💧 濕度：${weather.humidity}% | ☀️ 紫外線：${weather.uv}`;
            weatherWarningSpan.innerHTML = weather.warningRaw ? `<span class="danger-alert">⚠️ 天文台警報：${weather.warningRaw}</span>` : '🟢 目前無極端天氣警告';
            weatherBanner.style.display = 'block';

            // 繪製未來天氣圖表
            if (weather.chart.labels.length > 0) {
                drawWeatherChart(weather.chart);
            }

            // 改良 AI 智能判斷邏輯（整合未來三天降雨預警）
            setTimeout(() => {
                let aiSuggestion = `【AI 行山教練智能決策 —— ${route.name}】\n\n`;
                aiSuggestion += `💧 飲水補給建議：目前體感偏暖，建議準備約 ${weather.temp > 28 ? '2.0' : '1.5'} 公升飲用水。 \n\n`;
                aiSuggestion += `🎒 戶外裝備建議：沿途特色為 ${route.views}。`;
                
                if (weather.uv >= 6) {
                    aiSuggestion += `\n☀️ 🚨 紫外線高企：請備好 SPF50+ 防曬、防曬帽與太陽眼鏡。`;
                }
                if (weather.futureRainAlert) {
                    aiSuggestion += `\n⚠️ 🚨 【天文台降雨預警】：AI 發現預報系統顯示未來 3 天內有機率出現降雨或驟雨！山路泥濘易滑，請務必隨身攜帶雨具（防風防水外套/雨傘），並隨時注意山洪與天氣轉變！`;
                } else {
                    aiSuggestion += `\n🟢 預報顯示未來數天無顯著降雨，路面狀況預期良好。`;
                }

                aiLoading.style.display = 'none';
                aiText.innerText = aiSuggestion;
            }, 1000);
        }

        // 黑夜模式切換
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggleBtn.innerText = savedTheme === 'dark' ? '☀️ 白天模式' : '🌙 黑夜模式';
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            themeToggleBtn.innerText = newTheme === 'dark' ? '☀️ 白天模式' : '🌙 黑夜模式';
            localStorage.setItem('theme', newTheme);
        });

        // 頁面初次運作
        initTagsUI();
        renderHistoryUI();
        searchBtn.click();

        // ==========================================
        // 3. 【功能 2：PWA 離線標準 Service Worker 註冊】
        // ==========================================
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./service-worker.js')
                    .then(reg => console.log('PWA SW 註冊成功，守護離線狀態中！', reg.scope))
                    .catch(err => console.error('Service Worker 註冊失敗:', err));
            });
        }
    </script>
</body>
</html>