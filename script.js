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

    return { getBoard, putToken };
})();

const DomDisplay = () => {

    let control = GameController();

    const mainDiv = document.querySelector(`.main`);
    const startButton = mainDiv.querySelector(`.start`);
    const resetButton = mainDiv.querySelector(`.reset`);
    const ticTacToeGrid = mainDiv.querySelector(`div:first-of-type`);
    const announcementDiv = mainDiv.querySelector(`.announcement`);
    const nameInputForm = mainDiv.querySelector(`dialog`);

    const form = nameInputForm.querySelector(`form`);
    const playerOneName = nameInputForm.querySelector(`#playerOne`);
    const playerTwoName = nameInputForm.querySelector(`#playerTwo`);
    const nameSubmitButton = nameInputForm.querySelector(`.submit-button button`);
    const closeFormButton = nameInputForm.querySelector(`.cancel-button button`);

    const displayBoard = () => {
        ticTacToeGrid.innerHTML = "";
        GameBoard.getBoard().forEach((row,rowIndex) => {
            row.forEach((col, colIndex) => {
                const cell = document.createElement(`button`);
                cell.setAttribute(`data-row`, rowIndex);
                cell.setAttribute(`data-col`, colIndex);
                cell.textContent = `${col.getValue()}`;
                ticTacToeGrid.appendChild(cell);
            })
        })
    }

    const announcement = (result) => {
        announcementDiv.innerHTML = "";
        const sayActivePlayer = document.createElement(`h2`);
        sayActivePlayer.textContent = result;
        announcementDiv.appendChild(sayActivePlayer);
    }

    const pressTile = () => {
        const targetCell = ticTacToeGrid.querySelector(`button:focus`);
        const row = parseInt(targetCell.getAttribute(`data-row`));
        const col = parseInt(targetCell.getAttribute(`data-col`));
        let gameStatus = control.playRound(row, col);
        displayBoard();
        return gameStatus;
    }

    const events = () => {
        startButton.addEventListener(`click`, getNames);
        ticTacToeGrid.addEventListener(`click`, gameRound);
        resetButton.addEventListener(`click`, reset);

        // form events below
        form.addEventListener(`submit`, (event) => {
            event.preventDefault();
            const pOne = playerOneName.value;
            const pTwo = playerTwoName.value;
            control = GameController(pOne,pTwo);
            gameStart();
            nameInputForm.close();
        })

    }

    const gameStart = () => {
        displayBoard();
        announcementDiv.innerHTML = "";
        const welcome = document.createElement(`p`);
        const welcomeTwo = document.createElement(`p`);
        welcome.textContent = `WELCOME ${control.getPlayers()[0]} and ${control.getPlayers()[1]}`;
        welcomeTwo.textContent = `Player 1 will always the first. That's you, ${control.getCurrentPlayerName()}. Pick a Tile.`;
        announcementDiv.appendChild(welcome);
        announcementDiv.appendChild(welcomeTwo);
    }

    const gameRound = () => {
        switch(pressTile()) {
            case `winner`:
                announcement(`GAME OVER! ${control.getCurrentPlayer().playerName} wins!`);
                break;
            case `draw`:
                announcement(`GAME OVER! It's a DRAW.`);
                break;
            default:
                announcement(`${control.getCurrentPlayer().playerName} is Done.`);
        };
    }

    const reset = () => {
        control.reset();
        displayBoard();
    }

    const getNames = () => {
        nameInputForm.showModal();
    }

    events();
}

const GameController = (playerOne, playerTwo) => {

    let players = [
        { playerName: playerOne, token: `X` },
        { playerName: playerTwo, token: `O` }
    ];

    let currentPlayer = players[0];

    const getCurrentPlayer = () => currentPlayer;

    const getCurrentPlayerName = () => currentPlayer.playerName;

    const getPlayers = () => players.map(player => player.playerName);

    const switchPlayer = () => currentPlayer = currentPlayer === players[0] ? players[1] : players[0];

    const playRound = (row, col) => {

        const player = getCurrentPlayer();

        const targetCell = GameBoard.getBoard()[row].find((_, colIndex) => colIndex === col);

        const checkDraw = () => GameBoard.getBoard().every(item => item.every(cell => cell.getValue() !== ``)) && checkWin() === false;

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
                console.log(`${getCurrentPlayer().playerName}'s turn`);
            } else if (checkDraw()) {
                return `draw`;
            } else {
                return `winner`;
            }
        } else {
            console.log(`Please choose another tile`);
        }
    }

    const reset = () => {
        GameBoard.getBoard().forEach(row => row.forEach(cell => cell.addValue(``)));
        currentPlayer = players[0];
    }

    return { playRound, getCurrentPlayer, reset, getPlayers, getCurrentPlayerName };
}

DomDisplay();