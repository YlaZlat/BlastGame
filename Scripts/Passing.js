
cc.Class({
    extends: cc.Component,

    properties: {
        initLivel: 1,
        initMovies: 10,
        coins: 1000,
        initRequiredLevelScore: 50,
        increasRequiredLevelScore: 50,

        levelScoreDisplay: {
            default: null,
            type: cc.Label
        },
        
        moviesDisplay: {
            default: null,
            type: cc.Label
        },

        bonuseMoveNode: {
            default: null,
            type: cc.Node
        }, 

        totalScoreDisplay: {
            default: null,
            type: cc.Label
        },

        coinsNumDisplay: {
            default: null,
            type: cc.Label
        },

        levelProgress: {
            default: null,
            type: cc.Node
        }, 

        levelLabel: {
            default: null,
            type: cc.Label
        },
        
        scoreFXPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    init(game){
        this.game = game;
        this.currentLevel = this.initLivel;
        this.movies = this.initMovies;
        this.totalScore = 0;
        this.currentRequiredLevelScore = this.initRequiredLevelScore + (this.currentLevel - this.initLivel) * this.increasRequiredLevelScore;
        this.scorePool = new cc.NodePool('ScoreAnim');
    },
    
    resetLevelScore: function () {
        this.levelScore = 0;
        this.levelCoins = 0;
        this.movies = this.initMovies;
        this.moviesDisplay.string = this.movies.toString();
        this.updateLevelScore();
        this.levelDisplay();
    },

    changeMovies: function (n) {
        this.movies += n;
        this.moviesDisplay.string = this.movies.toString();
    },

    changeCoins: function (n) {
        if( n > 0) this.levelCoins += n;
        this.coins += n;
        this.coinsNumDisplay.string = this.coins.toString();
    },

    levelDisplay(){
        this.levelLabel.string = 'Level: ' + this.currentLevel;
    },
   
   
    updateLevelScore(){
        this.levelScoreDisplay.string = 'Score: ' + '\n' + this.levelScore.toString() + "/" + this.currentRequiredLevelScore ;
        this.levelProgress.getComponent(cc.ProgressBar).progress = this.levelScore / this.currentRequiredLevelScore;
    },

    gainScore: function (pos, num) {
        this.levelScore += num * num;
        this.updateLevelScore();
        this.totalScore += num * num;
        this.totalScoreDisplay.string = this.totalScore;
        var fx = this.spawnScoreFX();
        fx.getComponent('ScoreAnim').init(this);
        this.game.field.node.addChild(fx);
        fx.zIndex = this.game.field.cellsNum;
        fx.setPosition(pos);
        fx.getComponent('ScoreAnim').label.string =  '+' + num + "x" + num;
        fx.getComponent(cc.Animation).play();

        if(this.levelScore < this.currentRequiredLevelScore && this.movies < 1) this.game.gameOver();
        if(this.levelScore >= this.currentRequiredLevelScore) this.game.nextLevel();
    },

    spawnScoreFX: function () {
        var fx;
        if (this.scorePool.size() > 0) {
            fx = this.scorePool.get();
           return fx;
        } else {
           fx = cc.instantiate(this.scoreFXPrefab);
            return fx;
        }
    },

    despawnScoreFX (scoreFX) {
        this.scorePool.put(scoreFX);
    },

    increaseLevel(){
        let coins = this.movies * this.bonuseMoveNode.getComponent("BonuseMove").cost + this.levelScore - this.currentRequiredLevelScore;
        this.coins += coins;
        this.levelCoins += coins;
        this.coinsNumDisplay.string = this.coins;
        this.currentLevel++;
        this.currentRequiredLevelScore = this.initRequiredLevelScore + (this.currentLevel - this.initLivel) * this.increasRequiredLevelScore;
        this.movies = this.initMovies;
    },
    
});
