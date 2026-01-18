
const calculateTravelTime = (room1, room2) => {
  const verticalTime = Math.abs(room1.floor - room2.floor) * 2;
  const horizontalTime = Math.abs(room1.position - room2.position);
  return verticalTime + horizontalTime;
};


const getBestOnSameFloor = (rooms, numRooms) => {
  let bestSubset = null;
  let minHorizontalSpan = Infinity;

  for (let i = 0; i <= rooms.length - numRooms; i++) {
    const subset = rooms.slice(i, i + numRooms);
    const horizontalSpan =
      subset[subset.length - 1].position - subset[0].position;

    if (horizontalSpan < minHorizontalSpan) {
      minHorizontalSpan = horizontalSpan;
      bestSubset = subset;
    }
  }

  return bestSubset;
};

const findOptimalRooms = (availableRooms, numRooms) => {
  if (!availableRooms || availableRooms.length < numRooms) return null;

  const rooms = availableRooms
    .filter(room => room.available)
    .sort((a, b) =>
      a.floor !== b.floor ? a.floor - b.floor : a.position - b.position
    );

  let bestCombination = null;
  let minTravelTime = Infinity;

  const uniqueFloors = [...new Set(rooms.map(room => room.floor))];

  for (const floor of uniqueFloors) {
    const floorRooms = rooms.filter(room => room.floor === floor);

    if (floorRooms.length >= numRooms) {
      return getBestOnSameFloor(floorRooms, numRooms);
    }
  }

  for (let i = 0; i <= rooms.length - numRooms; i++) {
    const combination = rooms.slice(i, i + numRooms);

    const travelTime = calculateTravelTime(
      combination[0],
      combination[combination.length - 1]
    );

    if (travelTime < minTravelTime) {
      minTravelTime = travelTime;
      bestCombination = combination;
    }
  }

  return bestCombination;
};

module.exports = {
  calculateTravelTime,
  findOptimalRooms
};
