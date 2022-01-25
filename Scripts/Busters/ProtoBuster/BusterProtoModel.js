const BusterProtoModel = cc.Class({

    ctor: function (controller, viev) {
        this.viev = viev;
        this.controller = controller;
        this.passingModel = this.controller.passingModel;
        this.fieldModel = this.controller.fieldModel;
        this.cost = 10;
    },

    init(){
        this.viev.displayCost(this.cost);
        this.viev.setCostLabelNormalColor();
        this.viev.enable();
    },

    setCostNormalColor(){
        this.viev.setCostLabelNormalColor();
    },

    setCostWarningColor(){
        this.viev.setCostLabelWarningColor();
    },

    buyBuster(){
        cc.log("Определите метод!");
        if(this.passingModel.coins < this.cost){
            return;
        }
    },

   
});

module.exports = BusterProtoModel;