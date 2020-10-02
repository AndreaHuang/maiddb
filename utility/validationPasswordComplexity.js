const passwordComplexity = require("joi-password-complexity");
const complexityOptions = {
  min: 6,
  max: 20,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 3,
};

module.exports = function (input) {
  const validationResult = passwordComplexity(
    complexityOptions,
    "Password"
  ).validate(input);
  if (validationResult.error) {
    throw new Error(
      validationResult.error.name +
        " - " +
        validationResult.error.details[0].message
    );
  }
};
