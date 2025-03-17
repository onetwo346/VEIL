const urlBar = document.getElementById('urlBar');
const webview = document.getElementById('webview');
const tabList = document.getElementById('tabList');
const backBtn = document.getElementById('backBtn');
const forwardBtn = document.getElementById('forwardBtn');
const refreshBtn = document.getElementById('refreshBtn');
const veilBtn = document.getElementById('veilBtn');

let tabs = [{ title: "Home", url: "https://www.duckduckgo.com" }];
let currentTab = 0;

function updateTabs() {
    tabList.innerHTML = '';
    tabs.forEach((tab, index) => {
        const tabEl = document.createElement('div');
        tabEl.className = 'tab' + (index === currentTab ? ' active' : '');
        tabEl.innerHTML = `${tab.title} <span class="close" onclick="closeTab(${index})">✖</span>`;
        tabEl.onclick = () => switchTab(index);
        tabList.appendChild(tabEl);
    });
    webview.src = tabs[currentTab].url;
}

function switchTab(index) {
    currentTab = index;
    webview.src = tabs[currentTab].url;
    urlBar.value = tabs[currentTab].url;
    updateTabs();
}

function closeTab(index) {
    if (tabs.length > 1) {
        tabs.splice(index, 1);
        if (currentTab >= tabs.length) currentTab = tabs.length - 1;
        updateTabs();
    }
}

function navigate() {
    let url = urlBar.value;
    if (!url.startsWith('http')) url = 'https://' + url;
    tabs[currentTab].url = url;
    webview.src = url;
}

function addTab() {
    tabs.push({ title: "New Tab", url: "https://www.duckduckgo.com" });
    currentTab = tabs.length - 1;
    updateTabs();
    goofyMode();
}

function goofyMode() {
    const confetti = document.createElement('div');
    confetti.innerHTML = '🎉😂 VEIL Party!';
    confetti.style.cssText = 'position: fixed; top: 50%; left: 50%; font-size: 30px; z-index: 9999;';
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 2000);
}

function intelligentLinking() {
    const doc = webview.contentWindow.document.body.innerText;
    const keywords = doc.split(/\s+/).filter(w => w.length > 5).slice(0, 3);
    console.log("VEIL Suggests:");
    keywords.forEach(k => console.log(`Search '${k}' - https://duckduckgo.com/?q=${k}`));
}

// Event listeners
urlBar.addEventListener('keypress', (e) => e.key === 'Enter' && navigate());
backBtn.onclick = () => webview.contentWindow.history.back();
forwardBtn.onclick = () => webview.contentWindow.history.forward();
refreshBtn.onclick = () => webview.src = webview.src;
veilBtn.onclick = () => { addTab(); setTimeout(intelligentLinking, 1000); };

// Initial setup
updateTabs();
