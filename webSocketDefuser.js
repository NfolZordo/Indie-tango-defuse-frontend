var stompClient = null;
var timerText = document.querySelector(".timer");
var token;

// Функція для підключення до WebSocket сервера
function connect() {
    // var socket = new SockJS('http://localhost:5000/connect');
    var socket = new SockJS('https://indie-tango-defuse-backend-dep-b485d223046a.herokuapp.com/connect');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {

        // Підписка на отримання коду гри
        stompClient.subscribe('/user/queue/gameCode', function (message) {
            let gameCode = message.body;
            showCode(gameCode);
            document.getElementById('code').innerText = gameCode;

            ignition(gameCode);
        });

        // Підписка на отримання повідомлень таймера
        stompClient.subscribe('/user/queue/getTimerValue', function (message) {
            showTimer(JSON.parse(message.body));
        });

        stompClient.subscribe('/user/queue/doStep', function (message) {
            checkSolution(JSON.parse(message.body).body);
        });
        createGame();
    });
}

// Функція для виведення коду на сторінку
function showCode(gameCode) {
    let chatMessages = document.getElementById('start-game-lisst');
    let li = document.createElement('li');
    
    // Створення посилання
    let link = document.createElement('a');
    link.href = "https://sprightly-elf-836547.netlify.app/helper.html?sessionCode=" + gameCode;
    link.textContent = "Link to connect another player: https://sprightly-elf-836547.netlify.app/helper.html?sessionCode=" + gameCode;
    
    // Додавання посилання до елементу списку
    li.appendChild(link);
    
    // Створення кнопки для копіювання
    let copyButton = document.createElement('button');
    copyButton.textContent = 'Copy Link';
    
    // Додавання обробника подій для копіювання посилання
    copyButton.addEventListener('click', function() {
        navigator.clipboard.writeText(link.href);
    });
    
    // Додавання кнопки до елементу списку
    li.appendChild(copyButton);
    
    // Додавання елементу списку до контейнера повідомлень
    chatMessages.appendChild(li);
}

// Функція для створення нової гри
function createGame() {
    let userName = "qwe2@qwe";
    stompClient.send("/app/createGame", {}, userName);
}

function doStep(stepTaken) {
    stompClient.send("/app/doStep", {}, stepTaken);
}

// Функція для запуску таймера
function startTimer() {
    let difficultyRadio = document.querySelector('input[name="difficulty"]:checked');
    let payload = {
        gameMode: difficultyRadio.value,
        Authorization: token
    };
    // stompClient.send("/app/startTimer", {}, difficultyRadio.value);
    stompClient.send("/app/startTimer", {}, JSON.stringify(payload));
}

// Функція для виведення таймера на сторінку
function showTimer(message) {
    if (message <= 0) {
        loseGame();
        timerText.htmlElement.innerHTML = "0:00";
    } else {
        var minutes = Math.floor(message / 60);
        var seconds = message % 60;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        timerText.htmlElement.innerHTML = minutes + ":" + seconds;
    }
}

function resetGame() {
    location.reload(true);
}

// Підключення до WebSocket сервера при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function () {
    connect();    
    console.log('   token   ');
    console.log(localStorage.getItem('token'));

    token = 'Bearer ' + localStorage.getItem('token');
    
    document.getElementById('restartButton').addEventListener('click', function () {
        window.location.href = 'index.html';
        // location.reload(true);
    });
});

var loseGame = function () {
    constants.explosionAudio.play();
    kaboom.setStyle("transform: scale(1)");
    clearInterval(time);
    stompClient.send("/app/stopTimer", {}, token);
};

var winGame = function () {
    safetyStatus.toggleClass("safe");
    win.setStyle("transform: scale(1)");
    clearInterval(time);
    stompClient.send("/app/stopTimer", {}, token);
};
