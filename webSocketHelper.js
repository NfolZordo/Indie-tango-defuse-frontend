var stompClient = null;
var timerText = document.querySelector(".timer");

// Функція для підключення до WebSocket сервера
function connect() {
    var socket = new SockJS('http://localhost:8080/connect');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);

        // Підписка на отримання повідомлень таймера
        stompClient.subscribe('/user/queue/getTimerValue', function (message) {
            showTimer(JSON.parse(message.body));
            console.log("getTimerValue" + message.body);
        });
    });
}

// Функція для приєднання до існуючої гри
function joinGame() {
    var gameCode = document.getElementById('newCode').value;
    console.log(gameCode);
    stompClient.send("/app/joinGame", {}, gameCode);
}

// Функція для виведення таймера на сторінку
function showTimer(message) {
    if (message <= 0) {
        loseGame();
    } else {
        var minutes = Math.floor(message / 60);
        var seconds = message % 60;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        timerText.htmlElement.innerHTML = minutes + ":" + seconds;
    }

}

// Підключення до WebSocket сервера при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function () {
    console.log("Підключення до WebSocket");
    connect();
});

