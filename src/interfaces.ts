import { PersonData, FormLabel } from './template';

export interface VeriffHeaders {
  'vrf-integration-id'?: string;
}

export interface Options {
  host?: string;
  apiKey: string;
  parentId: string;
  headers?: VeriffHeaders;
  onSession?: (err, response) => void;
}

export interface MountOptions {
  formLabel?: FormLabel;
  submitBtnText?: string;
  loadingText?: string;
}

export interface Params {
  callback?: string;
  person?: PersonData;
  vendorData?: string;
}
