module.exports = function (schema, requestBody) {
  const validationResult = schema.validate(requestBody);
  if (validationResult.error) {
    throw new Error(
      validationResult.error.name +
        " - " +
        validationResult.error.details[0].message
    );
  }
};
