import { firebase } from './firebase-environment';

export const environment = {
  ...firebase,
  production: true
};
