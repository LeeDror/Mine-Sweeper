
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
    var elTime = document.querySelector('.time span');
    gGame.secsPassed += 1;    
    elTime.innerText = gGame.secsPassed;
}