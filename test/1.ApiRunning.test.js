const dotenv = require('dotenv'),
  chai = require('chai'),
  supertest = require('supertest');

dotenv.config();
const api = supertest(process.env.URL);

describe('ApiRunning Tests', () => {
  it('should get response from the endpoint', done => {
    api
      .get('/ping')
      .set('Accept', 'application/json')
      .end((err, res) => {
        chai.expect(res.body).to.have.property('msg');
        chai.expect(res.body.msg).to.equal('pong');
        done();
      });
  });
});
