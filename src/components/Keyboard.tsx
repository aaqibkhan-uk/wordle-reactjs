import React from "react";

interface KeyboardProps {
  keyboardColors: { [key: string]: string };
}

const Keyboard: React.FC<KeyboardProps> = ({ keyboardColors }) => {
  // Define the keyboard layout
  const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "400px",
      }}
    >
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: rowIndex < rows.length - 1 ? "5px" : "0",
          }}
        >
          {row.split("").map((key) => (
            <div
              key={key}
              style={{
                width: "40px", // Increased width for better visual
                height: "40px",
                margin: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: keyboardColors[key] || "grey", // Default to grey if no color is set
                color: "white",
                borderRadius: "5px",
                fontWeight: "bold",
                fontSize: "14px", // Adjust font size if needed
              }}
            >
              {key.toUpperCase()}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
