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
      const ship = shipFactory(length);
      gameboard.placeShip(ship, x, y, isHorizontal);
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

  const checkIfValidShip = (gameboard, x, y) => {
    const placement = gameboard[x][y];
    return placement === null;
  };

  const randomDirection = () => {
    const randomNumber = Math.random();
    return randomNumber >= 0.5;
  };

  // Rewrite this so it doesnt use x as a variable
  const placeAllShips = (gameboard) => {
    const shipLengths = [5, 4, 3, 3, 2];
    for (let shipIndex = 0; shipIndex < shipLengths.length; shipIndex += 1) {
      let validPlacement = false;
      let x;
      let y;

      while (!validPlacement) {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        validPlacement = checkIfValidShip(gameboard.board, x, y);
      }

      if (validPlacement) {
        const isHorizontal = randomDirection();
        const ship = shipFactory(shipLengths[shipIndex]);
        gameboard.placeShip(ship, x, y, isHorizontal);
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
  const shipIndex = 0;
  let placementPhase = true;

  const initializeBoards = () => {
    userBoard.createBoard();
    compBoard.createBoard();
    computer.placeAllShips(compBoard);
    console.table(compBoard.board);
  };

  const shipPlacement = (x, y) => {
    if (shipIndex <= shipIndex.length) {
      user.placeAllShips(userBoard, x, y, shipLengths[shipIndex]);
    } else {
      placementPhase = false;
    }
  };

  const playTurn = (x, y) => {
    if (placementPhase) {
      shipPlacement(x, y);
    } else {
      user.attack(compBoard, x, y);
    }
  };

  return {
    initializeBoards, playTurn,
  };
};

const displayController = (game) => {
  const handleButtonClick = (x, y) => {
    game.playTurn(x, y);
  };

  const updateGameboards = () => {

  };

  const generatePlayerScreen = () => {
    const content = document.querySelector('.userBoard');
    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        const button = document.createElement('button');
        button.addEventListener('click', () => {
          handleButtonClick(i, j);
          updateGameboards();
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
          updateGameboards();
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
