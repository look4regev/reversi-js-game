let BLANK = 0;
let WHITE = 1;
let BLACK = 2;
let BOARD_SIZE = 8;

var currentTurnColor = null;
var mainDiv = null;
var cells = [];
var score = [0, 0];

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
        is_changed = makeMove(i, j, currentTurnColor);
        if (is_changed) {
            currentTurnColor = switchColor(currentTurnColor);
        }
    }
}

function initGame() {
    setTurn(WHITE);
    setSpot(BOARD_SIZE/2-1, BOARD_SIZE/2-1, WHITE);
    setSpot(BOARD_SIZE/2-1, BOARD_SIZE/2, BLACK);
    setSpot(BOARD_SIZE/2, BOARD_SIZE/2-1, BLACK);
    setSpot(BOARD_SIZE/2, BOARD_SIZE/2, WHITE);
}

function setTurn(color) {
    currentTurnColor = color;
}

function switchColor(color) {
    return color % 2 + 1;
}

function updateScore(old_color, new_color) {
    score[new_color-1]++;
    if (old_color != BLANK) {
        score[old_color-1]--;
    }
}

function makeMove(i, j, color) {
    if (isSpotColor(i, j, BLANK)) {
        cellsToChange = getCellsToChangeByMove(i, j, color);
        if (cellsToChange.length > 0) {
            for (changeIndex=0; changeIndex<cellsToChange.length; changeIndex++) {
                setSpot(cellsToChange[changeIndex][0], cellsToChange[changeIndex][1], color);
            }
            return true;
        }
    }
    return false;
}

function setSpot(i, j, color) {
    updateScore(cells[i][j].value, color);
    cells[i][j].elem.innerHTML = color;
    cells[i][j].value = color;
}

function isSpotColor(i, j, color) {
    return isSpotInBoard(i, j) && cells[i][j].value === color;
}

function getCellsToChangeByMove(i, j, color) {
    cellsToChange = [];
    for (diri=-1; diri<=1; diri++) {
        nexti = i + diri;
        for (dirj=-1; dirj<=1; dirj++) {
            nextj = j + dirj;
            colorFlushSpots = getColorFlushSpots(switchColor(color), nexti, nextj, diri, dirj);
            cellsToChange = cellsToChange.concat(colorFlushSpots);
        }
    }
    if (cellsToChange.length > 0) {
        cellsToChange.push([i, j]);
    }
    return cellsToChange
}

function getColorFlushSpots(color, i, j, diri, dirj) {
    return getColorFlushSpotsAccumalator([], color, i, j, diri, dirj);
}

function getColorFlushSpotsAccumalator(spots, color, i, j, diri, dirj) {
    if (isSpotColor(i, j, switchColor(color))) {
        return spots;
    }
    if (isSpotColor(i, j, color)) {
        spots.push([i, j]);
        return getColorFlushSpotsAccumalator(spots, color, i+diri, j+dirj, diri, dirj);
    }
    return []
}

function isSpotInBoard(i, j) {
    return isNumBetween(i, 0, BOARD_SIZE-1) && isNumBetween(j, 0, BOARD_SIZE-1);
}

function isNumBetween(x, min, max) {
    return x >= min && x <= max;
}
