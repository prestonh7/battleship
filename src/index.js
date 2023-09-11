import './style.css';

const shipFactory = (size) => {
  let hits = 0;
  const length = size;

  const isSunk = () => {
    if (hits === length) {
      return true;
    }
    return false;
  };

  const hit = () => {
    hits += 1;
  };

  return { length, hit, isSunk };
};

const gameboardFactory = () => {
  const boardSize = 10;
  const board = [];
  const shipArray = [];
  let shipIndex = 0;

  const createBoard = () => {
    for (let i = 0; i < boardSize; i += 1) {
      board[i] = Array(boardSize).fill(null);
    }
  };

  const placeShip = (x, y, isHorizontal, length) => {
    const ship = shipFactory(length);
    if (isHorizontal) {
      for (let i = 0; i < length; i += 1) {
        board[x][y + i] = shipIndex;
      }
    } else {
      for (let i = 0; i < length; i += 1) {
        board[x + i][y] = shipIndex;
      }
    }
    shipArray.push(ship);
    shipIndex += 1;
  };

  const canPlaceShip = (length, x, y, isHorizontal) => {
    if (isHorizontal) {
      if (y + length > boardSize) {
        return false;
      }

      for (let i = y; i < y + length; i += 1) {
        if (board[x][i] !== null) {
          return false;
        }
      }
    } else {
      if (x + length > boardSize) {
        return false;
      }

      for (let i = x; i < x + length; i += 1) {
        if (board[i][y] !== null) {
          return false;
        }
      }
    }

    return true;
  };

  const receiveAttack = (x, y) => {
    if (board[x][y] !== null && board[x][y] !== 'miss') {
      const index = board[x][y];
      board[x][y] = 'hit';
      shipArray[index].hit();
    } else {
      board[x][y] = 'miss';
    }
  };

  const getValue = (x, y) => board[x][y];

  return {
    board, createBoard, placeShip, canPlaceShip, receiveAttack, getValue,
  };
};

const playerFactory = () => {
  let allShipsPlaced = false;

  const attack = (opponent, x, y) => {
    opponent.receiveAttack(x, y);
  };

  const changePhase = () => {
    allShipsPlaced = true;
  };

  const shipsPlaced = () => allShipsPlaced;

  const placeAllShips = (gameboard, x, y, length) => {
    const isHorizontal = true;
    let isValidPlacement = false;

    isValidPlacement = gameboard.canPlaceShip(length, x, y, isHorizontal);

    if (!isValidPlacement) {
      alert('Invalid placement');
    } else {
      gameboard.placeShip(x, y, isHorizontal, length);
    }
  };
  return {
    attack, placeAllShips, shipsPlaced, changePhase,
  };
};

const computerFactory = () => {
  const checkIfValid = (opponent, x, y) => {
    const attack = opponent.board[x][y];
    const isValid = attack === null || attack === 'miss' || typeof attack === 'object';

    return isValid;
  };

  const randomAttack = (opponent) => {
    let isValidAttack = false;
    let x;
    let y;

    while (!isValidAttack) {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);

      isValidAttack = checkIfValid(opponent, x, y);
    }

    opponent.receiveAttack(x, y);
  };

  const randomDirection = () => {
    const randomNumber = Math.random();
    return randomNumber >= 0.5;
  };

  const placeAllShips = (gameboard) => {
    const shipLengths = [5, 4, 3, 3, 2];
    for (let shipIndex = 0; shipIndex < shipLengths.length; shipIndex += 1) {
      const isHorizontal = randomDirection();
      let validPlacement = false;
      let x;
      let y;

      while (!validPlacement) {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        validPlacement = gameboard.canPlaceShip(shipLengths[shipIndex], x, y, isHorizontal);
      }

      if (validPlacement) {
        gameboard.placeShip(x, y, isHorizontal, shipLengths[shipIndex]);
      }
    }
  };

  return { randomAttack, placeAllShips };
};

const gameState = () => {
  const userBoard = gameboardFactory();
  const compBoard = gameboardFactory();
  const user = playerFactory();
  const computer = computerFactory();

  const shipLengths = [5, 4, 3, 3, 2];
  let shipIndex = 0;
  let placementPhase = true;

  const initializeBoards = () => {
    userBoard.createBoard();
    compBoard.createBoard();
    computer.placeAllShips(compBoard);
    console.table(compBoard.board);
  };

  const shipPlacement = (x, y) => {
    if (shipIndex < shipLengths.length) {
      user.placeAllShips(userBoard, x, y, shipLengths[shipIndex]);
      shipIndex += 1;
      console.table(userBoard.board);
      if (shipIndex === shipLengths.length) {
        placementPhase = false;
      }
    }
  };

  const playTurn = (x, y) => {
    if (placementPhase) {
      shipPlacement(x, y);
    } else {
      user.attack(compBoard, x, y);
      computer.randomAttack(userBoard);
    }
  };

  const getBoardValue = (x, y) => {
    userBoard.getValue(x, y);
  };

  return {
    initializeBoards, playTurn, getBoardValue,
  };
};

const displayController = (game) => {
  const updateGameboard = (button, x, y) => {
    const value = game.getBoardValue(x, y);
    if (value === 'miss') {
      button.classList.add('miss');
    } else if (typeof value === 'object') {
      button.classList.add('hit');
    }
  };

  const handleButtonClick = (button, x, y) => {
    game.playTurn(x, y);
    updateGameboard(button, x, y);
  };

  const generatePlayerScreen = () => {
    const content = document.querySelector('.userBoard');
    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        const button = document.createElement('button');
        button.addEventListener('click', () => {
          handleButtonClick(button, i, j);
        });
        button.className = `gameTile ${i}, ${j}`;
        content.appendChild(button);
      }
    }
  };

  const generateComputerScreen = () => {
    const content = document.querySelector('.computerBoard');
    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        const button = document.createElement('button');
        button.addEventListener('click', () => {
          handleButtonClick(i, j);
        });
        button.className = `gameTile ${i}, ${j}`;
        content.appendChild(button);
      }
    }
  };

  const initializeScreen = () => {
    generatePlayerScreen();
    generateComputerScreen();
  };

  return { initializeScreen, handleButtonClick };
};

const game = gameState();
game.initializeBoards();

const display = displayController(game);
display.initializeScreen();
