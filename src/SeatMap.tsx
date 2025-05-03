import React from "react";

interface SeatMapProps {
  rows: number;
  cols: number;
  seatAvailability: string[][];
  selectedSeats: string[];
  isReadOnly: boolean;
  onSeatSelect: (selectedSeats: string[]) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({
  rows,
  cols,
  seatAvailability,
  selectedSeats,
  isReadOnly,
  onSeatSelect,
}) => {

  const getTravelerIndex = (seat: string) => {
    const index = selectedSeats.indexOf(seat);
    return index !== -1 ? index + 1 : null;
  };

  const handleSeatClick = (row: number, col: number) => {
    const seat = `${row}-${col}`;
    if (isReadOnly || seatAvailability[row][col] === "reserved") return;

    const newSelection = [...selectedSeats];
    const index = newSelection.indexOf(seat);
    if (index === -1) {
      newSelection.push(seat);
    } else {
      newSelection.splice(index, 1);
    }
    onSeatSelect(newSelection);
  };

  const colToLetter = (colIndex: number) => {
    return String.fromCharCode(65 + colIndex);
  };

  return (
    <div>
      <style>
        {`
          .seat-button {
            position: relative;
            overflow: hidden;
          }

          .seat-button:hover {
            filter: brightness(95%);
            transform: scale(1.08);
            box-shadow: 0 0 10px rgba(0, 255, 150, 0.5);
            transition: all 0.3s ease;
          }

          .seat-button::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(255, 255, 255, 0.3); /* Default white ripple */
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: width 0.4s ease, height 0.4s ease;
            pointer-events: none;
          }

          .seat-button:hover::after {
            width: 200%;
            height: 200%;
          }

          /* NEW: Reserved seats have red ripple */
          .seat-button.reserved::after {
            background: rgba(255, 0, 0, 0.3); /* Light red ripple */
          }
        `}
      </style>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          {Array.from({ length: cols }).map((_, colIndex) => {
            const seatStatus = seatAvailability[rowIndex][colIndex];
            const seat = `${rowIndex}-${colIndex}`;
            const isSelected = selectedSeats.includes(seat);
            const travelerIndex = getTravelerIndex(seat);

            return (
              <div key={colIndex} style={{ display: "flex" }}>
                <button
                  className={`seat-button ${seatStatus === "reserved" ? "reserved" : ""}`}
                  onClick={() => handleSeatClick(rowIndex, colIndex)}
                  style={{
                    width: "40px",
                    height: "40px",
                    margin: "5px",
                    marginRight: colIndex === 2 ? "45px" : "5px", // Add aisle space after 3rd column
                    backgroundColor:
                      seatStatus === "reserved" ? "#fc6875" :
                      isSelected ? "#8781f7" : "#79f7b2",
                    cursor: isReadOnly ? "not-allowed" : "pointer",
                    border:
                      seatStatus === "reserved" ? "3px solid #610b12" :
                      isSelected ? "3px solid #0a165c" : "3px solid #0f7a3f",
                    borderRadius: "5px",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                  }}
                  disabled={seatStatus === "reserved" || isReadOnly}
                >
                  {travelerIndex ? `T${travelerIndex}` : `${rowIndex + 1}${colToLetter(colIndex)}`}
                </button>
              </div>
            );
          })}

        </div>
      ))}
    </div>
  );
};

export default SeatMap;
