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

    if (servers.length == 1) oneServer(servers);
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
        <p id="beta-key-value">C:\\Users\\Dmitry\\WebstormProjects\\mta-launcher\\test_gamepath</p>
        <button id="save-button">Cохранить</button>
        <h2 id="game-path">путь до игры</h2>
        <p id="beta-key-value">C:\\User\\program files\\gta derzhava</p>
        <button id="change-button">Изменить</button>
        <div class="settings">
            <p><input type="checkbox" name="settings-checkbox">Настройка с чекбоксом</p>
            <p><input type="checkbox" name="settings-checkbox">Настройка с чекбоксом, не включена</p>
            <p><input type="checkbox" name="settings-checkbox">Настройка с чекбоксом 
            в две строчки</p>
            <p><input type="checkbox" name="settings-checkbox">Настройка с чекбоксом</p>
            <p><input type="checkbox" name="settings-checkbox">Заменять звуки</p>
            <p><input type="checkbox" name="settings-checkbox">Заменять погоду</p>
            <p><input type="checkbox" name="settings-checkbox">Заменять эффекты</p>
            <p><input type="checkbox" name="settings-checkbox">Заменять текстуры эффектов</p>
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
    console.log(serverContainer)
    serverContainer.innerHTML = 
    `
    <div class="server">
        <h3>Сервер #${servers[0].id + 1}</h3>
        <label>Онлайн</label>
        <h4>${servers[0].players}/${servers[0].maxPlayers}</h4>
        <label>Состояние</label>
        <button onclick="window.electronAPI.playGame()">Играть</a>
    </div>
    `;
    //${servers[0].id}
}
serversUpdate();
//setInterval(serversUpdate, 5000);