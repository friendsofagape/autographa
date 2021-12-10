/* eslint-disable no-console */
import * as logger from '../logger';

const Ajv = require('ajv');
const schemaIndex = require('../../vendor/scripture-burrito/v0.3.0/schema');

const ajv = new Ajv({ schemas: schemaIndex.schemas });
export const validate = (schemaName, fn, data) => {
  logger.debug('validate.js', 'In validate for validation the burrito');
  const validator = ajv.getSchema(schemaIndex.schemaIds[schemaName]);
  if (validator(JSON.parse(data))) {
    logger.debug('validate.js', `Successfully validated the burrito, Location:${fn}`);
    return true;
  }
  logger.error('validate.js', `Burrito failed the validation ${validator?.errors}, Location:${fn}`);
  return false;
};
