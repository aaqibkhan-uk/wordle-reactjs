import React from "react";

interface TableProps {
  submittedLetters: string[];
  newGetColours: (
    guess: string,
    currentKeyboardColors: { [key: string]: string }
  ) => {
    colours: string[];
    updatedKeyboardColors: { [key: string]: string };
  };
  keyboardColors: { [key: string]: string };
}

const Table: React.FC<TableProps> = ({
  submittedLetters,
  newGetColours,
  keyboardColors,
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "repeat(6, 1fr)",
        gridGap: "20px",
        maxWidth: "300px", // Set the maximum width of the table
        marginRight: "100px",
        marginBottom: "20px",
        textAlign: "center", // Center the text inside the table cells
      }}
    >
      {Array.from({ length: 6 }).map((_, rowIndex) => {
        const guess = submittedLetters[rowIndex] || "";
        const { colours } = newGetColours(guess, keyboardColors);
        return (
          <div
            key={rowIndex}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gridGap: "10px",
              height: "50px",
            }}
          >
            {Array.from({ length: 5 }).map((_, letterIndex) => {
              const char = guess[letterIndex] || "";
              const color = colours[letterIndex] || "black";
              return (
                <div
                  key={letterIndex}
                  style={{
                    width: "50px",
                    padding: "10px",
                    border: "1px solid black",
                    backgroundColor: color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  {char.toUpperCase()}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Table;
