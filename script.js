function Cell() {

    let value = ``;

    const addValue = (player) => value = player;

    const getValue = () => value;

    return { addValue, getValue };
}

const GameBoard = (() => {

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
})();

const DomDisplay = () => {

    const mainDiv = document.querySelector(`.main`);
    const startButton = mainDiv.querySelector(`.start`);
    const ticTacToeGrid = mainDiv.querySelector(`div:first-of-type`);
    const announcementDiv = mainDiv.querySelector(`div:last-of-type`);

    const displayBoard = (board) => {
        ticTacToeGrid.classList.add(`grid-generator`);
        startButton.addEventListener(`click`, () => {
            ticTacToeGrid.innerHTML = "";
            board.forEach((row,rowIndex) => {
                row.forEach((_, colIndex) => {
                    const cell = document.createElement(`button`);
                    cell.setAttribute(`data-row`, rowIndex);
                    cell.setAttribute(`data-col`, colIndex);
                    ticTacToeGrid.appendChild(cell);
                })
            })
        })
    }

    return { displayBoard };
}

function GameController(playerOne = `Ivan`, playerTwo = `Jim`) {

    const dom = DomDisplay();

    const players = [
        { playerName: playerOne, token: `X` },
        { playerName: playerTwo, token: `O` }
    ];

    let currentPlayer = players[0];

    const getCurrentPlayer = () => currentPlayer;

    const switchPlayer = () => currentPlayer = currentPlayer === players[0] ? players[1] : players[0];

    const intro = () => {
        dom.displayBoard(GameBoard.getBoard());
    }

    const playRound = (row, col) => {

        const player = getCurrentPlayer();

        const targetCell = GameBoard.getBoard()[row].find((_, colIndex) => colIndex === col);

        const checkDraw = () => GameBoard.getBoard().every(item => item.every(cell => cell.getValue() !== ``));

        const checkWin = () => {
            const length = GameBoard.getBoard().length;

            if (GameBoard.getBoard()[row].every(cell => cell.getValue() === player.token)) return true; // check row where the value was placed.
            if (GameBoard.getBoard().every(item => item[col].getValue() === player.token)) return true; // check column where the value was placed.
            if (row === col && GameBoard.getBoard().every((_, index) => GameBoard.getBoard()[index][index].getValue() === player.token)) return true; // check top-left to bottom-right 
            if (row + col === length - 1 && GameBoard.getBoard().every((_, index) => GameBoard.getBoard()[index][length - 1 - index].getValue() === player.token)) return true // check top right to bottom left

            return false;
        }

        if (targetCell.getValue() === ``) {
            GameBoard.putToken(row, col, player.token);
            if (!checkWin() && !checkDraw()) {
                console.log(`${player.playerName} put his token in row ${row} and col ${col}`);
                switchPlayer();
                GameBoard.printBoard();
                console.log(`${getCurrentPlayer().playerName}'s turn`);
            } else if (checkDraw()) {
                console.log(`GAME OVER! It's DRAW`);
            } else {
                console.log(`GAME OVER!`);
                console.log(`${player.playerName} wins!`);
            }
        } else {
            console.log(`Please choose another tile`);
        }
    }

    intro();

    return { playRound };
}

const game = GameController();