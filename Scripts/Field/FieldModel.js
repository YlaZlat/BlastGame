const FieldModel = cc.Class({

    ctor: function (controller, viev) {
        this.viev = viev;
        this.viev.model  = this;
        this.controller = controller;

        this.initHeight;
        this.height;
        this.width;
        this.frameWidth;
        this.cubeFormat;
        this.fallingSpeed;
        this.spriteTextures
        //получаем начальные параметры рендеринга поля      
        let initRenderParameters = this.viev.getInitRenderFieldParameters();
        this.setInitRenderFieldParameters(initRenderParameters);

        this.loverLeftInnerPoint = cc.v2(this.frameWidth, this.frameWidth);
        this.spriteOverlay = {
            x: 1,
            y: 0.92,
        }
        this.minRowLength = 3;
        this.maxRowLength = 15;
        this.cellSize = {};
        this.cellSize.width;
        this.cellSize.height;
        this.rowLength;
        this.initRowLength = 8;
        this.currentRowLength;
        this.rowNum;
        this.fieldCells = [];
        this.sameColorGroup = [];
        this.currentMaxFallHaight = 0;
        this.maxFallTime = 0;
    },

    init(){
        this.passingModel = this.controller.passingModel; 
        this.getSpriteCell = this.getSpriteCell.bind(this);
    },

    setInitRenderFieldParameters(parameters) { 
        this.initHeight = parameters.height;
        this.height = this.initHeight;
        this.width = parameters.width;
        this.frameWidth = parameters.frameWidth;
        this.cubeFormat = parameters.cubeFormat;
        this.fallingSpeed = parameters.fallingSpeed;
        this.spriteTextures = parameters.spriteTextures;
    },

    setRandomTexture(sprite){
        const randomIndex = Math.floor(Math.random()*this.spriteTextures.length);
        const texture = this.spriteTextures[randomIndex];
        sprite.color = randomIndex;
        this.viev.setTexture(sprite, texture);
        return randomIndex;
    },

    setTexture(sprite, colorIndex){
        const texture = this.spriteTextures[colorIndex];
        this.viev.setTexture(sprite, texture);
        sprite.color = colorIndex
        return colorIndex;
    },

    createField(rowLength) {
        this.viev.deleteAllCubeSprite();
        this.setRowLength(rowLength);
        this.viev.createCubesPool(this.cellsNum * 2); 
        this.createFieldCells();
        this.fillFieldWithSprites();
    },

    setRowLength(rowLength) {
        this.height = this.initHeight;
        this.rowLength = rowLength;
        this.currentRowLength = this.rowLength;

        const innerWidth = this.width - this.frameWidth * 2;
        const innerHeight = this.height - this.frameWidth * 2;

        this.cellSize.width = innerWidth / rowLength;
        this.cellSize.height = this.cellSize.width / this.cubeFormat;
        this.rowNum = Math.floor(innerHeight / (this.cellSize.height * this.spriteOverlay.y));
        this.cellsNum = this.rowNum * rowLength;
        const spaceOverage = innerHeight - this.cellSize.height * this.spriteOverlay.y * this.rowNum;

        this.height -= spaceOverage;

        this.viev.setFieldSize(this.width, this.height);
        this.viev.setFrameZIndex(this.cellsNum);
        this.passingModel.setLevelProgressPosition(0, this.height, this.cellsNum * 2 + 1 );
    },

    createFieldCells() {
        this.fieldCells = [];
        let indent = 0;
        let number = 1;
        let shiftX = this.cellSize.width / 2;
        let shiftY = this.cellSize.height / 2;
        for (let r = 0; r < this.rowNum * 2; r++) {
            let row = [];
            if (r == this.rowNum) { indent = this.frameWidth };
            for (let c = 0; c < this.rowLength; c++) {
                let cell = {};
                cell.width = this.cellSize.width;
                cell.height = this.cellSize.height;
                cell.position = cc.v2(this.loverLeftInnerPoint.x + shiftX + c * this.cellSize.width * this.spriteOverlay.x, this.loverLeftInnerPoint.y + shiftY + r * this.cellSize.height * this.spriteOverlay.y + indent);
                cell.row = r;
                cell.col = c;
                cell.number = number;
                cell.sprite = null;
                row.push(cell);
                number++;
            }
            this.fieldCells.push(row);
        }
    },

    setSpriteToCell(cell, sprite){
        this.viev.setSpriteToCell(cell, sprite);
        cell.sprite = sprite;
        sprite.fallHeight = 0;
        sprite.cell = cell;
    },
   
    fillFieldWithSprites() {
        const fieldCells = this.fieldCells;
        for (let r = 0; r < fieldCells.length; r++) {
            for (let c = 0; c < fieldCells[r].length; c++) {

                const cell = fieldCells[r][c];
                if (!cell.sprite) {
                    let cube = this.viev.spawnNewCubeSprite();
                    this.setRandomTexture(cube);
                    this.setSpriteToCell(cell, cube)
                  cube.on(this.controller.mousedown, function () {},); 
                }
            }
        }
    },

    findNeighborsSprites(sprite){ 
        const arr = this.fieldCells;
        const rowL = this.rowLength;
        const rowN = this.rowNum;
        const cell = sprite.cell;
        const col = cell.col;
        const row = cell.row;
        let neighbors = [ ];
       
        // если ячейка не крайняя справа добавляем соседа справа
        if (col !== rowL - 1 && arr[row][col + 1].sprite)  neighbors.push(arr[row][col + 1].sprite);
        // если ячейка не крайняя слева добавляем соседа слева
        if (col && arr[row][col - 1].sprite) neighbors.push(arr[row][col - 1].sprite);
        // если ячейка не крайняя сверху добавляем соседа сверху
        if (row !== (rowN - 1) && arr[row + 1][col].sprite) neighbors.push(arr[row + 1][col].sprite);
        // если ячейка не крайняя снизу добавляем соседа снизу
        if (row && arr[row - 1][col].sprite) neighbors.push(arr[row - 1][col].sprite);

        return neighbors;
    },
    
    getSpriteCell(sprite){
        const arr = this.fieldCells;
        const cell = sprite.cell;
        if(!cell) return;
        const col = cell.col;
        const row = cell.row;
        return arr[row][col];
    },

    searchSameColorGroup(sprite) {
        const sameColorGroup = [sprite];
        const sameColor = sprite.colorName;
        let cell = this.getSpriteCell(sprite);
        cell.sprite = null;
        cheсkColor = cheсkColor.bind(this);

        function cheсkColor (sprite) {
            const  neighbors =  this.findNeighborsSprites(sprite);
            neighbors.forEach(elem => {
                if (elem.colorName === sameColor) {
                    sameColorGroup.push(elem);
                    const cell = this.getSpriteCell(elem);
                    cell.sprite = null;
                    cheсkColor (elem);
                }
            });
        } 

        cheсkColor (sprite);

        if (sameColorGroup.length < 2) {
            let cell = this.getSpriteCell(sameColorGroup[0]);
            cell.sprite = sameColorGroup[0];
        }
        this.sameColorGroup = sameColorGroup;
        return this.sameColorGroup; // возвращаем массив спрайтов
    },

    checkFieldForEmptyCells: function () {
        const arr = this.fieldCells;
        checkEmptyCells = checkEmptyCells.bind(this);

        function checkEmptyCells(arr) {
            let isEmptyСell = false;
            for (let r = 1; r < arr.length; r++) {
                for (let c = 0; c < arr[r].length; c++) {
                    const curCell = arr[r][c];
                    const lowCell = arr[r - 1][c];
                    if (!curCell.sprite) continue;
                    if (!lowCell.sprite) {
                        isEmptyСell = true;
                        lowCell.sprite = curCell.sprite;
                        curCell.sprite = null;
                        lowCell.sprite.fallHeight++;
                        lowCell.sprite.cell = lowCell;
                        if (lowCell.sprite.fallHeight > this.currentMaxFallHaight) this.currentMaxFallHaight = lowCell.sprite.fallHeight;
                    }
                }
            }
            return isEmptyСell;
        };

        while (checkEmptyCells(arr)) {
            checkEmptyCells(arr)
        };
    },

    wiggle(sprite){
        this.viev.wiggle(sprite);
    },

    onFinishWiggle(){
        this.controller.onFinishRebuild();
    },

    dumping: function () {
        const arr = this.fieldCells;
        this.maxFallTime = this.fallingSpeed * this.currentMaxFallHaight / (this.currentMaxFallHaight * 0, 2);
        for (let r = 0; r < arr.length; r++) {
            for (let c = 0; c < arr[r].length; c++) {
                const sprite = arr[r][c].sprite;
                const cell = arr[r][c];
                if (sprite && sprite.fallHeight) {
                    const fallTime = this.fallingSpeed * sprite.fallHeight / (sprite.fallHeight * 0, 2);
                    sprite.fallHeight = 0;
                    this.viev.cubeFallTo(sprite, cell.position, fallTime);
                    this.viev.setCubeSpriteZIndex(sprite, cell.number)
                }
            }
        }
    },

    rebuildField(){
        this.checkFieldForEmptyCells();
        this.dumping();
        setTimeout(()=> {
            this.currentMaxFallHaight = 0;
            this.maxFallTime = 0;
            this.fillFieldWithSprites();
            this.controller.onFinishRebuild();
        }, this.maxFallTime * 1000);
    },

    despawnSprites(arr){
        for (let i = 0; i< arr.length; i++){
            this.viev.despawnCubeSprite(arr[i]);
        }
    },

    getVisibleCells(){
        const arr = this.fieldCells;
        let visibleCells = [];
        for (let r = 0; r < arr.length / 2; r++) {
            for (let c = 0; c < arr[r].length; c++) { 
                let cell = arr[r][c];
                visibleCells.push(cell);
            }
        }

        return visibleCells;
    },

    onMouseDown(sprite){
        if (sprite.number > this.cellsNum) return;
        let pos = sprite.cell.position;
        let relatedGroup = this.searchSameColorGroup(sprite);
        if(relatedGroup.length < 2) {
            this.wiggle(sprite);
            return;
        }
        this.despawnSprites(relatedGroup);
        this.rebuildField();
        this.passingModel.gainScore(relatedGroup.length, pos, this.cellsNum * 2);
    },

});

module.exports = FieldModel;

