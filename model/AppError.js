function AppError(errorCode, message) {
  this.errorCode = errorCode;
  this.message = message;
}
module.exports = AppError;
