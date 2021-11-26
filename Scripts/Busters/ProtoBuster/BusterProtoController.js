const Game = require('GameController');
const Model = require('BusterProtoModel');
const Viev = require('BusterProtoViev');

const BusterProtoController = cc.Class({
    extends: cc.Component,

    properties: {

        game: {
            default: null,
            type: Game
        },
       
        viev: {
            default: null,
            type: Viev
        },

},

    onLoad () {
        this.mousedown = this.game.mousedown;
        this.mouseup = this.game.mouseup;
        this.mousemove = this.game.mousemove;
        this.mouseleave = this.game.mouseleave;

        this.passingModel = this.game.passingModel;
        this.fieldModel = this.game.fieldModel;
        this.model = new Model(this, this.viev);
        this.model.init();
        this.onBusterEvent();
    },
    
    offStandartGameEvents(){
        this.game.offGame();
    },

    onStandartGameEvents(){
        this.game.onGame();
    },

    onBusterEvent(){
        this.node.on(this.mousedown, this.onBusterMouseDown, this);
        this.node.on('click', this.onBusterClick, this);  
    },

    offBusterEvent(){
        this.node.off(this.mousedown, this.onBusterMouseDown, this);
        this.node.off('click', this.onBusterClick, this);  
    },

    onBusterClick(){
        if(!this.game.state.game) return; 
        this.model.buyBuster();
    },

    onBusterMouseDown(){
        if(!this.game.state.game) return;
        if(this.passingModel.coins < this.model.cost){
            this.model.setCostWarningColor();
            this.node.on(this.mouseup, this.onBusterMouseUp, this);
            this.node.on(this.mouseleave, this.onBusterMouseUp, this);
            return;
        }
    },

    onBusterMouseUp(){
        this.model.setCostNormalColor()
        this.node.off(this.mouseup, this.onBusterMouseUp, this);
        this.node.off(this.mouseleave, this.onBusterMouseUp, this);
    },

    
});

module.exports = BusterProtoController;
