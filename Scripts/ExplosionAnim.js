

cc.Class({
    extends: cc.Component,

    properties: {
    },

    init (game) {
        this.game = game;
        const anim = this.node.getComponent(cc.Animation);
        const animState = anim.play('explosionAnimation');  
       this.duration = animState.duration;
    },

    despawn () {
        this.game.despawnExplosionBomb(this.node);
    },

    
});
