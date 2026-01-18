const calculateTravelTime = (room1, room2) => {
  const verticalTime = Math.abs(room1.floor - room2.floor) * 2;
  const horizontalTime = Math.abs(room1.position - room2.position);
  return verticalTime + horizontalTime;
};

const getBestSubsetInSpan = (rooms, start, end, numRooms) => {
  let bestSubset = null;
  let minSpan = Infinity;

  for (let i = start; i <= end - numRooms + 1; i++) {
    const subset = rooms.slice(i, i + numRooms);
    const span =
      subset[subset.length - 1].position - subset[0].position;

    if (span < minSpan) {
      minSpan = span;
      bestSubset = subset;
    }
  }

  return bestSubset;
};

const findOptimalRooms = (availableRooms, numRooms) => {
  if (!availableRooms || numRooms > 5) return null;

  const rooms = availableRooms
    .filter(r => r.available)
    .sort((a, b) =>
      a.floor !== b.floor ? a.floor - b.floor : a.position - b.position
    );

  if (rooms.length < numRooms) return null;

  // RULE 2: Same floor first
  const floors = [...new Set(rooms.map(r => r.floor))];
  for (const floor of floors) {
    const floorRooms = rooms.filter(r => r.floor === floor);
    if (floorRooms.length >= numRooms) {
      return getBestSubsetInSpan(floorRooms, 0, floorRooms.length - 1, numRooms);
    }
  }

  // RULE 3 & 4: Minimize total travel time
  let bestCombination = null;
  let minTravelTime = Infinity;

  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + numRooms - 1; j < rooms.length; j++) {
      const travelTime = calculateTravelTime(rooms[i], rooms[j]);

      if (travelTime < minTravelTime) {
        minTravelTime = travelTime;
        bestCombination = getBestSubsetInSpan(rooms, i, j, numRooms);
      }
    }
  }

  return bestCombination;
};

module.exports = {
  calculateTravelTime,
  findOptimalRooms
};
