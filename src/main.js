'use strick';

import PopUp from './popUp.js';
import GameBuilder, { Reason } from './game.js';
import * as sound  from './sound.js';

//when you declare class u shold consider where this class will be  going to be used
// According to the usage u have to name it.
const gameFinishBanner = new PopUp();

const game = new GameBuilder()
.withGameDuration(5)
.withCarrotCount(3)
.withBugCount(3)
.build();

game.setGameStopListener( reason => {
    let message;
    switch(reason){
        case Reason.cancel:
            message = 'Replay?';
            sound.playAlert();
            break;
        case Reason.win: 
            message = 'YOU WON!';
            sound.playWin();
            break;
        case Reason.lose:
            message = 'YOU LOST!';
            sound.playBug();
            break;
        default:
            throw new Error('not  valied reason');
    }

    gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickListener(() =>{
    game.start();
})

