'use strict';

import { Field, ItmeType } from './field.js';
import * as sound  from './sound.js';

export const Reason = Object.freeze({
    win: 'win',
    lose: 'lose',
    cancel: 'cancel',
});


// Builder Pattern
export default class GameBuilder {
    withGameDuration(duration){
       this.gameDuration = duration;
       return this;
    }

    withCarrotCount(num) {
        this.carrotCount = num;
        return this;
    }

    withBugCount(num){
        this.bugCount = num;
        return this;
    }

    build(){
        return new Game(
            this.gameDuration,
            this.carrotCount,
            this.bugCount
        );
    }
}

class Game{

    constructor(gameDuration, carrotCount, bugCount){
        
        this.started = false;
        this.score = 0;
        this.timer = undefined;
        
        this.gameDuration = gameDuration;
        this.carrotCount = carrotCount;
        this.bugCount = bugCount;

        
        this.gameTimer = document.querySelector(".game_timer");
        this.gameScore = document.querySelector(".game_score");
        this.gameBtn = document.querySelector(".game_button");
       
        this.gameBtn.addEventListener( "click", () => {
            
            if(this.started){
                this.stop(Reason.cancel);
            } else {
                this.start();
            }
        });
        
        
        this.gameField = new Field(carrotCount, bugCount);
        this.gameField.setClickListener(this.onItemClick);
    }

    setGameStopListener(onGameStop){
        this.onGameStop = onGameStop;
    }

    start(){
        this.started = true;  
        this.initGame();
        this.showStopButton();
        this.showTimerAndScore();
        this.startGameTimer();
        sound.playBg();
       }
       
    stop(reason){
           this.started = false;
           this.stopGameTimer();
           this.hideGameButton();
           sound.stopBg();

        this.onGameStop && this.onGameStop(reason);
       }

    onItemClick = (item) => {

        if(!this.started){
         return ;
        }
     
        if(item === ItmeType.carrot){
           this.score++
           this.updateScoreBoard();
           if(this.score === this.carrotCount){
               this.stop(Reason.win);
           }
        } else if (item === ItmeType.bug){
            this.stop(Reason.lose); 
        }
    };


showStopButton(){
    const icon = this.gameBtn.querySelector(".fas");
    icon.classList.add("fa-stop");
    icon.classList.remove("fa-play");
    this.gameBtn.style.visibility = 'visible';
}

hideGameButton(){
    this.gameBtn.style.visibility = "hidden";
}

showTimerAndScore(){
    this.gameTimer.style.visibility = "visible";
    this.gameScore.style.visibility = "visible";
}

startGameTimer(){
    let remaingTimeSec = this.gameDuration;
    this.updateTimerText(remaingTimeSec);
    this.timer = setInterval(() =>{
       if(remaingTimeSec <= 0){
           clearInterval(this.timer);
           this.stop(this.carrotCount === this.score ? Reason.win : Reason.lose);
           return;
        }
        this.updateTimerText(--remaingTimeSec);

   }, 1000);  
}

stopGameTimer(){
    clearInterval(this.timer);
}

updateTimerText(time){
  const minute = Math.floor(time / 60);
  const seconds = time % 60;
  this.gameTimer.innerText = `${minute}:${seconds}`;
}


initGame(){
// create carrot and bugs and then add them to fild
this.score = 0;
this.gameScore.innerText = this.carrotCount;
this.gameField.init(); 
}


updateScoreBoard(){
    this.gameScore.innerText = this.carrotCount - this.score;
}

}
