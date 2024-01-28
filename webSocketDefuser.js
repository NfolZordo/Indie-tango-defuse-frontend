var stompClient = null;
var timerText = document.querySelector(".timer");

// Функція для підключення до WebSocket сервера
function connect() {
    var socket = new SockJS('http://localhost:8080/connect');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);

        // Підписка на отримання коду гри
        stompClient.subscribe('/user/queue/gameCode', function (message) {
            let gameCode = message.body;
            console.log("Received game code: " + gameCode);
            showCode(gameCode);
            document.getElementById('code').innerText = gameCode;
    
            ignition(gameCode);
        });

        // Підписка на отримання повідомлень таймера
        stompClient.subscribe('/user/queue/getTimerValue', function (message) {
            showTimer(JSON.parse(message.body));
            console.log("getTimerValue" + message.body);
        });
        createGame();
    });
}
// Функція для виведення коду на сторінку
function showCode(gameCode) {
    let chatMessages = document.getElementById('start-game-lisst');
    let li = document.createElement('li');
    li.appendChild(document.createTextNode("In order for another player to be able to connect to you, give him this code: " + gameCode));
    chatMessages.appendChild(li);
}
// Функція для створення нової гри
function createGame() {
    stompClient.send("/app/createGame", {}, {});
}

// Функція для запуску таймера
function startTimer() {
    let difficultyRadio = document.querySelector('input[name="difficulty"]:checked');
    stompClient.send("/app/startTimer", {}, difficultyRadio.value);
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

function resetGame() {
    location.reload(true);
}

// Підключення до WebSocket сервера при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function () {
    console.log("Підключення до WebSocket");
    connect();

    document.getElementById('restartButton').addEventListener('click', function () {
        window.location.href = 'index.html';
        // location.reload(true);
    });
});

var loseGame = function() {
    constants.explosionAudio.play();
    kaboom.setStyle("transform: scale(1)");
    clearInterval(time);
    stompClient.send("/app/stopTimer", {}, {});
  };


  var winGame = function() {
    safetyStatus.toggleClass("safe");
    win.setStyle("transform: scale(1)");
    clearInterval(time);
    stompClient.send("/app/stopTimer", {}, {});
  };

