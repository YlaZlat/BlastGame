const FieldModel = require('FieldModel');
const FieldViev = require('FieldViev');

const PassingModel = require('PassingModel');
const PassingViev = require('PassingViev');

const MainMenuViev = require('MainMenuViev');
const MainMenuModel = require('MainMenuModel');

const GameOverMenuViev = require('GameOverMenuViev');
const GameOverMenuModel = require('GameOverMenuModel');

const NextLevelMenuViev = require('NextLevelMenuViev');
const NextLevelMenuModel = require('NextLevelMenuModel');


cc.Class({
    extends: cc.Component,
   
    properties: {
       
        fieldViev: {
            default: null,
            type: FieldViev 
        }, 

        passingViev: {
            default: null,
            type: PassingViev 
        }, 

        mainMenuViev: {
            default: null,
            type: MainMenuViev 
        },

        gameOverMenuViev: {
            default: null,
            type: GameOverMenuViev 
        },

        nextLevelMenuViev: {
            default: null,
            type: NextLevelMenuViev
        },

    },  

    onLoad () {
        this.state = {  game: false, 
                        mainMenu: true, 
                        nextLevel: false, 
                        gameOver: false,
                    };

        Object.defineProperty(this.state, 'resetState', {
            value: function(){
                for (let state in this) {
                    this[state] = false;
                }
            },
            enumerable: false,
        });

        this.mousedown = 'mousedown';
        this.mouseup = 'mouseup';
        this.mousemove = 'mousemove';
        this.mouseleave = 'mouseleave';
        this.mouseleave = 'mouseleave';

        if (cc.sys.platform === cc.sys.MOBILE_BROWSER) {
             this.mousedown = 'touchstart';
             this.mouseup = 'touchend';
             this.mousemove = 'touchmove';
             this.mouseleave = 'touchcancel';
        }

        this.fieldModel = new FieldModel(this, this.fieldViev);
        this.passingModel = new PassingModel(this, this.passingViev);
        this.mainMenuModel = new MainMenuModel(this, this.mainMenuViev);
        this.nextLevelMenuModel = new NextLevelMenuModel (this, this.nextLevelMenuViev);
        this.gameOverMenuModel = new GameOverMenuModel(this, this.gameOverMenuViev);

        this.fieldModel.init();
        this.passingModel.init();
        this.mainMenuModel.init();
        this.gameOverMenuModel.init();
        this.nextLevelMenuModel.init();
    },

    start(){
        this.fieldModel.createField(this.fieldModel.initRowLength);
        this.onMainMenu();
        this.gameOverMenuModel.disable();
        this.nextLevelMenuModel.disable();
    },

    onGame(){
        this.state.resetState();
        this.state.game = true;
        this.onGameEvent();
    },

    offGame(){
        this.state.game = false;
        this.offGameEvent();
    },

    onMainMenu(){
        this.offGame();
        this.state.mainMenu = true;
        this.mainMenuModel.enable();
        this.onMainMenuEvent();
    },

    onNextLevel(){
        this.offGame();
        this.state.nextLevel = true;
        this.passingModel.increaseLevel();
        this.nextLevelMenuModel.enable();
        this.onNextLevelMenuEvent();
    },

    onGameOver(){
        this.offGame();
        this.state.gameOver = true;
        this.gameOverMenuModel.enable();
        this.onGameOverMenuEvent();
    },

    onGameEvent(){
        this.fieldViev.node.on(this.mousedown, this.gameOnMouseDown, this);  
    },

    offGameEvent(){
        this.fieldViev.node.off(this.mousedown, this.gameOnMouseDown, this);  
    },

    onMainMenuEvent(){
        this.mainMenuViev.slider.node.on('slide', this.mainMenuOnSlider, this);
        this.mainMenuViev.playButton.node.on('click', this.mainMenuOnButtonClick, this);  
    },

    onNextLevelMenuEvent(){
        this.nextLevelMenuViev.playButton.node.on('click', this.nextLevelMenuOnButtonClick, this);  
    },

    onGameOverMenuEvent(){
        this.gameOverMenuViev.playButton.node.on('click', this.gameOverMenuOnButtonClick, this);  
    },
    

    gameOnMouseDown(event){
        if(event.target === event.currentTarget) return;
        event.stopPropagation();
        this.offGameEvent();
        let target = event.target;
        this.fieldModel.onMouseDown(target);
    },

    onFinishRebuild(){
        this.onGameEvent();
        this.state.game = true;
        if(this.state.nextLevel) this.onNextLevel();
        if(this.state.gameOver) this.onGameOver();
     },

    mainMenuOnButtonClick(){
        if(this.fieldModel.currentRowLength !== this.fieldModel.rowLength){
            this.fieldModel.createField(this.fieldModel.currentRowLength);
        }
        this.mainMenuModel.disable();
        this.passingModel.resetGame();
        this.onGame();
    },
    
    mainMenuOnSlider(slider){
        this.mainMenuModel.onSlider(slider);
    },

    nextLevelMenuOnButtonClick(){
        this.nextLevelMenuModel.disable();
        this.passingModel.resetLevelScore();
        this.onGame();
    },

    gameOverMenuOnButtonClick(){
        this.gameOverMenuModel.disable();
        this.passingModel.resetGame();
        this.onGame();
    },
  
});
