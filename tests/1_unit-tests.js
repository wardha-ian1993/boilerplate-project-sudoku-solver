const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

let solver = new Solver;

const {
  validate,
  checkRowPlacement,
  checkColPlacement,
  checkRegionPlacement,
  solve
} = solver;

suite('Unit Tests', () => {
  test('Logic handles a valid puzzle string of 81 characters', function() {
    assert.equal(validate(puzzlesAndSolutions[0][0]), 'valid');
  });
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function() {
    assert.equal(validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9>47..?8..1..16....926914.37.'), 'invalid');
  });
  test('Logic handles a puzzle string that is not 81 characters in length', function() {
    assert.equal(validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914'), 'length');
  });
  test('Logic handles a valid row placement', function() {
    assert.equal(checkRowPlacement(puzzlesAndSolutions[0][0], 'A', 2, 3), true);
  });
  test('Logic handles an invalid row placement', function() {
    assert.equal(checkRowPlacement(puzzlesAndSolutions[0][0], 'A', 2, 5), false);
  });
  test('Logic handles a valid column placement', function() {
    assert.equal(checkColPlacement(puzzlesAndSolutions[0][0], 'A', 2, 3), true);
  });
  test('Logic handles an invalid column placement', function() {
    assert.equal(checkColPlacement(puzzlesAndSolutions[0][0], 'A', 2, 7), false);
  });
  test('Logic handles a valid region (3x3 grid) placement', function() {
    assert.equal(checkRegionPlacement(puzzlesAndSolutions[0][0], 'A', 2, 3), true);
  });
  test('Logic handles an invalid region (3x3 grid) placement', function() {
    assert.equal(checkRegionPlacement(puzzlesAndSolutions[0][0], 'A', 2, 5), false);
  });
  test('Valid puzzle strings pass the solver', function() {
    assert.equal(solve.call(solver, puzzlesAndSolutions[0][0]), puzzlesAndSolutions[0][1]);
  });
  test('Invalid puzzle strings fail the solver', function() {
    assert.equal(
      solve.call(solver, '1.5..2.84..63.12.7.2..5...?.9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'),
      'invalid'
    );
  });
  test('Solver returns the expected solution for an incomplete puzzle', function() {
    assert.equal(
      solve.call(solver, '155..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'),
      'incomplete'
    );
  });
  /*
    
    
    
    
    
    
    
    
    
    
    
    
  */
});
