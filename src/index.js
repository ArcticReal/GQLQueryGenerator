
import {ObjectTypeTemplate} from './ObjectTypeTemplate.js';
import {TypeField} from './TypeFieldClass.js';
import {Import} from './ImportClass.js';
import {createFile} from './framework/FileUtil.js';
import fs from 'fs';


import allEntities from '../resources/entity_jsons/overall.json';


console.log(importBuffer);

const pathToOutput = '/home/work/workspace/QLGen/generatedFiles/';

const imports = [
  new Import({
    resources: [
      'ProductCategoryMemberType'
    ],
    source: 'product/ProductCategoryMemberType'
  }),
  new Import({
    resources: [
      'ProductCategoryType',
      'SomeOtherType'
    ],
    source: 'product/ProductCategoryType'
  })
];

const typeDef = {
  typeName: productEntity.entityName,
  typeDescription: "this is a product type",
  fields: productEntity.fields.map((field) => {return new TypeField(field);}),
  additionalImports: imports
};
const file = {
  path: `${pathToOutput}types/`,
  name: `${typeDef.typeName}Type.js`,
  content: new ObjectTypeTemplate(typeDef).generate,
  encoding: 'utf8'
};

createFile(file);
