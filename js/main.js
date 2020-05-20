'use strict'

const MINE = '💣';
const FLAG = '🚩';
const EMPTY = 'X';

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
    secsPassed: 0
};

function initGame() {
    gGame.secsPassed;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gBoard = buildBoard(gLevel.size);
    randomMines(gBoard, gLevel.mines);
    setMinesNegsCount(gBoard);
    renderBoard(gBoard);
    console.log(gBoard);
}

function checkGameOver() {
    //gGame.isOn = false;
    clearInterval(gGameInterval);
}

function renderBoard(board) {
    var elBoard = document.querySelector('.board');
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            strHTML += `<td data-i="${i}" data-j="${j}"
            onclick="cellClicked(this, ${i},${j})" oncontextmenu="cellMarked(${i},${j}) ">${EMPTY}</td>`
        }
        strHTML += '</tr>'
    }
    elBoard.innerHTML = strHTML;
}

function cellMarked(i, j) {
    if (!gGame.shownCount && !gGame.markedCount) {
        gGame.isOn = true;
        gGameInterval = setInterval(secondCount, 1000);
    }
    if (!gGame.isOn) return;
    var randomCellIdx = { i: i, j: j };
    var cellContent;
    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false;
        cellContent = EMPTY;
        gGame.markedCount--;
    } else {
        gBoard[i][j].isMarked = true;
        cellContent = FLAG;
        gGame.markedCount++;
    }
    // MODEL
    renderCell(randomCellIdx, cellContent);
    return false;
}

function cellClicked(elCell, i, j) {
    var cell = gBoard[i][j];
    // first cell
    if (gGame.shownCount === 0 && gGame.markedCount === 0) {
        gGame.isOn = true;
        gGameInterval = setInterval(secondCount, 1000);
        console.log('first cell')
    }
    // game over

    if (!gGame.isOn) return;

    // cell is marked
    if (cell.isMarked) return;
    console.log('cell is isMarked', cell.isMarked);
    // cell is shown
    if (cell.isShown) return;
    console.log('cell is shown', cell.isShown);

    // MODEL
    cell.isShown = true;
    gGame.shownCount++;
    console.log('count++');

    // mine in cell
    if (cell.isMine) {
        elCell.innerHTML = MINE;
        revelMines(gBoard, elCell);
        checkGameOver(true);
    }
    // no negs
    else if (!cell.minesAroundCount) {
        elCell.innerHTML = '';
        expandShown(gBoard, elCell, i, j);
        checkGameOver(false);
        console.log('no negs');
        return;
    }
    // negs
    else {
        elCell.innerHTML = cell.minesAroundCount;
        checkGameOver();
    }

    // else if (!cell.minesAroundCount) cellContent = '';
    // else cellContent = cell.minesAroundCount;
    // renderCell(randomCellIdx, cellContent);
    checkGameOver()
}


function expandShown(board, elCell, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            if (board[i][j].isMine) continue;
            if (board[i][j].isShown) continue;

            else {
                elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
                cellClicked(elCell, i, j);
                console.log(board[i][j]);
            }
        }
    }
}

function revelMines(board, elCell) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) {
                renderCell({ 'i': i, 'j': j }, MINE);
                // elCell.innerHTML = MINE;
                // console.log('board[i][j]', board[i][j]);
                // console.log('board[i][j].isMine', board[i][j].isMine);
                // console.log('elCell', elCell);
                // console.log('i', i, 'j', j);
            }
        }
    }
}

function renderCell(pos, value) {
    var elCell = document.querySelector(`[data-i="${pos.i}"][data-j="${pos.j}"]`);
    elCell.innerText = value;
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


function randomMines(board, mineNum) {
    var emptyCells = getEmptyCells(board);
    emptyCells = shuffle(emptyCells);

    for (var i = 0; i < mineNum; i++) {
        var cellIdxs = emptyCells[emptyCells.length - 1];
        var randomCell = board[cellIdxs.i][cellIdxs.j];
        // MODEL
        console.log(cellIdxs.i, cellIdxs.j);
        randomCell.isMine = true;
        emptyCells.pop();
    }
}
