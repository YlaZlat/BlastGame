const BusterProtoController = require('BusterProtoController');
const Model = require('BusterBombModel');
const Viev = require('BusterBombViev');

cc.Class({
        extends: BusterProtoController,

    properties: {

        viev: {
            default: null,
            type: Viev,
            override: true
        },
        
    },  

    onLoad () {
        this._super();
        this.model = new Model(this, this.viev);
        this.model.init();
        this.bomb = null;
        this.fieldNode = this.viev.fieldNode;
    },

    onBusterClick(){
        if(!this.game.state.game) return; 
        if(this.model.buyBomb()) {
            this.offStandartGameEvents();
            this.game.node.on(this.mousemove, this.onMouseMove, this);
            this.fieldNode.on(this.mousedown, this.onFieldMouseDown, this);
        }
    },

    onMouseMove(event){
        let pos = this.node.convertToNodeSpaceAR(event.getLocation());
        this.model.bomb.setPosition(pos);
    },

    onFieldMouseDown(event){
        if(event.target === event.currentTarget) return;
        this.game.node.off(this.mousemove, this.onMouseMove, this);
        this.fieldNode.off(this.mousedown, this.onFieldMouseDown, this);
        event.stopPropagation();
        let target = event.target;
        this.model.onFieldBombDown(target);
    },

    
});
