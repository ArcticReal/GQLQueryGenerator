
import {ObjectTypeTemplate} from './ObjectTypeTemplate.js';
import {TypeField} from './TypeFieldClass.js';
import {Import} from './ImportClass';
import fs from 'fs';

const pathToOutput = '/home/work/workspace/QLGen/generatedFiles/';

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

const imports = [
  new Import({
    resources: [
      'ProductCategoryMemberType'
    ],
    source: 'product/ProductCategoryMemberType'
  }),
  new Import({
    resources: [
      'ProductCategoryType'
    ],
    source: 'product/ProductCategoryType'
  })
];

const newVariables = {
  typeName: "ProductType",
  typeDescription: "this is a product type",
  fields: fields,
  additionalImports: imports
};
const file = {
  path: `${pathToOutput}types/`,
  name: `${newVariables.typeName}.js`,
  content: new ObjectTypeTemplate(newVariables).generate,
  encoding: 'utf8'
};
fs.mkdir(file.path, (err) => {
  if (err){
    if(err.code!=='EEXIST')
      throw err;
  }else {
    console.log('mkdired');
  }
  fs.writeFile(`${file.path}${file.name}`, file.content, file.encoding, (err) => {
    if (err) throw err;
    console.log("writing successful");
  });
});
console.log(file.content);
