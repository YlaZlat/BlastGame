cc.Class({
    extends: cc.Component,

    properties: {
        levelLabel: {
            default: null,
            type: cc.Label
        },

        numberOfCubesLabel: {
            default: null,
            type: cc.Label
        },

        numberOfCubesSlider: {
            default: null,
            type: cc.Slider
        },

        field: {
            default: null,
            type: cc.Node
        },
    },

    
    onSlider(slider, customEventData){
        let field = this.field.getComponent("Field");
        let minCubesNum = field.minRowLength;
        let maxCubesNum = field.maxRowLength;
        let progressOfCubes = minCubesNum + Math.floor((maxCubesNum - minCubesNum) * slider.progress);
        this.numberOfCubesLabel.string = progressOfCubes;
        field.rowLength = progressOfCubes;
    },

    
    onEnable () {
        let field = this.field.getComponent("Field");
        this.numberOfCubesLabel.string  = field.rowLength;
        let minCubesNum = field.minRowLength;
        let maxCubesNum = field.maxRowLength;
        this.numberOfCubesSlider.progress =  (field.rowLength - minCubesNum) / (maxCubesNum - minCubesNum);
    },
});
