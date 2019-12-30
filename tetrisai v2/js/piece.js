function Piece(cells, type){
    this.cells = cells;
    this.type = type;

    this.dimension = this.cells.length;
    this.row = 0;
    this.column = 0;

    this.best_rotation = null;
    this.best_xpos = null;
};

Piece.fromIndex = function(index){
    var piece;
    switch (index){
        case 0:// O
            piece = new Piece([
                [0x0000AA, 0x0000AA],
                [0x0000AA, 0x0000AA]
            ], 'O');
            break;
        case 1: // J
            piece = new Piece([
                [0xC0C0C0, 0x000000, 0x000000],
                [0xC0C0C0, 0xC0C0C0, 0xC0C0C0],
                [0x000000, 0x000000, 0x000000]
            ], 'J');
            // piece = new Piece([
            //     [0x000000, 0xC0C0C0, 0x000000],
            //     [0x000000, 0xC0C0C0, 0x000000],
            //     [0xC0C0C0, 0xC0C0C0, 0x000000]
            // ], 'J');
            break;
        case 2: // L
            piece = new Piece([
                [0x000000, 0x000000, 0xAA00AA],
                [0xAA00AA, 0xAA00AA, 0xAA00AA],
                [0x000000, 0x000000, 0x000000]
            ], 'L');
            // piece = new Piece([
            //     [0xAA00AA, 0x000000, 0x000000],
            //     [0xAA00AA, 0x000000, 0x000000],
            //     [0xAA00AA, 0xAA00AA, 0x000000]
            // ], 'L');
            break;
        case 3: // Z
            piece = new Piece([
                [0x00AAAA, 0x00AAAA, 0x000000],
                [0x000000, 0x00AAAA, 0x00AAAA],
                [0x000000, 0x000000, 0x000000]
            ], 'Z');
            break;
        case 4: // S
            piece = new Piece([
                [0x000000, 0x00AA00, 0x00AA00],
                [0x00AA00, 0x00AA00, 0x000000],
                [0x000000, 0x000000, 0x000000]
            ], 'S');
            break;
        case 5: // T
            piece = new Piece([
                [0x000000, 0xAA5500, 0x000000],
                [0xAA5500, 0xAA5500, 0xAA5500],
                [0x000000, 0x000000, 0x000000]
            ], 'T');
            // piece = new Piece([
            //     [0xAA5500, 0xAA5500, 0xAA5500],
            //     [0x000000, 0xAA5500, 0x000000],
            //     [0x000000, 0x000000, 0x000000]
            // ], 'T');
            break;
        case 6: // I
            piece = new Piece([
                [0x000000, 0x000000, 0x000000, 0x000000],
                [0xAA0000, 0xAA0000, 0xAA0000, 0xAA0000],
                [0x000000, 0x000000, 0x000000, 0x000000],
                [0x000000, 0x000000, 0x000000, 0x000000]
            ], 'I');
            // piece = new Piece([
            //     [0xAA0000, 0x000000, 0x000000, 0x000000],
            //     [0xAA0000, 0x000000, 0x000000, 0x000000],
            //     [0xAA0000, 0x000000, 0x000000, 0x000000],
            //     [0xAA0000, 0x000000, 0x000000, 0x000000]
            // ], 'I');
            break;

    }
    piece.row = 0;
    piece.column = Math.floor((10 - piece.dimension) / 2); // Centralize
    return piece;
};

Piece.prototype.getTypeEncoding = function(){
  var typeVec;
  switch (this.type){
      case 'I':
          typeVec = [1, 0, 0, 0, 0, 0, 0]
          break;
      case 'O':
          typeVec = [0, 1, 0, 0, 0, 0, 0]
          break;
      case 'T':
          typeVec = [0, 0, 1, 0, 0, 0, 0]
          break;
      case 'S':
          typeVec = [0, 0, 0, 1, 0, 0, 0]
          break;
      case 'Z':
          typeVec = [0, 0, 0, 0, 1, 0, 0]
          break;
      case 'J':
          typeVec = [0, 0, 0, 0, 0, 1, 0]
          break;
      case 'L':
          typeVec = [0, 0, 0, 0, 0, 0, 1]
          break;
  }
  return typeVec;
}

Piece.prototype.getRotationEncoding = function(){
  var rotVec;
  switch (this.best_rotation){
    case 0:
      rotVec = [1, 0, 0, 0];
      break;
    case 1:
      rotVec = [0, 1, 0, 0];
      break;
    case 2:
      rotVec = [0, 0, 1, 0];
      break;
    case 3:
      rotVec = [0, 0, 0, 1];
      break;
  }
  return rotVec;
}

Piece.prototype.getXPosEncoding = function(){
  var posVec;
  switch (this.best_xpos){
    case 1:
      posVec = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      break;
    case 2:
      posVec = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
      break;
    case 3:
      posVec = [0, 0, 1, 0, 0, 0, 0, 0, 0, 0];
      break;
    case 4:
      posVec = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0];
      break;
    case 5:
      posVec = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0];
      break;
    case 6:
      posVec = [0, 0, 0, 0, 0, 1, 0, 0, 0, 0];
      break;
    case 7:
      posVec = [0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
      break;
    case 8:
      posVec = [0, 0, 0, 0, 0, 0, 0, 1, 0, 0];
      break;
    case 9:
      posVec = [0, 0, 0, 0, 0, 0, 0, 0, 1, 0];
      break;
    case 10:
      posVec = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
      break;
  }
  return posVec;
}

Piece.prototype.clone = function(){
    var _cells = new Array(this.dimension);
    for (var r = 0; r < this.dimension; r++) {
        _cells[r] = new Array(this.dimension);
        for(var c = 0; c < this.dimension; c++){
            _cells[r][c] = this.cells[r][c];
        }
    }

    var piece = new Piece(_cells);
    piece.type = this.type;
    piece.row = this.row;
    piece.column = this.column;
    piece.best_rotation = this.best_rotation;
    piece.best_xpos = this.best_xpos;
    return piece;
};

Piece.prototype.canMoveLeft = function(grid){
    for(var r = 0; r < this.cells.length; r++){
        for(var c = 0; c < this.cells[r].length; c++){
            var _r = this.row + r;
            var _c = this.column + c - 1;
            if (this.cells[r][c] != 0){
                if (!(_c >= 0 && grid.cells[_r][_c] == 0)){
                    return false;
                }
            }
        }
    }
    return true;
};

Piece.prototype.canMoveRight = function(grid){
    for(var r = 0; r < this.cells.length; r++){
        for(var c = 0; c < this.cells[r].length; c++){
            var _r = this.row + r;
            var _c = this.column + c + 1;
            if (this.cells[r][c] != 0){
                if (!(_c >= 0 && grid.cells[_r][_c] == 0)){
                    return false;
                }
            }
        }
    }
    return true;
};


Piece.prototype.canMoveDown = function(grid){
    for(var r = 0; r < this.cells.length; r++){
        for(var c = 0; c < this.cells[r].length; c++){
            var _r = this.row + r + 1;
            var _c = this.column + c;
            if (this.cells[r][c] != 0 && _r >= 0){
                if (!(_r < grid.rows && grid.cells[_r][_c] == 0)){
                    return false;
                }
            }
        }
    }
    return true;
};

Piece.prototype.moveLeft = function(grid){
    if(!this.canMoveLeft(grid)){
        return false;
    }
    this.column--;
    return true;
};

Piece.prototype.moveRight = function(grid){
    if(!this.canMoveRight(grid)){
        return false;
    }
    this.column++;
    return true;
};

Piece.prototype.moveDown = function(grid){
    if(!this.canMoveDown(grid)){
        return false;
    }
    this.row++;
    return true;
};

Piece.prototype.rotateCells = function(){
      var _cells = new Array(this.dimension);
      for (var r = 0; r < this.dimension; r++) {
          _cells[r] = new Array(this.dimension);
      }

      switch (this.dimension) { // Assumed square matrix
          case 2:
              _cells[0][0] = this.cells[1][0];
              _cells[0][1] = this.cells[0][0];
              _cells[1][0] = this.cells[1][1];
              _cells[1][1] = this.cells[0][1];
              break;
          case 3:
              _cells[0][0] = this.cells[2][0];
              _cells[0][1] = this.cells[1][0];
              _cells[0][2] = this.cells[0][0];
              _cells[1][0] = this.cells[2][1];
              _cells[1][1] = this.cells[1][1];
              _cells[1][2] = this.cells[0][1];
              _cells[2][0] = this.cells[2][2];
              _cells[2][1] = this.cells[1][2];
              _cells[2][2] = this.cells[0][2];
              break;
          case 4:
              _cells[0][0] = this.cells[3][0];
              _cells[0][1] = this.cells[2][0];
              _cells[0][2] = this.cells[1][0];
              _cells[0][3] = this.cells[0][0];
              _cells[1][3] = this.cells[0][1];
              _cells[2][3] = this.cells[0][2];
              _cells[3][3] = this.cells[0][3];
              _cells[3][2] = this.cells[1][3];
              _cells[3][1] = this.cells[2][3];
              _cells[3][0] = this.cells[3][3];
              _cells[2][0] = this.cells[3][2];
              _cells[1][0] = this.cells[3][1];

              _cells[1][1] = this.cells[2][1];
              _cells[1][2] = this.cells[1][1];
              _cells[2][2] = this.cells[1][2];
              _cells[2][1] = this.cells[2][2];
              break;
      }

      this.cells = _cells;
};

Piece.prototype.computeRotateOffset = function(grid){
    var _piece = this.clone();
    _piece.rotateCells();
    if (grid.valid(_piece)) {
        return { rowOffset: _piece.row - this.row, columnOffset: _piece.column - this.column };
    }

    // Kicking
    var initialRow = _piece.row;
    var initialCol = _piece.column;

    for (var i = 0; i < _piece.dimension - 1; i++) {
        _piece.column = initialCol + i;
        if (grid.valid(_piece)) {
            return { rowOffset: _piece.row - this.row, columnOffset: _piece.column - this.column };
        }

        for (var j = 0; j < _piece.dimension - 1; j++) {
            _piece.row = initialRow - j;
            if (grid.valid(_piece)) {
                return { rowOffset: _piece.row - this.row, columnOffset: _piece.column - this.column };
            }
        }
        _piece.row = initialRow;
    }
    _piece.column = initialCol;

    for (var i = 0; i < _piece.dimension - 1; i++) {
        _piece.column = initialCol - i;
        if (grid.valid(_piece)) {
            return { rowOffset: _piece.row - this.row, columnOffset: _piece.column - this.column };
        }

        for (var j = 0; j < _piece.dimension - 1; j++) {
            _piece.row = initialRow - j;
            if (grid.valid(_piece)) {
                return { rowOffset: _piece.row - this.row, columnOffset: _piece.column - this.column };
            }
        }
        _piece.row = initialRow;
    }
    _piece.column = initialCol;

    return null;
};

Piece.prototype.rotate = function(grid){
    var offset = this.computeRotateOffset(grid);
    if (offset != null){
        this.rotateCells(grid);
        this.row += offset.rowOffset;
        this.column += offset.columnOffset;
    }
};
