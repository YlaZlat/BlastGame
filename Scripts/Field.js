cc.Class({
    extends: cc.Component,

    properties: {
        spriteTextures: {
            default: [],
            type: [cc.SpriteFrame]     // type can also defined as an array to improve readability
        }, 

        rowLength: {
            default: 9,
            type: cc.Integer,
            range: [3, 15],
        },

        rowNum: {
               default: 0,
                visible: false,
        },

        cube: {
            default: null,
            type: cc.Prefab
        }, 

        fieldFrame: {
            default: null,
            type: cc.Node
        }, 

        blackRect: {
            default: null,
            type: cc.Node
        }, 
        
        levelProgress: {
            default: null,
            type: cc.Node
        }, 

        cubeFormat: {
            default: 357/402,
            tooltip: "The ratio of the width of the sprite to its height (default: 357/402)",
        }, 

        fallingSpeed: 0.25,
    },

    init(game){
        this.game = game;
        this.initNodeHeight =  this.node.height;
        this.initiateFieldParameters(); 
        this.createGrid();
    },

    initiateFieldParameters(){
        this.currentRowLength = this.rowLength;
        this.node.height = this.initNodeHeight;
        this.fieldFrame.height = this.initNodeHeight;
        this.spriteOverlay = { 
            x: 1,
            y: 0.92,
        }
        this.frameWidth = this.node.width * 0.025;
        this.loverLeftInnerPoint = cc.v2(this.frameWidth, this.frameWidth);
        this.innerWidth = this.node.width - this.frameWidth * 2;
        this.innerHeight = this.node.height - this.frameWidth * 2;
        this.cellSize = {};
        this.cellSize.width = this.innerWidth / this.rowLength;
        this.cellSize.height = this.cellSize.width/ this.cubeFormat;
        this.minRowLength = 3;
        this.maxRowLength = 15;
        this.rowNum = Math.floor(this.innerHeight / (this.cellSize.height*this.spriteOverlay.y));
        this.cellsNum = this.rowNum * this.rowLength; 
        this.spaceOverage = this.innerHeight - this.cellSize.height *  this.spriteOverlay.y * this.rowNum;
        this.node.height -= this.spaceOverage;
        this.fieldFrame.height -= this.spaceOverage;
        this.fieldFrame.zIndex = this.cellsNum*2;
        this.currentMaxFallHaight = 0;
        this.maxFallTime = 0;
    },

    setLevelProgress(){
        this.levelProgress.x = 0; 
        this.levelProgress.y = this.node.height; 
        this.levelProgress.zIndex = this.cellsNum * 2 + 1;
    },

    createBlackRect(){
        let blackRect = this.blackRect.getComponent(cc.Graphics);
        this.blackRect.zIndex = this.cellsNum * 2;
        blackRect.rect(0, this.node.height, this.node.width, this.node.height);
        blackRect.fillColor = cc.Color.BLACK;
        blackRect.fill(); 
    },

    createGrid(){
        this.fieldCells = [];
        let indent = 0;
        let shiftX = this.cellSize.width/2;
        let shiftY = this.cellSize.height/2;
        let number = 0;
        for (let i = 0; i < this.rowNum * 2; i++) {
            for (let j = 0; j < this.rowLength; j++) {
                let cell = {};
                if(i == this.rowNum) {indent = this.frameWidth};
                cell.sprite = null;
                cell.position = cc.v2(this.loverLeftInnerPoint.x + shiftX + j * this.cellSize.width * this.spriteOverlay.x, this.loverLeftInnerPoint.y + shiftY + i * this.cellSize.height * this.spriteOverlay.y + indent);
                cell.zIndex = number;
                cell.number = number;
                number++;
                this.fieldCells.push(cell);
            }
        }
    },

    spawnNewSprite: function(cell) {
        let sprite = null;
        if (this.game.cubesPool.size() > 0) {
            sprite =  this.game.cubesPool.get(this.game); 
        } else {
            sprite = cc.instantiate(this.game.cubePrefab);
        } 
        
        cell.sprite = sprite;
        let texture = this.spriteTextures[Math.floor(Math.random()*this.spriteTextures.length)];
        sprite.getComponent(cc.Sprite).spriteFrame = texture;
        sprite.textureName = texture.name;
        sprite.setPosition(cell.position);
        sprite.width = this.cellSize.width;
        sprite.height = this.cellSize.height;
        sprite.fallHeight = 0;
        sprite.number = cell.number; 
        sprite.zIndex = cell.zIndex;
        sprite.on(this.game.mousedown, function () {},);
        this.node.getChildByName("cubes").addChild(sprite);
    },

    fillFieldWithSprites () {
        this.setLevelProgress();
        this.createBlackRect();
        for (let i = 0; i < this.fieldCells.length; i++) {
            if(!this.fieldCells[i].sprite){
                this.spawnNewSprite(this.fieldCells[i]);
            }   
        }
    },

    searchForSameColorAdjacentSprites(i, arr){
        let sameColorAdjacentSprites = [arr[i].sprite,];
        let sameColor = arr[i].sprite.textureName;
        arr[i].sprite = null;
        let rowL = this.rowLength;
        let cellsN = this.cellsNum;
      
        function seachSame(arr, i){ 
            if ((i + 1) % rowL && arr[i + 1].sprite && arr[i + 1].sprite.textureName == sameColor ){// проверяем соседа справа
                sameColorAdjacentSprites.push(arr[i + 1].sprite);
                arr[i + 1].sprite = null;
                seachSame(arr, i+1)}

            if (i % rowL && arr[i - 1].sprite && arr[i - 1].sprite.textureName == sameColor){//проверяем соседа слева
                sameColorAdjacentSprites.push(arr[i - 1].sprite);
                arr[i - 1].sprite = null;
                seachSame(arr, i-1)} 

            if (i < cellsN - rowL && arr[i + rowL].sprite && arr[i + rowL].sprite.textureName == sameColor){
                sameColorAdjacentSprites.push(arr[i + rowL].sprite);
                arr[i + rowL].sprite = null;
                seachSame(arr, i + rowL)} //проверяем соседа сверху

            if (i > rowL - 1 && arr[i - rowL].sprite  &&  arr[i - rowL].sprite.textureName == sameColor) {
                sameColorAdjacentSprites.push(arr[i - rowL].sprite);
                arr[i - rowL].sprite = null;
                seachSame(arr, i - rowL)} //проверяем соседа снизу   
        }

        seachSame(arr, i)

        if (sameColorAdjacentSprites.length < 2) {
            arr[i].sprite = sameColorAdjacentSprites[0];
        }
        return  sameColorAdjacentSprites; 
    },

    getExplosionGroup(i, arr){
        let explosionGroup = [arr[i].sprite,];
        arr[i].sprite = null;
        let rowL = this.rowLength;
        let cellsN = this.cellsNum;

        if ((i + 1) % rowL) {
            explosionGroup.push(arr[i + 1].sprite);
            arr[i + 1].sprite = null;
        }

        if (i % rowL){
            explosionGroup.push(arr[i - 1].sprite);
            arr[i - 1].sprite = null;
        }

        if (i < cellsN - rowL){
            explosionGroup.push(arr[i + rowL].sprite);
            arr[i + rowL].sprite = null;
        } 

        if (i > rowL - 1) {
            explosionGroup.push(arr[i - rowL].sprite);
            arr[i - rowL].sprite = null;
        }

        return explosionGroup;
    },

    dumping: function(arr){
        let rowL = this.rowLength;
        let rowN = this.rowNum;
        let cellsN = this.cellsNum;
        for(let n = 0; n < rowN; n++) {
            for(let i = rowL; i< cellsN*2; i++){
                if(arr[i].sprite==null) continue;
                if(arr[i - rowL].sprite==null){
                    arr[i - rowL].sprite = arr[i].sprite;
                    arr[i].sprite = null;
                    arr[i - rowL].sprite.zIndex = arr[i - rowL].zIndex;
                    arr[i - rowL].sprite.number = arr[i - rowL].number;
                    arr[i - rowL].sprite.fallHeight++;
                    if (arr[i - rowL].sprite.fallHeight > this.currentMaxFallHaight) this.currentMaxFallHaight = arr[i - rowL].sprite.fallHeight;
                }
            }
        }
        this.maxFallTime = this.fallingSpeed*this.currentMaxFallHaight / (this.currentMaxFallHaight*0,2);
        for(let i = 0; i < arr.length; i++){
            if(arr[i].sprite && arr[i].sprite.fallHeight){
                let fallTime = this.fallingSpeed*arr[i].sprite.fallHeight / (arr[i].sprite.fallHeight*0,2);
                cc.tween(arr[i].sprite)
                .to(fallTime, {position: arr[i].position}, { easing: 'sineIn'})
                .start()
                arr[i].sprite.fallHeight = 0;
            }
        }
    }, 

    updateField(){
        this.node.getChildByName("cubes").removeAllChildren();
        this.initiateFieldParameters(); 
        this.createGrid();
        this.game.cubesPool = new cc.NodePool();
        let initCount = this.cellsNum * 2; // 
        for (let i = 0; i < initCount; ++i) {
            let cube = cc.instantiate(this.game.cubePrefab); // create node instance
            this.game.cubesPool.put(cube); // populate your pool with put method
        }   

        this.fillFieldWithSprites ();
    },
            
    mix(){
        let currentColors = [];
        for (let i = 0; i < this.cellsNum; i++) {
            let currentColor = this.fieldCells[i].sprite.getComponent(cc.Sprite).spriteFrame;
            currentColors.push(currentColor);
        }
        currentColors.sort(function() {return Math.random() - 0.5});
        for (let i = 0; i <  this.cellsNum; i++) {
            this.fieldCells[i].sprite.getComponent(cc.Sprite).spriteFrame = currentColors[i];
            this.fieldCells[i].sprite.textureName = currentColors[i].name;
        }
    },
    
});
