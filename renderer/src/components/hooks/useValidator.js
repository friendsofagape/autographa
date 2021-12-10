import { validEmailRegex } from '../Validation/helper';
import * as logger from '../../logger';

export default function useValidator() {
  const isLengthValidated = (data, len) => {
    logger.debug('useValidator.js', 'In isLengthValidated for validating the length of a string');
    const errors = { };
    if (data.length > len.maxLen || data.length < len.minLen) {
      errors.message = `The input has to be between ${len.minLen} and ${len.maxLen} characters long`;
      errors.isValid = false;
    } else {
      errors.message = '';
      errors.isValid = true;
    }
    return errors;
  };
  const isTextValidated = (data, name) => {
    logger.debug('useValidator.js', 'In isTextValidated for validating the type of text');
    const errors = { };
    switch (name) {
      case 'onlyNum':
        errors.message = /^\d+$/.test(data) ? '' : 'Please enter only numbers.';
        errors.isValid = !!/^\d+$/.test(data);
        break;
      case 'onlyString':
        errors.message = /^[A-Za-z]+$/.test(data) ? '' : 'Please enter only alphabets';
        errors.isValid = !!/^[A-Za-z]+$/.test(data);
        break;
      case 'nonSpecChar':
        errors.message = /^[\w\s]+$/.test(data) ? '' : 'Special character are not allowed';
        errors.isValid = !!/^[\w\s]+$/.test(data);
        break;
      case 'alphaNum':
        errors.message = /^[A-Za-z0-9]+$/.test(data) ? '' : 'Only alphabets and numbers are allowed';
        errors.isValid = !!/^[A-Za-z0-9]+$/.test(data);
        break;
      case 'charSpace':
        errors.message = /^[A-Za-z\s]+$/.test(data) ? '' : 'Please enter only alphabets';
        errors.isValid = !!/^[A-Za-z\s]+$/.test(data);
        break;
      case 'email':
        errors.message = validEmailRegex.test(data) ? '' : 'Email is not valid!';
        errors.isValid = !!validEmailRegex.test(data);
        break;
      default:
        break;
    }
    return errors;
  };
  const validateField = (val) => val;

  return {
    action: {
      validateField,
      isLengthValidated,
      isTextValidated,
    },
  };
}
