const dotenv = require('dotenv'),
  chai = require('chai'),
  supertest = require('supertest');

dotenv.config();
const api = supertest(process.env.URL);

describe('Fetch Order Tests', () => {
  it('Should get status code 405 for not passing OrderID', done => {
    api
      .get('/v1/orders')
      .expect('Content-Type', /json/)
      .end((err, res) => {
        chai.expect(res.statusCode).to.equal(405);
        done();
      });
  });

  it('Should get status code 404 for passing incorrect OrderID', done => {
    api
      .get('/v1/orders/0')
      .expect('Content-Type', /json/)
      .end((err, res) => {
        chai.expect(res.statusCode).to.equal(404);
        chai.expect(res.body).to.have.property('message');
        chai.expect(res.body.message).to.equal('ORDER_NOT_FOUND');
        done();
      });
  });

  it('Should get valid properties from the response on passing correct OrderID', done => {
    api
      .get('/v1/orders/' + global.OrderID)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.body).to.have.property('id');
        chai.expect(res.body).to.have.property('stops');
        chai.expect(res.body).to.have.property('drivingDistancesInMeters');
        chai.expect(res.body).to.have.property('fare');
        chai.expect(res.body.fare).to.have.property('amount');
        chai.expect(res.body.fare).to.have.property('currency');
        chai.expect(res.body).to.have.property('status');
        chai.expect(res.body.status).not.equal('');
        done();
      });
  });
});
