const BusterProtoModel = require('BusterProtoModel');

const BusterMixModel = cc.Class({
    extends: BusterProtoModel,
    ctor: function (controller, viev) {
        this.viev = viev;
        this.controller = controller;
        this.passingModel= this.controller.passingModel;
        this.fieldModel = this.controller.fieldModel;
        this.cost = 70;
    },


    buyBuster(){
        if(this.passingModel.coins < this.cost){
            return;
        }
        this.passingModel.changeCoins(-this.cost); 
        this.mix();
    },

    mix(){
        const fieldCells = this.fieldModel.getVisibleCells();
        let sprites = [];

        for(let i = 0; i < fieldCells.length; i++){
            let sprite = fieldCells[i].sprite;
            sprites.push(sprite);
        }

        sprites.sort(function() {return Math.random() - 0.5});

         for(let i = 0; i < fieldCells.length; i++){
            const cell = fieldCells[i];
            const sprite = sprites[i];
            this.fieldModel.setSpriteToCell(cell, sprite);
        }
    },
 
    
});

module.exports = BusterMixModel;