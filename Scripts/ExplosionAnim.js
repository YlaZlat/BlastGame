

cc.Class({
    extends: cc.Component,

    properties: {
    },

    init (game) {
        this.game = game;
        let anim = this.node.getComponent(cc.Animation);
        let animState = anim.play('explosionAnimation');  
       this.duration = animState.duration;
    },

    despawn () {
        this.game.despawnExplosionBomb(this.node);
    },

    
});
