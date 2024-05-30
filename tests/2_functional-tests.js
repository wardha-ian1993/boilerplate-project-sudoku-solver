const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function(done){
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({ puzzle: puzzlesAndSolutions[0][0]})
      .end(function(err, res) {
        const { solution } = res.body;
        assert.equal(res.status, 200);
        assert.equal(solution, puzzlesAndSolutions[0][1]);
        done();
      });
  });
  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function(done){
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({ puzzle: '' })
      .end(function(err, res) {
        const { error } = res.body;
        assert.equal(res.status, 200);
        assert.equal(error, 'Required field missing');
        done();
      });
  });
  test('Solve a puzzle with invalid characters: POST request to /api/solve', function(done){
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5..??.9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
      .end(function(err, res) {
        const { error } = res.body;
        assert.equal(res.status, 200);
        assert.equal(error, 'Invalid characters in puzzle');
        done();
      });
  });
  test('Solve a puzzle with incorrect length: POST request to /api/solve', function(done){
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37' })
      .end(function(err, res) {
        const { error } = res.body;
        assert.equal(res.status, 200);
        assert.equal(error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });
  test('Solve a puzzle that cannot be solved: POST request to /api/solve', function(done){
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({ puzzle: '155..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
      .end(function(err, res) {
        const { error } = res.body;
        assert.equal(res.status, 200);
        assert.equal(error, 'Puzzle cannot be solved');
        done();
      });
  });
  test('Check a puzzle placement with all fields: POST request to /api/check', function(done){
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A2',
        value: 3
      })
      .end(function(err, res) {
        const { valid } = res.body;
        assert.equal(res.status, 200);
        assert.equal(valid, true);
        done();
      });
  });
  test('Check a puzzle placement with single placement conflict: POST request to /api/check', function(done){
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A2',
        value: 8
      })
      .end(function(err, res) {
        const { valid, conflict } = res.body;
        assert.equal(res.status, 200);
        assert.equal(valid, false);
        assert.isArray(conflict);
        assert.equal(conflict[0], 'row');
        done();
      });
  });
  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function(done){
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A2',
        value: 5
      })
      .end(function(err, res) {
        const { valid, conflict } = res.body;
        assert.equal(res.status, 200);
        assert.equal(valid, false);
        assert.isArray(conflict);
        assert.equal(conflict[0], 'row');
        assert.equal(conflict[1], 'region');
        done();
      });
  });
  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function(done){
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A2',
        value: 2
      })
      .end(function(err, res) {
        const { valid, conflict } = res.body;
        assert.equal(res.status, 200);
        assert.equal(valid, false);
        assert.isArray(conflict);
        assert.equal(conflict[0], 'row');
        assert.equal(conflict[1], 'column');
        assert.equal(conflict[2], 'region');
        done();
      });
  });
  test('Check a puzzle placement with missing required fields: POST request to /api/check', function(done){
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: '',
        value: 3
      })
      .end(function(err, res) {
        const { error } = res.body;
        assert.equal(res.status, 200);
        assert.equal(error, 'Required field(s) missing');
        done();
      });
  });
  test('Check a puzzle placement with invalid characters: POST request to /api/check', function(done){
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: '1.5??2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate: 'A2',
        value: 3
      })
      .end(function(err, res) {
        const { error } = res.body;
        assert.equal(res.status, 200);
        assert.equal(error, 'Invalid characters in puzzle');
        done();
      });
  });
  test('Check a puzzle placement with incorrect length: POST request to /api/check', function(done){
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37',
        coordinate: 'A2',
        value: 3
      })
      .end(function(err, res) {
        const { error } = res.body;
        assert.equal(res.status, 200);
        assert.equal(error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });
  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function(done){
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A99',
        value: 3
      })
      .end(function(err, res) {
        const { error } = res.body;
        assert.equal(res.status, 200);
        assert.equal(error, 'Invalid coordinate');
        done();
      });
  });
  test('Check a puzzle placement with invalid placement value: POST request to /api/check', function(done){
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A2',
        value: -1
      })
      .end(function(err, res) {
        const { error } = res.body;
        assert.equal(res.status, 200);
        assert.equal(error, 'Invalid value');
        done();
      });
  });
});

