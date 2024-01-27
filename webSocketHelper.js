let stompClient = null;
let sessionCode;
var timerText = document.querySelector(".timer");

// Функція для підключення до WebSocket сервера
function connect() {
    let socket = new SockJS('http://localhost:8080/connect');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);

        // Підписка на отримання повідомлень таймера
        stompClient.subscribe('/user/queue/getTimerValue', function (message) {
            showTimer(JSON.parse(message.body));
            console.log("getTimerValue" + message.body);
        });
        joinGame(sessionCode);

    });
}

// Функція для приєднання до існуючої гри
function joinGame(gameCode) {
    // let gameCode = document.getElementById('newCode').value;
    console.log(gameCode);
    stompClient.send("/app/joinGame", {}, gameCode);
}

// Функція для виведення таймера на сторінку
function showTimer(message) {
    if (message <= 0) {
        loseGame();
    } else {
        let minutes = Math.floor(message / 60);
        let seconds = message % 60;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        timerText.htmlElement.innerHTML = minutes + ":" + seconds;
    }

}

// Підключення до WebSocket сервера при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function () {
    console.log("Підключення до WebSocket");
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    sessionCode = getParameterByName('sessionCode');
    document.getElementById('code').textContent = sessionCode;
    connect();
    console.log("Підключення до WebSocket connectconnect");

    document.getElementById('restartButton').addEventListener('click', function () {
        window.location.href = 'index.html';
    });
});
