function AI(heightWeight, linesWeight, holesWeight, bumpinessWeight){
    this.heightWeight = heightWeight;
    this.linesWeight = linesWeight;
    this.holesWeight = holesWeight;
    this.bumpinessWeight = bumpinessWeight;
};

AI.prototype._best = function(grid, workingPieces, workingPieceIndex){
    var best = null;
    var bestRot = null;
    var bestXPos = null;
    var bestScore = null;
    var workingPiece = workingPieces[workingPieceIndex];

    for(var rotation = 0; rotation < 4; rotation++){
        var _piece = workingPiece.clone();
        for(var i = 0; i < rotation; i++){
            _piece.rotate(grid);
        }

        while(_piece.moveLeft(grid));

        while(grid.valid(_piece)){
            var _pieceSet = _piece.clone();
            while(_pieceSet.moveDown(grid));

            var _grid = grid.clone();
            _grid.addPiece(_pieceSet);

            var score = null;
            if (workingPieceIndex == (workingPieces.length - 1)) {
                score = -this.heightWeight * _grid.aggregateHeight() + this.linesWeight * _grid.lines() - this.holesWeight * _grid.holes() - this.bumpinessWeight * _grid.bumpiness();
            }else{
                score = this._best(_grid, workingPieces, workingPieceIndex + 1).score;
            }

            if (score > bestScore || bestScore == null){
                bestScore = score;
                bestRot = rotation;
                bestXPos = _piece.column;
                best = _piece.clone();
                best.type = _piece.type;
            }

            _piece.column++;
        }
    }
    return {piece:best, score:bestScore, bestRot:bestRot, bestXPos:bestXPos};
};

AI.prototype.best = function(grid, workingPieces){
    best = this._best(grid, workingPieces, 0)
    best_piece = best.piece;
    best_piece.best_rotation = best.bestRot;
    best_piece.setBestXPos(best.bestXPos);
    return best_piece;
};
