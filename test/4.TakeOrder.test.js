const dotenv = require('dotenv'),
  chai = require('chai'),
  supertest = require('supertest');

dotenv.config();
const api = supertest(process.env.URL);

describe('Take Order Tests', () => {
  it('Should get status code 301 for not passing OrderID', done => {
    api
      .put('/v1/orders//take')
      .send(null)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        chai.expect(res.statusCode).to.equal(301);
        done();
      });
  });

  it('Should get status code 404 for passing incorrect OrderID', done => {
    api
      .put('/v1/orders/-1/take')
      .send(null)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        chai.expect(res.statusCode).to.equal(404);
        chai.expect(res.body).to.have.property('message');
        chai.expect(res.body.message).to.equal('ORDER_NOT_FOUND');
        done();
      });
  });

  it('Valid Input', done => {
    api
      .put('/v1/orders/1000/take')
      .send(null)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        console.log(res.statusCode);
        console.log(res.body);
        chai.expect(res.statusCode).to.equal(404);
        chai.expect(res.body).to.have.property('message');
        chai.expect(res.body.message).to.equal('ORDER_NOT_FOUND');
        done();
      });
  });
});
