var mode = "levelMenu"; // "game", "failMenu", "winMenu"
var level = {
    num: 1,
    target: 150
};
var coins = 0;

var GameLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        // 1. super init first
        this._super();
        var size = cc.winSize;
       
        this.totalScore = 0;       
        this.score = 0;
        this.initMovies = 10
        this.movies = this.initMovies;
                
        this.field = new cc.Sprite(res.field_png);
        this.field.setScale(0.285);
        this.field.setPosition(cc.p(size.width*0.25, size.height*0.5));
        this.addChild(this.field);
        this.field.isRebuilding= false;
        this.field.currentTouch = null;
        this.field.isTouched = false;
        this.field.isClicked = false;
        this.field.rect = this.field.getBoundingBox( );
        var leftFieldCorner = cc.p(this.field.rect.x+10, this.field.rect.y + this.field.rect.height*2 - 40 ); //*2

        var fieldFrame = new cc.Sprite(res.fieldFrame_png);
        fieldFrame.setScale(this.field.getScale());
        fieldFrame.setPosition(this.field.getPosition());
        fieldFrame.rect = fieldFrame.getBoundingBox( );
        this.addChild(fieldFrame, 300);

        this.totalScorePanel =  new cc.Sprite(res.button2_png);
        this.totalScorePanel.setScale(0.3, 0.2);
        this.totalScorePanel.setPosition(cc.p(fieldFrame.getPosition().x  + fieldFrame.rect.width*1.2, fieldFrame.rect.y + fieldFrame.rect.height));
        this.totalScorePanel.rect = this.totalScorePanel .getBoundingBox( );
        this.addChild(this.totalScorePanel );

        this.totalScorePanel.text = new cc.LabelBMFont ("" + this.totalScore, res.LabelBMFont_png);
        this.totalScorePanel.text.setPosition(this.totalScorePanel.getPosition());
        this.totalScorePanel.text.setScale(0.6);
        this.addChild(this.totalScorePanel.text, 1);
        //
        this.coinsPanel =  new cc.Sprite(res.button_png);
        this.coinsPanel.setScale(0.3, 0.2);
        this.coinsPanel.setPosition(cc.p(fieldFrame.getPosition().x  + fieldFrame.rect.width*0.8, fieldFrame.rect.y + fieldFrame.rect.height));
        this.coinsPanel.rect = this.coinsPanel.getBoundingBox( );
        this.addChild(this.coinsPanel);

        this.coinsPanel.coin =  new cc.Sprite(res.coin_png);
        this.coinsPanel.coin.setScale(0.2, 0.2);
        this.coinsPanel.coin.setPosition(cc.p(this.coinsPanel.rect.x + this.coinsPanel.rect.width*0.1 , this.coinsPanel.getPosition().y));
        this.addChild(this.coinsPanel.coin);

        this.coinsPanel.text = new cc.LabelBMFont ("" + coins, res.LabelBMFontYellow_png);
        this.coinsPanel.text.setPosition(this.coinsPanel.getPosition());
        this.coinsPanel.text.setScale(0.6);
        this.addChild(this.coinsPanel.text, 1);

        //
        this.panelScore =  new cc.Sprite(res.panelScore_png);
        this.panelScore.setScale(0.2);
        this.panelScore.setPosition(cc.p(fieldFrame.getPosition().x  + fieldFrame.rect.width*1.0, fieldFrame.rect.y + fieldFrame.rect.height*0.45));
        this.panelScore.rect = this.panelScore.getBoundingBox( );
        this.addChild(this.panelScore);

        this.panelScore.heading = new cc.LabelBMFont ("Movies", res.LabelBMFont_png);
        this.panelScore.heading.setPosition( cc.p(this.panelScore.getPosition().x, this.panelScore.getPosition().y + this.panelScore.rect.height*0.5) );
        this.panelScore.heading.setScale(0.7);
        this.addChild(this.panelScore.heading, 1);

        this.labelScore = new cc.LabelBMFont ("Score:"  , res.LabelBMFont_png,  -1,  cc.TEXT_ALIGNMENT_CENTER, cc.p(0.5,0.5));
        this.labelScore.setPosition( cc.p(this.panelScore.getPosition().x, this.panelScore.getPosition().y - this.panelScore.rect.height/5) );
        this.labelScore.setScale(0.5);
        this.addChild(this.labelScore, 1);

        this.labelScoreNum = new cc.LabelBMFont (this.score + " / " + level.target , res.LabelBMFont_png,  -1,  cc.TEXT_ALIGNMENT_CENTER, cc.p(0.5,0.5));
        this.labelScoreNum.setPosition( cc.p(this.panelScore.getPosition().x, this.panelScore.getPosition().y - this.panelScore.rect.height/3) );
        this.labelScoreNum.setScale(0.5);
        this.addChild(this.labelScoreNum, 1);

        this.labelMovies= new cc.LabelBMFont ("" +this.movies, res.LabelBMFont_png,  -1,  cc.TEXT_ALIGNMENT_CENTER, cc.p(0.5,0.5));
        this.labelMovies.setPosition( cc.p(this.panelScore.getPosition().x, this.panelScore.getPosition().y + this.panelScore.rect.height/10) );
        this.labelMovies.setScale(1);
        this.addChild(this.labelMovies, 1);

        var sliderField = new cc.Sprite(res.menuField_png);
        sliderField.setScale(0.25, 0.3);
        sliderField.setPosition( cc.p(fieldFrame.getPosition().x  + fieldFrame.rect.width*1.0, fieldFrame.rect.y + fieldFrame.rect.height*0.85 ) );
        sliderField.rect = sliderField.getBoundingBox( );
        this.addChild(sliderField, 300);

        this.levelLabel = new cc.LabelBMFont ("Level: " + level.num , res.LabelBMFont_png);
                this.levelLabel.setPosition( cc.p(sliderField.getPosition().x , sliderField.getPosition().y + sliderField.rect.height*0.23) );
                this.levelLabel.setScale(0.7);
                this.addChild(this.levelLabel, 301);

        this.slider = new ccui.Slider();
        this.slider.loadBarTexture(res.roundedRectangleBlue_png);
        //slider.loadSlidBallTextures(res.roundedRectangleGreen_png, res.roundedRectangleGreen_png,"");
        this.slider.loadProgressBarTexture(res.roundedRectangleGreen_png);
        this.slider.setPosition( cc.p(sliderField.getPosition().x , sliderField.getPosition().y - sliderField.rect.height*0.25) );
        this.slider.setScale(0.25);
        this.slider.percent = this.score/level.target;
        this.slider.setPercent(this.slider.percent);
        this.addChild(this.slider, 301);



        var bonusesItemCenter = new cc.MenuItemImage(res.bonusField_png, res.bonusField_png, ()=> {
            if(coins < this.bonusBombsCost || this.bonusBombClone.isChosen) return;      
            this.addCoins(-this.bonusBombsCost);  
            this.bonusBombClone.isChosen =true});  
        bonusesItemCenter.setPosition( cc.p(fieldFrame.getPosition().x  + fieldFrame.rect.width*1.0, fieldFrame.rect.y + fieldFrame.rect.height*0.08 ));
        bonusesItemCenter.setScale(0.2);

        this.bonusBomb = new cc.Sprite (res.bomb_png);
        this.bonusBomb.setPosition( cc.p(bonusesItemCenter.getPosition().x, bonusesItemCenter.getPosition().y + bonusesItemCenter.getBoundingBox().height*0.2));
        this.bonusBomb.setScale(0.17);
        this.addChild(this.bonusBomb, 1);

        this.bonusBombClone = new cc.Sprite (res.bomb_png);
        this.bonusBombClone.setScale(0.17);
        this.bonusBombClone.setPosition(this.bonusBomb.getPosition());
            this.addChild(this.bonusBombClone, 305);

        this.bonusBombClone.isChosen =false;
        this.bonusBombsCost = 100;
        this.labelBombCost = new cc.LabelBMFont ("" + this.bonusBombsCost, res.LabelBMFont_png);
        this.labelBombCost.setPosition( cc.p(bonusesItemCenter.getPosition().x - bonusesItemCenter.getBoundingBox().width*0.14, bonusesItemCenter.getPosition().y - bonusesItemCenter.getBoundingBox().height*0.24));
        this.labelBombCost.setScale(0.35);
        this.addChild(this.labelBombCost, 1);

        this.bonusesItemLeft = new cc.MenuItemImage(res.bonusField_png, res.bonusField_png,  ()=>{
            if(coins < this.bonusMoveCost )return;
            this.addCoins(-this.bonusMoveCost);
            this.movies++; 
            this.labelMovies.setString("" + this.movies); 
        }
        );  
        this.bonusesItemLeft.setPosition( cc.p(bonusesItemCenter.getPosition().x - fieldFrame.rect.width*0.2, bonusesItemCenter.getPosition().y));
        this.bonusesItemLeft.setScale(0.2);
        this.bonusLabelMov = new cc.LabelBMFont ("+move ", res.LabelBMFont_png);
        this.bonusLabelMov.setPosition( cc.p(this.bonusesItemLeft.getPosition().x, this.bonusesItemLeft.getPosition().y + this.bonusesItemLeft.getBoundingBox().height*0.2) );
        this.bonusLabelMov.setScale(0.4);
        this.addChild(this.bonusLabelMov, 1);
        this.bonusMoveCost = 25;
        this.bonusLabelMovCost = new cc.LabelBMFont ("" + this.bonusMoveCost, res.LabelBMFont_png);
        this.bonusLabelMovCost.setPosition( cc.p(this.bonusesItemLeft.getPosition().x - this.bonusesItemLeft.getBoundingBox().width*0.14, this.bonusesItemLeft.getPosition().y - this.bonusesItemLeft.getBoundingBox().height*0.24));
        this.bonusLabelMovCost.setScale(0.35);
        this.addChild(this.bonusLabelMovCost, 1);


        this.bonusesItemRight = new cc.MenuItemImage(res.bonusField_png, res.bonusField_png, ()=>{ 
            if(coins < this.bonusMixCost) return;
            this.addCoins(-this.bonusMixCost);
            
            for (var i = 0; i < this.currentCubes.length; i++) {
                var randomColor = this.cubeColors[Math.floor(Math.random()*this.cubeColors.length)];
                this.currentCubes[i].sprite.initWithFile(randomColor.texture);
                this.currentCubes[i].sprite.type = randomColor.color;
            }
        });
        this.bonusesItemRight.setPosition( cc.p(bonusesItemCenter.getPosition().x + fieldFrame.rect.width*0.2, bonusesItemCenter.getPosition().y));
        this.bonusesItemRight.setScale(0.2);
        this.bonusLabelMix = new cc.LabelBMFont ("mix! ", res.LabelBMFont_png);
        this.bonusLabelMix.setPosition( cc.p(this.bonusesItemRight.getPosition().x, this.bonusesItemRight.getPosition().y + this.bonusesItemRight.getBoundingBox().height*0.2) );
        this.bonusLabelMix.setScale(0.4);
        this.addChild(this.bonusLabelMix, 1);
        this.bonusMixCost = 50;
        this.bonusLabelMixCost = new cc.LabelBMFont ("" + this.bonusMixCost, res.LabelBMFont_png);
        this.bonusLabelMixCost.setPosition(cc.p(this.bonusesItemRight.getPosition().x - this.bonusesItemRight.getBoundingBox().width*0.14, this.bonusesItemRight.getPosition().y - this.bonusesItemRight.getBoundingBox().height*0.24));
        this.bonusLabelMixCost.setScale(0.35);
        this.addChild(this.bonusLabelMixCost, 1);





        var bonusMenu = new cc.Menu(this.bonusesItemLeft, bonusesItemCenter, this.bonusesItemRight);
        bonusMenu.setPosition( cc.p(0, 0));
        this.addChild(bonusMenu);

        this.bonusLabel= new cc.LabelBMFont ("Bonuses", res.LabelBMFont_png);
        this.bonusLabel.setPosition( cc.p(bonusesItemCenter.getPosition().x, bonusesItemCenter.getPosition().y + bonusesItemCenter.rect.height*0.7) );
        this.bonusLabel.setScale(0.7);
        this.addChild(this.bonusLabel, 1);

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
            // this.setAnchorPoint(cc.p(0, 1));
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

        var emitter = cc.ParticleExplosion.create();
        
            var myTexture = cc.textureCache. addImage(res.green_png);
        emitter.setTexture(myTexture, cc.rect(0,0,20,20));
        emitter.setLife(20);
            emitter.setTotalParticles(20);
            emitter.setEndSpinVar(360);
            emitter.setStartSpinVar(0);
        //  emitter.setRotatePerSecond(360);
            emitter.setStartSize(10);
            emitter.setEndSize(20);
            emitter.setPosVar(cc.p(20,20));
            emitter.setPosition(cc.p(200,200));
        
        this.addChild(emitter,200);

        this.currentCubes = [];
        var indent = 0;
        for (var i = 0; i < 18; i++) {// 9 на 18
            for (var j = 0; j < 9; j++) {
            var randomColor = this.cubeColors[Math.floor(Math.random()*this.cubeColors.length)];
            var cell = {};
            cell.sprite = new this.Cube (randomColor.texture);
            cell.sprite.type = randomColor.color;
        // cell.sprite.texture = randomColor.texture;
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
            swallowTouches: true, // поглотить событие и не передавать другим EventListener
            onTouchBegan: function (touch, event) {
            
            return true;
            },
            onTouchEnded: function (touch, event) {
            
            var target = event.getCurrentTarget();
            if (target.isClicked || target.isDumping) return;
            var locationInNode = target.convertToNodeSpace(touch.getLocation());
            var s = target.getContentSize();
            var rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    // target.runAction( nodeAction );
                    target.currentTouch = touch.getLocation();
                    target.isClicked= true;
                }  
                cc.log('Touch end');
            },
            
            });
            var listener2 = cc.EventListener.create({
                event: cc.EventListener.MOUSE,
                swallowTouches: true,
        
                onMouseMove: function (event) {

                var target = event.getCurrentTarget();
                if(target.isChosen == false) return;
                cc.log(target.isChosen);
                target.setPosition(event.getLocation());
                return true;
                },
            
                });
            cc.eventManager.addListener(listener, this.field);
            cc.eventManager.addListener(listener2, this.bonusBombClone);
            this.schedule(this.functionUpdate1, 0.006);

                return true;
            },

            functionUpdate1: function(dt) {
            this.touchHandler(this.currentCubes);
            this.bombHandler(this.currentCubes);
            this.dumpingCheck(this.currentCubes);
            },
        
                
            play: function(){
                this.mode = "game";
                this.background.setLocalZOrder(-1);
            },

            createPlusScore: function(num, position){
        var plusScore = new cc.LabelBMFont ("+ " + num  , res.LabelBMFont_png,  -1,  cc.TEXT_ALIGNMENT_CENTER, cc.p(0.5,0.5));
                    plusScore.setPosition( cc.p(position.x + 20, position.y + 20) );
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
                this.schedule( ()=>{
                if(num< 10) {
                    this.coinsPanel.text.setString("" + coins + num);
                    coins += num; 
                }
                
                coins += partOfCoins;
                this.coinsPanel.text.setString("" + coins);
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
            this.coinsPanel.text.setString("" +coins);
        },
            touchHandler: function(arr){
                
                if(this.field.isClicked && mode == "game"&& !this.bonusBombClone.isChosen){
                    this.field.isClicked = false;  
                    for(var i = 81; i< arr.length; i++){
                        if(arr[i] && cc.rectContainsPoint(arr[i].sprite.getBoundingBox( ), this.field.currentTouch)) {
                            var sameColorNeighbor = [arr[i],];
                            function seachSame(arr, i){// [this.currentCubes, i]
                                if ((i + 1) % 9 &&  arr[i + 1].sprite.type == arr[i].sprite.type && !sameColorNeighbor.includes(arr[i + 1])){// проверяем соседа справа
                                    sameColorNeighbor.push(arr[i + 1])
                                    seachSame(arr, i+1)}
                                if ((i) % 9 &&  arr[i - 1].sprite.type == arr[i].sprite.type && !sameColorNeighbor.includes(arr[i - 1])){
                                sameColorNeighbor.push(arr[i - 1])
                                seachSame(arr, i-1)} //проверяем соседа слева
                                if (i > 90 &&  arr[i - 9].sprite.type == arr[i].sprite.type && !sameColorNeighbor.includes(arr[i -9])){
                                    sameColorNeighbor.push(arr[i - 9])
                                /seachSame(arr, i-9)} //проверяем соседа сверху
                                if (i < arr.length - 9 &&  arr[i + 9].sprite.type == arr[i].sprite.type && !sameColorNeighbor.includes(arr[i + 9])){
                                sameColorNeighbor.push(arr[i + 9])
                                seachSame(arr, i+9)} //проверяем соседа снизу   
                            }
                            seachSame(arr, i);
                            if (sameColorNeighbor.length < 2) {
                                var num = this.currentCubes.indexOf(sameColorNeighbor[0]);
                                arr[num].sprite.currentAction = arr[num].sprite.swayPush;
                                arr[num].sprite.runAction(arr[num].sprite.currentAction);
                                this.field.isRebuilding= true;
                                return;}
                            if (sameColorNeighbor.length > 9) {
                                this.createPlusCoins(sameColorNeighbor.length*sameColorNeighbor.length)
                                //this.addCoins (sameColorNeighbor.length*sameColorNeighbor.length);
                            }   

                            this.movies--;
                            this.score += sameColorNeighbor.length*sameColorNeighbor.length;
                            this.totalScore += sameColorNeighbor.length*sameColorNeighbor.length;
                            this.createPlusScore(sameColorNeighbor.length + "x" + sameColorNeighbor.length, sameColorNeighbor[0].position);
                            this.slider.percent = (this.score/level.target)*100;
                            this.slider.setPercent(this.slider.percent);   
                            
                            if(this.score >= level.target){
                                    level.num++;
                                    this.createPlusCoins((this.initMovies - this.movies)*20 + (level.target - this.score));
                                // this.addCoins ((this.initMovies - this.movies)*20 + (level.target - this.score));
                                    level.target+= 50;
                                    mode = "levelMenu";
                                    var winMenuLayer = new WinMenuLayer();
                                    this.getParent().addChild(winMenuLayer, 1);
                                    this.score = 0;
                                    this.movies = this.initMovies;
                                    this.levelLabel.setString("Level: " + level.num );
                                    this.slider.percent = (this.score/level.target)*100;
                                    this.slider.setPercent(this.slider.percent); 

                                }
                                if(this.movies == 0){
                                    level.num =1;
                                    level.target = 150;
                                    this.addCoins(-coins);
                                    this.totalScore = 0;
                                    mode = "faillMenu";
                                    var faillMenuLayer = new FailMenuLayer();
                                    this.getParent().addChild(faillMenuLayer, 1);
                                    this.score = 0;
                                    this.movies = this.initMovies;
                                    this.levelLabel.setString("Level: " + level.num );
                                    this.slider.percent = (this.score/level.target)*100;
                                    this.slider.setPercent(this.slider.percent); 
                                }
                            this.labelScoreNum.setString(this.score + " / " + level.target); 
                            this.totalScorePanel.text.setString("" +  this.totalScore); 
                            this.labelMovies.setString("" +this.movies);
                            for(var j = 0; j<  sameColorNeighbor.length; j++){
                                
                                var num = this.currentCubes.indexOf(sameColorNeighbor[j]);
                                // this.createExplosion(this.currentCubes[num]);
                                this.removeChild(sameColorNeighbor[j].sprite);
                                arr[num].sprite = null;  
                            } 
                        
                        // for(var i = 0; i< 9; i++){
                            this.dumping(arr);
                            //}
                        
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
                if(this.field.isClicked && mode == "game"&& this.bonusBombClone.isChosen){
                    this.field.isClicked = false;
                    this.bonusBombClone.isChosen = false;
                    this.bonusBombClone.setPosition(this.bonusBomb.getPosition());
                    
                    for(var i = 81; i< arr.length; i++){
                        if(arr[i] && cc.rectContainsPoint(arr[i].sprite.getBoundingBox( ), this.field.currentTouch)) {
                            var explosionGroup = [arr[i],];
                            function seachExplosionGroup(arr, i){// [this.currentCubes, i]
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
                        
                            this.score += explosionGroup.length*explosionGroup.length;
                            this.totalScore += explosionGroup.length*explosionGroup.length;
                            this.createPlusScore(explosionGroup.length + "x" + explosionGroup.length, explosionGroup[0].position);
                            this.slider.percent = (this.score/level.target)*100;
                            this.slider.setPercent(this.slider.percent);   
                            
                            if(this.score >= level.target){
                                    level.num++;
                                    level.target += 50;
                                    mode = "levelMenu";
                                    var levelMenuLayer = new LevelMenuLayer();
                                    this.getParent().addChild(levelMenuLayer, 1);
                                    this.score = 0;
                                    this.movies = this.initMovies;
                                    this.levelLabel.setString("Level: " + level.num );
                                    this.slider.percent = (this.score/level.target)*100;
                                    this.slider.setPercent(this.slider.percent); 
                                }
                                
                            this.labelScoreNum.setString(this.score + " / " + level.target); 
                            this.totalScorePanel.text.setString("" +  this.totalScore); 
                            for(var j = 0; j<  explosionGroup.length; j++){
                                
                                var num = this.currentCubes.indexOf(explosionGroup[j]);
                                explosionGroup[j].sprite.runAction(explosionGroup[j].sprite.fadeOutAction);
                                this.createFire(explosionGroup[j].sprite);
                                    
                                    arr[num].sprite = null;
                                
                            } 
                            // arr[num].sprite = null;
                            //  this.dumping(arr);
                            this.scheduleOnce(()=>{
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

            movesPlus: function(){
                ()=>{
                    if(this.bonusMoves==0)return
                    this.bonusMoves--;
                    this.movies++; 
                    this.labelMovies.setString("" + this.movies);
                    this.bonusLabelMovNum.setString("" + this.bonusMoves );  
                }
                
            },

            mixField: function(){
                ()=>{
                if(this.bonusMix==0) return;
                this.currentCubes = [];
                var indent = 0;
                for (var i = 0; i < 18; i++) {// 9 на 18
                    for (var j = 0; j < 9; j++) {
                    var randomColor = this.cubeColors[Math.floor(Math.random()*this.cubeColors.length)];
                    var cell = {};
                    cell.sprite = new this.Cube (randomColor.texture);
                    cell.sprite.type = randomColor.color;
                    cell.sprite.texture = randomColor.texture;
                    if(i ==9){indent=50};
                    cell.position = cc.p(leftFieldCorner.x + j*cell.sprite.cubeWidth + cell.sprite.cubeWidth/2 , leftFieldCorner.y - i*cell.sprite.cubeHeight - cell.sprite.cubeHeight/2 - indent);
                    cell.zIndex = 162-i;
                    cell.sprite.setPosition(cell.position);
                    this.currentCubes.push(cell);
                    this.addChild(cell.sprite, cell.zIndex);
                    }
                }     
                }
            
            },

            createExplosion(sprite){
            var emitter = cc.ParticleExplosion.create();
        
            
            emitter.setTexture(sprite.texture);
        emitter.setLife(1);
        emitter.setLifeVar(0)
            emitter.setTotalParticles(20);
            emitter.setEndSpinVar(360);
            emitter.setStartSpinVar(0);
        //  emitter.setRotatePerSecond(360);
            emitter.setStartSize(10);
            emitter.setEndSize(20);
            emitter.setPosVar(cc.p(20,20));
            emitter.setPosition(cc.p(sprite.getPosition().x + sprite.rect.width/2, sprite.getPosition().y - sprite.rect.height/2));
            emitter.setGravity(cc.p(0,-100));
        
        this.addChild(emitter,200);
        },

            dumping: function(arr){
                this.field.isRebuilding= true;
                for(var n = 0; n< 9; n++)
                { for(var i = 0; i< arr.length-9; i++){
                    if(arr[i].sprite==null) continue;
                    if(arr[i + 9].sprite==null){
                    arr[i + 9].sprite = arr[i].sprite;
                    arr[i + 9].sprite.setLocalZOrder(arr[i + 9].zIndex)
                    //var action = this.nodeAction.clone();
                    // arr[i+9].runAction(action);
                    arr[i+9].sprite.fallHeight++;
                        arr[i].sprite = null;
                    }
                }}
                for(var i = 0; i< arr.length; i++){
                    if(arr[i].sprite && arr[i].sprite.fallHeight){
                    // var action = new cc.MoveBy( 0.25*arr[i].sprite.fallHeight, cc.p(0, -arr[i].sprite.cubeHeight*arr[i].sprite.fallHeight));
                    var action = new cc.MoveTo( 0.25*arr[i].sprite.fallHeight,arr[i].position);
                    // var actionAnimation = new cc.EaseBounceOut(action);
                    var actionAnimation = new cc.EaseBounceOut(action);
                    arr[i].sprite.currentAction = actionAnimation;
                    arr[i].sprite.runAction(arr[i].sprite.currentAction); 

                    arr[i].sprite.fallHeight=0;
                    }
                }
                
            },
            dumpingCheck: function(arr){
                if (!this.field.isDumping)return;
                for(var i = 0; i< arr.length; i++){
                    if(arr[i].sprite.currentAction && !arr[i].sprite.currentAction.isDone()) return;
                }
                this.field.isDumping=false;    
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

