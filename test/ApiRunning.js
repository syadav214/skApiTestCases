const dotenv = require('dotenv'),
  chai = require('chai'),
  supertest = require('supertest');

dotenv.config();
const api = supertest(process.env.URL);

describe('skApiTestCases - ApiRunning Tests', function() {
  it('should get response from the endpoint and the object with keys and values', function(done) {
    api
      .get('/ping')
      .set('Accept', 'application/json')
      .end(function(err, res) {
        chai.expect(res.body).to.have.property('msg');
        chai.expect(res.body.msg).to.not.equal(null);
        done();
      });
  });
});
