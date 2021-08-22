
var WinMenuLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        // 1. super init first
        this._super();
        var size = cc.winSize;
        var initCoins = coins;// начальное значения монет для вычисления заработанных в этом уровне
        //полупрозрачный фон, скрывающий игровой слой
        var background = new cc.Sprite(res.field_png);
        background.setPosition(cc.p(size.width/2, size.height/2));
        background.setScale(3);
        background.setOpacity(150);
        this.addChild(background);
        //панель меню
        this.menuField = new cc.Sprite(res.menuField_png);
        this.menuField.setScale(0.3, 0.7);
        this.menuField.setPosition(cc.p(size.width/2, size.height/2));
        this.menuField.rect = this.menuField.getBoundingBox();
        this.addChild(this.menuField, 1);
        // надпись "You win!"
        this.winLabel = new cc.LabelBMFont ("You win!" , res.LabelBMFont_png);
        this.winLabel.setPosition( cc.p(this.menuField.getPosition().x, this.menuField.rect.y + this.menuField.rect.height*0.85 ) );
        this.winLabel.setScale(0.7);
        this.winLabel.setColor( cc.color(125,209,70,255 ));
        this.addChild(this.winLabel, 1);
        // начисление выигранных монет
        this.winCoinsLable = new cc.LabelBMFont ("+ "  , res.LabelBMFontYellow_png);
        this.winCoinsLable.setPosition( cc.p(this.menuField.getPosition().x, this.menuField.rect.y + this.menuField.rect.height*0.7 )  );
        this.winCoinsLable.setScale(0.5);
        this.addChild(this.winCoinsLable, 1);
        this.schedule( function(){
        this.winCoinsLable.setString("+ " + (coins - initCoins)  +  " coins");
        });
        //надпись о следующем уровне
        this.levelLabel = new cc.LabelBMFont ("Next level: " + level.num , res.LabelBMFont_png);
        this.levelLabel.setColor( cc.color(125,209,70,255 ));
        this.levelLabel.setPosition( cc.p(this.menuField.getPosition().x, this.menuField.rect.y + this.menuField.rect.height*0.55 )  );
        this.levelLabel.setScale(0.5);
        this.addChild(this.levelLabel, 1);

        this.levelLabel2 = new cc.LabelBMFont ("Score " + level.target + " points in 10 moves!" , res.LabelBMFont_png);
        this.levelLabel2.setColor( cc.color(125,209,70,255 ));
        this.levelLabel2.setPosition(  cc.p(this.menuField.getPosition().x, this.menuField.rect.y + this.menuField.rect.height*0.45 ) );
        this.levelLabel2.setScale(0.5);
        this.addChild(this.levelLabel2, 1);
       
        //кнопка play
        var menuItem1 = new cc.MenuItemImage(res.button_png, res.button_png, this.play.bind(this));  
        menuItem1.setPosition(  cc.p (this.menuField.getPosition().x, this.menuField.rect.y + this.menuField.rect.height*0.22 ) );
        menuItem1.setScale(0.4);
        var menu = new cc.Menu(menuItem1);
        menu.setPosition( cc.p(0, 0));
        this.addChild(menu,3);
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
