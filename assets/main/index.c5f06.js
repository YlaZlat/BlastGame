window.__require=function e(t,i,s){function o(l,h){if(!i[l]){if(!t[l]){var r=l.split("/");if(r=r[r.length-1],!t[r]){var c="function"==typeof __require&&__require;if(!h&&c)return c(r,!0);if(n)return n(r,!0);throw new Error("Cannot find module '"+l+"'")}l=r}var a=i[l]={exports:{}};t[l][0].call(a.exports,function(e){return o(t[l][1][e]||e)},a,a.exports,e,t,i,s)}return i[l].exports}for(var n="function"==typeof __require&&__require,l=0;l<s.length;l++)o(s[l]);return o}({BonuseMove:[function(e,t,i){"use strict";cc._RF.push(t,"f81bfr9eghNM5oE9S2+eUu/","BonuseMove");var s=e("passing");cc.Class({extends:cc.Component,properties:{passing:{default:null,type:s},cost:50,costDisplay:{default:null,type:cc.Label}},onButtonClick:function(){this.passing.coins<this.cost||(this.passing.changeMovies(1),this.passing.changeCoins(-this.cost))},onMouseDown:function(){if(this.passing.coins<this.cost)return this.costDisplay.node.color=cc.Color.RED,this.node.on("mouseup",this.onMouseUp,this),void this.node.on("mouseleave",this.onMouseUp,this)},onMouseUp:function(){this.costDisplay.node.color=cc.Color.WHITE,this.node.off("mouseup",this.onMouseUp,this),this.node.off("mouseleave",this.onMouseUp,this)},start:function(){this.node.on("mousedown",this.onMouseDown,this),this.costDisplay.string=this.cost}}),cc._RF.pop()},{passing:"passing"}],"Bonuses Mix":[function(e,t,i){"use strict";cc._RF.push(t,"8e309Dkw89Ck6dnM+IzomYQ","Bonuses Mix");var s=e("field"),o=e("passing");cc.Class({extends:cc.Component,properties:{field:{default:null,type:s},passing:{default:null,type:o},cost:70,costDisplay:{default:null,type:cc.Label}},onButtonClick:function(){this.passing.coins<this.cost||(this.passing.changeCoins(-this.cost),this.field.mix(),cc.log("Mix!"))},onMouseDown:function(){if(this.passing.coins<this.cost)return this.costDisplay.node.color=cc.Color.RED,this.node.on("mouseup",this.onMouseUp,this),void this.node.on("mouseleave",this.onMouseUp,this)},onMouseUp:function(){this.costDisplay.node.color=cc.Color.WHITE,this.node.off("mouseup",this.onMouseUp,this),this.node.off("mouseleave",this.onMouseUp,this)},start:function(){this.node.on("mousedown",this.onMouseDown,this),this.costDisplay.string=this.cost}}),cc._RF.pop()},{field:"field",passing:"passing"}],bonuseBomb:[function(e,t,i){"use strict";cc._RF.push(t,"f734cfQ6WFLCZVSocm3SFlQ","bonuseBomb");var s=e("field"),o=e("passing");cc.Class({extends:cc.Component,properties:{field:{default:null,type:s},passing:{default:null,type:o},cost:100,costDisplay:{default:null,type:cc.Label},bombPrefab:{default:null,type:cc.Prefab},explosionPrefab:{default:null,type:cc.Prefab}},init:function(e){this.game=e},onLoad:function(){this.bomb=null,this.bombPool=new cc.NodePool;var e=cc.instantiate(this.bombPrefab);this.bombPool.put(e),this.explosionPool=new cc.NodePool;for(var t=0;t<5;++t){var i=cc.instantiate(this.explosionPrefab);this.explosionPool.put(i)}},onButtonClick:function(e){if(!(this.passing.coins<this.cost||this.bomb)){this.passing.changeCoins(-this.cost),this.bomb=this.bombPool.get(this),this.node.addChild(this.bomb),this.bomb.zIndex=500;var t=this.node.convertToNodeSpaceAR(e.getLocation());this.bomb.setAnchorPoint(1,1),this.bomb.setPosition(t),this.game.node.on(this.game.mousemove,this.onMouseMove,this),this.game.bombChosen()}},onMouseMove:function(e){var t=this.node.convertToNodeSpaceAR(e.getLocation());this.bomb.setPosition(t)},onMouseDown:function(){if(this.passing.coins<this.cost)return this.costDisplay.node.color=cc.Color.RED,this.node.on(this.game.mouseup,this.onMouseUp,this),void this.node.on(this.game.mouseleave,this.onMouseUp,this)},onMouseUp:function(){this.costDisplay.node.color=cc.Color.WHITE,this.node.off(this.game.mouseup,this.onMouseUp,this),this.node.off(this.game.mouseleave,this.onMouseUp,this)},spawnExplosion:function(){return this.explosionPool.size()>0?this.explosionPool.get():cc.instantiate(this.explosionPrefab)},despawnExplosionBomb:function(e){this.explosionPool.put(e)},despawnBomb:function(e){this.bombPool.put(e),this.bomb=null},start:function(){this.node.on(this.game.mousedown,this.onMouseDown,this),this.costDisplay.string=this.cost}}),cc._RF.pop()},{field:"field",passing:"passing"}],explosionAnim:[function(e,t,i){"use strict";cc._RF.push(t,"5218aWswGhAA5vgQVw/dxt8","explosionAnim"),cc.Class({extends:cc.Component,properties:{},init:function(e){this.game=e;var t=this.node.getComponent(cc.Animation).play("explosionAnimation");this.duration=t.duration},despawn:function(){this.game.despawnExplosionBomb(this.node)}}),cc._RF.pop()},{}],field:[function(e,t,i){"use strict";cc._RF.push(t,"83a2al34mtIXpKXFWrUIMJE","field"),cc.Class({extends:cc.Component,properties:{spriteTextures:{default:[],type:[cc.SpriteFrame]},rowLength:{default:9,type:cc.Integer,range:[3,15]},rowNum:{default:0,visible:!1},cube:{default:null,type:cc.Prefab},fieldFrame:{default:null,type:cc.Node},blackRect:{default:null,type:cc.Node},levelProgress:{default:null,type:cc.Node},cubeFormat:{default:357/402,tooltip:"The ratio of the width of the sprite to its height (default: 357/402)"},fallingSpeed:.25},init:function(e){this.game=e,this.initNodeHeight=this.node.height,this.initiateFieldParameters(),this.createGrid()},initiateFieldParameters:function(){this.currentRowLength=this.rowLength,this.node.height=this.initNodeHeight,this.fieldFrame.height=this.initNodeHeight,this.spriteOverlay={x:1,y:.92},this.frameWidth=.025*this.node.width,this.loverLeftInnerPoint=cc.v2(this.frameWidth,this.frameWidth),this.innerWidth=this.node.width-2*this.frameWidth,this.innerHeight=this.node.height-2*this.frameWidth,this.cellSize={},this.cellSize.width=this.innerWidth/this.rowLength,this.cellSize.height=this.cellSize.width/this.cubeFormat,this.minRowLength=3,this.maxRowLength=15,this.rowNum=Math.floor(this.innerHeight/(this.cellSize.height*this.spriteOverlay.y)),this.cellsNum=this.rowNum*this.rowLength,this.spaceOverage=this.innerHeight-this.cellSize.height*this.spriteOverlay.y*this.rowNum,this.node.height-=this.spaceOverage,this.fieldFrame.height-=this.spaceOverage,this.fieldFrame.zIndex=2*this.cellsNum,this.currentMaxFallHaight=0,this.maxFallTime=0},setLevelProgress:function(){this.levelProgress.x=0,this.levelProgress.y=this.node.height,this.levelProgress.zIndex=2*this.cellsNum+1},createBlackRect:function(){var e=this.blackRect.getComponent(cc.Graphics);this.blackRect.zIndex=2*this.cellsNum,e.rect(0,this.node.height,this.node.width,this.node.height),e.fillColor=cc.Color.BLACK,e.fill()},createGrid:function(){this.fieldCells=[];for(var e=0,t=this.cellSize.width/2,i=this.cellSize.height/2,s=0,o=0;o<2*this.rowNum;o++)for(var n=0;n<this.rowLength;n++){var l={};o==this.rowNum&&(e=this.frameWidth),l.sprite=null,l.position=cc.v2(this.loverLeftInnerPoint.x+t+n*this.cellSize.width*this.spriteOverlay.x,this.loverLeftInnerPoint.y+i+o*this.cellSize.height*this.spriteOverlay.y+e),l.zIndex=s,l.number=s,s++,this.fieldCells.push(l)}},spawnNewSprite:function(e){var t=null;t=this.game.cubesPool.size()>0?this.game.cubesPool.get(this.game):cc.instantiate(this.game.cubePrefab),e.sprite=t;var i=this.spriteTextures[Math.floor(Math.random()*this.spriteTextures.length)];t.getComponent(cc.Sprite).spriteFrame=i,t.textureName=i.name,t.setPosition(e.position),t.width=this.cellSize.width,t.height=this.cellSize.height,t.fallHeight=0,t.number=e.number,t.zIndex=e.zIndex,t.on("mousedown",function(){}),this.node.getChildByName("cubes").addChild(t)},fillFieldWithSprites:function(){this.setLevelProgress(),this.createBlackRect();for(var e=0;e<this.fieldCells.length;e++)this.fieldCells[e].sprite||this.spawnNewSprite(this.fieldCells[e])},searchForSameColorAdjacentSprites:function(e,t){var i=[t[e].sprite],s=t[e].sprite.textureName;t[e].sprite=null;var o=this.rowLength,n=this.cellsNum;return function e(t,l){(l+1)%o&&t[l+1].sprite&&t[l+1].sprite.textureName==s&&(i.push(t[l+1].sprite),t[l+1].sprite=null,e(t,l+1)),l%o&&t[l-1].sprite&&t[l-1].sprite.textureName==s&&(i.push(t[l-1].sprite),t[l-1].sprite=null,e(t,l-1)),l<n-o&&t[l+o].sprite&&t[l+o].sprite.textureName==s&&(i.push(t[l+o].sprite),t[l+o].sprite=null,e(t,l+o)),l>o-1&&t[l-o].sprite&&t[l-o].sprite.textureName==s&&(i.push(t[l-o].sprite),t[l-o].sprite=null,e(t,l-o))}(t,e),i.length<2&&(t[e].sprite=i[0]),i},getExplosionGroup:function(e,t){var i=[t[e].sprite];t[e].sprite=null;var s=this.rowLength,o=this.cellsNum;return(e+1)%s&&(i.push(t[e+1].sprite),t[e+1].sprite=null),e%s&&(i.push(t[e-1].sprite),t[e-1].sprite=null),e<o-s&&(i.push(t[e+s].sprite),t[e+s].sprite=null),e>s-1&&(i.push(t[e-s].sprite),t[e-s].sprite=null),i},dumping:function(e){for(var t=this.rowLength,i=this.rowNum,s=this.cellsNum,o=0;o<i;o++)for(var n=t;n<2*s;n++)null!=e[n].sprite&&null==e[n-t].sprite&&(e[n-t].sprite=e[n].sprite,e[n].sprite=null,e[n-t].sprite.zIndex=e[n-t].zIndex,e[n-t].sprite.number=e[n-t].number,e[n-t].sprite.fallHeight++,e[n-t].sprite.fallHeight>this.currentMaxFallHaight&&(this.currentMaxFallHaight=e[n-t].sprite.fallHeight));this.maxFallTime=this.fallingSpeed*this.currentMaxFallHaight/(this.currentMaxFallHaight,2);for(var l=0;l<e.length;l++)if(e[l].sprite&&e[l].sprite.fallHeight){var h=this.fallingSpeed*e[l].sprite.fallHeight/(e[l].sprite.fallHeight,2);cc.tween(e[l].sprite).to(h,{position:e[l].position},{easing:"sineIn"}).start(),e[l].sprite.fallHeight=0}},updateField:function(){this.node.getChildByName("cubes").removeAllChildren(),this.initiateFieldParameters(),this.createGrid(),this.game.cubesPool=new cc.NodePool;for(var e=2*this.cellsNum,t=0;t<e;++t){var i=cc.instantiate(this.game.cubePrefab);this.game.cubesPool.put(i)}this.fillFieldWithSprites()},mix:function(){for(var e=[],t=0;t<this.cellsNum;t++){var i=this.fieldCells[t].sprite.getComponent(cc.Sprite).spriteFrame;e.push(i)}e.sort(function(){return Math.random()-.5});for(var s=0;s<this.cellsNum;s++)this.fieldCells[s].sprite.getComponent(cc.Sprite).spriteFrame=e[s],this.fieldCells[s].sprite.textureName=e[s].name}}),cc._RF.pop()},{}],game:[function(e,t,i){"use strict";cc._RF.push(t,"a5e1aPQKqBDXZGHsGasts21","game");var s=e("field"),o=e("passing"),n=e("bonuseBomb");cc.Class({extends:cc.Component,properties:{cubePrefab:{default:null,type:cc.Prefab},field:{default:null,type:s},passing:{default:null,type:o},bonuseBomb:{default:null,type:n},mainMenuNode:{default:null,type:cc.Node},gameOverNode:{default:null,type:cc.Node},nextLevelNode:{default:null,type:cc.Node}},onLoad:function(){this.mousedown="mousedown",this.mouseup="mouseup",this.mousemove="mousemove",this.mouseleave="mouseleave",cc.sys.isMobile&&(this.mousedown="touchstart",this.mouseup="touchend",this.mousemove="touchmove",this.mouseleave="touchcancel"),this.field.init(this),this.passing.init(this),this.bonuseBomb.init(this),this.gameOverNode.active=!1,this.nextLevelNode.active=!1,this.cubesPool=new cc.NodePool;for(var e=2*this.field.cellsNum,t=0;t<e;++t){var i=cc.instantiate(this.cubePrefab);this.cubesPool.put(i)}this.field.fillFieldWithSprites()},onStartGame:function(){this.passing.resetLevelScore(),this.passing.changeCoins(0),this.gameOverNode.active=!1,this.mainMenuNode.active=!1,this.nextLevelNode.active=!1,this.field.node.on(this.mousedown,this.onMouseDown,this),this.field.rowLength!==this.field.currentRowLength&&this.field.updateField()},bombChosen:function(){this.field.node.off(this.mousedown,this.onMouseDown,this),this.field.node.on(this.mousedown,this.onMouseDownBomb,this)},onMouseDownBomb:function(e){var t=e.target;if(!(t.number>this.field.cellsNum)){this.node.off(this.mousemove,this.bonuseBomb.onMouseMove,this.bonuseBomb),this.field.node.off(this.mousedown,this.onMouseDownBomb,this),this.bonuseBomb.despawnBomb(this.bonuseBomb.bomb);for(var i,s=this.field.getExplosionGroup(t.number,this.field.fieldCells),o=0;o<s.length;o++)this.cubesPool.put(s[o]),(i=this.bonuseBomb.spawnExplosion()).getComponent("explosionAnim").init(this),this.field.node.addChild(i),i.zIndex=this.field.cellsNum,i.scale=5/this.field.rowLength,i.setPosition(s[o].getPosition());this.scheduleOnce(function(){this.field.dumping(this.field.fieldCells),this.scheduleOnce(function(){this.field.fillFieldWithSprites(),this.bonuseBomb.bomb||this.field.node.on(this.mousedown,this.onMouseDown,this)},this.field.maxFallTime)},.7*i.getComponent("explosionAnim").duration)}},onMouseDown:function(e){var t=e.target;if(!(t.number>this.field.cellsNum)){var i=this.field.node.convertToNodeSpaceAR(e.getLocation());e.currentTarget.pauseSystemEvents(!0);var s=this.field.searchForSameColorAdjacentSprites(t.number,this.field.fieldCells);if(s.length<2)cc.tween(t).by(.1,{scale:-.15,angle:-20}).by(.1,{scale:.15,angle:20}).call(function(){e.currentTarget.resumeSystemEvents(!0)}).start();else{this.passing.changeMovies(-1),this.passing.gainScore(i,s.length);for(var o=0;o<s.length;o++)this.cubesPool.put(s[o]);this.field.dumping(this.field.fieldCells),this.scheduleOnce(function(){this.field.currentMaxFallHaight=0,e.currentTarget.resumeSystemEvents(!0),this.field.fillFieldWithSprites()},this.field.maxFallTime)}}},gameOver:function(){this.passing.init(this),this.passing.resetLevelScore(),this.gameOverNode.active=!0,this.field.node.off(this.mousedown,this.onMouseDown,this)},nextLevel:function(){this.passing.increaseLevel(),this.nextLevelNode.active=!0,this.field.node.off(this.mousedown,this.onMouseDown,this)}}),cc._RF.pop()},{bonuseBomb:"bonuseBomb",field:"field",passing:"passing"}],mainMenu:[function(e,t,i){"use strict";cc._RF.push(t,"8b1fbTGo0JMM6rYGwDsVcpK","mainMenu"),cc.Class({extends:cc.Component,properties:{levelLabel:{default:null,type:cc.Label},numberOfCubesLabel:{default:null,type:cc.Label},numberOfCubesSlider:{default:null,type:cc.Slider},field:{default:null,type:cc.Node}},onSlider:function(e,t){var i=this.field.getComponent("field"),s=i.minRowLength,o=i.maxRowLength,n=s+Math.floor((o-s)*e.progress);this.numberOfCubesLabel.string=n,i.rowLength=n},onEnable:function(){var e=this.field.getComponent("field");this.numberOfCubesLabel.string=e.rowLength;var t=e.minRowLength,i=e.maxRowLength;this.numberOfCubesSlider.progress=(e.rowLength-t)/(i-t)}}),cc._RF.pop()},{}],nextLevelMenu:[function(e,t,i){"use strict";cc._RF.push(t,"6e7b8MTG81Ki5/JK0NDq8tC","nextLevelMenu");var s=e("passing");cc.Class({extends:cc.Component,properties:{passing:{default:null,type:s},wonCoinsLabel:{default:null,type:cc.Label},nextLevelInformation:{default:null,type:cc.Label}},onEnable:function(){this.wonCoinsLabel.string="+ "+this.passing.levelCoins+" coins!",this.nextLevelInformation.string="Level "+this.passing.currentLevel+"\n Score "+this.passing.currentRequiredLevelScore+" points in "+this.passing.initMovies+" movies!"}}),cc._RF.pop()},{passing:"passing"}],passing:[function(e,t,i){"use strict";cc._RF.push(t,"d76fek7CidOcJMgbuOnZEIm","passing"),cc.Class({extends:cc.Component,properties:{initLivel:1,initMovies:10,coins:1e3,initRequiredLevelScore:50,increasRequiredLevelScore:50,levelScoreDisplay:{default:null,type:cc.Label},moviesDisplay:{default:null,type:cc.Label},bonuseMoveNode:{default:null,type:cc.Node},totalScoreDisplay:{default:null,type:cc.Label},coinsNumDisplay:{default:null,type:cc.Label},levelProgress:{default:null,type:cc.Node},levelLabel:{default:null,type:cc.Label},scoreFXPrefab:{default:null,type:cc.Prefab}},init:function(e){this.game=e,this.currentLevel=this.initLivel,this.movies=this.initMovies,this.totalScore=0,this.currentRequiredLevelScore=this.initRequiredLevelScore+(this.currentLevel-this.initLivel)*this.increasRequiredLevelScore,this.scorePool=new cc.NodePool("ScoreAnim")},resetLevelScore:function(){this.levelScore=0,this.levelCoins=0,this.movies=this.initMovies,this.moviesDisplay.string=this.movies.toString(),this.updateLevelScore(),this.levelDisplay()},changeMovies:function(e){this.movies+=e,this.moviesDisplay.string=this.movies.toString()},changeCoins:function(e){e>0&&(this.levelCoins+=e),this.coins+=e,this.coinsNumDisplay.string=this.coins.toString()},levelDisplay:function(){this.levelLabel.string="Level: "+this.currentLevel},updateLevelScore:function(){this.levelScoreDisplay.string="Score: \n"+this.levelScore.toString()+"/"+this.currentRequiredLevelScore,this.levelProgress.getComponent(cc.ProgressBar).progress=this.levelScore/this.currentRequiredLevelScore},gainScore:function(e,t){this.levelScore+=t*t,this.updateLevelScore(),this.totalScore+=t*t,this.totalScoreDisplay.string=this.totalScore;var i=this.spawnScoreFX();i.getComponent("scoreAnim").init(this),this.game.field.node.addChild(i),i.zIndex=this.game.field.cellsNum,i.setPosition(e),i.getComponent("scoreAnim").label.string="+"+t+"x"+t,i.getComponent(cc.Animation).play(),this.levelScore<this.currentRequiredLevelScore&&this.movies<1&&this.game.gameOver(),this.levelScore>=this.currentRequiredLevelScore&&this.game.nextLevel()},spawnScoreFX:function(){return this.scorePool.size()>0?this.scorePool.get():cc.instantiate(this.scoreFXPrefab)},despawnScoreFX:function(e){this.scorePool.put(e)},increaseLevel:function(){var e=this.movies*this.bonuseMoveNode.getComponent("BonuseMove").cost+this.levelScore-this.currentRequiredLevelScore;this.coins+=e,this.levelCoins+=e,this.coinsNumDisplay.string=this.coins,this.currentLevel++,this.currentRequiredLevelScore=this.initRequiredLevelScore+(this.currentLevel-this.initLivel)*this.increasRequiredLevelScore,this.movies=this.initMovies}}),cc._RF.pop()},{}],scoreAnim:[function(e,t,i){"use strict";cc._RF.push(t,"878f1phGrNDtYPTzPbNwRJK","scoreAnim"),cc.Class({extends:cc.Component,properties:{label:{default:null,type:cc.Label}},init:function(e){this.game=e},despawn:function(){this.game.despawnScoreFX(this.node)}}),cc._RF.pop()},{}]},{},["BonuseMove","Bonuses Mix","bonuseBomb","explosionAnim","field","game","mainMenu","nextLevelMenu","passing","scoreAnim"]);