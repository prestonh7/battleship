const shipFactory = (length) => {
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

  return { hit };
};
