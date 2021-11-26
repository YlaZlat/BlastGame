const PassingModel = cc.Class({

    ctor: function (controller, viev) {
        this.viev = viev;
        this.controller = controller;
        this.fieldModel = this.controller.fieldModel;

        this.initLivel = 1;
        this.initMovies = 10;
        this.initRequiredLevelScore = 50;
        this.increasRequiredLevelScore = 50;
        
        this.levelScore = 0;
        this.coins = 0;
        this.levelCoins = 0;
        this.totalScore = 0;
        this.moveCost = 50;
        this.level = this.initLivel;
        this.movies = this.initMovies;
        this.requiredLevelScore = this.initRequiredLevelScore + (this.level - this.initLivel) * this.increasRequiredLevelScore;
    },

    init(){
      this.displayAll(); 
    },

    displayAll(){
        this.viev.displayMovies(this.movies);
        this.viev.displayLevelSore(this.levelScore, this.requiredLevelScore);
        this.viev.displayTotalSore(this.totalScore);
        this.viev.displayLevel(this.level);
        this.viev.displayCoins(this.coins); 
    },

    setLevelProgressPosition(x, y, zIndex){
        this.viev.setLevelProgressPosition(x, y, zIndex);
    },

    resetLevelScore() {
        this.levelScore = 0;
        this.levelCoins = 0;
        this.movies = this.initMovies;
        this.viev.displayMovies(this.movies);
        this.viev.displayLevelSore(this.levelScore, this.requiredLevelScore);
        this.viev.displayTotalSore(this.totalScore);
        this.viev.displayLevel(this.level);
        this.viev.displayCoins(this.coins);
    },

    resetGame(){
        this.level = this.initLivel;
        this.movies = this.initMovies;
        this.requiredLevelScore = this.initRequiredLevelScore;
        this.coins = 0;
        this.levelScore = 0;
        this.levelCoins = 0;
        this.totalScore = 0;
        this.displayAll();
    }, 

    changeMovies (n) {
        this.movies += n;
        this.viev.displayMovies(this.movies);
    },

    changeCoins(n) {
        if( n > 0) this.levelCoins += n;
        this.coins += n;
        this.viev.displayCoins(this.coins); 
    },

    gainScore(num, pos, z) {
        this.levelScore += num * num;
        this.totalScore += num * num;
        this.movies--;
        this.viev.displayMovies(this.movies);
        this.viev.displayLevelSore(this.levelScore, this.requiredLevelScore);
        this.viev.displayTotalSore(this.totalScore);
        this.viev.creareScoreAnim(num, pos, z);
        if(this.levelScore < this.requiredLevelScore && this.movies < 1) this.controller.state.gameOver = true;
        if(this.levelScore >= this.requiredLevelScore) this.controller.state.nextLevel = true;
    },

    increaseLevel(){
        let coins = this.movies * this.moveCost + this.levelScore - this.requiredLevelScore;
        this.levelCoins += coins;
        this.coins += coins;
        this.level++;
        this.requiredLevelScore = this.initRequiredLevelScore + (this.level - this.initLivel) * this.increasRequiredLevelScore;
    },

});

module.exports = PassingModel;

