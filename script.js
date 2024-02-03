var constants = {
    switchButton: "switch",
    greenButton: "greenButton",
    blueButton: "blueButton",
    redButton: "redButton",
    yellowButton: "yellowButton",
    greenWire: "greenWire",
    blueWire: "blueWire",
    redWire: "redWire",
    yellowWire: "yellowWire",
    defaultTimeInSeconds: 1 * 60 * 1000,
    explosionAudio: new Audio("http://tedjamulia.com/dev/images/explosion_only.mp3"),
    blipAudio: new Audio("http://tedjamulia.com/dev/images/countdown_blip.mp3")
  };
  constants.scenarios = [{
    steps: [constants.redButton, constants.blueButton, constants.switchButton, constants.greenWire]
  }, {
    steps: [constants.yellowWire, constants.greenButton, constants.redButton, constants.greenWire]
  }, {
    steps: [constants.blueWire, constants.yellowButton, constants.greenWire, constants.redWire]
  }, {
    steps: [constants.greenButton, constants.switchButton, constants.blueWire, constants.yellowWire]
  }, {
    steps: [constants.switchButton, constants.yellowWire, constants.yellowButton, constants.redButton]
  }, {
    steps: [constants.blueWire, constants.greenButton, constants.redButton, constants.yellowWire]
  }, {
    steps: [constants.redWire, constants.redButton, constants.greenWire, constants.switchButton]
  }, {
    steps: [constants.blueWire, constants.redWire, constants.greenButton, constants.yellowWire]
  }, {
    steps: [constants.yellowButton, constants.switchButton, constants.blueButton, constants.greenWire]
  }, {
    steps: [constants.blueWire, constants.yellowButton, constants.redWire, constants.greenButton]
  }];
  
  var stepsTaken = [];
  var stepsToTake;
  var currentTimeInSeconds = 0;
  var time;
  
  var modal = summon(".modal");
  var startButton = summon(".start-game");
  startButton.addListener("click", function() {
    modal.toggle();
    ignition();
    startTimer();
  });
  var kaboom = summon(".kaboom");
  var win = summon(".win");
  var restartButtons = summonAll(".restart-game");
  restartButtons.each(function(restartButton) {
    restartButton.addListener("click", function() {
      resetGame();
      ignition();
    });
  });
  
  var sticker = summon(".sticker");
  var safetyStatus = summon(".status");
  var timerText = summon(".timer");
  
  var switchButton = summon(".switch");
  switchButton.addListener("click", function() {
    switchButton.toggleClass("on");
    stepsTaken.push(constants.switchButton);
    doStep(constants.switchButton);
  });
  
  var buttons = summonAll(".button");
  buttons.each(function(button) {
    button.addListener("click", function(e) {
      button.toggleClass("on");
      stepsTaken.push(button.get("data"));
      doStep(button.get("data"));
    });
  });
  
  var wires = summonAll(".wire");
  wires.each(function(wire) {
    wire.addListener("click", function() {
      wire.toggleClass("cut");
      stepsTaken.push(wire.get("data"));
      doStep(wire.get("data"));
    });
  });
  
  var timer = function() {
    // if (currentTimeInSeconds < 0) {
    //   loseGame();
    // } else {
    //   constants.blipAudio.play();
    //   minutes = parseInt(currentTimeInSeconds / 60000);
    //   seconds = parseInt(currentTimeInSeconds % 60000) / 1000;
  
    //   seconds = seconds < 10 ? "0" + seconds : seconds;
    //   currentTimeInSeconds = currentTimeInSeconds - 1000;
    //   // timerText.htmlElement.innerHTML = minutes + ":" + seconds;
    // }
  };
  var scenarioNumber;
  var ignition = function(gameCode) {
    if (scenarioNumber == undefined) {
      scenarioNumber = parseInt(gameCode) % 10
    }
    stepsToTake = constants.scenarios[scenarioNumber].steps;
    currentTimeInSeconds = constants.defaultTimeInSeconds;
    time = setInterval(timer, 1000);
    sticker.htmlElement.innerHTML = "#" + scenarioNumber;
};
  
  var checkSolution = function(stepTaken) {
    if (stepTaken == "false") {
      loseGame();
      return;
    } else if (stepTaken == "win") {
      winGame();
      return;
    }

    // for (var i = 0; i < this.stepsTaken.length; i++) {
    //   if (stepsTaken[i] != stepsToTake[i]) {
    //     loseGame();
    //     return;
    //   }
    // }
    // if (stepsTaken.length == stepsToTake.length) {
    //   winGame();
    //   return;
    // }
  };
  
  var resetGame = function() {
    location.reload();
    // //Clear out lose message
    // kaboom.setStyle("transform: scale(0)");
  
    // //Clear out win message
    // win.setStyle("transform: scale(0)");
  
    // //reset buttons
    // buttons.toggleClass("on", REMOVE_ONLY);
  
    // //reset wires
    // wires.toggleClass("cut", REMOVE_ONLY);
  
    // //reset switch
    // switchButton.toggleClass("on", REMOVE_ONLY);
  
    // //reset status of bomb
    // safetyStatus.toggleClass("safe", REMOVE_ONLY);
  
    // //reset stepsTaken
    // stepsTaken = [];
  };