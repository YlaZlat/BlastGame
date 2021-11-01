const Field = require('Field');
const Passing = require('Passing');


cc.Class({
    extends: cc.Component,
    
    properties: {

        field: {
            default: null,
            type: Field 
        },

        passing: {
            default: null,
            type: Passing 
        },

        cost: 100,

        costDisplay: {
            default: null,
            type: cc.Label
        },
        
        bombPrefab: {
            default: null,
            type: cc.Prefab
        }, 

        explosionPrefab: {
            default: null,
            type: cc.Prefab
        }, 
    },

    init(game){
        this.game = game
    },

    onLoad () {
        this.bomb = null;
        this.bombPool = new cc.NodePool();
        let bomb = cc.instantiate(this.bombPrefab); // create node instance
        this.bombPool.put(bomb); // populate your pool with put method

        this.explosionPool = new cc.NodePool();
        let initCount = 5; // 
        for (let i = 0; i < initCount; ++i) {
            let explosion = cc.instantiate(this.explosionPrefab); // create node instance
            this.explosionPool.put(explosion);// populate your pool with put method
        }  
    },

    onButtonClick(event){
        if(this.passing.coins < this.cost || this.bomb){
            return;
        }
        this.passing.changeCoins(-this.cost);
        this.bomb =  this.bombPool.get(this); 
        this.node.addChild(this.bomb);
        this.bomb.zIndex = 500;
        let pos = this.node.convertToNodeSpaceAR(event.getLocation());
        this.bomb.setAnchorPoint(1, 1);
         this.bomb.setPosition(pos);
        this.game.node.on(this.game.mousemove, this.onMouseMove, this);
        this.game.bombChosen();
    },
    
    onMouseMove(event){
       let pos = this.node.convertToNodeSpaceAR(event.getLocation());
        this.bomb.setPosition(pos);
    },

    onMouseDown(){
        if(this.passing.coins < this.cost){
            this.costDisplay.node.color = cc.Color.RED;
            this.node.on(this.game.mouseup, this.onMouseUp, this);
            this.node.on(this.game.mouseleave, this.onMouseUp, this);
            return;
        }
    },

    onMouseUp(){
        this.costDisplay.node.color = cc.Color.WHITE;
        this.node.off(this.game.mouseup, this.onMouseUp, this);
        this.node.off(this.game.mouseleave, this.onMouseUp, this);
    },

    spawnExplosion: function () {
        var explosion;
        if (this.explosionPool.size() > 0) {
            explosion = this.explosionPool.get();
           return explosion;
        } else {
            explosion = cc.instantiate(this.explosionPrefab);
            return explosion;
        }
    },

    despawnExplosionBomb (explosion) {
        this.explosionPool.put(explosion);
    },

    despawnBomb (bomb) {
        this.bombPool.put(bomb);
        this.bomb = null;
    },

    start () {
        this.node.on(this.game.mousedown, this.onMouseDown, this);
        this.costDisplay.string = this.cost;
    },

    

});
