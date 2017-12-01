
import {ObjectTypeTemplate} from './ObjectTypeTemplate.js';
import {TypeField} from './TypeFieldClass.js';

const fields = [
  new TypeField({
    fieldName: 'categoryMembers',
    fieldType: 'new GraphQLList(ProductCategoryMemberType)',
    fetchUrl: /*ofbiz/eCommerce/api/*/'productCategoryMembers/find?id=vgerge',
    parentType: 'product',
    loader: '',
    args: ``
  }),
  new TypeField({
    fieldName: 'productId',
    fieldType: 'GraphQLString',
  }),
  new TypeField({
    fieldName: 'productName',
    fieldType: 'GraphQLString',
  })
];


const newVariables = {
  TypeName: "ProductType",
  TypeDescription: "this is a product type",
  fields: `${fields.map(field => field.generate)}`,
  additionalImports: ``
};
console.log(new ObjectTypeTemplate(newVariables).generate);
