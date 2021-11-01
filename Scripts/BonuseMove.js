
const Passing = require('Passing');

cc.Class({
    extends: cc.Component,
    
    properties: {

        passing: {
            default: null,
            type: Passing 
        },

        cost: 50,

        costDisplay: {
            default: null,
            type: cc.Label
        },
    },
    init(game){
        this.game = game;
    },

    onButtonClick(){
        if(this.passing.coins < this.cost){
            return;
        }
        this.passing.changeMovies(1);
        this.passing.changeCoins(-this.cost);
    },

    onMouseDown(){
        if(this.passing.coins < this.cost){
            this.costDisplay.node.color = cc.Color.RED;
            this.node.on(this.game.mouseup, this.onMouseUp, this);
            this.node.on(this.game.mouseleave, this.onMouseUp, this);
            return;
        }
    },

    onMouseUp(){
        this.costDisplay.node.color = cc.Color.WHITE;
        this.node.off(this.game.mouseup, this.onMouseUp, this);
        this.node.off(this.game.mouseleave, this.onMouseUp, this);
    },

    start () {
        this.node.on(this.game.mousedown, this.onMouseDown, this);
        this.costDisplay.string = this.cost;
    },

});
