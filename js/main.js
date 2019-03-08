currentTurn = null;
BOARD_SIZE = 8;
BLACK = 0;
WHITE = 1;

function init(divId) {
    mainDiv = document.getElementById(divId);
    //mainDiv.innerHTML = "hi from init";
    makeBoard();
    initGame();
}

function makeBoard() {
    var boardTable = document.createElement('table');
    for (var i=0; i<=BOARD_SIZE; i++) {
        tr = document.createElement('tr');
        boardTable.appendChild(tr);
        for (var j=0; j<=BOARD_SIZE; j++) {
            td = document.createElement('td');
            bindCellClick(i, j, td);
            tr.appendChild(td);
        }
    }
}

function initGame() {
    setTurn(0);
    setSpot(boardSize/2-1, boardSize/2-1, BLACK);
    setSpot(boardSize/2-1, boardSize/2, WHITE);
    setSpot(boardSize/2, boardSize/2-1, BLACK);
    setSpot(boardSize/2, boardSize/2, WHITE);
    setScore(2, 2);
}

function setTurn(turn) {
    currentTurn = turn;
}

function setScore(blackCount, whiteCount) {

}

function setSpot(row, col, color) {

}
