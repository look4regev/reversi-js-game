let BLANK = 0;
let WHITE = 1;
let BLACK = 2;
let BOARD_SIZE = 8;
let SCORE_COLOR_TO_TEXT = ["", "White: ", "Black: "];

var currentTurnColor = null;
var mainDiv = null;
var cells = [];
var score = [{}, {value: 0}, {value: 0}];
var timers = [{ turns: 0, time: 0, timerFunc: increaseTimeForWhite, timerHandle: null, timerDiv: null},
    {turns: 0, time: 0, timerFunc: increaseTimeForBlack, timerHandle: null, timerDiv: null}];
var gameInterval = null;

function init(divId) {
    mainDiv = document.getElementById(divId);
    makeScoreCard();
    makeStatisticsCard();
    makeBoard();
    initGame();
}

function makeBoard() {
    let boardTable = document.createElement('table');
    for (let i=0; i<BOARD_SIZE; i++) {
        tr = document.createElement('tr');
        cells[i] = [];
        for (let j=0; j<BOARD_SIZE; j++) {
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

function makeScoreCard() {
    let scoreCard = document.createElement('p');

    score[WHITE].elem = document.createElement('span');
    score[BLACK].elem = document.createElement('span');

    scoreCard.appendChild(score[WHITE].elem);
    scoreCard.appendChild(score[BLACK].elem);
    mainDiv.appendChild(scoreCard);
}

function makeStatisticsCard() {
    let statisticsCard = document.createElement('div');
    statisticsCard.className = 'statistics';

    timer = document.createElement('span');
    timer.innerText = 'Elapsed Time: 0';
    timer.className = 'inner_statistics';
    statisticsCard.appendChild(timer);
    gameInterval = setInterval(increaseTime, 1000);

    movesCounter = document.createElement('span');
    movesCounter.innerText = 'Total Moves: 0';
    movesCounter.className = 'inner_statistics';
    statisticsCard.appendChild(movesCounter);

    let avgWhiteTimer = document.createElement('span');
    avgWhiteTimer.innerText = 'White Avg Time: 0s';
    avgWhiteTimer.className = 'inner_statistics';
    timers[WHITE - 1].timerDiv = avgWhiteTimer;
    statisticsCard.appendChild(avgWhiteTimer);

    let avgBlackTimer = document.createElement('span');
    avgBlackTimer.innerText = 'Black Avg Time: 0s';
    avgBlackTimer.className = 'inner_statistics';
    timers[BLACK - 1].timerDiv = avgBlackTimer;
    statisticsCard.appendChild(avgBlackTimer);

    mainDiv.appendChild(statisticsCard);
}

function increaseTime() {
    timer.innerText = timer.innerText.split(':')[0] + ': ' + (parseInt(timer.innerText.split(':')[1]) + 1);
}

function increaseTimeForWhite() {
    increaseTimeForColor(WHITE);
}

function increaseTimeForBlack() {
    increaseTimeForColor(BLACK);
}

function increaseTimeForColor(color) {
    timers[color - 1].time++;
}

function clearTimer(color) {
    clearInterval(timers[color - 1].timerHandle);
    timers[color - 1].turns++;
    timers[color - 1].timerDiv.innerText = timers[color - 1].timerDiv.innerText.split(':')[0] + ': ' + Math.round(timers[color - 1].time / timers[color - 1].turns) + 's';
}

function setTimer(color) {
    timers[color - 1].timerHandle = setInterval(timers[color - 1].timerFunc, 1000);
}

function bindCellClick(i, j, td) {
    td.onclick = function(event) {
        is_changed = makeMove(i, j, currentTurnColor);
        if (is_changed) {
            movesCounter.innerText = movesCounter.innerText.split(':')[0] + ': ' + (parseInt(movesCounter.innerText.split(':')[1]) + 1);
            clearTimer(currentTurnColor);
            currentTurnColor = switchColor(currentTurnColor);
            setTimer(currentTurnColor);
            movesMarkedCount = markMove(currentTurnColor);
            if (isOneColorScoreZeroed() || isBoardFull() || movesMarkedCount === 0) {
                showWinner();
            }
        }
    }
}

function showWinner() {
    winnerElement = document.createElement('p');
    text = "End of game! The winner is ";
    if (score[WHITE].value > score[BLACK].value) {
        winnerElement.innerHTML = text + "White!"
    } else {
        if (score[WHITE].value < score[BLACK].value) {
            winnerElement.innerHTML = text + "Black!"
        } else {
            winnerElement.innerHTML = text + "Both! It's a tie!"
        }
    }
    mainDiv.appendChild(winnerElement);
    clearInterval(gameInterval);
}

function isOneColorScoreZeroed() {
    return (score[WHITE].value == 0 && score[BLACK].value > 0) ||
           (score[WHITE].value > 0 && score[BLACK].value == 0);
}

function isBoardFull() {
    for (let i=0; i<BOARD_SIZE; i++) {
        for (let j=0; j<BOARD_SIZE; j++) {
            if (cells[i][j].value === BLANK) {
                return false;
            }
        }
    }
    return true;
}

function initGame() {
    setTurn(WHITE);
    setSpot(BOARD_SIZE/2-1, BOARD_SIZE/2-1, WHITE);
    setSpot(BOARD_SIZE/2-1, BOARD_SIZE/2, BLACK);
    setSpot(BOARD_SIZE/2, BOARD_SIZE/2-1, BLACK);
    setSpot(BOARD_SIZE/2, BOARD_SIZE/2, WHITE);
    markMove(WHITE);
    timers[WHITE - 1].timerHandle = setInterval(timers[WHITE - 1].timerFunc, 1000);
}

function setTurn(color) {
    currentTurnColor = color;
}

function switchColor(color) {
    return color % 2 + 1;
}

function invalidateScore(color) {
    score[color].elem.innerHTML = SCORE_COLOR_TO_TEXT[color] + score[color].value + " &nbsp; ";
}

function updateScore(oldColor, newColor) {
    if (newColor != BLANK) {
        score[newColor].value++;
        invalidateScore(newColor);
    }
    if (typeof oldColor !== "undefined" && oldColor != BLANK) {
        score[oldColor].value--;
        invalidateScore(oldColor);
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

function markMove(color) {
    var movesMarkedCount = 0;
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (isSpotColor(i, j, BLANK)) {
                if (getCellsToChangeByMove(i, j, color).length > 0) {
                    cells[i][j].elem.className = "clickable_" + color;
                    movesMarkedCount++;
                } else if (cells[i][j].elem.className.startsWith("clickable_")) {
                    cells[i][j].elem.className = '';
                }
            }
        }
    }
    return movesMarkedCount;
}

function setSpot(i, j, color) {
    updateScore(cells[i][j].value, color);
    cells[i][j].elem.innerHTML = "<span id=\"" + color + "\" class=\"color_" + color + "\">";
    cells[i][j].value = color;
    if (cells[i][j].value !== BLANK) {
        cells[i][j].elem.className = "clicked";
    }
}

function isSpotColor(i, j, color) {
    return isSpotInBoard(i, j) && cells[i][j].value === color;
}

function getCellsToChangeByMove(i, j, color) {
    let cellsToChange = [];
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