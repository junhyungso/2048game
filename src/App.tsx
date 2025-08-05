import { useEffect, useState } from 'react';
import './App.css';

type Direction = 'up' | 'down' | 'left' | 'right' | null;
type Board = number[][];
const BOARD_SIZE = 4;

export default function App() {
  const getRandomEmptyCell = (board: Board) => {
    const empty: [number, number][] = [];
    board.forEach((row, i) =>
      row.forEach((val, j) => {
        if (val === 0) empty.push([i, j]);
      })
    );
    return empty[Math.floor(Math.random() * empty.length)];
  };

  const addRandomTile = (board: Board) => {
    const [i, j] = getRandomEmptyCell(board) || [];
    if (i !== undefined) {
      board[i][j] = 2;
    }
    return board;
  };

  const getInitialBoard = (size: number) => {
    const matrix = Array(size)
      .fill(0)
      .map(() => Array(size).fill(0));

    return matrix;
  };

  const transpose = (board: Board): Board =>
    board[0].map((_, i) => board.map((row) => row[i]));

  const reverse = (board: Board): Board =>
    board.map((row) => [...row].reverse());

  const compressRow = (row: number[]): number[] => {
    const newRow = row.filter((val) => val !== 0);
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow[i + 1] = 0;
      }
    }
    return newRow
      .filter((val) => val !== 0)
      .concat(Array(BOARD_SIZE).fill(0))
      .slice(0, BOARD_SIZE);
  };

  const moveTiles = (board: Board, direction: Direction) => {
    let newBoard = board.map((row) => [...row]);

    if (direction === 'up') {
      newBoard = transpose(newBoard).map(compressRow);
      newBoard = transpose(newBoard);
    } else if (direction === 'down') {
      newBoard = transpose(newBoard);
      newBoard = reverse(newBoard).map(compressRow);
      newBoard = reverse(newBoard);
      newBoard = transpose(newBoard);
    } else if (direction === 'left') {
      newBoard = newBoard.map(compressRow);
    } else if (direction === 'right') {
      newBoard = reverse(newBoard).map(compressRow);
      newBoard = reverse(newBoard);
    }
    return newBoard;
  };

  const [board, setBoard] = useState(
    addRandomTile(addRandomTile(getInitialBoard(BOARD_SIZE)))
  );

  const spawnTile = (board: Board): Board => {
    const newBoard = board.map((row) => [...row]);
    const cell = getRandomEmptyCell(newBoard);
    if (!cell) return newBoard;
    const [i, j] = cell;
    newBoard[i][j] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
  };

  const boardsEqual = (a: Board, b: Board): boolean =>
    a.every((row, i) => row.every((val, j) => val === b[i][j]));

  const handleKeyDown = (event: KeyboardEvent) => {
    let direction: Direction = null;
    switch (event.key) {
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
      case 'ArrowLeft':
        direction = 'left';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
    }
    if (direction) {
      const moved = moveTiles(board, direction);
      if (!boardsEqual(moved, board)) {
        setBoard(spawnTile(moved));
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, moveTiles]);

  return (
    <div className="App">
      <div className="board">
        {board.map((row) =>
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
