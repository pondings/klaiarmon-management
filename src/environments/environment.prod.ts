import { env } from './environment-overrider';

export const environment = {
  ...env,
  production: true
};
