const shipFactory = (size) => {
  const length = size;
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

  const placeAllShips = () => {
    const shipLengths = [5, 4, 3, 3, 2];

    // Remove confirm and prompts later
    shipLengths.forEach((length) => {
      const isHorizontal = window.confirm('Do you want to place this ship horizontally?');
      let isValidPlacement = false;

      while (!isValidPlacement) {
        const row = parseInt(prompt(`Enter the starting row (0-${boardSize}):`), 10);
        const column = parseInt(prompt(`Enter the starting column (0-${boardSize}):`), 10);

        isValidPlacement = canPlaceShip(length, row, column, isHorizontal);

        if (isValidPlacement) {
          const ship = shipFactory(length);
          placeShip(ship, row, column, isHorizontal);
        } else {
          alert('Invalid placement');
        }
      }
    });
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
    board, createBoard, placeShip, canPlaceShip, receiveAttack, allShipsSunk, placeAllShips,
  };
};

const playerFactory = (userGameboard) => {
  const gameboard = userGameboard;

  const attack = (opponent, x, y) => {
    opponent.receiveAttack(x, y);
  };

  const logBoard = () => { // Delete this later
    console.table(gameboard.board);
  };

  return {
    logBoard, gameboard, attack,
  };
};

const computerFactory = (computerBoard) => {
  const gameboard = computerBoard;

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
  const initializeGame = () => {
    const playerBoard = gameboardFactory();
    const computerBoard = gameboardFactory();

    const user = playerFactory(playerBoard);
    const computer = computerFactory(computerBoard);

    user.gameboard.createBoard();
    computer.gameboard.createBoard();

    playerBoard.placeAllShips();
    user.logBoard();
  };

  return { initializeGame };
};

const game = gameState();
game.initializeGame();
