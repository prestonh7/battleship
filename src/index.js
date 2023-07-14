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
    if (isSunk) return;
    hitpoints -= 1;
  };

  return { length, hit };
};

const gameboardFactory = () => {
  const boardSize = 10;
  const board = [];

  const createBoard = () => {
    for (let i = 0; i < boardSize; i += 1) {
      board[i] = Array(boardSize).fill(null);
    }
  };

  const placeShip = (ship, x, y, isHorizontal) => {
    if (isHorizontal) {
      for (let i = 0; i < ship.length; i += 1) {
        this.board[x][y + i] = ship;
      }
    } else {
      for (let i = 0; i < ship.length; i += 1) {
        this.board[x + i][y] = ship;
      }
    }
  };
  const receiveAttack = (x, y) => {
    if (this.board[x][y] !== null) {
      this.board[x][y].hit();
    } else {
      this.board[x][y] = 'miss';
    }
  };

  return { createBoard, placeShip, receiveAttack };
};

const playerOneBoard = gameboardFactory();
playerOneBoard.createBoard();
