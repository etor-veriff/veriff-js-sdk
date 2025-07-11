import { VeriffHeaders } from './interfaces';
import { PersonData } from './template';

const CREATED_RESPONSE_STATUS = 201;
export interface RequestData {
  callback?: string;
  person?: PersonData;
  vendorData?: string;
}

export function createSession(
  host: string,
  apiKey: string,
  data: RequestData,
  headers: VeriffHeaders = {},
  cb: (statusObject, resp) => void
): void {
  const url = `${host}/v1/sessions`;
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.setRequestHeader('x-auth-client', apiKey);
  if (headers['vrf-integration-id']) {
    xhr.setRequestHeader('vrf-integration-id', headers['vrf-integration-id']);
  }
  xhr.setRequestHeader('x-origin', 'js-sdk');
  xhr.onreadystatechange = (): void => {
    if (xhr.readyState !== XMLHttpRequest.DONE) {
      return;
    }
    if (xhr.status === CREATED_RESPONSE_STATUS) {
      const resp = JSON.parse(xhr.responseText);
      return cb(null, resp);
    }
    return cb(
      {
        status: xhr.status,
        statusText: xhr.statusText,
      },
      null
    );
  };

  const body = {
    verification: {
      callback: data.callback,
      person: {
        firstName: data.person.givenName,
        lastName: data.person.lastName,
        idNumber: data.person.idNumber,
      },
      vendorData: data.vendorData,
      timestamp: new Date().toISOString(),
    },
  };

  const json = JSON.stringify(body);
  xhr.send(json);
}
