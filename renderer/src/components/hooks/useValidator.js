import { validEmailRegex } from '../Validation/helper';

export default function useValidator() {
  const validateField = (data, len, name) => {
    const errors = {
      fieldValid: false,
      fieldMsg: '',
      lenValid: false,
      lenMsg: '',
    };
    switch (name) {
      case 'onlyNum':
        errors.fieldMsg = /^\d+$/.test(data) ? '' : 'Please enter only numbers.';
        errors.fieldValid = !!/^\d+$/.test(data);
        break;
      case 'onlyString':
        errors.fieldMsg = /^[A-Za-z]+$/.test(data) ? '' : 'Please enter only alphabets';
        errors.fieldValid = !!/^[A-Za-z]+$/.test(data);
        break;
      case 'nonSpecChar':
        errors.fieldMsg = /^[\w\s]+$/.test(data) ? '' : 'Special character are not allowed';
        errors.fieldValid = !!/^[\w\s]+$/.test(data);
        break;
      case 'alphaNum':
        errors.fieldMsg = /^[A-Za-z0-9]+$/.test(data) ? '' : 'Only alphabets and numbers are allowed';
        errors.fieldValid = !!/^[A-Za-z0-9]+$/.test(data);
        break;
      case 'charSpace':
        errors.fieldMsg = /^[A-Za-z\s]+$/.test(data) ? '' : 'Please enter only alphabets';
        errors.fieldValid = !!/^[A-Za-z\s]+$/.test(data);
        break;
      case 'email':
        errors.fieldMsg = validEmailRegex.test(data) ? '' : 'Email is not valid!';
        errors.fieldValid = !!validEmailRegex.test(data);
        break;
      default:
        break;
    }
    if (len.check) {
      if (data.length > len.maxLen || data.length < len.minLen) {
        errors.lenMsg = `The input has to be between ${len.minLen} and ${len.maxLen} characters long`;
        errors.lenValid = false;
      } else {
        errors.lenMsg = '';
        errors.lenValid = true;
      }
    } else {
      errors.lenMsg = '';
      errors.lenValid = true;
    }
    return errors;
  };

  return {
    action: {
      validateField,
    },
  };
}
