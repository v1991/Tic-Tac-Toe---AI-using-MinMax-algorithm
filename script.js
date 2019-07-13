var orgiBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
    [0,1,2],
    [0,4,8],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2],
    [3,4,5]
];

const cells = document.querySelectorAll('.cell');
startGame();

function startGame (){
    document.querySelector('.endGame').style.display = "none";
    orgiBoard = Array.from(Array(9).keys());
    for(var i=0; i < cells.length; i++){
        cells[i].innerHTML = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', trunClick, false)
    }
}

function trunClick(square){
    var nextPlay;
    if(typeof orgiBoard[square.target.id] == 'number'){
        nextPlay = trun(square.target.id, huPlayer)
        if( nextPlay && (!checkTie())){
            nextPlay = trun(bestSpot(), aiPlayer)
        }
    }
}

function trun(squareId, player){
    orgiBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(orgiBoard, player);
    if(gameWon){
        gameOver(gameWon);
        return false;
    }
    return trun;
}

function checkWin(board, player){
    let plays = board.reduce((a, e, i) =>
     (e === player) ? a.concat(i) : a, [])
    let gameWon = null;
    for(let [index, win] of winCombos.entries()){
        if(win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon  = { index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon){

    for(let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor = gameWon.player == huPlayer? 'blue' : 'red';
    }
    for(var i=0; i < cells.length; i++) {
        cells[i].removeEventListener('click', trunClick, false);
    }
    declareWinner(gameWon.player == huPlayer? "You Win!" : "You Lose!");
}

function declareWinner(winner){
    document.querySelector('.endGame').style.display = "block";
    document.querySelector(".endGame .result").innerText = winner;
}

function emptySquares(){
    return orgiBoard.filter(s => typeof s == 'number')
}

function bestSpot(){
    return minmax(orgiBoard, aiPlayer).index;
}

function checkTie(){
    if(emptySquares().length == 0 ){
        for( var i =0; i< cells.length; i++){
            cells[i].style.backgroundColor == 'green';
            cells[i].removeEventListener('click', trunClick, false);
        }
        declareWinner("Tie Game!");
        return true;
    }
    return false;
}

function minmax(newBoard, player){
    var availBoard = emptySquares(newBoard);
    
    if(checkWin(newBoard, player)){
        return {score : -10}
    } else if(checkWin(newBoard, aiPlayer)){
        return {score: 20};
    } else if(availBoard.length == 0){
        return {score : 0}
    }

    var moves = [];
    for(var i=0; i < availBoard.length; i++){
        var move = {}
        move.index = newBoard[availBoard[i]];
        newBoard[availBoard[i]] = player;

        if(player == aiPlayer){
            var result = minmax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            var result = minmax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availBoard[i]] = move.index;
        moves.push(move);
    }
    var bestMove;
    if(player == aiPlayer) {
        var bestScore = -10000;
        for(var i=0; i < moves.length; i++){
            if(moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for(var i=0; i < moves.length; i++){
            if(moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }

    }
return moves[bestMove];
}






