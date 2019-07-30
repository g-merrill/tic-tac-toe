// constants (variables that won't ever change)
const COLORS = {
    '0': '#ff0000',
    '1': '#ffffff'
}
// state variables (static variables that get updated when events happen and will affect what game will render)
let board, turn, winner, lastStarter; 
// cache (grabbing elements from html/css and storing them as variables)
let blinkerOne = document.getElementById('turnPlayerOne');
let blinkerTwo = document.getElementById('turnPlayerTwo');
let turnMsg = document.getElementById('turnMsg');
let whoseTurn = document.getElementById('whoseTurn');
let winMsgOne = document.getElementById('winnerPlayerOne');
let winMsgTwo = document.getElementById('winnerPlayerTwo');
let tieMsg = document.getElementById('tie');
let resetBtn = document.getElementById('reset');

// event listeners
resetBtn.addEventListener('click', resetBoard);

// functions
init();
function init() {
    board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    // winner will be null, 1, 2, or 'tie'
    winner = null;
    // clear and assign event listeners to each tile by cycling through board array
    board.forEach(function(colArr, colIdx) {
        colArr.forEach(function(rowVal, rowIdx) {
            let tile = document.getElementById(`c${colIdx}r${rowIdx}`);
            tile.innerHTML = '';
            tile.addEventListener('click', handleClick);
        });
    });
    // need to set indicator to player 1
    blinkerOne.style.visibility = 'visible';
    whoseTurn.textContent = '1';
    turnMsg.style.visibility = 'visible';
    // remember that player 1 started for this game
    lastStarter = 1;
    // turn will be turns 1-9, clicks will not do anything > 9
    turn = 1;
}
function handleClick(evt) {
    // if board is full, return
    if (turn > 9 || (turn > 8 && lastStarter === 2)) {
        return;
    }
    let tile = evt.target;
    // if board value is not zero, return 
    let colIdx = tile.id.charAt(1);
    let rowIdx = tile.id.charAt(3);
    if (board[colIdx][rowIdx] !== 0) {
        return;
    }
    // if there is a winner already, return
    if (winner === 1 || winner === 2) {
        return;
    }
    // change the board
    render(tile);
    // update the turn value
    turn += 1;
}
function render(tile) {
    // change all prev clicked p text to 50% opacity
    let clickedTiles = document.querySelectorAll('#clicked');
    for (let i = 0; i < clickedTiles.length; i++) {
        clickedTiles[i].style.opacity = 0.5;
    }
    // update board array based on tile clicked
    let colIdx = tile.id.charAt(1);
    let rowIdx = tile.id.charAt(3);
    board[colIdx][rowIdx] = turn % 2 === 1 ? 1 : 2;
    // write X or O to tile, depending on board array value
    tile.innerHTML = `<p id='clicked'>${board[colIdx][rowIdx] % 2 === 1 ? 'X' : 'O'}</p>`;
    // check if winner, if so, display winner message for that player and return
    // checkWinner function will also check if tie, and if so, display tie message and return
    checkWinner();
    switch (winner) {
        case 1:
            winMsgOne.style.visibility = 'visible';
            break;
        case 2:
            winMsgTwo.style.visibility = 'visible';
            break;
        case 'tie':
            tieMsg.style.visibility = 'visible';
            break;
        case null:
            break;
    }
    // update turn span and indicator to next player based on current turn
    if (winner === null) {
        if (turn % 2 === 1) {
            blinkerOne.style.visibility = 'hidden';
            blinkerTwo.style.visibility = 'visible';
            whoseTurn.textContent = '2';
        } else {
            blinkerOne.style.visibility = 'visible';
            blinkerTwo.style.visibility = 'hidden';
            whoseTurn.textContent = '1';
        }
    } else if (winner === 'tie') {
        blinkerOne.style.visibility = 'visible';
        blinkerTwo.style.visibility = 'visible';
        turnMsg.style.visibility = 'hidden';
    } else {
        // hide turn message when someone wins
        turnMsg.style.visibility = 'hidden';
    }
}
function checkWinner() {
    // if there are three marks in a row/colum/diag, push sum of those three to sums array to be checked for a winner
    let sums = [];
    function zeroCheck(valOne, valTwo, valThree) {
        if (valOne !== 0 && valTwo !== 0 && valThree !== 0) {
            sums.push(valOne + valTwo + valThree);
        }
    }
    // win combinations
    zeroCheck(board[0][0], board[0][1], board[0][2]);
    zeroCheck(board[1][0], board[1][1], board[1][2]);
    zeroCheck(board[2][0], board[2][1], board[2][2]);
    zeroCheck(board[0][0], board[1][0], board[2][0]);
    zeroCheck(board[0][1], board[1][1], board[2][1]);
    zeroCheck(board[0][2], board[1][2], board[2][2]);
    zeroCheck(board[0][0], board[1][1], board[2][2]);
    zeroCheck(board[0][2], board[1][1], board[2][0]);
    // player win logic
    for (let sum of sums) {
        if (sum === 3) {
            winner = 1;
            return;
        } else if (sum === 6) {
            winner = 2;
            return;
        }
    }
    // players tie / no winners yet logic
    if (winner === null && turn === 9) {
        winner = 'tie';
        return;
    } else if (winner === null && turn === 8 && lastStarter === 2) {
        winner = 'tie';
        return;
    } else {
        return;
    }
}
function resetBoard() {
    // utilizing all the resets from init function, but keeping lastStarter value from previous games
    let storeLastStarter = lastStarter;
    init();
    lastStarter = storeLastStarter;
    winMsgOne.style.visibility = 'hidden';
    winMsgTwo.style.visibility = 'hidden';
    tieMsg.style.visibility = 'hidden';
    if (lastStarter === 1) { 
        blinkerOne.style.visibility = 'hidden';
        blinkerTwo.style.visibility = 'visible';
        whoseTurn.textContent = '2';
        turn = 0;
        lastStarter = 2;
    } else {
        blinkerOne.style.visibility = 'visible';
        blinkerTwo.style.visibility = 'hidden';
        whoseTurn.textContent = '1';
        lastStarter = 1;
    }
}