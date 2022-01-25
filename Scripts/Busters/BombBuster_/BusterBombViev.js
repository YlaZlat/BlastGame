const BusterProtoViev = require('BusterProtoViev');

cc.Class({
    extends: BusterProtoViev ,

    properties: {

        costLabel: {
            default: null,
            type: cc.Label,
            override: true
        },

        bombLabel:{
            default: null,
            type: cc.Node
        },

        bombPrefab: {
            default: null,
            type: cc.Prefab
        }, 

        explosionPrefab: {
            default: null,
            type: cc.Prefab
        }, 

        fieldNode: 
        {
            default: null,
            type: cc.Node
        },  

    },

    onLoad(){
        this.bombPool = new cc.NodePool();
        const bomb = cc.instantiate(this.bombPrefab); // create node instance
        this.bombPool.put(bomb); // populate your pool with put method

        this.explosionPool = new cc.NodePool();
        let initCount = 5; // 
        for (let i = 0; i < initCount; ++i) {
            let explosion = cc.instantiate(this.explosionPrefab); // create node instance
            this.explosionPool.put(explosion);// populate your pool with put method
        }  
    },

    spawnExplosion: function () {
        let explosion;
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

    createExplosin(pos, zIndex, size){
        const exp = this.spawnExplosion();
            exp.getComponent('ExplosionAnim').init(this);
            this.fieldNode.addChild(exp);
            const expSprite = exp.getChildByName('explosion');
            exp.zIndex = zIndex;
            expSprite.width = size;
            expSprite.height = size;
            exp.setPosition(pos);
    },

    spawnBomb(){
        const bomb = this.bombPool.get(this);
        this.node.addChild(bomb);
        bomb.zIndex = 500;
        bomb.position = this.bombLabel.position;
        return bomb;
    },

    despawnBomb (bomb) {
        this.bombPool.put(bomb);
    },


});
