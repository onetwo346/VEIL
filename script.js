const urlBar = document.getElementById('urlBar');
const content = document.getElementById('content');
const tabList = document.getElementById('tabList');
const backBtn = document.getElementById('backBtn');
const forwardBtn = document.getElementById('forwardBtn');
const refreshBtn = document.getElementById('refreshBtn');
const veilBtn = document.getElementById('veilBtn');
const suggestions = document.getElementById('suggestions');
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
const goofySound = document.getElementById('goofySound');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let tabs = [{ title: "Home", url: "https://www.duckduckgo.com", content: "Welcome to VEIL—Search anything!" }];
let currentTab = 0;
let history = [tabs[0].url];
let historyIndex = 0;

function updateTabs() {
    tabList.innerHTML = '';
    tabs.forEach((tab, index) => {
        const tabEl = document.createElement('div');
        tabEl.className = 'tab' + (index === currentTab ? ' active' : '');
        tabEl.innerHTML = `${tab.title} <span class="close" onclick="closeTab(${index})">✖</span>`;
        tabEl.onclick = () => switchTab(index);
        tabList.appendChild(tabEl);
    });
    content.innerHTML = tabs[currentTab].content;
    urlBar.value = tabs[currentTab].url;
}

function switchTab(index) {
    currentTab = index;
    content.innerHTML = tabs[currentTab].content;
    urlBar.value = tabs[currentTab].url;
    updateTabs();
    intelligentLinking();
}

function closeTab(index) {
    if (tabs.length > 1) {
        tabs.splice(index, 1);
        if (currentTab >= tabs.length) currentTab = tabs.length - 1;
        updateTabs();
    }
}

async function navigate() {
    const query = urlBar.value.trim();
    if (!query) return;
    try {
        // Try DuckDuckGo first
        const ddResp = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`);
        const ddData = await ddResp.json();
        const result = ddData.AbstractText || ddData.Results[0]?.FirstURL || "No DuckDuckGo results...";
        if (result.includes("http")) {
            const pageResp = await fetch(result);
            const pageText = await pageResp.text();
            tabs[currentTab].content = `<div>${pageText.slice(0, 1000)}...</div>`;
        } else {
            tabs[currentTab].content = `<div>${result}</div>`;
        }
        tabs[currentTab].url = query;
        tabs[currentTab].title = query.slice(0, 10) + "...";
        history.push(query);
        historyIndex = history.length - 1;
        updateTabs();
        intelligentLinking();
    } catch (e) {
        // Fallback to Google scrape (basic)
        const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        tabs[currentTab].content = `<div>Redirecting to <a href="${googleUrl}" target="_blank">Google</a></div>`;
        tabs[currentTab].url = query;
        tabs[currentTab].title = query.slice(0, 10) + "...";
        history.push(query);
        historyIndex = history.length - 1;
        updateTabs();
        intelligentLinking();
    }
}

function addTab() {
    tabs.push({ title: "New Tab", url: "", content: "New Tab—Search or Explore!" });
    currentTab = tabs.length - 1;
    updateTabs();
    goofyMode();
}

function goBack() {
    if (historyIndex > 0) {
        historyIndex--;
        urlBar.value = history[historyIndex];
        navigate();
    }
}

function goForward() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        urlBar.value = history[historyIndex];
        navigate();
    }
}

function refresh() {
    navigate();
}

function goofyMode() {
    goofySound.play();
    let particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            size: Math.random() * 15 + 5,
            speedX: Math.random() * 8 - 4,
            speedY: Math.random() * 8 - 4,
            life: 150,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        });
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.life--;
            if (p.life <= 0) particles.splice(i, 1);
            ctx.fillStyle = p.color;
            ctx.font = `${p.size}px Arial`;
            ctx.fillText("😂🎉", p.x, p.y);
        });
        if (particles.length) requestAnimationFrame(animate);
    }
    animate();
}

function intelligentLinking() {
    const text = content.innerText;
    const keywords = text.split(/\s+/).filter(w => w.length > 5).slice(0, 5);
    suggestions.innerHTML = "VEIL Suggests:<br>" + keywords.map(k => 
        `<a href="#" onclick="urlBar.value='${k}';navigate();">${k}</a>`).join("<br>");
}

// Event listeners
urlBar.addEventListener('keypress', (e) => e.key === 'Enter' && navigate());
urlBar.addEventListener('input', () => {
    if (urlBar.value.length > 2) intelligentLinking();
});
backBtn.onclick = goBack;
forwardBtn.onclick = goForward;
refreshBtn.onclick = refresh;
veilBtn.onclick = addTab;

// Initial setup
updateTabs();
