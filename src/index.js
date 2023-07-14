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

  // Need to check if placement is valid
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

  const receiveAttack = (x, y) => {
    if (board[x][y] !== null) {
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
    board, createBoard, placeShip, receiveAttack, allShipsSunk,
  };
};

const playerFactory = (userGameboard) => {
  const gameboard = userGameboard;
  const attack = (opponent, x, y) => {
    opponent.receiveAttack(x, y);
  };
  const logBoard = () => {
    console.table(gameboard);
  };

  return { logBoard, gameboard, attack };
};

const gameState = () => {
  const initializeGame = () => {
    const playerBoard = gameboardFactory();
    const computerBoard = gameboardFactory();
    playerBoard.createBoard();
    computerBoard.createBoard();

    const user = playerFactory(playerBoard);
    const computer = playerFactory(computerBoard); // Change this to ai
    const userCarrier = shipFactory(5);
    user.gameboard.placeShip(userCarrier, 1, 3, true);
    user.logBoard();
  };

  return { initializeGame };
};

const game = gameState();
game.initializeGame();
