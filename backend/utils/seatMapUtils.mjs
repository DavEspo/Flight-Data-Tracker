// utils/seatMapUtils.mjs

export const extractSeatsRemaining = (seatMapResponse) => {
    try {
      let availableSeats = 0;
  
      const data = seatMapResponse?.data;
      if (!Array.isArray(data)) return null;
  
      for (const deck of data) {
        const decks = deck?.decks || [];
        for (const d of decks) {
          const seatRows = d?.seatRows || [];
          for (const row of seatRows) {
            const seats = row?.seats || [];
            for (const seat of seats) {
              if (seat.occupancyStatus === "AVAILABLE") {
                availableSeats++;
              }
            }
          }
        }
      }
  
      return availableSeats;
    } catch (error) {
      console.error("Error extracting seats remaining:", error);
      return null;
    }
};