cc.Class({
    extends: cc.Component,

    properties: {

        levelScoreDisplay: {
            default: null,
            type: cc.Label
        },
        
        moviesDisplay: {
            default: null,
            type: cc.Label
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

        progressBar: {
            default: null,
            type: cc.ProgressBar
        },

        levelLabel: {
            default: null,
            type: cc.Label
        },
        
        scoreFXPrefab: {
            default: null,
            type: cc.Prefab
        },

        field: {
            default: null,
            type: cc.Node 
        }

    },


    start(){
        this.node.position = this.field.position;
        this.scorePool = new cc.NodePool();
    },

    displayLevelSore(currentScore, requiredScore){
        this.levelScoreDisplay.string = 'Score: ' + '\n' + currentScore + "/" + requiredScore ;
        this.progressBar.progress = currentScore / requiredScore;
    },

    displayTotalSore(score){
        this.totalScoreDisplay.string = score;
    },

    displayMovies(movies) {
        this.moviesDisplay.string = movies;
    },

    displayLevel(level){
        this.levelLabel.string = 'Level: ' + level;
    },

    displayCoins(coins) {
        this.coinsNumDisplay.string = coins.toString();
    },

    setLevelProgressPosition(x, y, zIndex){
        this.levelProgress.x = x; 
        this.levelProgress.y = y; 
        this.levelProgress.zIndex = zIndex;
    },

    spawnScoreFX: function () {
        let fx;
        if (this.scorePool.size() > 0) {
            fx = this.scorePool.get();
            return fx;
        } else {
            fx = cc.instantiate(this.scoreFXPrefab);
            return fx;
        }
    },

    creareScoreAnim(num, pos, z){
        let fx = this.spawnScoreFX();
        this.node.addChild(fx);
        fx.getComponent('ScoreAnim').init(this);
        fx.zIndex = z;
        fx.setPosition(pos);
        fx.getComponent('ScoreAnim').label.string =  '+' + num + "x" + num;
        fx.getComponent(cc.Animation).play(); 
    },

    despawnScoreFX (scoreFX) {
        this.scorePool.put(scoreFX);
    },

});
