function checkBodyContains(body, ...params) {
  let errors = {};
  for (let p of params) {
    if (body[p] === undefined) {
      errors[p] = {
        message: `${p} is required in the body`
      };
    }
  }
  return Object.keys(errors).length ? errors : null;
}

function checkValuesNullorEmpty(body, ...params) {
  const errors = {};
  for (let p of params) {
    if (body[p] !== undefined && (body[p] === null || body[p] === '')) {
      errors[p] = {
        message: `${p} cannot be null or empty`
      };
    }
  }
  return Object.keys(errors).length ? errors : null;
}

function checkValuesValid(body, ...values) {
  // {name, regex}
  const errors = {};
  for (let value of values) {
    if (!value.regex.test(body[value.name])) {
      errors[value.name] = {
        message: `${value.name} is invalid`
      };
    }
  }
  return Object.keys(errors).length ? errors : null;
}

module.exports = {
  checkBodyContains,
  checkValuesNullorEmpty,
  checkValuesValid
};
