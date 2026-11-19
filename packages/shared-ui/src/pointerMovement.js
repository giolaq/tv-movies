export function createPointerMovementTracker() {
  let previous;
  return (x, y) => {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
    const moved = !previous || previous.x !== x || previous.y !== y;
    previous = { x, y };
    return moved;
  };
}
