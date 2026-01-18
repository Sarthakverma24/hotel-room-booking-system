export const calculateTravelTime = (room1, room2) => {
  const verticalTime = Math.abs(room1.floor - room2.floor) * 2;
  const horizontalTime = room1.floor === room2.floor ? Math.abs(room1.position - room2.position) : 0;
  return verticalTime + horizontalTime;
};

export const findOptimalRooms = (rooms, numRooms) => {
  const availableRooms = rooms.filter(room => room.available);
  if (availableRooms.length < numRooms) return null;

  let bestCombination = null;
  let minTravelTime = Infinity;

  // Try combinations by floor first
  for (let floor = 1; floor <= 10; floor++) {
    const floorRooms = availableRooms.filter(room => room.floor === floor);
    if (floorRooms.length >= numRooms) {
      const selectedRooms = floorRooms.slice(0, numRooms);
      const travelTime = calculateTravelTime(selectedRooms[0], selectedRooms[selectedRooms.length - 1]);
      if (travelTime < minTravelTime) {
        minTravelTime = travelTime;
        bestCombination = selectedRooms;
      }
    }
  }

  // If no single floor has enough rooms, find cross-floor combination
  if (!bestCombination) {
    const sortedRooms = availableRooms.sort((a, b) => {
      if (a.floor !== b.floor) return a.floor - b.floor;
      return a.position - b.position;
    });
    
    for (let i = 0; i <= sortedRooms.length - numRooms; i++) {
      const combination = sortedRooms.slice(i, i + numRooms);
      const travelTime = calculateTravelTime(combination[0], combination[combination.length - 1]);
      if (travelTime < minTravelTime) {
        minTravelTime = travelTime;
        bestCombination = combination;
      }
    }
  }

  return { rooms: bestCombination, travelTime: minTravelTime };
};

export const getRoomsByFloor = (rooms) => {
  const floors = {};
  rooms.forEach(room => {
    if (!floors[room.floor]) floors[room.floor] = [];
    floors[room.floor].push(room);
  });
  return floors;
};