const {
  addDecoratorsLegacy,
  override,
  disableEsLint,
} = require("customize-cra");

module.exports = {
  webpack: override(addDecoratorsLegacy(), disableEsLint()),
};
