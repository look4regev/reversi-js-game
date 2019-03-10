var currentTurn = null;
var mainDiv = null;
var cells = [];
let BOARD_SIZE = 8;
let BLANK = 0;
let WHITE = 1;
let BLACK = 2;

function init(divId) {
     mainDiv = document.getElementById(divId);
     makeBoard();
     initGame();
 }

function makeBoard() {
    var boardTable = document.createElement('table');
    for (var i=0; i<BOARD_SIZE; i++) {
        tr = document.createElement('tr');
        cells[i] = [];
        for (var j=0; j<BOARD_SIZE; j++) {
            td = document.createElement('td');
            cells[i][j] = {elem: td};
            bindCellClick(i, j, td);
            setSpot(i, j, BLANK)
            tr.appendChild(td);
        }
        boardTable.appendChild(tr);
    }
    mainDiv.appendChild(boardTable);
}

function bindCellClick(i, j, td) {
    td.onclick = function(event) {
        setSpot(i, j, currentTurn);
        currentTurn = currentTurn % 2 + 1;
    }
}

function initGame() {
    setTurn(WHITE);
    setSpot(BOARD_SIZE/2-1, BOARD_SIZE/2-1, WHITE);
    setSpot(BOARD_SIZE/2-1, BOARD_SIZE/2, BLACK);
    setSpot(BOARD_SIZE/2, BOARD_SIZE/2-1, BLACK);
    setSpot(BOARD_SIZE/2, BOARD_SIZE/2, WHITE);
    setScore(2, 2);
}

function setTurn(turn) {
    currentTurn = turn;
}

function setScore(blackCount, whiteCount) {
    // TODO: Implement
}

function setSpot(i, j, color) {
    cells[i][j].elem.innerHTML = color;
    cells[i][j].value = color;
}
