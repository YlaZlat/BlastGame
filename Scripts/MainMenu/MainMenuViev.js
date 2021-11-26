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

        field: {
            default: null,
            type: cc.Node
        },

        slider: {
            default: null,
            type: cc.Slider
        },

        playButton: {
            default: null,
            type: cc.Button
        },

    },

    enable(){
        this.node.active = true;
    },

    disable(){
        this.node.active = false; 
    },
    
    displayNumberOfCubes(num){
        this.numberOfCubesLabel.string  = num + '';
       },
   
    displaySliderProgress(progres){
        this.slider.progress =  progres;
    },

});
