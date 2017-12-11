
import {ObjectTypeTemplate} from './ObjectTypeTemplate.js';
import {InputTypeTemplate} from './InputTypeTemplate.js';
import {TypeField} from './TypeFieldClass.js';
import {Import} from './ImportClass.js';
import {createFile} from './framework/FileUtil.js';
import fs from 'fs';


import allEntities from '../resources/entity_jsons/overall.json';
import allImports from '../resources/import.json';

import swagger from '../resources/swagger.json';

const pathToOutput = '/home/work/workspace/QLGen/generatedFiles';


const folders = Object.keys(allImports);

folders.forEach((folder) => {
  allEntities[folder].forEach((entity) => {

    const imports = [];
    const objectType = entity.objectType;
    const inputType = entity.inputType;

    const specificImports = allImports[folder][objectType.entityName];
    if(specificImports!==undefined){
      Object.keys(specificImports).forEach((reference) => {
        imports.push(new Import({
          resources: [`${reference}Type`],
          source: `${allImports[folder][objectType.entityName][reference]}/${reference}`
        }));
      });
    }
    const typeDef = {
      typeName: objectType.entityName,
      typeDescription: `Type for ${objectType.entityName} in ${folder}`,
      fields: objectType.fields.map((field) => {return new TypeField(field);}),
      additionalImports: imports
    };

    const typeDefInput = {
      typeName: inputType.entityName,
      typeDescription: `input type for ${inputType.entityName} in ${folder}`,
      fields: inputType.fields.map((field) => {return new TypeField(field);}),
    };

    const file = {
      path: `${pathToOutput}/domain/${folder}/`,
      name: `${typeDef.typeName}.js`,
      content: new ObjectTypeTemplate(typeDef).generate + "\n\n" +
               new InputTypeTemplate(typeDefInput).generate,
      encoding: 'utf8'
    };
    createFile(file);

  });
});
