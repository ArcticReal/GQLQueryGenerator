'use strict';

var _ObjectTypeTemplate = require('./ObjectTypeTemplate.js');

var _TypeFieldClass = require('./TypeFieldClass.js');

var _ImportClass = require('./ImportClass');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pathToOutput = '/home/work/workspace/QLGen/generatedFiles/';

var fields = [new _TypeFieldClass.TypeField({
  fieldName: 'categoryMembers',
  fieldType: 'new GraphQLList(ProductCategoryMemberType)',
  fetchUrl: /*ofbiz/eCommerce/api/*/'productCategoryMembers/find?id=vgerge',
  parentType: 'product',
  loader: '',
  args: ''
}), new _TypeFieldClass.TypeField({
  fieldName: 'productId',
  fieldType: 'GraphQLString'
}), new _TypeFieldClass.TypeField({
  fieldName: 'productName',
  fieldType: 'GraphQLString'
})];

var imports = [new _ImportClass.Import({
  resources: ['ProductCategoryMemberType'],
  source: 'product/ProductCategoryMemberType'
}), new _ImportClass.Import({
  resources: ['ProductCategoryType', 'SomeOtherType'],
  source: 'product/ProductCategoryType'
})];

var newVariables = {
  typeName: "ProductType",
  typeDescription: "this is a product type",
  fields: fields,
  additionalImports: imports
};
var file = {
  path: pathToOutput + 'types/',
  name: newVariables.typeName + '.js',
  content: new _ObjectTypeTemplate.ObjectTypeTemplate(newVariables).generate,
  encoding: 'utf8'
};
_fs2.default.mkdir(file.path, function (err) {
  if (err) {
    if (err.code !== 'EEXIST') throw err;
  } else {
    console.log('mkdired');
  }
  _fs2.default.writeFile('' + file.path + file.name, file.content, file.encoding, function (err) {
    if (err) throw err;
    console.log("writing successful");
  });
});
console.log(file.content);