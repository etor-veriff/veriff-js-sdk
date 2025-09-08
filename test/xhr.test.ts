// @ts-ignore
const sinon = require('sinon');
import { should } from 'chai';
import { createSession, RequestData } from '../src/xhr';
import { VeriffHeaders } from '../src/interfaces';

should();

let xhr;
let requests;

beforeEach(() => {
  xhr = sinon.useFakeXMLHttpRequest();

  requests = [];
  xhr.onCreate = function (xhrCopy) {
    requests.push(xhrCopy);
  }.bind(this);
});

afterEach(() => {
  xhr.restore();
});

describe('Veriff create session', () => {
  it('should submit the verification data', (done) => {
    const responseData = JSON.stringify({ url: 'test' });
    const requestData: RequestData = {
      callback: 'https://veriff.com',
      person: {
        givenName: 'test',
        lastName: 'test',
      },
    };

    createSession('test', 'key', requestData, undefined, (err, resp) => {
      if (err) {
        return done(err);
      }

      const expectedData = JSON.parse(responseData);
      resp.should.deep.equal(expectedData);
      done();
    });

    requests[0].respond(
      201,
      {
        'Content-Type': 'text/json',
      },
      responseData
    );
  });

  it('should submit the verification data with optional header', (done) => {
    const setRequestHeaderSpy = sinon.spy(XMLHttpRequest.prototype, 'setRequestHeader');
    const responseData = JSON.stringify({ url: 'test' });
    const requestData: RequestData = {
      callback: 'https://veriff.com',
      person: {
        givenName: 'test',
        lastName: 'test',
      },
    };
    const headers: VeriffHeaders = {
      'vrf-integration-id': 'integration-id',
    };

    createSession('test', 'key', requestData, headers, (err, resp) => {
      if (err) {
        return done(err);
      }

      const expectedData = JSON.parse(responseData);
      resp.should.deep.equal(expectedData);
      setRequestHeaderSpy.calledWith('vrf-integration-id', headers['vrf-integration-id']).should.be.true;
      done();
    });

    requests[0].respond(
      201,
      {
        'Content-Type': 'text/json',
      },
      responseData
    );
  });

  it('should return error status call into callback', (done) => {
    const requestData = {
      features: [],
      person: {
        givenName: 'test',
        lastName: 'test',
      },
    };

    createSession('test', '123', requestData, undefined, (err) => {
      err.should.exist;
      err.status.should.eql(500);
      err.statusText.should.eql('Internal Server Error');
      done();
    });

    requests[0].respond(500);
  });
});
