/**
 * Travel Time Rules:
 * - Horizontal: 1 minute per room difference
 * - Vertical: 2 minutes per floor difference
 * - Total = horizontal + vertical
 */
const calculateTravelTime = (room1, room2) => {
  const verticalTime = Math.abs(room1.floor - room2.floor) * 2;
  const horizontalTime = Math.abs(room1.position - room2.position);
  return verticalTime + horizontalTime;
};

/**
 * Finds the best contiguous set of rooms on the same floor
 * that minimizes horizontal distance.
 */
const getBestOnSameFloor = (rooms, numRooms) => {
  let bestSubset = null;
  let minHorizontalSpan = Infinity;

  for (let i = 0; i <= rooms.length - numRooms; i++) {
    const subset = rooms.slice(i, i + numRooms);
    const span =
      subset[subset.length - 1].position - subset[0].position;

    if (span < minHorizontalSpan) {
      minHorizontalSpan = span;
      bestSubset = subset;
    }
  }

  return bestSubset;
};

/**
 * Main booking function
 */
const findOptimalRooms = (availableRooms, numRooms) => {
  if (!availableRooms || numRooms > 5) return null;

  // 1️⃣ Filter available rooms and sort by (floor, position)
  const rooms = availableRooms
    .filter(r => r.available)
    .sort((a, b) =>
      a.floor !== b.floor ? a.floor - b.floor : a.position - b.position
    );

  if (rooms.length < numRooms) return null;

  // 2️⃣ RULE: Same-floor booking has highest priority
  const floors = [...new Set(rooms.map(r => r.floor))];

  for (const floor of floors) {
    const floorRooms = rooms.filter(r => r.floor === floor);

    if (floorRooms.length >= numRooms) {
      return getBestOnSameFloor(floorRooms, numRooms);
    }
  }

  // 3️⃣ RULE: Span floors → minimize total travel time
  let bestCombination = null;
  let minTravelTime = Infinity;

  /**
   * Key idea:
   * Only the FIRST and LAST room determine travel time.
   * Middle rooms do not affect travel cost.
   */
  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + numRooms - 1; j < rooms.length; j++) {
      const travelTime = calculateTravelTime(rooms[i], rooms[j]);

      if (travelTime < minTravelTime) {
        minTravelTime = travelTime;

        // Take the closest `numRooms` between i and j
        bestCombination = rooms.slice(i, j + 1).slice(0, numRooms);
      }
    }
  }

  return bestCombination;
};

module.exports = {
  calculateTravelTime,
  findOptimalRooms
};
