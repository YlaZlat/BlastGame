var mode = "levelMenu"; // "game", "failMenu", "winMenu"
var level = {
    num: 1,
    target: 150
};
var coins = 150;

var isMix = false;

//Динамичные надписи:
var totalScoreText; 
var totalCoinsText;
var sliderLevelNumText;
var slider;
var levelScoreText;
var levelMoviesText; 
var bombCostText;
var moveCostText;
var mixCostText;

var GameLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        // 1. super init first
        this._super();
        var size = cc.winSize;
       
        this.totalScore = 0;       
        this.levelScore = 0;
        this.initMovies = 10
        this.movies = this.initMovies;
                
        this.field = new cc.Sprite(res.field_png);
        this.field.setScale(0.285);
        this.field.setPosition(cc.p(size.width*0.25, size.height*0.5));
        this.addChild(this.field);
        this.field.isRebuilding= false;
        this.field.currentTouch = null;
        this.field.isClicked = false;
        this.field.rect = this.field.getBoundingBox( );
        var leftFieldCorner = cc.p(this.field.rect.x+10, this.field.rect.y + this.field.rect.height*2 - 40 ); //*2

        var fieldFrame = new cc.Sprite(res.fieldFrame_png);
        fieldFrame.setScale(this.field.getScale());
        fieldFrame.setPosition(this.field.getPosition());
        fieldFrame.rect = fieldFrame.getBoundingBox( );
        this.addChild(fieldFrame, 300);

        //панель с общим счетом игры Total score
        this.totalScorePanel =  new cc.Sprite(res.button2_png);
        this.totalScorePanel.setScale(0.3, 0.2);
        this.totalScorePanel.setPosition(cc.p(fieldFrame.getPosition().x  + fieldFrame.rect.width*1.2, fieldFrame.rect.y + fieldFrame.rect.height*0.92));
        this.totalScorePanel.rect = this.totalScorePanel .getBoundingBox( );
        this.addChild(this.totalScorePanel );

        this.totalScorePanel.heading = new cc.LabelBMFont ("Total score", res.LabelBMFont_png);
        this.totalScorePanel.heading.setPosition(cc.p (this.totalScorePanel.rect.x , this.totalScorePanel.rect.y + this.totalScorePanel.rect.height*1.1 ));
        this.totalScorePanel.heading.setScale(0.4);
        this.totalScorePanel.heading.setAnchorPoint(cc.p (0, 0));
        this.addChild(this.totalScorePanel.heading, 1);

        totalScoreText = new cc.LabelBMFont ("" + this.totalScore, res.LabelBMFont_png);
        totalScoreText.setPosition(this.totalScorePanel.getPosition());
        totalScoreText.setScale(0.6);
        this.addChild(totalScoreText, 1);

        //панель с отображением количества монет
        this.coinsPanel =  new cc.Sprite(res.button_png);
        this.coinsPanel.setScale(0.3, 0.2);
        this.coinsPanel.setPosition(cc.p(fieldFrame.getPosition().x  + fieldFrame.rect.width*0.8, fieldFrame.rect.y + fieldFrame.rect.height*0.92));
        this.coinsPanel.rect = this.coinsPanel.getBoundingBox( );
        this.addChild(this.coinsPanel);

        this.coinsPanel.coin =  new cc.Sprite(res.coin_png);
        this.coinsPanel.coin.setScale(0.2, 0.2);
        this.coinsPanel.coin.setPosition(cc.p(this.coinsPanel.rect.x + this.coinsPanel.rect.width*0.1 , this.coinsPanel.getPosition().y));
        this.addChild(this.coinsPanel.coin);

        this.coinsPanel.heading = new cc.LabelBMFont ("Coins", res.LabelBMFont_png);
        this.coinsPanel.heading.setPosition(cc.p (this.coinsPanel.rect.x , this.coinsPanel.rect.y + this.coinsPanel.rect.height*1.1 ));
        this.coinsPanel.heading.setScale(0.4);
        this.coinsPanel.heading.setAnchorPoint(cc.p (0, 0));
        this.addChild(this.coinsPanel.heading, 1);

        totalCoinsText = new cc.LabelBMFont ("" + coins, res.LabelBMFontYellow_png);
        totalCoinsText.setPosition(this.coinsPanel.getPosition());
        totalCoinsText.setScale(0.6);
        this.addChild(totalCoinsText, 1);

        //слайдер с отображением прогресса уровня
        var sliderField = new cc.Sprite(res.menuField_png);
        sliderField.setScale(0.25, 0.3);
        sliderField.setPosition( cc.p(fieldFrame.getPosition().x  + fieldFrame.rect.width*1.0, fieldFrame.rect.y + fieldFrame.rect.height*0.76 ) );
        sliderField.rect = sliderField.getBoundingBox( );
        this.addChild(sliderField, 300);

        sliderLevelNumText = new cc.LabelBMFont ("Level: " + level.num , res.LabelBMFont_png);
        sliderLevelNumText.setPosition( cc.p(sliderField.getPosition().x , sliderField.getPosition().y + sliderField.rect.height*0.23) );
        sliderLevelNumText.setScale(0.7);
        this.addChild(sliderLevelNumText, 301);

        slider = new ccui.Slider();
        slider.loadBarTexture(res.roundedRectangleBlue_png);
        slider.loadProgressBarTexture(res.roundedRectangleGreen_png);
        slider.setPosition(cc.p(sliderField.getPosition().x , sliderField.getPosition().y - sliderField.rect.height*0.25));
        slider.setScale(0.25);
        slider.percent = this.levelScore/level.target;
        slider.setPercent(slider.percent);
        this.addChild(slider, 301);

        //панель с отображением ходов и счета уровня
        this.panelScore =  new cc.Sprite(res.panelScore_png);
        this.panelScore.setScale(0.2);
        this.panelScore.setPosition(cc.p(fieldFrame.getPosition().x  + fieldFrame.rect.width*1.0, fieldFrame.rect.y + fieldFrame.rect.height*0.38));
        this.panelScore.rect = this.panelScore.getBoundingBox( );
        this.addChild(this.panelScore);

        this.panelScore.heading = new cc.LabelBMFont ("Movies", res.LabelBMFont_png);
        this.panelScore.heading.setPosition( cc.p(this.panelScore.getPosition().x, this.panelScore.getPosition().y + this.panelScore.rect.height*0.5) );
        this.panelScore.heading.setScale(0.7);
        this.addChild(this.panelScore.heading, 1);

        this.labelScore = new cc.LabelBMFont ("Score:"  , res.LabelBMFont_png,  -1,  cc.TEXT_ALIGNMENT_CENTER, cc.p(0.5,0.5));
        this.labelScore.setPosition(cc.p(this.panelScore.getPosition().x, this.panelScore.getPosition().y - this.panelScore.rect.height/5));
        this.labelScore.setScale(0.5);
        this.addChild(this.labelScore, 1);

        levelScoreText = new cc.LabelBMFont (this.levelScore + " / " + level.target , res.LabelBMFont_png,  -1,  cc.TEXT_ALIGNMENT_CENTER, cc.p(0.5,0.5));
        levelScoreText.setPosition(cc.p(this.panelScore.getPosition().x, this.panelScore.getPosition().y - this.panelScore.rect.height/3));
        levelScoreText.setScale(0.5);
        this.addChild(levelScoreText, 1);

        levelMoviesText = new cc.LabelBMFont ("" +this.movies, res.LabelBMFont_png,  -1,  cc.TEXT_ALIGNMENT_CENTER, cc.p(0.5,0.5));
        levelMoviesText.setPosition( cc.p(this.panelScore.getPosition().x, this.panelScore.getPosition().y + this.panelScore.rect.height/10) );
        levelMoviesText.setScale(1);
        this.addChild(levelMoviesText, 1);
      
    //меню бонусов 
    //центральная кнопка   
    
        var bonusesItemCenter = new cc.MenuItemImage(res.bonusField_png, res.bonusField_png, this.buyBomb.bind(this)) ;  
        bonusesItemCenter.setPosition(cc.p(fieldFrame.getPosition().x  + fieldFrame.rect.width*1.0, fieldFrame.rect.y + fieldFrame.rect.height*0.07));
        bonusesItemCenter.setScale(0.2);

        this.bomb = new cc.Sprite (res.bomb_png);
        this.bomb.setPosition( cc.p(bonusesItemCenter.getPosition().x, bonusesItemCenter.getPosition().y + bonusesItemCenter.getBoundingBox().height*0.2));
        this.bomb.setScale(0.17);
        this.addChild(this.bomb, 1);

        this.bombClone = new cc.Sprite (res.bomb_png);
        this.bombClone.setScale(0.17);
        this.bombClone.setPosition(this.bomb.getPosition());
        this.addChild(this.bombClone, 305);
        this.bombClone.isChosen =false;

        this.bombCost = 150;
        bombCostText = new cc.LabelBMFont ("" + this.bombCost, res.LabelBMFont_png);
        bombCostText.setPosition( cc.p(bonusesItemCenter.getPosition().x - bonusesItemCenter.getBoundingBox().width*0.14, bonusesItemCenter.getPosition().y - bonusesItemCenter.getBoundingBox().height*0.24));
        bombCostText.setScale(0.35);
        this.addChild(bombCostText, 1);
        //левая кнопка 
        var bonusesItemLeft = new cc.MenuItemImage(res.bonusField_png, res.bonusField_png, this.buyMove.bind(this));  
        bonusesItemLeft.setPosition( cc.p(bonusesItemCenter.getPosition().x - fieldFrame.rect.width*0.2, bonusesItemCenter.getPosition().y));
        bonusesItemLeft.setScale(0.2);
        this.bonusLabelMov = new cc.LabelBMFont ("move", res.LabelBMFont_png);
        this.bonusLabelMov.setPosition( cc.p(bonusesItemLeft.getPosition().x, bonusesItemLeft.getPosition().y + bonusesItemLeft.getBoundingBox().height*0.2) );
        this.bonusLabelMov.setScale(0.4);
        this.addChild(this.bonusLabelMov, 1);
        this.moveCost = 50;
        moveCostText = new cc.LabelBMFont ("" + this.moveCost, res.LabelBMFont_png);
        moveCostText.setPosition( cc.p(bonusesItemLeft.getPosition().x - bonusesItemLeft.getBoundingBox().width*0.14, bonusesItemLeft.getPosition().y - bonusesItemLeft.getBoundingBox().height*0.24));
        moveCostText.setScale(0.35);
        this.addChild(moveCostText, 1);
        //правая кнопка
         var bonusesItemRight = new cc.MenuItemImage(res.bonusField_png, res.bonusField_png, this.buyMix.bind(this));
        bonusesItemRight.setPosition( cc.p(bonusesItemCenter.getPosition().x + fieldFrame.rect.width*0.2, bonusesItemCenter.getPosition().y));
        bonusesItemRight.setScale(0.2);
        this.bonusLabelMix = new cc.LabelBMFont ("mix", res.LabelBMFont_png);
        this.bonusLabelMix.setPosition( cc.p(bonusesItemRight.getPosition().x, bonusesItemRight.getPosition().y + bonusesItemRight.getBoundingBox().height*0.2) );
        this.bonusLabelMix.setScale(0.4);
        this.addChild(this.bonusLabelMix, 1);
        this.mixCost = 50;
        mixCostText = new cc.LabelBMFont ("" + this.mixCost, res.LabelBMFont_png);
        mixCostText.setPosition(cc.p(bonusesItemRight.getPosition().x - bonusesItemRight.getBoundingBox().width*0.14, bonusesItemRight.getPosition().y - bonusesItemRight.getBoundingBox().height*0.24));
        mixCostText.setScale(0.35);
        this.addChild(mixCostText, 1);

        var bonusMenu = new cc.Menu(bonusesItemLeft, bonusesItemCenter, bonusesItemRight);
        bonusMenu.setPosition(cc.p(0, 0));
        this.addChild(bonusMenu);

        this.bonusLabel= new cc.LabelBMFont ("Bonuses", res.LabelBMFont_png);
        this.bonusLabel.setPosition( cc.p(bonusesItemCenter.getPosition().x, bonusesItemCenter.getPosition().y + bonusesItemCenter.rect.height*0.7) );
        this.bonusLabel.setScale(0.7);
        this.addChild(this.bonusLabel, 1);

        // квадрат, скрывающийневидимую часть поля, откуда падаю новые кубики
        this.draw = new cc.DrawNode();
        this.draw.drawRect(cc.p(this.field.rect.x, this.field.rect.y + this.field.rect.height), cc.p(leftFieldCorner.x + this.field.rect.width , leftFieldCorner.y + this.field.rect.height ), cc.color(0, 0, 0, 255), 2, cc.color(0, 0, 0, 255));
        this.addChild(this.draw, 299);

        this.cubeColors = [{color: "purple", texture: res.purple_png},
                        {color: "yellow", texture: res.yellow_png},
                        {color: "rgeen", texture: res.green_png},
                        {color: "blue", texture: res.blue_png},
                        {color: "pink", texture: res.pink_png},];

        this.Cube = cc.Sprite.extend({
            ctor:function (file) {
                this._super();
                this.initWithFile(file);
                this.setScale(0.14);
                this.setAnchorPoint(cc.p(0.5, 0.5));
                this.type;
                this.rect = this.getBoundingBox( );
                this.currentAction = null;
                this.fallHeight = 0;
                this.cubeHeight = this.rect.height - 5;
                this.cubeWidth = this.rect.width - 1;
                this.fadeOutAction = new cc.FadeOut(0.5);
                this.sway = new cc.Sequence(new cc.RotateBy(0.1, 20), new cc.RotateBy(0.1, -20));
                this.push = new cc.Sequence(new cc.ScaleTo(0.1, 0.12), new cc.ScaleTo(0.1, 0.14));
                this.swayPush = new cc.Spawn(this.sway, this.push);
                },
        });    

        this.currentCubes = [];
        var indent = 0;
        for (var i = 0; i < 18; i++) {
            for (var j = 0; j < 9; j++) {
                var randomColor = this.cubeColors[Math.floor(Math.random()*this.cubeColors.length)];
                var cell = {};
                cell.sprite = new this.Cube (randomColor.texture);
                cell.sprite.type = randomColor.color;
                if(i ==9){indent=50};
                cell.position = cc.p(leftFieldCorner.x + j*cell.sprite.cubeWidth + cell.sprite.cubeWidth/2 , leftFieldCorner.y - i*cell.sprite.cubeHeight - cell.sprite.cubeHeight/2 - indent);
                cell.zIndex = 162-i;
                cell.sprite.setPosition(cell.position);
                this.currentCubes.push(cell);
                this.addChild(cell.sprite, cell.zIndex);
            }
        }

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true, 
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                return true;
                },
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget();
                if (target.isClicked || target.isRebuilding ) return;
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                    if (cc.rectContainsPoint(rect, locationInNode)) {
                        target.currentTouch = touch.getLocation();
                        target.isClicked = true;
                        target.isRebuilding = true;
                    }  
            },
        });
            var listener2 = cc.EventListener.create({
                event: cc.EventListener.MOUSE,
                swallowTouches: true,
                onMouseMove: function (event) {
                    var target = event.getCurrentTarget();
                    if(target.isChosen == false) return;
                    target.setPosition(event.getLocation());
                    return true;
                },
            });
            
            cc.eventManager.addListener(listener, this.field);
            cc.eventManager.addListener(listener2, this.bombClone);
            this.schedule(this.functionUpdate1, 0.006);
            return true;
    },

    functionUpdate1: function(dt) {
        this.touchHandler(this.currentCubes);
        this.bombHandler(this.currentCubes);
        this.rebuildingCheck(this.currentCubes);
    },
                
    play: function() {
        this.mode = "game";
        this.background.setLocalZOrder(-1);
    },

     //функции меню бонусов:
     buyBomb: function() {// купить бомбу
        
         if(coins < this.bombCost || this.bombClone.isChosen) return;    
         this.addCoins(-this.bombCost);  
         this.bombClone.isChosen = true
    },
    buyMove: function(){// купить дополнительный шаг
        if(coins < this.moveCost )return;
        this.addCoins(-this.moveCost);
        this.movies++; 
        levelMoviesText.setString("" + this.movies);
    },
    buyMix: function(){ // купить перемешивание поля
        if(coins < this.mixCost )return;
        this.addCoins(-this.mixCost);
         for (var i = 0; i < this.currentCubes.length; i++) {
                var randomColor = this.cubeColors[Math.floor(Math.random()*this.cubeColors.length)];
                this.currentCubes[i].sprite.initWithFile(randomColor.texture);
                this.currentCubes[i].sprite.type = randomColor.color;
        }
    },
    mix: function(){ // купить перемешивание поля
        for (var i = 0; i < this.currentCubes.length; i++) {
               var randomColor = this.cubeColors[Math.floor(Math.random()*this.cubeColors.length)];
               this.currentCubes[i].sprite.initWithFile(randomColor.texture);
               this.currentCubes[i].sprite.type = randomColor.color;
       }
   },
    createPlusScore: function(num, position){
        var plusScore = new cc.LabelBMFont ("+ " + num  , res.LabelBMFont_png);
        plusScore.setPosition( cc.p(position.x + 20, position.y + 20));
        plusScore.color = cc.color.WHITE;
        plusScore.setScale(0.5);
        this.addChild(plusScore, 300);
        this.scheduleOnce(function(){
            this.removeChild(plusScore);
            }, 1);
    },

    createPlusCoins: function(num){
        var n = Math.floor(num/10)+1;
        var partOfCoins = Math.floor(num/n);
        this.schedule(function(){
            if(num< 10) {
                totalCoinsText.setString("" + coins + num);
                coins += num; 
            }
            coins += partOfCoins;
            totalCoinsText.setString("" + coins);
            num -= partOfCoins;}, 0.1, n, 0 );
    },

    createFire: function (sprite){
        var emitter = cc.ParticleSun.create();
        this.addChild(emitter,305);
        var myTexture = cc.textureCache. addImage(res.pink_png);
        emitter.setTexture(myTexture);
        emitter.setStartSize(2);
        emitter.setEndSize(4);
        emitter.setPosition(sprite.getPosition());
        this.scheduleOnce(function(){
                this.removeChild(sprite);
        }, 0.5);
        this.scheduleOnce(function(){
                this.removeChild(emitter);
        }, 0.7);
    },

    addCoins: function(num){
        coins += num;
        totalCoinsText.setString("" +coins);
    },
        
    sliderUpdate: function(){
        sliderLevelNumText.setString("Level: " + level.num );
        slider.percent = (this.levelScore/level.target)*100;
        slider.setPercent(slider.percent); 
    },

    touchHandler: function(arr){
        if(this.field.isClicked && mode == "game"&& this.bombClone.isChosen == false){
            this.field.isClicked = false;  
            for(var i = 81; i< arr.length; i++){
                if(arr[i] && cc.rectContainsPoint(arr[i].sprite.getBoundingBox( ), this.field.currentTouch)) {
                    var sameColorNeighbor = [arr[i],];
                    function seachSame(arr, i){// [this.currentCubes, i]
                        if ((i + 1) % 9 &&  arr[i + 1].sprite.type == arr[i].sprite.type && sameColorNeighbor.includes(arr[i + 1]) == false){// проверяем соседа справа
                            sameColorNeighbor.push(arr[i + 1])
                            seachSame(arr, i+1)}
                        if ((i) % 9 &&  arr[i - 1].sprite.type == arr[i].sprite.type && sameColorNeighbor.includes(arr[i - 1]) == false){
                            sameColorNeighbor.push(arr[i - 1])
                            seachSame(arr, i-1)} //проверяем соседа слева
                        if (i > 89 &&  arr[i - 9].sprite.type == arr[i].sprite.type && sameColorNeighbor.includes(arr[i -9]) == false){
                            sameColorNeighbor.push(arr[i - 9])
                            seachSame(arr, i-9)} //проверяем соседа сверху
                        if (i < arr.length - 9 &&  arr[i + 9].sprite.type == arr[i].sprite.type && sameColorNeighbor.includes(arr[i + 9]) == false){
                            sameColorNeighbor.push(arr[i + 9])
                            seachSame(arr, i+9)} //проверяем соседа снизу   
                    }
                    seachSame(arr, i);
                    if (sameColorNeighbor.length < 2) {
                        var num = this.currentCubes.indexOf(sameColorNeighbor[0]);
                        this.field.isRebuilding= true;
                        arr[num].sprite.currentAction = arr[num].sprite.swayPush;
                        arr[num].sprite.runAction(arr[num].sprite.currentAction);
                        return;}
                    this.movies--;
                    this.levelScore += sameColorNeighbor.length*sameColorNeighbor.length;
                    this.totalScore += sameColorNeighbor.length*sameColorNeighbor.length;
                    this.createPlusScore(sameColorNeighbor.length + "x" + sameColorNeighbor.length, sameColorNeighbor[0].position);
                    this.sliderUpdate();  
                            
                    if(this.levelScore >= level.target){
                        this.createPlusCoins(this.movies*20 + (this.levelScore - level.target));
                        this.levelScore = 0;
                        level.num++;
                        level.target+= 50;
                        mode = "levelMenu";
                        var winMenuLayer = new WinMenuLayer();
                        this.getParent().addChild(winMenuLayer, 1);
                        this.movies = this.initMovies;
                        this.sliderUpdate();
                    }
                               
                    if(this.movies == 0){
                        this.mix.bind(this)
                        level.num = 1;
                        level.target = 150;
                        this.addCoins(-coins);
                        this.totalScore = 0;
                        mode = "faillMenu";
                        var faillMenuLayer = new FailMenuLayer();
                        this.getParent().addChild(faillMenuLayer, 1);
                        this.levelScore = 0;
                        this.movies = this.initMovies;
                        this.sliderUpdate();
                    }
                    levelScoreText.setString(this.levelScore + " / " + level.target); 
                    totalScoreText.setString("" +  this.totalScore); 
                    levelMoviesText.setString("" +this.movies);
                    for(var j = 0; j<  sameColorNeighbor.length; j++){
                        var num = this.currentCubes.indexOf(sameColorNeighbor[j]);
                        this.removeChild(sameColorNeighbor[j].sprite);
                        arr[num].sprite = null;  
                    } 
                    this.dumping(arr);
                    for(var i = 0; i< arr.length; i++){
                        if(arr[i].sprite ==null) {
                            var randomColor = this.cubeColors[Math.floor(Math.random()*this.cubeColors.length)];
                            arr[i].sprite = new this.Cube (randomColor.texture);
                            arr[i].sprite.type = randomColor.color;
                            arr[i].sprite.texture = randomColor.texture;
                            arr[i].sprite.setPosition(arr[i].position);
                            this.addChild(arr[i].sprite, arr[i].zIndex);
                        }    
                    }
                    this.field.currentTouch = null;
                    return;
                }
            };
        }    
    },

    bombHandler: function(arr){
        if(this.field.isClicked && mode == "game"&& this.bombClone.isChosen){
            this.field.isClicked = false;
            this.bombClone.isChosen = false;
            this.bombClone.setPosition(this.bomb.getPosition());
                    
            for(var i = 81; i< arr.length; i++){
                if(arr[i] && cc.rectContainsPoint(arr[i].sprite.getBoundingBox( ), this.field.currentTouch)) {
                    var explosionGroup = [arr[i],];
                        function seachExplosionGroup(arr, i){
                            if ((i + 1) % 9 ){// если мы не у правого края
                                explosionGroup.push(arr[i + 1]);
                                if(i > 90) explosionGroup.push(arr[i - 8]);
                                if (i < arr.length - 9) explosionGroup.push(arr[i + 10]);
                            }
                            if ((i + 2) % 9 ){
                                explosionGroup.push(arr[i + 2]);}    
                            if ((i) % 9){// если мы не у левого края
                                explosionGroup.push(arr[i - 1])
                                if(i > 90) explosionGroup.push(arr[i - 10]);
                                if (i < arr.length - 9) explosionGroup.push(arr[i + 8]);
                            }
                            if ((i-1) % 9){// если мы не у левого края
                                 explosionGroup.push(arr[i - 2])}  
                            if (i > 90){
                                explosionGroup.push(arr[i - 9])} //проверяем соседа сверху
                            if (i > 99){
                                explosionGroup.push(arr[i - 18])} 
                            if (i < arr.length - 9){
                                explosionGroup.push(arr[i + 9])}
                            if (i < arr.length - 18){
                                explosionGroup.push(arr[i + 18])}   
                            }
                            seachExplosionGroup (arr, i);
                        
                            this.levelScore += Math.floor((explosionGroup.length/2)) * explosionGroup.length;
                            this.totalScore += Math.floor((explosionGroup.length/2))*explosionGroup.length;
                            this.createPlusScore(Math.floor((explosionGroup.length/2)) + "x" + explosionGroup.length, explosionGroup[0].position);
                            this.sliderUpdate();
                            
                            if(this.levelScore >= level.target){
                                this.createPlusCoins(this.movies*20 + (this.levelScore - level.target));
                                this.levelScore = 0;
                                level.num++;
                                level.target+= 50;
                                mode = "levelMenu";
                                var winMenuLayer = new WinMenuLayer();
                                this.getParent().addChild(winMenuLayer, 1);
                                this.movies = this.initMovies;
                                this.sliderUpdate(); 
                            }
                            levelScoreText.setString(this.levelScore + " / " + level.target); 
                            totalScoreText.setString("" +  this.totalScore); 
                            for(var j = 0; j<  explosionGroup.length; j++){
                                var num = this.currentCubes.indexOf(explosionGroup[j]);
                                explosionGroup[j].sprite.runAction(explosionGroup[j].sprite.fadeOutAction);
                                this.createFire(explosionGroup[j].sprite);
                                arr[num].sprite = null;
                            } 
                            this.scheduleOnce(function(){
                                this.dumping(arr);
                                for(var i = 0; i< arr.length; i++){
                                    if(arr[i].sprite ==null) {
                                        var randomColor = this.cubeColors[Math.floor(Math.random()*this.cubeColors.length)];
                                        arr[i].sprite = new this.Cube (randomColor.texture);
                                        arr[i].sprite.type = randomColor.color;
                                        arr[i].sprite.texture = randomColor.texture;
                                        arr[i].sprite.setPosition(arr[i].position);
                                        this.addChild(arr[i].sprite, arr[i].zIndex);
                                    }    
                                } 
                            }, 0.52)
                            this.field.currentTouch = null;
                            return;
                }
            };
        }    
    },

    dumping: function(arr){
        this.field.isRebuilding= true;
        for(var n = 0; n< 9; n++) {
            for(var i = 0; i< arr.length-9; i++){
                if(arr[i].sprite==null) continue;
                if(arr[i + 9].sprite==null){
                    arr[i + 9].sprite = arr[i].sprite;
                    arr[i + 9].sprite.setLocalZOrder(arr[i + 9].zIndex)
                    arr[i+9].sprite.fallHeight++;
                    arr[i].sprite = null;
                }
            }
        }
        for(var i = 0; i< arr.length; i++){
            if(arr[i].sprite && arr[i].sprite.fallHeight){
                var action = new cc.MoveTo( 0.25*arr[i].sprite.fallHeight,arr[i].position);
                var actionAnimation = new cc.EaseBounceOut(action);
                arr[i].sprite.currentAction = actionAnimation;
                arr[i].sprite.runAction(arr[i].sprite.currentAction); 
                arr[i].sprite.fallHeight=0;
            }
        }
    },

     rebuildingCheck: function(arr){
        if (this.field.isRebuilding == false)return;
            for(var i = 0; i< arr.length; i++){
                if(arr[i].sprite && arr[i].sprite.currentAction && arr[i].sprite.currentAction.isDone() == false) return;
            }
            this.field.isRebuilding=false;    
    },
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () { 
        this._super();

        var levelMenuLayer = new LevelMenuLayer();
        this.addChild(levelMenuLayer, 1);

        var gameLayer = new GameLayer();
        this.addChild(gameLayer);
    }
});

