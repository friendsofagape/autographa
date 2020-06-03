String.prototype.replaceAll = function (find, replace) {
  var str = this;
  return str.replace(new RegExp(find, "gi"), replace);
};
