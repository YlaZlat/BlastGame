const BusterProtoViev = cc.Class({
    extends: cc.Component,

    properties: {

        costLabel: {
            default: null,
            type: cc.Label
        },

        costLabelNormalColor: cc.Color.WHITE,
        costLabelWarningColor: cc.Color.RED,

    },

    enable(){
        this.node.active = true;
    },

    setCostLabelNormalColor(){
        this.costLabel.node.color = this.costLabelNormalColor;
    },

    setCostLabelWarningColor(){
        this.costLabel.node.color = this.costLabelWarningColor;
    },

    displayCost(num){
        this.costLabel.string  = num + '';
    },

});

module.exports = BusterProtoViev;
