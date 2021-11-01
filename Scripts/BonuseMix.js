

const Field = require('Field');
const Passing = require('Passing');

cc.Class({
    extends: cc.Component,
    
    properties: {

        field: {
            default: null,
            type: Field 
        },

        passing: {
            default: null,
            type: Passing 
        },

        cost: 70,

        costDisplay: {
            default: null,
            type: cc.Label
        },
    },

    init(game){
        this.game = game
    },

    onButtonClick(){
        if(this.passing.coins < this.cost){
            return;
        }
        this.passing.changeCoins(-this.cost);
        this.field.mix();
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

