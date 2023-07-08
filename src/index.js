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

  const placeShip = () => {

  };
  const receiveAttack = (x, y) => {

  };

  return { createBoard, placeShip, receiveAttack };
};

const playerOneBoard = gameboardFactory();
playerOneBoard.createBoard();
