const Field = require('Field');
const Passing = require('Passing');
const Bomb = require('BonuseBomb');
const Move = require('BonuseMove');
const Mix = require('BonuseMix');

cc.Class({
    extends: cc.Component,

    properties: {
        cubePrefab: {
            default: null,
            type: cc.Prefab
        },

        field: {
            default: null,
            type: Field 
        },

        passing: {
            default: null,
            type: Passing 
        },

        bonuseBomb: {
            default: null,
            type: Bomb
        },

        bonuseMove: {
            default: null,
            type: Move
        },

        bonuseMix: {
            default: null,
            type: Mix
        },

        mainMenuNode: {
            default: null,
            type: cc.Node
        },

        gameOverNode: {
            default: null,
            type: cc.Node
        },

        nextLevelNode: {
            default: null,
            type: cc.Node
        },
    },  

     onLoad () {
        this.mousedown = 'mousedown';
        this.mouseup = 'mouseup';
        this.mousemove = 'mousemove';
        this.mouseleave = 'mouseleave';
       if (cc.sys.platform === cc.sys.MOBILE_BROWSER) {
             this.mousedown = 'touchstart';
             this.mouseup = 'touchend';
             this.mousemove = 'touchmove';
             this.mouseleave = 'touchcancel';
       }
        this.field.init(this);
        this.passing.init(this);
        this.bonuseBomb.init(this);
        this.bonuseMove.init(this);
        this.bonuseMix.init(this);
        this.gameOverNode.active = false;
        this.nextLevelNode.active = false;
         
        this.cubesPool = new cc.NodePool();
        let initCount = this.field.cellsNum * 2; // 
        for (let i = 0; i < initCount; ++i) {
            let cube = cc.instantiate(this.cubePrefab); // create node instance
            this.cubesPool.put(cube); // populate your pool with put method
        }   

        this.field.fillFieldWithSprites();
     },

     onStartGame: function () {
        this.passing.resetLevelScore();
        this.passing.changeCoins(0);
        this.gameOverNode.active = false;
        this.mainMenuNode.active = false;
        this.nextLevelNode.active = false;

       // this.field.node.on('mousedown', this.onMouseDown, this);
       this.field.node.on(this.mousedown, this.onMouseDown, this);

        if(this.field.rowLength !== this.field.currentRowLength) {
            this.field.updateField()};
     },
    
     bombChosen(){
      //  this.field.node.off('mousedown', this.onMouseDown, this);
      //  this.field.node.on('mousedown', this.onMouseDownBomb, this);

      this.field.node.off(this.mousedown, this.onMouseDown, this);
        this.field.node.on(this.mousedown, this.onMouseDownBomb, this);

     },

     onMouseDownBomb(event){
        let target = event.target;
        if(target.number > this.field.cellsNum) return;
      //  this.node.off('mousemove', this.bonuseBomb.onMouseMove, this.bonuseBomb);
        this.node.off(this.mousemove, this.bonuseBomb.onMouseMove, this.bonuseBomb);
       // this.field.node.off('mousedown', this.onMouseDownBomb, this);
       this.field.node.off(this.mousedown, this.onMouseDownBomb, this);

        this.bonuseBomb.despawnBomb(this.bonuseBomb.bomb);
        let explosionGroup = this.field.getExplosionGroup(target.number, this.field.fieldCells);
        let exp;
        for (let i = 0; i< explosionGroup.length; i++){
            this.cubesPool.put(explosionGroup[i]);
            exp = this.bonuseBomb.spawnExplosion();
            exp.getComponent('ExplosionAnim').init(this);
            this.field.node.addChild(exp);
            exp.zIndex = this.field.cellsNum;
            exp.scale = 5/this.field.rowLength;
            exp.setPosition(explosionGroup[i].getPosition());
        }
        this.scheduleOnce(function() {
            this.field.dumping(this.field.fieldCells);
            this.scheduleOnce(function() {
                this.field.fillFieldWithSprites();
           //     if (!this.bonuseBomb.bomb)this.field.node.on('mousedown', this.onMouseDown, this);}, this.field.maxFallTime);
           if (!this.bonuseBomb.bomb)this.field.node.on(this.mousedown, this.onMouseDown, this);}, this.field.maxFallTime);
            }, exp.getComponent('ExplosionAnim').duration * 0.7);
    },
        
    onMouseDown(event){
        let target = event.target;
        if (target.number > this.field.cellsNum) return;
        let pos = this.field.node.convertToNodeSpaceAR(event.getLocation());
        event.currentTarget.pauseSystemEvents(true);
        let relatedGroup = this.field.searchForSameColorAdjacentSprites(target.number, this.field.fieldCells);
        if(relatedGroup.length < 2){
            cc.tween(target)
            .by(0.1, { scale: -0.15, angle: -20})
            .by(0.1, { scale: 0.15, angle: 20})
            .call(() => {event.currentTarget.resumeSystemEvents(true);}) 
            .start()
            return;
        }

        else {
            this.passing.changeMovies(-1);
            this.passing.gainScore(pos, relatedGroup.length);
            for (let i = 0; i< relatedGroup.length; i++){
                    this.cubesPool.put(relatedGroup[i]);
            }
            this.field.dumping(this.field.fieldCells);
            this.scheduleOnce(function() {
                this.field.currentMaxFallHaight = 0;
                event.currentTarget.resumeSystemEvents(true);
                this.field.fillFieldWithSprites();
            }, this.field.maxFallTime);
        }
    },

    gameOver(){
        this.passing.init(this);
        this.passing.resetLevelScore();
        this.gameOverNode.active = true;
    //  this.field.node.off('mousedown', this.onMouseDown, this);
    this.field.node.off(this.mousedown, this.onMouseDown, this);
    },

    nextLevel(){
        this.passing.increaseLevel();
        this.nextLevelNode.active = true;
      //  this.field.node.off('mousedown', this.onMouseDown, this);
      this.field.node.off(this.mousedown, this.onMouseDown, this);
    },
});
