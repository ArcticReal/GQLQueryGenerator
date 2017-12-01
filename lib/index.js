"use strict";

var _ObjectTypeTemplate = require("./ObjectTypeTemplate.js");

var newVariables = {
  TypeName: "Product",
  TypeDescription: "this is a test type",
  fields: "{\n        productId: {type: GraphQLString}\n      }"
};
console.log(new _ObjectTypeTemplate.ObjectTypeTemplate(newVariables).generate);