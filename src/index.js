
import {ObjectTypeTemplate} from './ObjectTypeTemplate.js';
import {TypeField} from './TypeFieldClass.js';
import {Import} from './ImportClass.js';
import {createFile} from './framework/FileUtil.js';
import fs from 'fs';


import allEntities from '../resources/entity_jsons/overall.json';
import allImports from '../resources/import.json';

const pathToOutput = '/home/work/workspace/QLGen/generatedFiles';

const folders = Object.keys(allImports);

folders.forEach((folder) => {
  allEntities[folder].forEach((entity) => {
    const imports = [];

    const specificImports = allImports[folder][entity.entityName];
    if(specificImports!==undefined){
      specificImports.forEach((reference) => {
        imports.push(new Import({
          resources: [reference],
          source: `${folder}/${reference}`
        }));
      });
    }
    const typeDef = {
      typeName: entity.entityName,
      typeDescription: `Type for ${entity.entityName} in ${folder}`,
      fields: entity.fields.map((field) => {return new TypeField(field);}),
      additionalImports: imports
    };

    const file = {
      path: `${pathToOutput}/types/${folder}/`,
      name: `${typeDef.typeName}Type.js`,
      content: new ObjectTypeTemplate(typeDef).generate,
      encoding: 'utf8'
    };
    createFile(file);

  });
});
