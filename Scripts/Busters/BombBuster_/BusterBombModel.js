const BusterProtoModel = require('BusterProtoModel');

const BusterBombModel = cc.Class({
    extends: BusterProtoModel,
    
    ctor: function (controller, viev) {
        this.viev = viev;
        this.controller = controller;
        this.passingModel= this.controller.passingModel;
        this.fieldModel = this.controller.fieldModel;
        this.cost = 100;
    },

    buyBomb(){
        if(this.passingModel.coins < this.cost){
            return;
        }
        this.passingModel.changeCoins(-this.cost);
        this.bomb = this.viev.spawnBomb();
        return this.bomb;
    },

    despawnBomb(){
        this.viev.despawnBomb(this.bomb);
        this.bomb = null;
    },

    onFieldBombDown(sprite){
        this.despawnBomb();
        let explosionGroup = this.getExplosionGroup(sprite);
        this.fieldModel.despawnSprites(explosionGroup);
        this.createExplosins(explosionGroup);
        const dumpingDelay = 500;
        this.rebuildField = this.fieldModel.rebuildField.bind(this.fieldModel);//или лучше это сразу сделать в поле
        setTimeout(()=> {
            this.rebuildField();
        }, dumpingDelay);
    },
    
    getExplosionGroup(sprite){
        const explosionGroup = this.fieldModel.findNeighborsSprites(sprite);
        explosionGroup.push(sprite);
        return explosionGroup;
    },

    createExplosins(explosionGroup){
        for (let i = 0; i< explosionGroup.length; i++){
            const sprite = explosionGroup[i];
            const pos = sprite.cell.position;
            const zIndex = sprite.cell.number + 1;
            const size = sprite.cell.width;
            this.viev.createExplosin(pos, zIndex, size);
            const cell = this.fieldModel.getSpriteCell(sprite);
            cell.sprite = null;
        }
    },
    

});

module.exports = BusterBombModel;