'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      const { 
        validate,
        checkRowPlacement,
        checkColPlacement,
        checkRegionPlacement
      } = solver;
      
      if (!puzzle || !coordinate || !value ) {
        return res.json({ error: 'Required field(s) missing' });
      } else {
        const row = coordinate.slice(0, 1);
        const col = coordinate.slice(1);

        let testPuzzle = validate(puzzle);
        let testRow = checkRowPlacement(
          puzzle, row, col, value
        );
        let testCol = checkColPlacement(
          puzzle, row, col, value
        );
        let testReg = checkRegionPlacement(
          puzzle, row, col, value
        );

        let indexRow = 'ABCDEFGHI'.indexOf(row);

        if (testPuzzle === 'invalid') {
          return res.json({ error: 'Invalid characters in puzzle' });
        }
        if (testPuzzle === 'length') {
          return res.json({ error: 'Expected puzzle to be 81 characters long' });
        }
        if (indexRow === -1 || col > 9 || col < 1) {
          return res.json({ error: 'Invalid coordinate' });
        }
        if (!/[0-9]/.test(value) || value > 9 || value < 1) {
          return res.json({ error: 'Invalid value' });
        }

        if (puzzle[(indexRow * 9) + (col - 1)] === value) {
          return res.json({ valid: true });
        }
        if (!testRow || !testCol || !testReg) {
          let invalidArr = [];
          if (!testRow) invalidArr.push('row');
          if (!testCol) invalidArr.push('column');
          if (!testReg) invalidArr.push('region');
          return res.json({ valid: false, conflict: invalidArr});
        } else {
          return res.json({ valid: true })
        }
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      const { validate, solve } = solver;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      } else {
        const testPuzzle = validate(puzzle) || null;
        if (testPuzzle === 'invalid') {
          return res.json({ error: 'Invalid characters in puzzle' });
        }
        if (testPuzzle === 'length') {
          return res.json({ error: 'Expected puzzle to be 81 characters long' });
        }

        // solve can return either invalid or solved puzzle
        const solvePuzzle = solve.call(solver, puzzle) || null;
        if (solvePuzzle === 'invalid') {
          return res.json({ error: 'Puzzle cannot be solved' });
        } else {
          return res.json({ solution: solvePuzzle });
        }
      }
    });
};
