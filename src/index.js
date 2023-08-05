import './style.css';

const shipFactory = (length) => {
  let hitpoints = length;

  const isSunk = () => {
    if (hitpoints === 0) {
      return true;
    }
    return false;
  };

  const hit = () => {
    hitpoints -= 1;
  };

  return { length, hit, isSunk };
};

const gameboardFactory = () => {
  const boardSize = 10;
  const board = [];
  const shipArray = [];

  const createBoard = () => {
    for (let i = 0; i < boardSize; i += 1) {
      board[i] = Array(boardSize).fill(null);
    }
  };

  const placeShip = (ship, x, y, isHorizontal) => {
    if (isHorizontal) {
      for (let i = 0; i < ship.length; i += 1) {
        board[x][y + i] = ship;
      }
    } else {
      for (let i = 0; i < ship.length; i += 1) {
        board[x + i][y] = ship;
      }
    }
    shipArray.push(ship);
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
      board[x][y].hit();
    } else {
      board[x][y] = 'miss';
    }
  };

  const allShipsSunk = () => {
    for (let i = 0; i < shipArray.length; i += 1) {
      if (!shipArray[i].isSunk()) {
        return false;
      }
    }
    return true;
  };

  return {
    board, createBoard, placeShip, canPlaceShip, receiveAttack, allShipsSunk,
  };
};

const playerFactory = () => {
  const gameboard = gameboardFactory();
  gameboard.createBoard();
  let allShipsPlaced = false;

  const attack = (opponent, x, y) => {
    opponent.receiveAttack(x, y);
  };

  const changePhase = () => {
    allShipsPlaced = true;
  };

  const shipsPlaced = () => allShipsPlaced;

  const placeAllShips = (x, y) => {
    const shipLengths = [5, 4, 3, 3, 2];
    let shipIndex = 0;
    const isHorizontal = true;
    let isValidPlacement = false;

    isValidPlacement = gameboard.canPlaceShip(shipLengths[shipIndex], x, y, isHorizontal);

    if (!isValidPlacement) {
      alert('Invalid placement');
    } else if (shipIndex <= 4) {
      const ship = shipFactory(shipLengths[shipIndex]);
      gameboard.placeShip(ship, x, y, isHorizontal);
      shipIndex += 1;
    } else {
      changePhase();
    }
  };
  return {
    attack, placeAllShips, gameboard, shipsPlaced,
  };
};

const computerFactory = () => {
  const gameboard = gameboardFactory();
  gameboard.createBoard();

  const checkIfValid = (opponent, x, y) => {
    const attack = opponent.gameboard.board[x][y];
    const isValid = attack === null || attack === 'miss' || typeof attack === 'object';

    return isValid;
  };

  const randomAttack = (opponent) => {
    let isValidAttack = false;
    let x;
    let y;

    while (!isValidAttack) {
      x = Math.floor(Math.random() * opponent.gameboard.boardSize);
      y = Math.floor(Math.random() * opponent.gameboard.boardSize);

      isValidAttack = checkIfValid(opponent, x, y);
    }

    opponent.gameboard.receiveAttack(x, y);
  };

  return { gameboard, randomAttack };
};

const gameState = () => {
  let turn = 1;

  const checkTurn = () => turn;

  const changeTurn = () => {
    if (turn === 1) {
      turn = 2;
    } else {
      turn = 1;
    }
  };

  return {
    checkTurn, changeTurn,
  };
};

const displayController = (game, user, computer) => {
  const handleButtonClick = (x, y) => {
    if (!user.shipsPlaced) {
      user.placeAllShips(x, y);
    }
  };

  const generatePlayerScreen = () => {
    const content = document.querySelector('.userBoard');
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

const user = playerFactory();
const computer = computerFactory();

user.placeAllShips();

const game = gameState();
game.initializeGame();

const display = displayController(game, user, computer);
display.initializeScreen();
