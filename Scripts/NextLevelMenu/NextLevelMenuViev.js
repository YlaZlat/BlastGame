cc.Class({
    extends: cc.Component,

    properties: {
        levelInformation: {
            default: null,
            type: cc.Label
        },

        wonCoinsLabel: {
            default: null,
            type: cc.Label
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
    
    displaylevelInformation(level, target, movies){
        this.levelInformation.string = "Level " + level +  "\n Score " + target + " points in "  + movies + " movies!"
    },
   
    displayWonCoins(coins){
        this.wonCoinsLabel.string =  "+ " + coins + " coins!"
    },

});
