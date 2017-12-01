'use strict';

var _ObjectTypeTemplate = require('./ObjectTypeTemplate.js');

var _TypeFieldClass = require('./TypeFieldClass.js');

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

var newVariables = {
  TypeName: "ProductType",
  TypeDescription: "this is a product type",
  fields: '' + fields.map(function (field) {
    return field.generate;
  })
};
console.log(new _ObjectTypeTemplate.ObjectTypeTemplate(newVariables).generate);