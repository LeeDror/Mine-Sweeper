
function getEmptyCells(mat) {
    var emptyCells = [];
    for (let i = 0; i < mat.length; i++) {
        for (let j = 0; j < mat[i].length; j++) {
            emptyCells.push({ i: i, j: j });
        }
    }
    return emptyCells;
}

function shuffle(array) {
    for (var i = 0; i < array.length; i++) {
        var j = Math.floor(Math.random() * i);
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function secondCount() {
    gGame.secsPassed += 1;
    gElTime.innerText = gGame.secsPassed;
}

function renderMarkCount() {
    var elMarkCount = document.querySelector('.mark-count span');
    elMarkCount.innerText = gGame.markedCount;
}

function renderLivesCount() {
    gElLives.innerText = gGame.lives;
    //console.log(gGame.lives);
}

function getBestTime() {
    console.log(' getBestTime ');
    var gameTime = gGame.secsPassed;
    console.log('gameTime', gameTime);
    console.log('bestTimeEazy', bestTimeEazy);
    console.log('gLevel.size', gLevel.size);
    localStorage.setItem('bestTimeEazy', 999);
    localStorage.clear();
    if (gLevel.size = 4) {
        if (gameTime < bestTimeEazy) {
            localStorage.setItem('bestTimeEazy', bestTimeEazy);
            document.querySelector('.eazy span').innerHTML = localStorage.getItem('bestTimeEazy');
            return;
        }
    }
    if (gLevel.size = 8) {
        if (gameTime < bestTimeHard) {
            console.log('hard best time');
            localStorage.setItem('bestTimeHard', bestTimeHard);
            document.querySelector('.hard span').innerHTML = localStorage.getItem('bestTimeHard');
            return;
        }
    }
    if (gLevel.size = 12) {
        if (gameTime < bestTimeExtreme) {
            localStorage.setItem('bestTimeExtreme', bestTimeExtreme);
            document.querySelector('.extreme span').innerHTML = localStorage.getItem('bestTimeExtreme');
            return;
        }
    }
}



/*
        var numColor;
        switch (cell.minesAroundCount) {
            case 1: numColor = 'purple'; break;
            case 2: numColor = 'red'; break;
            case 3: numColor = 'grey'; break;
            case 4: numColor = 'green'; break;
            default:
        }
        elCell.style.color = numColor;
*/