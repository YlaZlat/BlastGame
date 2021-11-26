cc.Class({
    extends: cc.Component,

    properties: {

        playButton: {
            default: null,
            type: cc.Button
        },
        
    },

    enable(){
        this.node.active = true;
    },

    disable(){
        this.node.active = false; 
    },
    
});
