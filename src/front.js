const apiPath = "https://mta-launcher.free.beeceptor.com/";

async function makeRequest(url) {  
    const resp = await fetch(url)
    return await resp.json();
}
async function serversUpdate() {
    //let servers = await makeRequest(apiPath + "servers");
    let servers = [
        {
            "id": 0,
            "players": 120,
            "maxPlayers": 1000,
            "status": 1,
            "image": "https://yrp.life/uploads/monthly_2021_12/sc11.png.f3e6e3c59f59c0e192af09628405bb92.png"
        }
    ];
    switch (servers.length) {
        case 1:
            oneServer(servers);
            break;
    }
}
async function getNews() {
    let news = [
        {
            "id": 0,
            "image": "https://images.stopgame.ru/news/2018/05/31/A6biPQ9eJKsJ6h.jpg",
            "title": "Ахаха",
            "description": "Деньги - это хорошо",
            "type": "Ну допустим"
        },
        {
            "id": 1,
            "image": "https://images.stopgame.ru/news/2018/05/31/EY_6tpI.jpg",
            "title": "Ещё какое-то название",
            "description": "Очень лень придумывать текст",
            "type": "Я чёт хз"
        }
    ];
    return news;
}
function newsPage() {
    return (
        `
        <h1 id="trendy">актуальное</h1>
        <div class="links">
            <a><p>официальный сайт</p><img src="public/arrow.svg"></a>
            <a><p>форум</p><img src="public/arrow.svg"></a>
            <a><p>vk</p><img src="public/arrow.svg"></a>
            <a><p>telegram</p><img src="public/arrow.svg"></a>
        </div>
        <div id="news-container" class="news">
        </div>
        `
    );
}
function changeNews(news) {
    let newsContainer = document.getElementById("news-container");
    newsContainer.style.background = `linear-gradient(0.92deg, rgba(0, 0, 0, 0.6) -10.51%, rgba(0, 0, 0, 0) 46.86%), url(${news.image})`;
    newsContainer.innerHTML = 
    `
    <text>${news.type}</text>
    <h1>${news.title}</h1>
    <h2>${news.description}</h2>
    <a id="news-link"><img id="news-link-img" src="public/arrow-right.svg"></a>
    `;
}
function settingsPage() {
    return (
        `
        <h1>настройки</h1>
        <h2 id="beta-key">бета ключ</h2>
        <input type="text" id="beta-key-value">
        <button id="save-button">Cохранить</button>
        <h2 id="game-path">путь до игры</h2>
        <p id="game-path-value">C:\\User\\program files\\gta derzhava</p>
        <button id="change-button" onclick="changePath()">Изменить</button>
        <div class="settings" id="column-1">
            <label class="checkbox-container"><p>Заменять звуки</p>
                <input type="checkbox" checked="checked">
                <span class="checkmark"></span>
            </label>
            <label class="checkbox-container"><p>Заменять погоду</p>
                <input type="checkbox">
                <span class="checkmark"></span>
            </label>
            <label class="checkbox-container"><p>Заменять текстуры транспорта</p>
                <input type="checkbox">
                <span class="checkmark"></span>
            </label>
            <label class="checkbox-container"><input type="checkbox"><p>Заменять текстуры эффектов</p>           
                <span class="checkmark"></span>
            </label>
        </div>
        <div class="settings" id="column-2">
            <label class="checkbox-container"><input type="checkbox"><p>Заменять эффекты</p>          
                <span class="checkmark"></span>
            </label>
            <label class="checkbox-container"><input type="checkbox"><p>Заменять оформление MTA</p>          
                <span class="checkmark"></span>
            </label>
            <label class="checkbox-container"><input type="checkbox"><p>Заменять текстуры травы</p>
                <span class="checkmark"></span>
            </label>
        </div>
        `
    );
}
async function changePage(selector) {
    let container = document.getElementById("changing-container");
    let settingsSVG = document.getElementById("settings-svg");
    let homeSVG1 = document.getElementById("home-svg-1");
    let homeSVG2 = document.getElementById("home-svg-2");

    if (selector.value == "settings") {
        container.innerHTML = settingsPage();     
        settingsSVG.style.fill = "#2E8DFF";
        homeSVG1.style.fill = "#7C8792";
        homeSVG2.style.fill = "#7C8792";
        homeSVG2.style.stroke = "#7C8792";
    } else {
        container.innerHTML = newsPage();
        let news = await getNews();
        changeNews(news[0]);
        settingsSVG.style.fill = "#7C8792";    
        homeSVG1.style.fill = "#2E8DFF";  
        homeSVG2.style.fill = "#2E8DFF";
        homeSVG2.style.stroke = "#2E8DFF";
    }
}
function oneServer(servers) {
    let serverContainer = document.getElementById("servers");
    serverContainer.innerHTML = 
    `
    <div class="server" name="server-container-1" style="background: linear-gradient(0.56deg, #141414 21.99%, rgba(0, 0, 0, 0) 85.01%), url('${servers[0].image}');">
        <h3 name="server-name-1-5">Сервер #${servers[0].id + 1}</h3>
        <label name="online-label-1-5">Онлайн</label>
        <h4 name="players-1-5">${servers[0].players}/${servers[0].maxPlayers}</h4>
        <label name="state-label-1-5">Состояние</label>
        <img id="dot" name="state-dot-1-5" src="public/dot.svg">
        <button name="play-1-5" onclick="window.electronAPI.connectToServer()">Играть</a>
    </div>
    `;
    //${servers[0].id}
}
async function changePath() {
    const filePath = await window.electronAPI.getDirectory()
    document.getElementById('game-path-value').innerText = filePath
}
function updateWarning() {
    return (
    `
    <img src="public/warning.svg" id="update-status-warning-img">
    <h4 id="update-status-warning">Требуется обновление!</h4>
    <h5 id="update-status-warning-description">Установите обновление для игры на проекте</h5>
    <button id="download">Установить</button>
    `);
}
function updateInProgress(fileName, speed, progress) {
    return (
        `
        <h4 id="update-in-progress-file">${fileName}</h4>
        <div id="update-progress-bar-outline"><div id="update-progress-bar" style="width: ${progress/100*355}px"></div></div>
        <h5 id="update-in-progress-speed">Скорость: ${speed}%</h5>
        <h5 id="update-in-progress-progress">${progress}%</h5>
        <button id="pause">Пауза</button>
        `);
}
function updates() {
    document.getElementById("update-container").innerHTML = updateInProgress("cards.dds", "8 МБ/С", 15);
}
async function main(){
    serversUpdate();
    let news = await getNews();
    changeNews(news[i]);
    i++;
    if (i > news.length - 1) i = 0;
}
main();
updates();
let i = 0;
// setInterval(main, 2000);