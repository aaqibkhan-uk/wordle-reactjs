import React from "react";

interface FinishWindowProps {
  message: string;
  onClose: () => void;
  numberOfGuesses?: number;
  timeTaken?: number; // Time in seconds
}

const FinishWindow: React.FC<FinishWindowProps> = ({
  message,
  onClose,
  numberOfGuesses,
  timeTaken,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Semi-transparent black background
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // Ensure it appears above other elements
      }}
    >
      <div
        style={{
          width: "300px",
          height: "300px", // Increased height to accommodate additional information
          backgroundColor: "black",
          color: "white",
          display: "flex",
          flexDirection: "column", // Use column direction for stacking items
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
          fontWeight: "bold",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <div>{message}</div>
        {numberOfGuesses !== undefined && timeTaken !== undefined && (
          <div style={{ marginTop: "20px" }}>
            <div>Number of Guesses: {numberOfGuesses}</div>
            <div>Time Taken: {timeTaken} seconds</div>
          </div>
        )}
      </div>
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          bottom: "20px",
          backgroundColor: "white",
          color: "black",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  );
};

export default FinishWindow;
