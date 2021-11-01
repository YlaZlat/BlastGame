const Passing = require('Passing');

cc.Class({
    extends: cc.Component,

    properties: {

        passing: {
            default: null,
            type: Passing 
        },

        wonCoinsLabel: {
            default: null,
            type: cc.Label
        },

        nextLevelInformation: {
            default: null,
            type: cc.Label
        },
    },

    onEnable () {
        this.wonCoinsLabel.string = "+ " + this.passing.levelCoins + " coins!";
        this.nextLevelInformation.string = "Level " + this.passing.currentLevel +  "\n Score " + this.passing.currentRequiredLevelScore + 
        " points in "  + this.passing.initMovies + " movies!"

    },

});
