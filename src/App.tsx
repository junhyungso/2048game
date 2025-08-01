import { useEffect, useState } from 'react';
import './App.css';

const SIZE = 4;

const getRandomEmptyCell = (board) => {
  const empty = [];
  board.forEach((row, i) =>
    row.forEach((val, j) => {
      if (val === null) empty.push([i, j]);
    })
  );
  return empty[Math.floor(Math.random() * empty.length)];
};

const addRandomTile = (board) => {
  const [i, j] = getRandomEmptyCell(board) || [];
  if (i !== undefined) {
    board[i][j] = 2;
  }
  return board;
};

const getInitialBoard = (size: number) => {
  const matrix = Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));

  return matrix;
};

export default function App() {
  const [board, setBoard] = useState(
    addRandomTile(addRandomTile(getInitialBoard(SIZE)))
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      console.log(event.key);
      // switch (event.key) {
      //   case "ArrowUp":
      // }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="App">
      <div className="board">
        {board.map((row, i) =>
          row.map((square, i) => (
            <div className="square" key={i}>
              {square}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
