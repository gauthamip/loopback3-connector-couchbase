'use strict';

const assert = require('assert');
const should = require('should');
const uuid = require('uuid/v4');
const _ = require('lodash');

const initialization = require("./init.js");
const exampleData = require("./exampleData.js");

describe('couchbase test cases', function() {
  let db, countries, COUNTRY_MODEL, COUNTRY_MODEL_WITH_ID;

  before(function(done) {
    db = initialization.getDataSource();
    countries = exampleData.countries;
    COUNTRY_MODEL = db.define('COUNTRY_MODEL', {
      gdp: Number,
      countryCode: String,
      name: String,
      population: Number,
      updatedAt: Date
    });
    COUNTRY_MODEL_WITH_ID = db.define('COUNTRY_MODEL_WITH_ID', {
      id: { type: String, id: true },
      gdp: Number,
      countryCode: String,
      name: String,
      population: Number,
      updatedAt: Date
    });
    done();
  });

  describe('create model', function() {
    function verifyCountryRows(err, m) {
      should.not.exists(err);
      should.exist(m && m.id);
      should.exist(m && m.gdp);
      should.exist(m && m.countryCode);
      should.exist(m && m.name);
      should.exist(m && m.population);
      should.exist(m && m.updatedAt);
      m.gdp.should.be.type('number');
      m.countryCode.should.be.type('string');
      m.name.should.be.type('string');
      m.population.should.be.type('number');
      m.updatedAt.should.be.type('object');
    }

    it('create a model and generate an id', function(done) {
      COUNTRY_MODEL.create(countries[0], function(err, res) {
        verifyCountryRows(err, res);
        done();
      });
    });

    it('create a model that has an id defined', function(done) {
      const id = uuid();

      let newCountry = _.omit(countries[0]);
      newCountry.id = id;
      COUNTRY_MODEL_WITH_ID.create(newCountry, function(err, res) {
        should.not.exists(err);
        assert.equal(res.id, id);
        done();
      });
    });

    it('create a model that has an id defined but empty', function(done) {
      const id = uuid();

      let newCountry = _.omit(countries[0]);
      COUNTRY_MODEL_WITH_ID.create(newCountry, function(err, res) {
        should.not.exists(err);
        should.exist(res && res.id);
        done();
      });
    });
  });
});

