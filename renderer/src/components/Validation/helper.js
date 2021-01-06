/* eslint-disable no-useless-escape */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-return-assign */
export const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
);

export const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach((val) => {
    (val.length > 0 && (valid = false));
  });
  return valid;
};

export const countErrors = (errors) => {
  let count = 0;
  Object.values(errors).forEach((val) => ((val.length > 0) && (count += 1)));
  return count;
};
