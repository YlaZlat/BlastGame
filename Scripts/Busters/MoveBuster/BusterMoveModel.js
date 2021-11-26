const BusterProtoModel = require('BusterProtoModel');

const AddMoveBusterModel = cc.Class({
    extends: BusterProtoModel,
    ctor: function (controller, viev) {
        this.viev = viev;
        this.controller = controller;
        this.passingModel= this.controller.passingModel;
        this.fieldModel = this.controller.fieldModel;
        this.cost = 50;
    },

    buyBuster(){
        if(this.passingModel.coins < this.cost){
            return;
        }
        this.passingModel.changeMovies(1);
        this.passingModel.changeCoins(-this.cost); 
    },
    
});

module.exports = AddMoveBusterModel;