let GameSeq = [];
let UserSeq = [];

let btns = ["red","green", "blue", "yellow"];

let started = false;
let level = 0;

let h2 = document.querySelector("h2");

document.addEventListener("keypress", function() {
     if(started == false){
        console.log("game is started");
        started = true;
      
        levelup();
     }
});

function btnFlash(btn) {
    btn.classList.add("flash");
    setTimeout(function() {
        btn.classList.remove("flash");
    }, 250);
}


 function levelup(){
    UserSeq = [];
    level++;
    h2.innerText = `level ${level}`;

    let randIdx = Math.floor(Math.random() * 3);
    let randcolor = btns[randIdx];
    let randbtn = document.querySelector(`.${randcolor}`);
    GameSeq.push(randcolor);
    btnFlash(randbtn);
 }

 function CheckAns(idx){    
    if(UserSeq[idx] === GameSeq[idx]){
        if(UserSeq.length == GameSeq.length){
            setTimeout(levelup, 1500);
        }
    } else {
        h2.innerHTML = `Game Over! Your score was <b>${level}</b> <br> press any key to start a Game.`;
        document.querySelector("body").style.backgroundColor ="red";
        setTimeout(function() {
            document.querySelector("body").style.backgroundColor ="white";
      },250);
        reset();
    }
 }

 function btnPress() {
    let btn = this;
    btnFlash(btn);

    Usercolor = btn.getAttribute("id");
    UserSeq.push(Usercolor);

    CheckAns(UserSeq.length-1);
 }

 let allbtns = document.querySelectorAll(".btn");
 for(btn of allbtns) {
    btn.addEventListener("click", btnPress);
 }

 function reset(){
    started = false;
    GameSeq = [];
    UserSeq = [];
    level = 0;
 }



