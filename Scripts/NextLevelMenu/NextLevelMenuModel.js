const NextLevelMenuModel = cc.Class({

    ctor: function (controller, viev) {
        this.viev = viev;
        this.controller = controller;
        this.passingModel = this.controller.passingModel;
    },

    init(){
        this.disable(); 
    },
    
    enable () {
        const level = this.passingModel.level;
        const target = this.passingModel.requiredLevelScore;
        const movies = this.passingModel.initMovies;
        const coins = this.passingModel.levelCoins;
        this.viev.displaylevelInformation(level, target, movies);
        this.viev.displayWonCoins(coins);
        this.viev.enable();
    },

    disable () {
        this.viev.disable();
    },

});

module.exports = NextLevelMenuModel;