const dotenv = require('dotenv'),
  chai = require('chai'),
  supertest = require('supertest');

dotenv.config();
const api = supertest(process.env.URL);

describe('Cancel Order Tests', () => {
  it('Should get status code 301 for not passing OrderID', done => {
    api
      .put('/v1/orders//cancel')
      .expect('Content-Type', /json/)
      .end((err, res) => {
        chai.expect(res.statusCode).to.equal(301);
        done();
      });
  });

  it('Should get status code 404 for passing incorrect OrderID', done => {
    api
      .put('/v1/orders/0/cancel')
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
      .put('/v1/orders/' + global.OrderID + '/cancel')
      .expect('Content-Type', /json/)
      .end((err, res) => {
        chai.expect(res.statusCode).to.equal(200);
        chai.expect(res.body).to.have.property('id');
        chai.expect(res.body).to.have.property('status');
        chai.expect(res.body.status).not.equal('');
        done();
      });
  });

  it('Should get status code 422 and custom message on passing correct OrderID where logic flow is incorrect', done => {
    api
      .put('/v1/orders/' + global.OrderID + '/cancel')
      .expect('Content-Type', /json/)
      .end((err, res) => {
        chai.expect(res.statusCode).to.equal(422);
        chai.expect(res.body).to.have.property('message');
        chai.expect(res.body.status).not.equal('');
        done();
      });
  });
});
