const dotenv = require('dotenv'),
  chai = require('chai'),
  supertest = require('supertest');

dotenv.config();
const api = supertest(process.env.URL);

const invalidInput = {
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
};

const invalidInputWithoutOrderAt = {
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
};

const invalidInputWithoutStops = {
  orderAt: '2018-09-03T13:00:00.000Z'
};

const validInput = {
  orderAt: '2018-10-13T13:00:00.000Z',
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
};

describe('Place Order Tests', () => {
  it('No Input', done => {
    api
      .post('/v1/orders')
      .set('Accept', 'application/json')
      .send(null)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        chai.expect(res.statusCode).to.equal(400);
        chai.expect(res.body).to.have.property('message');
        chai.expect(res.body.message).to.equal('');
        done();
      });
  });

  it('Invalid Input without orderAt property', done => {
    api
      .post('/v1/orders')
      .set('Accept', 'application/json')
      .send(invalidInputWithoutOrderAt)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        chai.expect(res.statusCode).to.equal(400);
        chai.expect(res.body).to.have.property('message');
        chai.expect(res.body.message).to.equal('error in field(s): orderAt');
        done();
      });
  });

  it('Invalid Input without stops property', done => {
    api
      .post('/v1/orders')
      .set('Accept', 'application/json')
      .send(invalidInputWithoutStops)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        chai.expect(res.statusCode).to.equal(400);
        chai.expect(res.body).to.have.property('message');
        chai.expect(res.body.message).to.equal('error in field(s): stops');
        done();
      });
  });

  it('Valid Input', done => {
    api
      .post('/v1/orders')
      .set('Accept', 'application/json')
      .send(invalidInput)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        console.log(res.body);
        console.log(res.statusCode);
        chai.expect(res.statusCode).to.equal(400);
        chai.expect(res.body).to.have.property('message');
        chai
          .expect(res.body.message)
          .to.equal('field orderAt is behind the present time');
        done();
      });
  });
});
