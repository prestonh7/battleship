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
  const placeShip = () => {

  };
  const receiveAttack = (x, y) => {

  };

  return { placeShip, receiveAttack };
};
