let stompClient = null;
let sessionCode;
var timerText = document.querySelector(".timer");
var token;
var gameCode;
// Функція для підключення до WebSocket сервера
function connect() {
    // let socket = new SockJS('http://localhost:5000/connect');
    var socket = new SockJS('https://indie-tango-defuse-backend-dep-b485d223046a.herokuapp.com/connect');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {

        // Підписка на отримання повідомлень таймера
        stompClient.subscribe('/user/queue/getTimerValue', function (message) {
            showTimer(JSON.parse(message.body));
        });

        // Підписка на отримання повідомлень завдання
        stompClient.subscribe('/user/queue/getTask', function (message) {
            displayImage(message.body);
        });
        joinGame(sessionCode);
        getTask(sessionCode);
    });
}

 // Для відображення списку друзів
 function showFriends(message) {
    console.log(message);
}

// Функція для приєднання до існуючої гри
// function getFriends() {
//     stompClient.send("/app/getFriends", {}, token);
// }

// Функція для приєднання до існуючої гри
function joinGame(gameCode) {
    let payload = {
        gameCode: gameCode,
        Authorization: token
    };
    console.log(payload);
    stompClient.send("/app/joinGame", {}, JSON.stringify(payload));
}

function getTask(gameCode) {
    stompClient.send("/app/getTask", {}, gameCode);
}

// Function to display the received image on the main page
function displayImage(message) {
    try {
        const imageInfo = JSON.parse(message);
        const imageData = imageInfo.body;
        
        let imgElement = document.createElement('img');
        imgElement.src = "data:image/jpeg;base64," + imageData;
        imgElement.alt = "Received Image";
        
        // Append the image to the main section of the HTML page
        document.querySelector('main').appendChild(imgElement);
    } catch (error) {
        console.error("Error parsing image data:", error);
    }
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
    if (localStorage.getItem('token') && localStorage.getItem('token') != "null") {
        token = 'Bearer ' + localStorage.getItem('token');
    } else {
        token = 'Bearer ' + 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnZ2dAYXNkYXNkIiwiaWF0IjoxNzA3NDI1ODM3LCJleHAiOjE3MDgwMzA2Mzd9.e8Cgjz4WAn2iwDVG1XjsXCr5CfRWT7hKNsrRuJ1farM';
    }
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

    document.getElementById('restartButton').addEventListener('click', function () {
        window.location.href = 'index.html';
    });
});
