cc.Class({
    extends: cc.Component,

    properties: {

        spriteTextures: {
            default: [],
            type: [cc.SpriteFrame]     // type can also defined as an array to improve readability
        }, 

        cubePrefab: {
            default: null,
            type: cc.Prefab
        },

        fieldFrame: {
            default: null,
            type: cc.Node
        }, 

        blackRect: {
            default: null,
            type: cc.Node
        }, 
        
        cubeFormat: {
            default: 357/402,
            tooltip: "The ratio of the width of the sprite to its height (default: 357/402)",
        }, 

        fallingSpeed: 0.25,
    },

    init(gameController){
        this.gameController = gameController;
        this.getInitRenderFieldParameters();
    },

    setFieldSize(width,height){
        this.node.width = width;
        this.node.height = height;
        this.fieldFrame.height = this.node.height;
        this.fieldFrame.width = this.node.width;
        this.createBlackRect();
    },
    
    setFrameZIndex(zIndex){
        this.fieldFrame.zIndex = zIndex;
        this.blackRect.zIndex = zIndex;
    },
   
    createCubesPool(initCount){
        this.cubesPool = new cc.NodePool();
        for (let i = 0; i < initCount; ++i) {
            let cube = cc.instantiate(this.cubePrefab); // create node instance
            this.cubesPool.put(cube); // populate your pool with put method
        }   
    },
    
    getInitRenderFieldParameters(){
        return ({
            height: this.node.height,
            width: this.node.width,
            frameWidth: this.node.width * 0.025,
            cubeFormat: this.cubeFormat,
            fallingSpeed: this.fallingSpeed,
            spriteTextures: this.spriteTextures,
        })
    },

    createBlackRect(){
        const blackRect = this.blackRect.getComponent(cc.Graphics);
        blackRect.clear();
        blackRect.rect(0, this.node.height, this.node.width, this.node.height);
        blackRect.fillColor = cc.Color.BLACK;
        blackRect.fill(); 
    },

    getTexture(cubeSprite){
        const texture = cubeSprite.getComponent(cc.Sprite).spriteFrame;
        return texture;
    },

    setTexture(cubeSprite, texture){
        if(!texture instanceof cc.SpriteFrame) return false;
        cubeSprite.getComponent(cc.Sprite).spriteFrame = texture; 
        cubeSprite.colorName = texture.name;
        return texture;
    },
   
    spawnNewCubeSprite: function() {
        let cubeSprite = null;
        if (this.cubesPool.size() > 0) {
            cubeSprite =  this.cubesPool.get(); 
        } else {
            cubeSprite = cc.instantiate(this.cubePrefab);
        }
        
       this.node.getChildByName("cubes").addChild(cubeSprite);
        return cubeSprite;
    },

    setSpriteToCell(cell, sprite){
        sprite.setPosition(cell.position);
        sprite.width = cell.width;
        sprite.height = cell.height;
        sprite.zIndex = cell.number;
    },

    despawnCubeSprite: function(cubeSprite){
        this.cubesPool.put(cubeSprite);
    },

    deleteAllCubeSprite: function(){
        this.node.getChildByName("cubes").removeAllChildren();
    },

    cubeFallTo(cubeSprite, pos, fallTime){
        cc.tween(cubeSprite)
                .to(fallTime, {position: pos}, { easing: 'sineIn'})
                .start()
    },

    setCubeSpriteZIndex(cubeSprite, ZIndex){
        cubeSprite.zIndex = ZIndex; 
    },

    wiggle(cubeSprite){
        cc.tween(cubeSprite)
        .by(0.1, { scale: -0.15, angle: -20})
        .by(0.1, { scale: 0.15, angle: 20})
        .call(() => {this.model.onFinishWiggle()}) 
        .start()
    },


});


