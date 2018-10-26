const dotenv = require('dotenv'),
  chai = require('chai'),
  supertest = require('supertest');

dotenv.config();
const api = supertest(process.env.URL);

const currDate = new Date();
const prevMonth = currDate.getMonth() - 1;
const oldDate = new Date(currDate.getFullYear(), currDate.getMonth() - 1, 1);

const dayTimeDate = new Date(
  currDate.getFullYear(),
  currDate.getMonth(),
  currDate.getDate(),
  20
);
const nightTimeDate = new Date(
  currDate.getFullYear(),
  currDate.getMonth(),
  currDate.getDate(),
  30
);

const invalidInput = {
  orderAt: oldDate,
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
  orderAt: oldDate
};

const validInput = {
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
      lat: 22.405669,
      lng: 114.188962
    }
  ]
};

function calculateAmt(drivingDistancesInMeters, isDay) {
  let totalDistance = drivingDistancesInMeters.reduce(
    (prev, cur) => prev + cur
  );

  let amt = 0,
    extraAmt = 0;

  // Get base amount and extra amount charged for given timings
  if (isDay) {
    amt = parseInt(process.env.BaseAmtDay);
    extraAmt = parseInt(process.env.ExtraAmtDay);
  } else {
    amt = parseInt(process.env.BaseAmtNight);
    extraAmt = parseInt(process.env.ExtraAmtNight);
  }

  if (totalDistance > parseInt(process.env.BaseDistance)) {
    totalDistance -= parseInt(process.env.BaseDistance);
    amt += (totalDistance * extraAmt) / parseInt(process.env.ExtraCostDistance);
  }
  return amt;
}

describe('Place Order Tests', () => {
  it('Should get status code 400 for null payload', done => {
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

  it('Should get status code 400 for not passing orderAt in payload', done => {
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

  it('Should get status code 400 for not passing stops in payload', done => {
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

  it('Should calculate correct fare amount from 5.01AM to 8.59PM', done => {
    // Setting day time
    validInput.orderAt = dayTimeDate;
    api
      .post('/v1/orders')
      .set('Accept', 'application/json')
      .send(validInput)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        chai.expect(res.statusCode).to.equal(201);
        global.OrderID = res.body.id;
        chai.expect(res.body).to.have.property('id');
        chai.expect(res.body).to.have.property('drivingDistancesInMeters');
        chai.expect(res.body).to.have.property('fare');
        chai.expect(res.body.fare).to.have.property('amount');
        chai.expect(res.body.fare).to.have.property('currency');
        // Comparing amount
        chai
          .expect(parseFloat(res.body.fare.amount))
          .to.equal(calculateAmt(res.body.drivingDistancesInMeters, true));

        done();
      });
  });

  it('Should calculate correct fare amount from 9.00PM to 5.00AM', done => {
    // Setting night time
    validInput.orderAt = nightTimeDate;
    api
      .post('/v1/orders')
      .set('Accept', 'application/json')
      .send(validInput)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        chai.expect(res.statusCode).to.equal(201);
        chai.expect(res.body).to.have.property('id');
        chai.expect(res.body).to.have.property('drivingDistancesInMeters');
        chai.expect(res.body).to.have.property('fare');
        chai.expect(res.body.fare).to.have.property('amount');
        chai.expect(res.body.fare).to.have.property('currency');
        // Comparing amount
        chai
          .expect(parseFloat(res.body.fare.amount))
          .to.equal(calculateAmt(res.body.drivingDistancesInMeters, false));

        done();
      });
  });
});
