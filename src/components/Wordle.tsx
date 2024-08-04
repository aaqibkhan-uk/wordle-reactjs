import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import axios from "axios";
import Keyboard from "./Keyboard";
import Table from "./Table";
import FinishWindow from "./FinishWindow";

function Wordle() {
  const [letters, setLetters] = useState<string[]>([]);
  const [submittedLetters, setSubmittedLetters] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [answerMap, setAnswerMap] = useState<{ [key: number]: string }>({});
  const [answerLetterCounter, setAnswerLetterCounter] = useState<{
    [key: string]: number;
  }>({});
  const [validWords, setValidWords] = useState<string[]>([]);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [keyboardColors, setKeyboardColors] = useState<{
    [key: string]: string;
  }>({});
  const [showFinishWindow, setShowFinishWindow] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(Date.now()); // Initialize start time
  const [endTime, setEndTime] = useState<number>(Date.now()); // Initialize end time

  useEffect(() => {
    // Initialize keyboard colors
    const initialColors: { [key: string]: string } = {};
    for (let i = 97; i <= 122; i++) {
      // ASCII codes for a-z
      initialColors[String.fromCharCode(i)] = "grey";
    }
    setKeyboardColors(initialColors);
    const fetchWords = async () => {
      try {
        const response = await axios.get("/words.txt");
        const words = response.data
          .split("\n")
          .map((word: string) => word.trim());
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setAnswer(randomWord);

        const map: { [key: number]: string } = {};
        const letterCounter: { [key: string]: number } = {};
        randomWord.split("").forEach((letter: string, index: number) => {
          map[index] = letter;
          if (letterCounter[letter]) {
            letterCounter[letter]++;
          } else {
            letterCounter[letter] = 1;
          }
        });
        setAnswerMap(map);
        setAnswerLetterCounter(letterCounter);

        const validWordsResponse = await axios.get("/allowed_guesses.txt");
        const validWordsList = validWordsResponse.data
          .split("\n")
          .map((word: string) => word.trim());
        setValidWords(validWordsList);
      } catch (error) {
        console.error("Error fetching the words:", error);
      }
    };

    fetchWords();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (/^[a-zA-Z]*$/.test(newValue) && newValue.length <= 5) {
      setLetters(newValue.toLowerCase().split(""));
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      console.log(answer);
      console.log(keyboardColors);
      if (
        letters.length === 5 &&
        submittedLetters.length < 6 &&
        validWords.includes(letters.join(""))
      ) {
        const word = letters.join("");
        const { colours, updatedKeyboardColors } = newGetColours(
          word,
          keyboardColors
        );
        setSubmittedLetters((prevSubmittedLetters) => [
          ...prevSubmittedLetters,
          word,
        ]);
        if (word === answer) {
          setGameWon(true);
          setEndTime(Date.now()); // Record the end time
          setShowFinishWindow(true);
        }
        if (submittedLetters.length === 5) {
          setGameOver(true);
          setEndTime(Date.now()); // Record the end time
          setShowFinishWindow(true);
        }
        setKeyboardColors(updatedKeyboardColors);
        setLetters([]);
      } else {
        console.log("Not enough letters or Max guesses or Invalid guess");
      }
    }
  };

  const newGetColours = (
    guess: string,
    currentKeyboardColors: { [key: string]: string }
  ): {
    colours: string[];
    updatedKeyboardColors: { [key: string]: string };
  } => {
    const wordArr = guess.split("");
    const colours: string[] = [];
    const guessLetterCounter: { [key: string]: number } = {};
    const newKeyboardColors = { ...currentKeyboardColors };

    wordArr.forEach((char, index) => {
      if (guessLetterCounter[char]) {
        guessLetterCounter[char] += 1;
      } else {
        guessLetterCounter[char] = 1;
      }

      if (Object.values(answerMap).includes(char)) {
        if (answerMap[index] === char) {
          colours.push("green");
          newKeyboardColors[char] = "green";
        } else {
          if (guessLetterCounter[char] <= (answerLetterCounter[char] || 0)) {
            colours.push("orange");
            if (newKeyboardColors[char] !== "green") {
              newKeyboardColors[char] = "orange";
            }
          } else {
            colours.push("black");
            if (
              newKeyboardColors[char] !== "green" &&
              newKeyboardColors[char] !== "orange"
            ) {
              newKeyboardColors[char] = "black";
            }
          }
        }
      } else {
        colours.push("black");
        if (
          newKeyboardColors[char] !== "green" &&
          newKeyboardColors[char] !== "orange"
        ) {
          newKeyboardColors[char] = "black";
        }
      }
    });

    return { colours, updatedKeyboardColors: newKeyboardColors };
  };

  const handleFinishWindowClose = () => {
    setShowFinishWindow(false);
    // Optionally reset the game here if needed
  };

  const numberOfGuesses = submittedLetters.length;
  const timeTaken = Math.round((endTime - startTime) / 1000); // Time in seconds

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        position: "relative",
      }}
    >
      <TextField
        value={letters.join("").toUpperCase()}
        onChange={handleChange}
        inputProps={{ maxLength: 5 }}
        placeholder="Type here"
        onKeyDown={handleKeyDown}
        disabled={gameWon || gameOver}
        style={{
          marginBottom: "20px", // Add space below the TextField
        }}
      />
      <Table
        submittedLetters={submittedLetters}
        newGetColours={newGetColours}
        keyboardColors={keyboardColors}
      />
      <Keyboard keyboardColors={keyboardColors} />
      {showFinishWindow && (
        <FinishWindow
          message={
            gameWon
              ? "Congratulations! You've guessed the word correctly!"
              : `Game Over! The correct word was "${answer}".`
          }
          numberOfGuesses={numberOfGuesses}
          timeTaken={timeTaken}
          onClose={handleFinishWindowClose}
        />
      )}
    </div>
  );
}

export default Wordle;
