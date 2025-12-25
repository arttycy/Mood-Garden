const ELEMENTS = {
    dateDisplay: document.getElementById('current-date'),
    moodInput: document.getElementById('mood-input'),
    addBtn: document.getElementById('add-btn'),
    timeline: document.getElementById('timeline'),
    dailyCanvas: document.getElementById('daily-flower'),
    todayView: document.getElementById('today-view'),
    jarView: document.getElementById('jar-view'),
    jarContent: document.getElementById('jar-content'), // Renamed from jar-grid
    // Calendar
    calendarView: document.getElementById('calendar-view'),
    calendarGrid: document.getElementById('calendar-grid'),
    calendarMonthYear: document.getElementById('calendar-month-year'),
    prevMonthBtn: document.getElementById('prev-month'),
    nextMonthBtn: document.getElementById('next-month'),
    
    navToday: document.getElementById('nav-today'),
    navJar: document.getElementById('nav-jar'),
    navCalendar: document.getElementById('nav-calendar'), // New Nav
    backToTodayBtn: document.getElementById('back-to-today'),
    // Settings
    settingsBtn: document.getElementById('settings-btn'),
    settingsModal: document.getElementById('settings-modal'),
    closeSettingsBtn: document.getElementById('close-settings'),
    saveSettingsBtn: document.getElementById('save-settings'),
    resetDataBtn: document.getElementById('reset-data-btn'),
    demoDataBtn: document.getElementById('demo-data-btn'), // New Demo Button
    apiUrlInput: document.getElementById('api-url'),
    apiKeyInput: document.getElementById('api-key'),
    modelNameInput: document.getElementById('model-name')
};

// ==========================================
// 🔧 Config Loading
// ==========================================
// Load Config: Priority given to config.js > localStorage > Defaults
let storedConfig = JSON.parse(localStorage.getItem('moodDiaryAIConfig')) || {};

// Check if MOOD_DIARY_CONFIG is defined (from config.js)
const externalConfig = (typeof MOOD_DIARY_CONFIG !== 'undefined') ? MOOD_DIARY_CONFIG : {};

let aiConfig = {
    url: externalConfig.apiUrl && externalConfig.apiUrl !== "https://api.openai.com/v1" ? externalConfig.apiUrl : (storedConfig.url || "https://api.openai.com/v1"),
    key: externalConfig.apiKey ? externalConfig.apiKey : (storedConfig.key || ''),
    model: externalConfig.model ? externalConfig.model : (storedConfig.model || "gpt-3.5-turbo")
};
// ==========================================

// State
let currentDate = new Date().toISOString().split('T')[0];
let data = JSON.parse(localStorage.getItem('moodDiaryData')) || {};

// Emotion Configuration (Base + Fallback)
const EMOTIONS = {
    happy: { color: '#FFD93D', icon: '☀️', keywords: ['开心', '高兴', '快乐', '爽', '棒', '喜', 'happy', 'joy', 'good', '美滋滋', '舒服', '满足', '幸运', '赢', '哈哈', '嘿嘿', '嘻嘻', '笑', 'nice', 'great', 'awesome', '顺利', '完美', '赞', '太好了', '治愈', '不生气', '没烦恼'] },
    excited: { color: '#FF6B6B', icon: '🎉', keywords: ['兴奋', '期待', 'excited', 'wow', '激动', '冲', '燃', '刺激', '惊喜', '天呐', 'omg', '牛', '厉害', '太神了', '绝了', 'yyds'] },
    sad: { color: '#6C5CE7', icon: '🌧️', keywords: ['难过', '伤心', '哭', '泪', '郁闷', 'sad', 'cry', 'bad', '痛苦', '惨', '糟', '唉', '呜呜', '低落', '失落', '失望', '遗憾', '不开心', '没劲', '心碎', 'emo', '孤独', '寂寞', '委屈'] },
    angry: { color: '#D63031', icon: '🔥', keywords: ['生气', '怒', '烦', '火', 'angry', 'mad', '气死', '讨厌', '滚', '恨', '恶心', '无语', '离谱', '有病', '傻逼', 'sb', 'tmd', '烦躁', '不爽', '暴躁'] },
    calm: { color: '#00B894', icon: '🍃', keywords: ['平静', '安', '闲', 'calm', 'relax', '没事', '普通', '一般', '还行', '正常', '喝茶', '发呆', '休息', '惬意', '安逸', 'peace', 'chill', '没啥', '就这样'] },
    love: { color: '#FD79A8', icon: '❤️', keywords: ['爱', '喜欢', 'love', 'like', '心动', '甜', '宠', '宝贝', '亲亲', '可爱', 'crush', '想你', '想见'] },
    tired: { color: '#B2BEC3', icon: '💤', keywords: ['累', '困', '疲', 'tired', 'sleepy', '瘫', '乏', '没力气', '心累', '想睡', '加班', '卷不动', '躺平'] },
    neutral: { color: '#A29BFE', icon: '💭', keywords: [] }
};

let currentCalendarDate = new Date(); // Track month for calendar

// 📖 Poetic Names from Stray Birds (Rabindranath Tagore)
const POETIC_NAMES = {
    happy: [
        "生如夏花 (Summer Flowers)",
        "晨光之吻 (Kiss of Morning)",
        "金色的收获 (Golden Harvest)",
        "飞鸟的歌 (Song of Birds)",
        "阳光的问候 (Greeting of Sun)"
    ],
    excited: [
        "燃烧的火花 (Burning Spark)",
        "风中的舞者 (Dancer in Wind)",
        "瞬间的永恒 (Eternal Moment)",
        "惊鸿一瞥 (Sudden Glimpse)",
        "热情的波浪 (Waves of Passion)"
    ],
    sad: [
        "秋叶之静 (Silence of Leaves)",
        "雨夜的灯 (Lamp in Rain)",
        "漂泊的云 (Wandering Cloud)",
        "露珠的泪 (Tears of Dew)",
        "黄昏的影子 (Shadow of Dusk)"
    ],
    angry: [
        "雷雨之剑 (Sword of Storm)",
        "带刺的玫瑰 (Thorny Rose)",
        "狂野的风 (Wild Wind)",
        "沉默的火 (Silent Fire)",
        "激流之石 (Stone in Torrent)"
    ],
    calm: [
        "静谧的湖 (Quiet Lake)",
        "星光之爱 (Love of Stars)",
        "远山的梦 (Dream of Hills)",
        "微风的低语 (Whisper of Breeze)",
        "月下的白莲 (Lotus in Moonlight)"
    ],
    love: [
        "爱的灯塔 (Lamp of Love)",
        "心之花环 (Garland of Hearts)",
        "温柔的夜 (Tender Night)",
        "无尽的思念 (Endless Longing)",
        "灵魂的伴侣 (Soulmate)"
    ],
    tired: [
        "疲惫的翅膀 (Tired Wings)",
        "沉睡的森林 (Sleeping Forest)",
        "归巢的鸟 (Homing Bird)",
        "落日的余晖 (Sunset Glow)",
        "等待黎明 (Waiting for Dawn)"
    ],
    neutral: [
        "时间的沙 (Sands of Time)",
        "无声的歌 (Silent Song)",
        "空白的页 (Blank Page)",
        "路过的风 (Passing Wind)",
        "未知的梦 (Unknown Dream)"
    ]
};

// Init
function init() {
    updateDateDisplay();
    renderTimeline();
    drawDailyFlower();
    setupEventListeners();
    loadSettings();
    renderCalendar(currentCalendarDate);
}

function updateDateDisplay() {
    ELEMENTS.dateDisplay.textContent = currentDate;
}

function loadSettings() {
    ELEMENTS.apiUrlInput.value = aiConfig.url;
    ELEMENTS.apiKeyInput.value = aiConfig.key;
    ELEMENTS.modelNameInput.value = aiConfig.model;
}

function setupEventListeners() {
    ELEMENTS.addBtn.addEventListener('click', addEntry);
    
    ELEMENTS.navToday.addEventListener('click', () => switchView('today'));
    ELEMENTS.navJar.addEventListener('click', () => {
        renderJar();
        switchView('jar');
    });
    ELEMENTS.navCalendar.addEventListener('click', () => {
        renderCalendar(currentCalendarDate);
        switchView('calendar');
    });

    // Calendar Navigation
    ELEMENTS.prevMonthBtn.addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
        renderCalendar(currentCalendarDate);
    });
    ELEMENTS.nextMonthBtn.addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
        renderCalendar(currentCalendarDate);
    });

    ELEMENTS.backToTodayBtn.addEventListener('click', () => {
        currentDate = new Date().toISOString().split('T')[0];
        updateDateDisplay();
        renderTimeline();
        drawDailyFlower();
        switchView('today');
    });

    // Settings
    ELEMENTS.settingsBtn.addEventListener('click', () => {
        ELEMENTS.settingsModal.classList.remove('hidden-view');
    });
    
    const closeSettings = () => {
        ELEMENTS.settingsModal.classList.add('hidden-view');
    };

    ELEMENTS.closeSettingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSettings();
    });

    // Close on background click
    ELEMENTS.settingsModal.addEventListener('click', (e) => {
        if (e.target === ELEMENTS.settingsModal) {
            closeSettings();
        }
    });

    ELEMENTS.saveSettingsBtn.addEventListener('click', () => {
        aiConfig = {
            url: ELEMENTS.apiUrlInput.value.trim(),
            key: ELEMENTS.apiKeyInput.value.trim(),
            model: ELEMENTS.modelNameInput.value.trim()
        };
        localStorage.setItem('moodDiaryAIConfig', JSON.stringify(aiConfig));
        closeSettings();
        alert('配置已保存！' + (aiConfig.key ? '已启用 AI 模式' : '将使用关键词模式'));
    });
    
    // Reset Data
    if (ELEMENTS.resetDataBtn) {
        ELEMENTS.resetDataBtn.addEventListener('click', () => {
            if (confirm('确定要清空所有日记和心情记录吗？此操作无法撤销。')) {
                localStorage.removeItem('moodDiaryData');
                data = {};
                currentDate = new Date().toISOString().split('T')[0];
                updateDateDisplay();
                renderTimeline();
                drawDailyFlower();
                renderJar();
                alert('数据已重置');
                closeSettings();
            }
        });
    }

    // Generate Demo Data
    if (ELEMENTS.demoDataBtn) {
        ELEMENTS.demoDataBtn.addEventListener('click', () => {
            if (confirm('这将生成过去14天的随机心情数据，用于展示效果。现有数据将被保留。确定吗？')) {
                generateDemoData();
                closeSettings();
                alert('✨ 演示数据已生成！去看看“心情罐子”吧！');
                // Switch to jar view to see the result
                renderJar();
                renderCalendar(currentCalendarDate); // Update calendar too
                switchView('jar');
            }
        });
    }
}

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Update Header
    ELEMENTS.calendarMonthYear.textContent = `${year}年 ${month + 1}月`;
    
    ELEMENTS.calendarGrid.innerHTML = '';
    
    // First day of the month
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    // Days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        ELEMENTS.calendarGrid.appendChild(emptyCell);
    }
    
    // Days
    const todayStr = new Date().toISOString().split('T')[0];
    
    for (let d = 1; d <= daysInMonth; d++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day';
        cell.textContent = d;
        
        // Format YYYY-MM-DD
        const currentMonthStr = (month + 1).toString().padStart(2, '0');
        const dayStr = d.toString().padStart(2, '0');
        const dateString = `${year}-${currentMonthStr}-${dayStr}`;
        
        // Highlight today
        if (dateString === todayStr) {
            cell.classList.add('today');
        }
        
        // Check for mood data
        if (data[dateString] && data[dateString].length > 0) {
            const entries = data[dateString];
            // Show up to 3 dots
            const dotsContainer = document.createElement('div');
            dotsContainer.style.display = 'flex';
            dotsContainer.style.gap = '2px';
            dotsContainer.style.justifyContent = 'center';
            dotsContainer.style.flexWrap = 'wrap';
            dotsContainer.style.width = '100%';
            dotsContainer.style.marginTop = '4px';
            
            // Limit to 3 dots to prevent overflow
            const showCount = Math.min(entries.length, 3);
            
            for(let i=0; i<showCount; i++) {
                const dot = document.createElement('div');
                dot.className = 'mood-dot';
                dot.style.backgroundColor = entries[i].color;
                dotsContainer.appendChild(dot);
            }
            
            if (entries.length > 3) {
                 const more = document.createElement('div');
                 more.className = 'more-dots';
                 more.textContent = '+';
                 dotsContainer.appendChild(more);
            }
            
            cell.appendChild(dotsContainer);
            
            // Click to view that day
            cell.addEventListener('click', () => {
                currentDate = dateString;
                updateDateDisplay();
                renderTimeline();
                drawDailyFlower();
                switchView('today');
            });
        }
        
        ELEMENTS.calendarGrid.appendChild(cell);
    }
}

function generateDemoData() {
    const moods = [
        { text: '今天天气真好，阳光明媚！', emotion: 'happy' },
        { text: '工作好多，感觉永远做不完...', emotion: 'tired' },
        { text: '收到了一份惊喜礼物！太开心了！', emotion: 'excited' },
        { text: '和朋友吵架了，心里有点堵。', emotion: 'sad' },
        { text: '周末在家看了一整天书，很平静。', emotion: 'calm' },
        { text: '这个甜点太好吃了，爱了爱了！', emotion: 'love' },
        { text: '堵车堵了一个小时，烦死了！', emotion: 'angry' },
        { text: '发呆中，不知道干什么。', emotion: 'neutral' },
        { text: '终于把项目做完了，成就感满满！', emotion: 'happy' },
        { text: '晚上去散步，风很舒服。', emotion: 'calm' }
    ];

    const today = new Date();
    
    // Generate for past 14 days
    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        if (!data[dateStr]) {
            data[dateStr] = [];
            // Randomly add 1-3 entries per day
            const entriesCount = Math.floor(Math.random() * 3) + 1;
            
            for (let j = 0; j < entriesCount; j++) {
                const randomMood = moods[Math.floor(Math.random() * moods.length)];
                const entry = {
                    id: Date.now() + Math.random(),
                    text: randomMood.text,
                    timestamp: new Date(date.setHours(10 + j*2)).toISOString(),
                    emotion: randomMood.emotion,
                    color: EMOTIONS[randomMood.emotion].color,
                    icon: EMOTIONS[randomMood.emotion].icon
                };
                data[dateStr].push(entry);
            }
        }
    }
    saveData();
}

function switchView(viewName) {
    const appContainer = document.querySelector('.app-container');
    
    // Hide all views first
    ELEMENTS.todayView.classList.add('hidden-view');
    ELEMENTS.todayView.classList.remove('active-view');
    ELEMENTS.jarView.classList.add('hidden-view');
    ELEMENTS.jarView.classList.remove('active-view');
    ELEMENTS.calendarView.classList.add('hidden-view');
    ELEMENTS.calendarView.classList.remove('active-view');
    
    // Reset Nav
    ELEMENTS.navToday.classList.remove('active');
    ELEMENTS.navJar.classList.remove('active');
    ELEMENTS.navCalendar.classList.remove('active');
    
    // Reset Background
    appContainer.classList.remove('jar-mode');

    if (viewName === 'today') {
        ELEMENTS.todayView.classList.remove('hidden-view');
        ELEMENTS.todayView.classList.add('active-view');
        ELEMENTS.navToday.classList.add('active');
    } else if (viewName === 'jar') {
        ELEMENTS.jarView.classList.remove('hidden-view');
        ELEMENTS.jarView.classList.add('active-view');
        ELEMENTS.navJar.classList.add('active');
        appContainer.classList.add('jar-mode');
    } else if (viewName === 'calendar') {
        ELEMENTS.calendarView.classList.remove('hidden-view');
        ELEMENTS.calendarView.classList.add('active-view');
        ELEMENTS.navCalendar.classList.add('active');
    }
}

    // Logic: Add Entry
    async function addEntry() {
        const text = ELEMENTS.moodInput.value.trim();
        if (!text) return;

        // UI Loading state
        const originalBtnText = ELEMENTS.addBtn.innerText;
        ELEMENTS.addBtn.innerText = '分析中...';
        ELEMENTS.addBtn.disabled = true;

        try {
            let analysis;
            // Check if key is configured (simple check)
            if (aiConfig.key && aiConfig.key.length > 5) {
                console.log('Using AI Analysis...');
                analysis = await analyzeWithLLM(text);
            } else {
                console.log('Using Local Keyword Analysis...');
                analysis = analyzeWithKeywords(text);
            }
            
            const entry = {
                id: Date.now(),
                text: text,
                timestamp: new Date().toISOString(),
                ...analysis
            };

            if (!data[currentDate]) {
                data[currentDate] = [];
            }
            data[currentDate].push(entry);
            saveData();

            ELEMENTS.moodInput.value = '';
            renderTimeline();
            drawDailyFlower();

        } catch (error) {
            console.error('Error adding entry:', error);
            
            let errorMsg = '分析失败，已切换回基础模式。';
            if (error.message.includes('API Error')) {
                errorMsg += `\n原因: ${error.message}`;
            } else if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
                errorMsg += '\n原因: 网络错误或跨域限制(CORS)。\n建议: 请检查 URL 是否支持浏览器直接访问，或尝试使用支持 CORS 的 API 代理。';
            } else {
                errorMsg += `\n原因: ${error.message}`;
            }
            
            alert(errorMsg);
            
            // Fallback
            const fallbackAnalysis = analyzeWithKeywords(text);
             const entry = {
                id: Date.now(),
                text: text,
                timestamp: new Date().toISOString(),
                ...fallbackAnalysis
            };
            if (!data[currentDate]) { data[currentDate] = []; }
            data[currentDate].push(entry);
            saveData();
            ELEMENTS.moodInput.value = '';
            renderTimeline();
            drawDailyFlower();
        } finally {
            ELEMENTS.addBtn.innerText = originalBtnText;
            ELEMENTS.addBtn.disabled = false;
        }
    }

    // Logic: AI Analysis (LLM)
    async function analyzeWithLLM(text) {
        const prompt = `
        Analyze the sentiment of the following text: "${text}".
        Return a JSON object with exactly these fields:
        - "emotion": one of ["happy", "excited", "sad", "angry", "calm", "love", "tired", "neutral"]
        - "color": a hex color code representing the mood
        - "icon": a single emoji representing the mood
        
        Example response: {"emotion": "happy", "color": "#fdcb6e", "icon": "☀️"}
        Only return the JSON.
        `;

        // Ensure URL doesn't end with slash
        let baseUrl = aiConfig.url.replace(/\/+$/, '');

        try {
            const response = await fetch(`${baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${aiConfig.key}`
                },
                body: JSON.stringify({
                    model: aiConfig.model,
                    messages: [
                        { role: "system", content: "You are a helpful assistant that analyzes sentiment and returns JSON." },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                // Try to read error body
                let errDetail = response.statusText;
                try {
                    const errJson = await response.json();
                    if (errJson.error && errJson.error.message) {
                        errDetail = errJson.error.message;
                    }
                } catch (e) { /* ignore */ }
                
                throw new Error(`API Error ${response.status}: ${errDetail}`);
            }

            const result = await response.json();
            
            if (!result.choices || !result.choices.length) {
                throw new Error('Invalid API response: no choices');
            }

            const content = result.choices[0].message.content;
            
            // Clean markdown code blocks if present
            const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
            try {
                return JSON.parse(jsonStr);
            } catch (e) {
                console.error("Failed to parse LLM JSON:", content);
                throw new Error("LLM returned invalid JSON");
            }

        } catch (e) {
            console.error("LLM Call Failed", e);
            throw e;
        }
    }

// Logic: Local Analysis (Fallback)
function analyzeWithKeywords(text) {
    const lowerText = text.toLowerCase();
    let scores = {};
    
    // Define negation words
    const negations = ['不', '没', '无', '非', '别', 'no', 'not', 'dont', 'don\'t'];
    
    // Emotion opposites map (for negation flipping)
    const opposites = {
        'happy': 'sad',
        'excited': 'calm',
        'sad': 'happy',
        'angry': 'calm',
        'calm': 'excited',
        'love': 'angry', // Approximate
        'tired': 'excited' // Approximate
    };

    for (const key of Object.keys(EMOTIONS)) {
        if (key === 'neutral') continue;
        scores[key] = 0;
    }

    for (const [key, config] of Object.entries(EMOTIONS)) {
        if (key === 'neutral') continue;
        
        config.keywords.forEach(keyword => {
            let index = lowerText.indexOf(keyword);
            while (index !== -1) {
                // Check for negation immediately preceding the keyword (up to 2 chars back to catch "并没有")
                const precedingText = lowerText.substring(Math.max(0, index - 3), index);
                let isNegated = false;
                
                for (const neg of negations) {
                    if (precedingText.endsWith(neg)) {
                        isNegated = true;
                        break;
                    }
                }

                if (isNegated) {
                    // If negated, add score to the opposite emotion instead
                    const oppositeEmotion = opposites[key];
                    if (oppositeEmotion && scores[oppositeEmotion] !== undefined) {
                        scores[oppositeEmotion] += 1;
                    } else {
                        // If no direct opposite, maybe just reduce score or ignore? 
                        // For now, let's treat "not happy" as "sad" (which is mapped).
                        // If "not neutral", ignore.
                    }
                } else {
                    scores[key] += 1;
                }

                // Find next occurrence
                index = lowerText.indexOf(keyword, index + 1);
            }
        });
    }

    let bestEmotion = 'neutral';
    let maxScore = 0;

    for (const [key, score] of Object.entries(scores)) {
        if (score > maxScore) {
            maxScore = score;
            bestEmotion = key;
        }
    }

    return {
        emotion: bestEmotion,
        color: EMOTIONS[bestEmotion].color,
        icon: EMOTIONS[bestEmotion].icon
    };
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
}

function hexToRgba(hex, alpha) {
    let c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
    }
    return `rgba(0,0,0,${alpha})`; // Fallback
}

function getMixedColor(entries) {
    if (!entries || entries.length === 0) return '#dfe6e9'; // Default gray

    let r = 0, g = 0, b = 0;
    
    // Track mood positivity
    let positiveCount = 0;
    const positiveMoods = ['happy', 'excited', 'love', 'calm'];
    
    entries.forEach(entry => {
        let hex = entry.color;
        if (hex.startsWith('#')) hex = hex.slice(1);
        
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }
        
        const bigint = parseInt(hex, 16);
        r += (bigint >> 16) & 255;
        g += (bigint >> 8) & 255;
        b += bigint & 255;
        
        if (positiveMoods.includes(entry.emotion)) {
            positiveCount++;
        }
    });

    r = Math.round(r / entries.length);
    g = Math.round(g / entries.length);
    b = Math.round(b / entries.length);

    // If mainly positive, boost saturation and brightness
    if (positiveCount > entries.length / 2) {
        const hsl = rgbToHsl(r, g, b);
        // Boost Saturation to at least 80%
        hsl[1] = Math.max(hsl[1], 0.8); 
        // Ensure Lightness is between 55% and 75% (Bright but not washed out)
        hsl[2] = Math.max(0.55, Math.min(hsl[2], 0.75));
        
        const boostedRgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
        r = boostedRgb[0];
        g = boostedRgb[1];
        b = boostedRgb[2];
    }

    // Return as Hex
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function getDominantEmotion(entries) {
    if (!entries || entries.length === 0) return 'neutral';
    
    const counts = {};
    let maxCount = 0;
    let dominant = 'neutral';
    
    entries.forEach(entry => {
        const emo = entry.emotion;
        counts[emo] = (counts[emo] || 0) + 1;
        if (counts[emo] > maxCount) {
            maxCount = counts[emo];
            dominant = emo;
        }
    });
    
    return dominant;
}

// Helper: RGB to HSL
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

// Helper: HSL to RGB
function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function saveData() {
    localStorage.setItem('moodDiaryData', JSON.stringify(data));
}

// Rendering
function renderTimeline() {
    const entries = data[currentDate] || [];
    ELEMENTS.timeline.innerHTML = '';

    [...entries].reverse().forEach((entry, index) => {
        const card = document.createElement('div');
        card.className = 'entry-card';
        // Set border color via inline variable for pseudo-element
        card.style.setProperty('--card-border-color', entry.color);
        
        // Stagger animation
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="entry-icon" style="background-color: ${entry.color}20">${entry.icon}</div>
            <div class="entry-content">
                <p class="entry-text">${entry.text}</p>
                <div class="entry-meta">${new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} · ${entry.emotion}</div>
            </div>
        `;
        ELEMENTS.timeline.appendChild(card);
    });
}

// Helper: Generate Light and Dark variations for gradients
function generateGradientColors(hex) {
    if (hex.startsWith('#')) hex = hex.slice(1);
    if (hex.length === 3) hex = hex.split('').map(c => c+c).join('');
    
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    
    const [h, s, l] = rgbToHsl(r, g, b);
    
    // Light: More lightness, slightly less saturation
    const lightRgb = hslToRgb(h, Math.max(0, s - 0.1), Math.min(1, l + 0.15));
    // Dark: Less lightness, slightly more saturation
    const darkRgb = hslToRgb(h, Math.min(1, s + 0.1), Math.max(0, l - 0.15));
    
    return {
        base: `rgb(${r}, ${g}, ${b})`,
        light: `rgb(${lightRgb[0]}, ${lightRgb[1]}, ${lightRgb[2]})`,
        dark: `rgb(${darkRgb[0]}, ${darkRgb[1]}, ${darkRgb[2]})`,
        rgba: (alpha) => `rgba(${r}, ${g}, ${b}, ${alpha})`
    };
}

// 🌸 Flower Drawing Logic
const FLOWER_TYPES = {
    happy: 'sunflower',
    excited: 'hibiscus',
    sad: 'tulip',
    angry: 'chrysanthemum',
    calm: 'orchid',
    love: 'rose',
    tired: 'begonia',
    neutral: 'default'
};

function getDailyFlowerName(emotion, dateStr) {
    if (!emotion) return "等待盛开";
    const names = POETIC_NAMES[emotion] || POETIC_NAMES['neutral'];
    // Use date string hash to pick a consistent name for the same day
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % names.length;
    return names[index];
}

function drawDailyFlower() {
    const ctx = ELEMENTS.dailyCanvas.getContext('2d');
    const width = ELEMENTS.dailyCanvas.width;
    const height = ELEMENTS.dailyCanvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    const entries = data[currentDate] || [];
    
    // Default empty state
    if (entries.length === 0) {
        drawFlower(ctx, 'default', centerX, centerY, 50, '#dfe6e9');
        document.querySelector('.flower-caption').innerHTML = `🌱 等待记录 · 暂无心情`;
        return;
    }

    const flowerColor = getMixedColor(entries);
    // Size grows with number of entries
    const flowerScale = Math.min(1.5, 0.7 + (entries.length * 0.15));
    const baseSize = 80; // Base radius size
    const size = baseSize * flowerScale;

    // Determine Flower Type
    const dominantEmotion = getDominantEmotion(entries);
    const flowerType = FLOWER_TYPES[dominantEmotion] || 'default';

    drawFlower(ctx, flowerType, centerX, centerY, size, flowerColor);
    
    // Update Caption with Poetic Name
    const poeticName = getDailyFlowerName(dominantEmotion, currentDate);
    document.querySelector('.flower-caption').innerHTML = `${EMOTIONS[dominantEmotion]?.icon || '🌸'} ${poeticName}`;
}

function drawMiniFlower(canvas, entries) {
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    
    // Scale down
    const baseScale = 0.25; 
    let dynamicScale = baseScale;
    let mixedColor = '#dfe6e9';
    let flowerType = 'default';

    if (entries && entries.length > 0) {
        mixedColor = getMixedColor(entries);
        const growth = Math.min(1.4, 0.8 + (entries.length * 0.15));
        dynamicScale = baseScale * growth;
        
        const dominantEmotion = getDominantEmotion(entries);
        flowerType = FLOWER_TYPES[dominantEmotion] || 'default';
    }

    // Canvas size is 60x60, so max radius should be around 25
    const size = 80 * dynamicScale; 
    
    drawFlower(ctx, flowerType, cx, cy, size, mixedColor);
}

// 🎨 Universal Flower Painter
function drawFlower(ctx, type, x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);

    switch (type) {
        case 'sunflower': // Happy
            drawSunflower(ctx, size, color);
            break;
        case 'rose': // Love
            drawRose(ctx, size, color);
            break;
        case 'hibiscus': // Excited
            drawHibiscus(ctx, size, color);
            break;
        case 'orchid': // Calm
            drawOrchid(ctx, size, color);
            break;
        case 'tulip': // Sad
            drawTulip(ctx, size, color);
            break;
        case 'chrysanthemum': // Angry
            drawChrysanthemum(ctx, size, color);
            break;
        case 'begonia': // Tired
            drawBegonia(ctx, size, color);
            break;
        default:
            drawDefaultFlower(ctx, size, color);
            break;
    }

    ctx.restore();
}

// --- Specific Flower Algorithms ---

function drawDefaultFlower(ctx, size, color) {
    const petalsNum = 8;
    const angleStep = (Math.PI * 2) / petalsNum;
    const petalLength = size;
    const petalWidth = size * 0.6;
    
    const colors = generateGradientColors(color);

    for (let i = 0; i < petalsNum; i++) {
        ctx.save();
        ctx.rotate(i * angleStep);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(petalWidth / 2, -petalLength / 3, petalWidth, -petalLength, 0, -petalLength);
        ctx.bezierCurveTo(-petalWidth, -petalLength, -petalWidth / 2, -petalLength / 3, 0, 0);
        
        // Soft Gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, -petalLength);
        gradient.addColorStop(0, colors.dark); // Darker at center
        gradient.addColorStop(0.5, colors.base);
        gradient.addColorStop(1, colors.light); // Lighter at tips
        ctx.fillStyle = gradient;
        
        // Add subtle transparency
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.restore();
    }
    
    // Center
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fill();
}

function drawSunflower(ctx, size, color) {
    const petalsNum = 12;
    const angleStep = (Math.PI * 2) / petalsNum;
    const petalLength = size;
    const petalWidth = size * 0.35;
    
    const colors = generateGradientColors(color);

    // Petals
    for (let i = 0; i < petalsNum; i++) {
        ctx.save();
        ctx.rotate(i * angleStep);
        ctx.beginPath();
        ctx.ellipse(0, -petalLength * 0.6, petalWidth / 2, petalLength / 2, 0, 0, Math.PI * 2);
        
        const gradient = ctx.createLinearGradient(0, 0, 0, -petalLength);
        gradient.addColorStop(0, '#e67e22'); // Slight orange tint at base for depth
        gradient.addColorStop(0.4, colors.base);
        gradient.addColorStop(1, colors.light);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();
    }

    // Big Center
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = '#6d4c41'; // Brown center
    ctx.fill();
    // Seeds pattern
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    for(let r=0; r<size*0.35; r+=4) {
        for(let a=0; a<Math.PI*2; a+=0.5) {
            ctx.beginPath();
            ctx.arc(Math.cos(a)*r, Math.sin(a)*r, 1, 0, Math.PI*2);
            ctx.fill();
        }
    }
}

function drawRose(ctx, size, color) {
    const layers = 4;
    const colors = generateGradientColors(color);
    
    for (let l = layers; l > 0; l--) {
        const radius = size * (l / layers);
        const petals = 3 + l;
        const angleStep = (Math.PI * 2) / petals;
        const offset = (l % 2) * (Math.PI / petals);

        for (let i = 0; i < petals; i++) {
            ctx.save();
            ctx.rotate(i * angleStep + offset);
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, -radius * 0.5, radius * 0.5, 0, Math.PI, true); 
            ctx.lineTo(0, 0);
            
            // Radial gradient for velvety look
            const gradient = ctx.createRadialGradient(0, -radius*0.5, 0, 0, -radius*0.5, radius);
            gradient.addColorStop(0, l === 1 ? colors.dark : colors.base);
            gradient.addColorStop(1, l === layers ? colors.light : colors.base);
            
            ctx.fillStyle = gradient;
            ctx.globalAlpha = 0.8 + (l/layers) * 0.2; // Inner petals more transparent
            ctx.fill();
            
            ctx.strokeStyle = 'rgba(255,255,255,0.15)';
            ctx.stroke();
            
            ctx.restore();
        }
    }
    
    // Spiral Center
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = colors.dark;
    ctx.fill();
}

function drawHibiscus(ctx, size, color) {
    const petalsNum = 5;
    const angleStep = (Math.PI * 2) / petalsNum;
    const colors = generateGradientColors(color);
    
    // Large wide petals
    for (let i = 0; i < petalsNum; i++) {
        ctx.save();
        ctx.rotate(i * angleStep);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(size*0.5, -size*0.2, size, -size*0.8, 0, -size);
        ctx.bezierCurveTo(-size, -size*0.8, -size*0.5, -size*0.2, 0, 0);
        
        const gradient = ctx.createRadialGradient(0, 0, 5, 0, -size*0.6, size);
        gradient.addColorStop(0, '#c0392b'); // Deep red center
        gradient.addColorStop(0.3, colors.dark);
        gradient.addColorStop(1, colors.light);
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.restore();
    }

    // Stamen (Long pistil)
    ctx.save();
    ctx.rotate(Math.PI / 4); 
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -size * 0.8);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#fff'; 
    ctx.stroke();
    
    // Pollen
    ctx.fillStyle = '#ffeaa7';
    ctx.beginPath();
    ctx.arc(0, -size * 0.8, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawOrchid(ctx, size, color) {
    const colors = generateGradientColors(color);
    
    // 3 Sepals (Outer)
    for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.rotate(i * (Math.PI * 2 / 3) - Math.PI / 6);
        ctx.beginPath();
        ctx.ellipse(0, -size * 0.6, size * 0.2, size * 0.6, 0, 0, Math.PI * 2);
        
        const gradient = ctx.createLinearGradient(0, 0, 0, -size);
        gradient.addColorStop(0, colors.base);
        gradient.addColorStop(1, colors.light);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();
    }

    // 2 Petals (Inner side)
    [-1, 1].forEach(dir => {
        ctx.save();
        ctx.rotate(dir * Math.PI / 2.5);
        ctx.beginPath();
        ctx.ellipse(0, -size * 0.5, size * 0.35, size * 0.5, 0, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(0, -size*0.5, 0, 0, -size*0.5, size*0.5);
        gradient.addColorStop(0, colors.light);
        gradient.addColorStop(1, colors.base);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.restore();
    });

    // Lip (Bottom center)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(size*0.3, size*0.3, size*0.3, size*0.8, 0, size*0.8);
    ctx.bezierCurveTo(-size*0.3, size*0.8, -size*0.3, size*0.3, 0, 0);
    
    // Contrast color for lip
    const lipGradient = ctx.createLinearGradient(0, 0, 0, size);
    lipGradient.addColorStop(0, '#ffeaa7');
    lipGradient.addColorStop(1, '#fab1a0');
    ctx.fillStyle = lipGradient;
    ctx.fill();
    ctx.restore();
}

function drawTulip(ctx, size, color) {
    const colors = generateGradientColors(color);
    
    // Cup shape
    ctx.save();
    ctx.translate(0, size * 0.2); 
    
    // Common gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, -size);
    gradient.addColorStop(0, colors.dark);
    gradient.addColorStop(1, colors.light);

    // Back petal
    ctx.beginPath();
    ctx.ellipse(0, -size*0.5, size*0.4, size*0.6, 0, 0, Math.PI*2);
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.8;
    ctx.fill();

    // Left petal
    ctx.beginPath();
    ctx.rotate(-0.2);
    ctx.ellipse(-size*0.25, -size*0.4, size*0.3, size*0.6, 0, 0, Math.PI*2);
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.9;
    ctx.fill();
    ctx.rotate(0.2); 

    // Right petal
    ctx.beginPath();
    ctx.rotate(0.2);
    ctx.ellipse(size*0.25, -size*0.4, size*0.3, size*0.6, 0, 0, Math.PI*2);
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.9;
    ctx.fill();
    ctx.rotate(-0.2);

    // Front center petal
    ctx.beginPath();
    ctx.ellipse(0, -size*0.4, size*0.3, size*0.65, 0, 0, Math.PI*2);
    ctx.fillStyle = gradient; // Same gradient, but maybe shift start
    ctx.globalAlpha = 1;
    ctx.fill();

    ctx.restore();
}

function drawChrysanthemum(ctx, size, color) {
    const petalsNum = 40;
    const angleStep = (Math.PI * 2) / petalsNum;
    const colors = generateGradientColors(color);
    
    // Multiple layers of thin petals
    for(let l=0; l<3; l++) {
        const layerSize = size * (1 - l*0.2);
        for (let i = 0; i < petalsNum; i++) {
            ctx.save();
            ctx.rotate(i * angleStep + (l * 0.1));
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            // Sharp thin petal
            ctx.quadraticCurveTo(layerSize*0.1, -layerSize*0.5, 0, -layerSize);
            ctx.quadraticCurveTo(-layerSize*0.1, -layerSize*0.5, 0, 0);
            
            // Gradient from center out
            const gradient = ctx.createLinearGradient(0, 0, 0, -layerSize);
            gradient.addColorStop(0, colors.dark);
            gradient.addColorStop(1, colors.light);
            
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.restore();
        }
    }
}

function drawBegonia(ctx, size, color) {
    const petalsNum = 4;
    const angleStep = (Math.PI * 2) / petalsNum;
    const colors = generateGradientColors(color);
    
    for (let i = 0; i < petalsNum; i++) {
        ctx.save();
        ctx.rotate(i * angleStep);
        
        ctx.beginPath();
        // Heart-like wide petals
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(size, -size*0.5, size, -size, 0, -size);
        ctx.bezierCurveTo(-size, -size, -size, -size*0.5, 0, 0);
        
        const gradient = ctx.createRadialGradient(0, -size*0.5, 5, 0, -size*0.5, size);
        gradient.addColorStop(0, colors.light);
        gradient.addColorStop(1, colors.base);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Veins
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.stroke();
        
        ctx.restore();
    }
    
    // Yellow Center
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = '#ffeaa7';
    ctx.fill();
}

function renderJar() {
    ELEMENTS.jarContent.innerHTML = ''; // Clear container
    
    const dates = Object.keys(data).sort().reverse();
    
    // Crystal Ball Dimensions
    const jarSize = 320;
    const radius = jarSize / 2;
    const itemSize = 60;
    const itemRadius = itemSize / 2;
    // Safe radius for placing items (keep away from very edge)
    const safeRadius = radius - itemRadius - 10; 

    // Store placed items to check collisions: {x, y, r}
    const placedItems = [];

    dates.forEach((date, index) => {
        const entries = data[date];
        if (!entries || entries.length === 0) return;
        
        const item = document.createElement('div');
        item.className = 'jar-item';
        item.setAttribute('data-date', date);

        // --- Collision Detection Logic ---
        let x, y;
        let attempt = 0;
        const maxAttempts = 50; // Try 50 times to find a free spot
        let placed = false;

        while (attempt < maxAttempts && !placed) {
            // Generate random polar coordinates
            const angle = Math.random() * 2 * Math.PI;
            // Use sqrt for uniform distribution within circle
            const r = Math.sqrt(Math.random()) * safeRadius; 
            
            // Convert to cartesian relative to center
            const relX = Math.cos(angle) * r;
            const relY = Math.sin(angle) * r;

            // Convert to CSS coordinates (top-left based)
            // Center of jar is (radius, radius)
            // Item position is top-left corner, so subtract itemRadius
            x = radius + relX - itemRadius;
            y = radius + relY - itemRadius;

            // Check collision with all previously placed items
            let overlap = false;
            for (const p of placedItems) {
                // Calculate distance between centers
                const dx = (x + itemRadius) - (p.x + itemRadius);
                const dy = (y + itemRadius) - (p.y + itemRadius);
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Min distance needed = sum of radii + padding
                // Let's add 5px padding
                if (distance < (itemSize + 5)) {
                    overlap = true;
                    break;
                }
            }

            if (!overlap) {
                placed = true;
                placedItems.push({x, y});
            }
            
            attempt++;
        }

        // If we couldn't find a spot after maxAttempts, just place it at the last generated position
        // (This prevents infinite loops if the jar is too full)
        
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        
        // Random Float Animation
        const duration = 4 + Math.random() * 5; 
        const delay = Math.random() * -5;
        const rot = Math.random() * 360;
        item.style.transform = `rotate(${rot}deg)`;
        item.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
        
        const miniCanvas = document.createElement('canvas');
        miniCanvas.width = 60;
        miniCanvas.height = 60;
        drawMiniFlower(miniCanvas, entries);
        
        item.appendChild(miniCanvas);
        
        item.addEventListener('click', (e) => {
            e.stopPropagation(); 
            currentDate = date;
            updateDateDisplay();
            renderTimeline();
            drawDailyFlower();
            switchView('today');
        });

        ELEMENTS.jarContent.appendChild(item);
    });
}

// Add float keyframes dynamically if not present
if (!document.getElementById('dynamic-styles')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'dynamic-styles';
    styleSheet.innerText = `
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
        }
    `;
    document.head.appendChild(styleSheet);
}

function drawMiniFlower(canvas, entries) {
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    
    // Scale down
    const baseScale = 0.22; 
    let dynamicScale = baseScale;
    let mixedColor = '#dfe6e9';

    if (entries && entries.length > 0) {
        mixedColor = getMixedColor(entries);
        // Same growth logic but scaled down
        const growth = Math.min(1.4, 0.7 + (entries.length * 0.15));
        dynamicScale = baseScale * growth;
    }

    const petalLength = 100 * dynamicScale;
    const petalWidth = 60 * dynamicScale;
    const petalsNum = 8;
    const angleStep = (Math.PI * 2) / petalsNum;

    for (let i = 0; i < petalsNum; i++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(i * angleStep);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(petalWidth / 2, -petalLength / 3, petalWidth, -petalLength, 0, -petalLength);
        ctx.bezierCurveTo(-petalWidth, -petalLength, -petalWidth / 2, -petalLength / 3, 0, 0);
        
        // Gradient fill for mini flower
        const gradient = ctx.createLinearGradient(0, -petalLength, 0, 0);
        gradient.addColorStop(0, hexToRgba(mixedColor, 0.9));
        gradient.addColorStop(1, hexToRgba(mixedColor, 0.6));
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.restore();
    }
    
    ctx.beginPath();
    ctx.arc(cx, cy, 4 * Math.max(0.8, dynamicScale/baseScale * 0.8), 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fill();
}

// Start
init();
