module.exports = Object.freeze({
  HEADER_AUTH_TOKEN: "x-maid-token",
  CONFIG_JWT_PRIVATE_KEY: "jwtPrivateKey",
  CONFIG_DATABASE: "database",
  CONFIG_ROUNDOFSALT: "roundsOfSalt",
  STATUS_CASE: {
    SAVED: "SAVED",
    PUBLISHED: "PUBLISHED",
    ONHOLD: "ONHOLD",
    SUBMITTED: "SUBMITTED",
  },
  MAID_NATIONALITY: {
    Idonesia: "ID",
    Philippines: "PH",
    Thailand: "TH",
  },
  ERROR: {
    SERROR001: {
      errorCode: "SERR001",
      message: "System Error.",
    },
    BERROR001: {
      errorCode: "BERR001",
      message: "Validation Error.",
    },
    BERROR002: {
      errorCode: "BERR002",
      message: "This email is already registered.",
    },
    BERROR003: {
      errorCode: "BERR003",
      message: "This name is in use.",
    },
    BERROR004: {
      errorCode: "BERR004",
      message: "Invalid email or password.",
    },
    BERROR005: {
      errorCode: "BERR005",
      message: "Access Denied.",
    },
    BERROR006: {
      errorCode: "BERR006",
      message: "Invalid Token.",
    },
    BERROR007: {
      errorCode: "BERR007",
      message: "Not privilege for the operation.",
    },
  },
});
