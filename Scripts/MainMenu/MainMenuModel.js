const MainMenuModel = cc.Class({

    ctor: function (controller, viev) {
        this.viev = viev;
        this.controller = controller;
        this.fieldModel = this.controller.fieldModel;
    },

    init(){
    },

    onSlider(slider){
        const minNum = this.fieldModel.minRowLength;
        const maxNum = this.fieldModel.maxRowLength;
        const curNum  = minNum + Math.floor((maxNum - minNum) * slider.progress);
        this.viev.displayNumberOfCubes(curNum);
        this.fieldModel.currentRowLength = curNum;
    },

    setCurrentSliderProgres(){
        const minNum = this.fieldModel.minRowLength;
        const maxNum = this.fieldModel.maxRowLength;
        const curNum = this.fieldModel.rowLength;
        const progress =  (curNum - minNum) / (maxNum - minNum);
        this.viev.displaySliderProgress(progress);
        this.viev.displayNumberOfCubes(curNum);
    },

   enable () {
        this.viev.enable();
        this.setCurrentSliderProgres();
    },

    disable () {
        this.viev.disable();
    },
});

module.exports = MainMenuModel;