// import { newsContent } from "/pages/news.js";

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
            "image": "https://img4.goodfon.com/wallpaper/nbig/a/b5/grand-theft-auto-v-gta-5-game-city-landscape.jpg",
            "title": "Мы открылись!",
            "description": "Открытие лучшего проекта в MTA!",
            "type": "Обновление"
        },
        {
            "id": 1,
            "image": "https://img4.goodfon.com/wallpaper/nbig/a/b5/grand-theft-auto-v-gta-5-game-city-landscape.jpg",
            "title": "Мы открылись!",
            "description": "Открытие лучшего проекта в MTA!",
            "type": "Обновление"
        },
        {
            "id": 2,
            "image": "https://img4.goodfon.com/wallpaper/nbig/a/b5/grand-theft-auto-v-gta-5-game-city-landscape.jpg",
            "title": "Мы открылись!",
            "description": "Открытие лучшего проекта в MTA!",
            "type": "Обновление"
        }
    ];
    return news;
}
function newsContent() {
    return (
        `
        <h1 id="trendy">актуальное</h1>
        <div class="links">
            <a><p>официальный сайт</p><img src="public/arrow.svg"></a>
            <a><p>форум</p><img src="public/arrow.svg"></a>
            <a><p>vk</p><img src="public/arrow.svg"></a>
            <a><p>telegram</p><img src="public/arrow.svg"></a>
        </div>

        `
    );
}
function settingsContent() {
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
function changePage(selector) {
    let container = document.getElementById("changing-container");
    if (selector.value == "settings") {
        container.innerHTML = settingsContent();
    } else {
        container.innerHTML = newsContent();
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
        <button name="play-1-5" onclick="window.electronAPI.playGame()">Играть</a>
    </div>
    `;
    //${servers[0].id}
}
async function changePath() {
    const filePath = await window.electronAPI.getDirectory()
    document.getElementById('game-path-value').innerText = filePath
}
serversUpdate();
//setInterval(serversUpdate, 5000);