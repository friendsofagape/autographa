/* eslint-disable no-console */
const Ajv = require('ajv');
const schemaIndex = require('../../vendor/scripture-burrito/v0.3.0/schema');

const ajv = new Ajv({ schemas: schemaIndex.schemas });
export const validate = (schemaName, fn, data) => {
  const validator = ajv.getSchema(schemaIndex.schemaIds[schemaName]);
  if (validator(JSON.parse(data))) {
    console.log(`${fn }: No errors.`);
    return true;
  }
  console.log(`${fn }:`, validator.errors);
  return false;
};
