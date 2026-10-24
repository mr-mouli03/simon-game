let GameSeq = [];
let UserSeq = [];

let btns = ["red", "green", "blue", "yellow"];

let started = false;
let level = 0;
let playerTurn = false;

let audioCtx;

let h2 = document.querySelector("h2");
let turnIndicator = document.querySelector("#turnIndicator");
let startBtn = document.querySelector("#startBtn");

document.addEventListener("keypress", function () {
   if (started == false && startBtn.style.display !== "block") {
      startGame();
   }
});

startBtn.addEventListener("click", function () {
   startGame();
});

function startGame() {
   started = true;
   playerTurn = false;
   GameSeq = [];
   UserSeq = [];
   level = 0;
   startBtn.style.display = "none";
   h2.innerText = "Get Ready!";
   levelup();
}

function playTone(frequency, duration = 150, type = "sine") {
   if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
   }
   if (audioCtx.state === "suspended") {
      audioCtx.resume();
   }
   let oscillator = audioCtx.createOscillator();
   let gainNode = audioCtx.createGain();
   oscillator.type = type;
   oscillator.frequency.value = frequency;
   oscillator.connect(gainNode);
   gainNode.connect(audioCtx.destination);

   gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);

   gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + duration / 1000
   );

   oscillator.start();

   oscillator.stop(
      audioCtx.currentTime + duration / 1000
   );
}

function playButtonSound(color) {
   let frequencies = {
      red: 329.63,
      green: 261.63,
      blue: 392.00,
      yellow: 523.25
   };

   playTone(frequencies[color], 180, "sine");
}

function gameOverSound() {
   playTone(150, 400, "sawtooth");

   setTimeout(function () {
      playTone(100, 500, "sawtooth");
   }, 200);
}

function btnFlash(btn) {
   btn.classList.add("flash");
   let color = btn.getAttribute("id");
   playButtonSound(color);
   setTimeout(function () {
      btn.classList.remove("flash");
   }, 250);
}

function simonBlink() {
   turnIndicator.classList.add("active");
   setTimeout(function () {
      turnIndicator.classList.remove("active");
   }, 300);
}

function levelup() {
   playerTurn = false;
   UserSeq = [];
   level++;
   h2.innerText = `Level ${level}`;
   turnIndicator.innerText = "SIMON";
   simonBlink();
   let randIdx = Math.floor(Math.random() * btns.length);
   let randcolor = btns[randIdx];
   GameSeq.push(randcolor);
   setTimeout(function () {
      let i = 0;
      let interval = setInterval(function () {
         let color = GameSeq[i];
         let btn = document.querySelector(`.${color}`);
         btnFlash(btn);
         i++;
         if (i >= GameSeq.length) {
            clearInterval(interval);
            setTimeout(function () {
               playerTurn = true;
               turnIndicator.innerText = "YOUR TURN";
               simonBlink();
            }, 500);
         }
      }, 700);
   }, 500);
}

function CheckAns(idx) {
   if (UserSeq[idx] === GameSeq[idx]) {
      if (UserSeq.length === GameSeq.length) {
         playerTurn = false;
         turnIndicator.innerText = "SIMON";
         setTimeout(function () {
            levelup();
         }, 1000);
      }

   } else {
      gameOverSound();
      h2.innerHTML = ` <span class="score">Game Over! Your score was ${level}</span>`;
      turnIndicator.innerText = "GAME OVER";
      playerTurn = false;
      document.querySelector("body").style.backgroundColor = "red";
      setTimeout(function () {
         document.querySelector("body").style.backgroundColor = "";
      }, 250);
      startBtn.style.display = "block";
      started = false;
   }
}

function btnPress() {
   if (playerTurn == false) {
      return;
   }
   let btn = this;
   btnFlash(btn);
   let Usercolor = btn.getAttribute("id");
   UserSeq.push(Usercolor);
   CheckAns(UserSeq.length - 1);
}

let allbtns = document.querySelectorAll(".btn");

for (let btn of allbtns) {
   btn.addEventListener("click", btnPress);
}
