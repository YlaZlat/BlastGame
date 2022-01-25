const BusterProtoController = require('BusterProtoController');
const Model = require('BusterMoveModel');
const Viev = require('BusterMoveViev');

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
    },
 
});
