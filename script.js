function Cell() {

    let value = ``;

    const addValue = (player) => value = player;

    const getValue = () => value;

    return { addValue, getValue };
}

function GameBoard() {

    const board = [];

    for (let row = 0; row < 3; row++) {
        board[row] = [];
        for(let col = 0; col < 3; col++) {
            board[row].push(Cell());
        }
    }

    const getBoard = () => board;

    const putToken = (row, col, playerToken) => {
        board[row][col].addValue(playerToken);
    }

    const printBoard = () => {
        const displayingBoardValue = board.map(row => row.map(cell => cell.getValue()));
        console.log(displayingBoardValue);
    }

    return { getBoard, putToken, printBoard };
}

function GameController(playerOne = `Ivan`, playerTwo = `Jim`) {

    const board = GameBoard();

    const players = [
        { playerName: playerOne, token: `X` },
        { playerName: playerTwo, token: `O` }
    ];

    let currentPlayer = players[0];

    const getCurrentPlayer = () => currentPlayer;

    const switchPlayer = () => currentPlayer = currentPlayer === players[0] ? players[1] : players[0];

    const intro = () => {
        board.printBoard();
        console.log(`Welcome Game Start!`);
        console.log(`${getCurrentPlayer().playerName} will start`);
    }

    const playRound = (row, col) => {

        const player = getCurrentPlayer();

        const targetCell = board.getBoard()[row].find((_, colIndex) => colIndex === col);

        const checkWin = () => {
            const length = board.getBoard().length;

            if (board.getBoard()[row].every(cell => cell.getValue() === player.token)) return true; // check row where the value was placed.
            if (board.getBoard().every(item => item[col].getValue() === player.token)) return true; // check column where the value was placed.
            if (row === col && board.getBoard().every((_, index) => board.getBoard()[index][index].getValue() === player.token)) return true; // check top-left to bottom-right 
            if (row + col === length - 1 && board.getBoard().every((_, index) => board.getBoard()[index][length - 1 - index].getValue() === player.token)) return true // check top right to bottom left

            return false;
        }

        if (targetCell.getValue() === ``) {
            board.putToken(row, col, player.token);
            if (!checkWin()) {
                console.log(`${player.playerName} put his token in row ${row} and col ${col}`);
                switchPlayer();
                board.printBoard();
                console.log(`${getCurrentPlayer().playerName}'s turn`);
            } else {
                console.log(`GAME OVER!`);
                console.log(`${player.playerName} wins!`);
            }
        } else {
            console.log(`Please choose another tile`);
        }
    }

    return { playRound, intro };
}

const game = GameController();
game.intro();
