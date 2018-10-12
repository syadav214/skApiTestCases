const dotenv = require('dotenv'),
  chai = require('chai'),
  supertest = require('supertest');

dotenv.config();
const api = supertest(process.env.URL);

describe('skApiTestCases - Place Order Tests', function() {
  it('should get response from the endpoint and the object with keys and values', function(done) {
    api
      .post('/v1/orders')
      .set('Accept', 'application/json')
      .send({
        orderAt: '2018-09-03T13:00:00.000Z',
        stops: [
          {
            lat: 22.344674,
            lng: 114.124651
          },
          {
            lat: 22.375384,
            lng: 114.182446
          },
          {
            lat: 22.385669,
            lng: 114.186962
          }
        ]
      })
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        console.log(res.statusCode);
        chai.expect(res.statusCode).to.equal(400);
        //chai.expect(res.body).to.have.property('msg');
        //chai.expect(res.body.msg).to.not.equal(null);
        done();
      });
  });
});
