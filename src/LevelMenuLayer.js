var LevelMenuLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        // 1. super init first
        this._super();
        var size = cc.winSize;
        ////полупрозрачный фон, скрывающий игровой слой
        var background = new cc.Sprite(res.field_png);
        background.setContentSize(cc.Size(size.width, size.height));
        background.setPosition(cc.p(size.width/2, size.height/2));
        background.setOpacity(150);
        this.addChild(background);
        //панель меню
        this.menuField = new cc.Sprite(res.menuField_png);
        this.menuField.setScale(0.3, 0.5);
        this.menuField.setPosition(cc.p(size.width/2, size.height/2));
        this.menuField.rect = this.menuField.getBoundingBox();
        this.addChild(this.menuField, 1);
        //надпись о следующем уровне
        this.levelLabel = new cc.LabelBMFont ("Level: " + level.num , res.LabelBMFont_png);
        this.levelLabel.setPosition( cc.p(this.menuField.getPosition().x, this.menuField.getPosition().y + this.menuField.rect.height/3) );
        this.levelLabel.setScale(0.5);
        this.addChild(this.levelLabel, 1);

        this.levelLabel2 = new cc.LabelBMFont ("Score " + level.target + " points in 10 moves!" , res.LabelBMFont_png);
        this.levelLabel2.setPosition( cc.p(this.menuField.getPosition().x, this.menuField.getPosition().y + this.menuField.rect.height/6) );
        this.levelLabel2.setScale(0.5);
        this.addChild(this.levelLabel2, 1);
        //кнопка play
        var menuItem1 = new cc.MenuItemImage(res.button_png, res.button_png, this.play.bind(this));  
      
        menuItem1.setPosition(cc.p(this.menuField.getPosition().x, this.menuField.getPosition().y - this.menuField.rect.height/5));
        menuItem1.setScale(0.5);
        var menu = new cc.Menu(menuItem1);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 3);
        this.playLabel = new cc.LabelBMFont ("Play!", res.LabelBMFont_png);
        this.playLabel.setPosition(menuItem1.getPosition() );
        this.playLabel.setScale(0.5);
        this.addChild(this.playLabel , 4);

        return true;
    },
    play: function() {
        mode = "game";
        this.removeFromParent();
    },
});