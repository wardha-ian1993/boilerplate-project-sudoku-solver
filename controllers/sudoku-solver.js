class SudokuSolver {
  validate(puzzleString) {
    if (!/^(\d|\.)(\d|\.)+(\d|\.)$/.test(puzzleString)) {
      return 'invalid';
    }
    if (puzzleString.match(/(\d|\.)/g).length !== 81) {
      return 'length';
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rows = 'ABCDEFGHI';
    const rowIndex = rows.indexOf(row) * 9;
    const colIndex = column - 1;
    const cell = rowIndex + colIndex;

    for (let i = rowIndex; i < rowIndex + 9; i++) {
      if (i === cell) {
        continue;
      } else {
        if (puzzleString[i] === value.toString()) return false;
      }
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const rows = 'ABCDEFGHI';
    const rowIndex = rows.indexOf(row) * 9;
    const colIndex = column - 1;
    const cell = rowIndex + colIndex;

    for (let i = colIndex; i < colIndex + 9 * 9; i += 9) {
      if (i === cell) {
        continue;
      } else {
        if (puzzleString[i] === value.toString()) return false;
      }
    }

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowGroups = {
      'A': ['A','B','C'],
      'D': ['D','E','F'],
      'G': ['G','H','I']
    };
    const rows = 'ABCDEFGHI';
    const rowIndex = rows.indexOf(row) * 9;
    const colIndex = column - 1;
    const cell = rowIndex + colIndex;

    let startRow;
    let startCol;

    for (let rowKey in rowGroups) {
      if (rowGroups[rowKey].indexOf(row) !== -1) {
        startRow = rows.indexOf(rowKey) * 9;
        break;
      }
    };

    switch (true) {
      case column >= 7:
        startCol = 6;
        break;
      case column >= 4:
        startCol = 3;
        break;
      case column >= 0:
        startCol = 0;
        break;
      default:
        break;
    };

    const start = startRow + startCol;
    let testArr = [];

    for (let i = start; i < start + 21; i++) {
      if (i === start + 3 || i === start + 12) i += 6;
      if (i === cell) {
        continue;
      } else {
        if (puzzleString[i] === value.toString()) return false;
      }
    }

    return true;
  }

  solve(puzzleString) {
    const rows = 'ABCDEFGHI';
    const len = puzzleString.length;
    let board = puzzleString.split('');

    for (let i = 0; i < len; i++) {
      const row = rows[Math.floor(i / 9)];
      const col = (i % 9) + 1;
      const value = puzzleString[i];
    
      if (value === '.') continue;
    
      const isValidRow = this.checkRowPlacement(puzzleString, row, col, value);
      const isValidCol = this.checkColPlacement(puzzleString, row, col, value);
      const isValidReg = this.checkRegionPlacement(puzzleString, row, col, value);
    
      if (!isValidRow || !isValidCol || !isValidReg) {
        return 'invalid';
      }
    }

    const solveSudoku = (board) => {
      let row, col, cell;

      // Find the next empty cell
      for (let i = 0; i < len; i++) {
        row = rows[Math.floor(i / 9)];
        col = (i % 9) + 1;
        cell = row + col;

        if (board[i] === '.') {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num.toString())) {
              board[i] = num.toString();

              if (solveSudoku(board)) {
                return board;
              }
              board[i] = '.';
            }
          }
          return false;
        }
      }
      return board;
    };
    
    const isValid = (board, row, col, value) => {
      return (
        this.checkRowPlacement(board.join(''), row, col, value) &&
        this.checkColPlacement(board.join(''), row, col, value) &&
        this.checkRegionPlacement(board.join(''), row, col, value)
      );
    }
    
    return solveSudoku(board).join('');
  } 
}

module.exports = SudokuSolver;
