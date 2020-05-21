'use strict'

const MINE = '💣';
const FLAG = '🚩';
const EMPTY = '';

const SMILEY = '😀';
const SMILEY_LOSE = '😭';
const SMILEY_WIN = '🥳';

var gBoard;
var gGameInterval;
var gLevel = {
    size: 4,
    mines: 2
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3
};
var gElSmiley = document.querySelector('button.smiley');;
var gElTime = document.querySelector('.time span');
var gElLives = document.querySelector('.lives span');
var gElTable = document.querySelector('table');

var bestTimeEazy = Infinity;
var bestTimeHard = Infinity;
var bestTimeExtreme = Infinity;

function initGame() {
    gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0, lives: 3 };
    gBoard = buildBoard(gLevel.size);
    renderBoard(gBoard);
    gElSmiley.innerHTML = SMILEY;
    gElTime.innerHTML = gGame.secsPassed;
    clearInterval(gGameInterval);
    renderLivesCount();
    gElTable.classList.remove('game-over');
    localStorage.setItem('bestTimeEazy', Infinity);
}

function changeLevel(size, mines) {
    gLevel.size = size;
    gLevel.mines = mines;
    initGame();
}

function checkGameOver() {    
    // win 1 - flag mine, shown count all 
    // win 2 - flag mine + minelives, shown count all 
    if (gGame.shownCount === gLevel.size ** 2 - gLevel.mines) {
        if ((gGame.markedCount + 3 - gGame.lives) === gLevel.mines) {
            console.log('Win');            
            gElSmiley.innerText = SMILEY_WIN;
            gameOver();
            return;
        }
    }
}

function gameOver() {
    gGame.isOn = false;
    clearInterval(gGameInterval);
    gElTable.classList.add('game-over');
    getBestTime();
}

function renderBoard(board) {
    var elBoard = document.querySelector('.board');
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            strHTML += `<td data-i="${i}" data-j="${j}" 
            onclick="cellClicked(this, ${i},${j})" oncontextmenu="cellMarked(this, ${i},${j})" class="cell" ></td>`
        }
        strHTML += '</tr>'
    }
    elBoard.innerHTML = strHTML;
}

function cellMarked(elCell, i, j) {
    if (gBoard[i][j].isShown) return;
    if (gGame.shownCount + gGame.markedCount === 0) {
        gGame.isOn = true;
        gGameInterval = setInterval(secondCount, 1000);
        //console.log('secondCount');
    }
    if (!gGame.isOn) return;
    var cellContent;
    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false;
        cellContent = EMPTY;
        gGame.markedCount--;
    } else {
        gBoard[i][j].isMarked = true;
        cellContent = FLAG;
        gGame.markedCount++;
        checkGameOver();
    }
    // MODEL
    elCell.innerText = cellContent;
    renderMarkCount();
}

function cellClicked(elCell, i, j) {
    var cell = gBoard[i][j];
    var cellIdx = { i: i, j: j };
    // first cell
    if (gGame.shownCount === 0 && gGame.markedCount === 0) {
        gGame.isOn = true;
        gGameInterval = setInterval(secondCount, 1000);
        randomMines(gBoard, gLevel.mines, cellIdx);
        setMinesNegsCount(gBoard);
    }
    // game over
    if (!gGame.isOn) return;
    // cell is marked
    if (cell.isMarked) return;
    // cell is shown
    if (cell.isShown) return;

    // MODEL
    cell.isShown = true;
    gGame.shownCount++;

    // mine in cell
    if (cell.isMine) {
        renderCell(cellIdx, MINE);
        gGame.lives--;
        renderLivesCount();

        if (gGame.lives) {
            //console.log('M-I-N-E');
            renderLivesCount();
            gGame.shownCount--;
            checkGameOver();
            return;
        }
        elCell.style.backgroundColor = "#da7676f1";;
        revelMines(gBoard, elCell);
        gElSmiley.innerText = SMILEY_LOSE;
        gameOver();
        return;
    }
    // no negs
    else if (!cell.minesAroundCount) {
        renderCell(cellIdx, EMPTY);
        expandShown(gBoard, elCell, i, j);
    }
    // negs
    else {
        renderCell(cellIdx, cell.minesAroundCount);
    }

    checkGameOver();
}

function expandShown(board, elCell, cellI, cellJ) {
    if (board[cellI][cellJ].minesAroundCount !== 0) return;

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (board[i][j].isMine) continue;
            if (board[i][j].isShown) continue;

            else {
                elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
                board[i][j].isShown = true;
                gGame.shownCount++;
                //console.log('gGame.shownCount', gGame.shownCount, 'i', i, 'j', j);
                var cellValue = (board[i][j].minesAroundCount) ? board[i][j].minesAroundCount : EMPTY;
                renderCell({ i: i, j: j }, cellValue);
                expandShown(board, elCell, i, j);
            }
        }
    }
}

function revelMines(board, elCell, i, j) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) {
                renderCell({ 'i': i, 'j': j }, MINE);
            }
        }
    }
}

function renderCell(pos, value) {
    var elCell = document.querySelector(`[data-i="${pos.i}"][data-j="${pos.j}"]`);
    elCell.innerText = value;
    elCell.classList.toggle('push');
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = countNeighbors(i, j, board);
        }
    }
}

function countNeighbors(cellI, cellJ, mat) {
    var neighborsSum = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (mat[i][j].isMine) neighborsSum++;
        }
    }
    return neighborsSum;
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.size; j++) {
            var cell = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false };
            board[i][j] = cell;
        }
    }
    return board;
}

function randomMines(board, mineNum, cellIdx) {
    var emptyCells = getEmptyCells(board);
    emptyCells = shuffle(emptyCells);

    for (var i = 0; i < mineNum; i++) {
        // not the firs cell clicked
        if (emptyCells[emptyCells.length - 1].i === cellIdx.i && emptyCells[emptyCells.length - 1].j === cellIdx.j) emptyCells.pop();
        var emptyCellIdxs = emptyCells[emptyCells.length - 1];
        var randomCell = board[emptyCellIdxs.i][emptyCellIdxs.j];
        // MODEL
        randomCell.isMine = true;
        emptyCells.pop();
    }
}
