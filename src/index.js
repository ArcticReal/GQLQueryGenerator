
import {ObjectTypeTemplate} from './ObjectTypeTemplate.js';
import {InputTypeTemplate} from './InputTypeTemplate.js';
import {ResponseTypeTemplate} from './ResponseTypeTemplate.js';
import {MutationsTemplate} from './MutationsTemplate.js';
import {TypeField} from './TypeFieldClass.js';
import {Import} from './ImportClass.js';
import {MutationBuilder} from './MutationBuilderTemplate.js';
import {createFile} from './framework/FileUtil.js';
import {firstToUpperCase, resolveTag} from './framework/StringUtil.js';
import fs from 'fs';


import allEntities from '../resources/entity_jsons/overall.json';
import allImports from '../resources/import.json';

import swagger from '../resources/swagger.json';

const pathToOutput = '/home/work/workspace/QLGen/generatedFiles';
const folders = Object.keys(allImports);

var fileLocations = {};

//sets fileLocations
generateTypes();

//needs fileLocations filled
generateMutations();


function generateMutations(){
  var mutationBuilder = {
    imports: [],
    mutations: []
  };

  const paths = Object.keys(swagger.paths);
  var mutations = {};

  paths.forEach((path) => {
    const methods = Object.keys(swagger.paths[path]);
    methods.forEach((method) => {
      if(method !== "get"){
        const tag = resolveTag(swagger.paths[path][method].tags[0]);
        if(mutations[tag]===undefined||mutations[tag]===null){
          mutations[tag] = [];
        }

        var args = swagger.paths[path][method].parameters;
        var responses = swagger.paths[path][method].responses;
        if(args===undefined){
          args = [];
        }
        if(responses===undefined){
          responses = [];
        }

        mutations[tag].push({
          fetchUrl: path.replace("/", "").replace("/{", "/${args.") + "?",
          method: method,
          mutationName: swagger.paths[path][method].summary,
          returnType: "ResponseType",
          mutationDescription: "'mutation for ofbiz " + swagger.paths[path][method].summary + " method'",
          args: args,
          responses: responses,
          bodyInput: "",
        });

      }

    });
  });

  const controllerNames = Object.keys(mutations);

  controllerNames.forEach((tag) => {
    var resources = [];
    var imports = new Set();
    var pathDepth;
    if(tag.includes("Service")){
      pathDepth = 1;
    }else if (fileLocations[tag.replace("Controller", "") + "Type"]===undefined) {
      pathDepth = 1;
    } else {
      pathDepth = 1 + fileLocations[tag.replace("Controller", "") + "Type"].replace(/\/$/, "").match(/\//).length;
    }
    var fileContent = "";
    mutations[tag].forEach((mutation) => {
      var newArgs = [];
      mutation.args.forEach((parameter) => {
        //extract and eliminate paramTypes that look like login.username
        const name = parameter.name.replace(".", "");
        switch (parameter.in) {
          case "body":
            mutation.bodyInput = "args." + name;
            const ref = parameter.schema.$ref;
            if (ref===undefined) {
              const inputType = parameter.schema.type;
              if(inputType.includes("array")){
                newArgs.push({
                  fieldName: name,
                  fieldType: "new GraphQLList(" + convertType(parameter.schema.items.type) + ")"
                });
                break;
              }else {
                newArgs.push({
                  fieldName: name,
                  fieldType: convertType(inputType)
                });
                break;
              }
            }
            const inputTypeName = ref.split("/")[2];
            if (fileLocations[inputTypeName + 'InputType'] !==undefined) {

              imports.add(new Import({
                pathDepth: pathDepth,
                resources: inputTypeName + "InputType",
                source:  `${fileLocations[inputTypeName + "InputType"]}/${inputTypeName}InputType`
              }));
            }else if (fileLocations[inputTypeName + "Type"] !== undefined) {
              const inputTypeDef = generateInputDefFromSwagger(inputTypeName);
              const file = {
                path: `${pathToOutput}/domain/${fileLocations[inputTypeName + 'Type']}/`,
                name: `${inputTypeName}InputType.js`,
                content: new InputTypeTemplate(inputTypeDef).generate,
                encoding: 'utf8'
              };
              createFile(file);
              fileLocations[inputTypeName + "InputType"] = `${fileLocations[inputTypeName + 'Type']}`;

              imports.add(new Import({
                pathDepth: pathDepth,
                resources: inputTypeName + "InputType",
                source:  `${fileLocations[inputTypeName + 'InputType']}/${inputTypeName}InputType`
              }));
            } else {
              const inputTypeDef = generateInputDefFromSwagger(inputTypeName);
              const file = {
                path: `${pathToOutput}/domain/dto/`,
                name: `${inputTypeName}InputType.js`,
                content: new InputTypeTemplate(inputTypeDef).generate,
                encoding: 'utf8'
              };
              createFile(file);
              fileLocations[inputTypeName + "InputType"] = `dto`;

              imports.add(new Import({
                pathDepth: pathDepth,
                resources: inputTypeName + "InputType",
                source:  `${fileLocations[inputTypeName + 'InputType']}/${inputTypeName}InputType`
              }));
            }
            newArgs.push({
              fieldName: name,
              fieldType: inputTypeName + 'InputType'
            });
            break;
          case "path":
            if(parameter.type.includes("array")){
              newArgs.push({
                fieldName: name,
                fieldType: "new GraphQLList(" + convertType(parameter.items.type) + ")"
              });
              break;
            }
            newArgs.push({
              fieldName: name,
              fieldType: convertType(parameter.type)
            });
            break;
          case "query":
            mutation.fetchUrl = mutation.fetchUrl + `${name}=\${args.${name}}`;
            var type;
            if(parameter.type!==undefined){
              if(parameter.type.includes("array")){
                type = "new GraphQLList(" + convertType(parameter.items.type) + ")";
                break;
              }else {
                type = convertType(parameter.type);
              }
            }else {
              type = "new GraphQLList(KeyValueInputType)";
            }
            newArgs.push({
              fieldName: name,
              fieldType: type
            });
            break;
          default:

        }
      });

      let responses = mutation.responses;
      let responseKeys = Object.keys(responses);
      responseKeys.forEach((responseKey) => {
        let response = responses[responseKey];
        if(response.schema!==undefined){
          var responseType = response.schema.type;
          if (responseType===undefined) {
            responseType = response.schema.$ref.split(/\//)[2];
            if (fileLocations[responseType + 'ResponseType'] !==undefined) {
              imports.add(new Import({
                pathDepth: pathDepth,
                resources: responseType + "ResponseType",
                source:  `${fileLocations[responseType + "ResponseType"]}/${responseType}ResponseType`
              }));
            }else if (fileLocations[responseType + "Type"] !== undefined) {
              const responseTypeDef = generateResponseDefFromSwagger(responseType);
              const file = {
                path: `${pathToOutput}/domain/${fileLocations[responseType + 'Type']}/`,
                name: `${responseType}ResponseType.js`,
                content: new ResponseTypeTemplate(responseTypeDef).generate,
                encoding: 'utf8'
              };
              createFile(file);
              fileLocations[responseType + "ResponseType"] = `${fileLocations[responseType + 'Type']}`;

              imports.add(new Import({
                pathDepth: pathDepth,
                resources: responseType + "ResponseType",
                source:  `${fileLocations[responseType + 'ResponseType']}/${responseType}ResponseType`
              }));
            } else {
              const responseTypeDef = generateResponseDefFromSwagger(responseType);
              const file = {
                path: `${pathToOutput}/domain/dto/`,
                name: `${responseType}ResponseType.js`,
                content: new ResponseTypeTemplate(responseTypeDef).generate,
                encoding: 'utf8'
              };
              createFile(file);
              fileLocations[responseType + "ResponseType"] = `dto`;

              imports.add(new Import({
                pathDepth: pathDepth,
                resources: responseType + "ResponseType",
                source:  `${fileLocations[responseType + 'ResponseType']}/${responseType}ResponseType`
              }));
            }
            responseType = responseType + 'ResponseType';
          } else {
            if (responseType!=="object") {
              if (responseType.includes("array")) {
                responseType = response.schema.items.type;
                if (responseType!==undefined) {
                  responseType = convertType(responseType);
                }else {
                  responseType = response.schema.items.$ref.split("/")[2];
                  if (fileLocations[responseType + 'ResponseType']!==undefined) {
                    imports.add(new Import({
                      pathDepth: pathDepth,
                      resources: responseType + "ResponseType",
                      source:  `${fileLocations[responseType + 'ResponseType']}/${responseType}ResponseType`
                    }));
                  }else if (fileLocations[responseType + "Type"] !== undefined) {
                    const responseTypeDef = generateResponseDefFromSwagger(responseType);
                    const file = {
                      path: `${pathToOutput}/domain/${fileLocations[responseType + 'Type']}/`,
                      name: `${responseType}ResponseType.js`,
                      content: new ResponseTypeTemplate(responseTypeDef).generate,
                      encoding: 'utf8'
                    };
                    createFile(file);
                    fileLocations[responseType + "ResponseType"] = fileLocations[responseType + 'Type'];

                    imports.add(new Import({
                      pathDepth: pathDepth,
                      resources: responseType + "ResponseType",
                      source:  `${fileLocations[responseType + 'ResponseType']}/${responseType}ResponseType`
                    }));
                  } else {
                    const responseTypeDef = generateResponseDefFromSwagger(responseType);
                    const file = {
                      path: `${pathToOutput}/domain/dto/`,
                      name: `${responseType}ResponseType.js`,
                      content: new ResponseTypeTemplate(responseTypeDef).generate,
                      encoding: 'utf8'
                    };
                    createFile(file);
                    fileLocations[responseType + "ResponseType"] = `dto`;

                    imports.add(new Import({
                      pathDepth: pathDepth,
                      resources: responseType + "ResponseType",
                      source:  `${fileLocations[responseType + 'ResponseType']}/${responseType}ResponseType`
                    }));

                  }

                }
                responseType = `new GraphQLList(${responseType + 'ResponseType'})`;
              }else {
                responseType = convertType(responseType);
              }
            }else {
              responseType = "ResponseType";
            }
          }
          mutation.returnType = responseType;
        }
      });

      var mutationDef = mutation;
      mutationDef.args = newArgs;
      fileContent += new MutationsTemplate(mutationDef).generate;

      if (mutationBuilder.mutations.includes(mutation.mutationName)) {
        if (!tag.includes("Service")) {
          mutationBuilder.imports = mutationBuilder.imports.map((specificImport) => {
            let tmpImport = specificImport;
            if (tmpImport.resources.includes(mutation.mutationName)) {
              tmpImport.resources.splice(tmpImport.resources.indexOf(mutation.mutationName), 1);
            }
            return tmpImport;
          });
          resources.push(mutation.mutationName);
        }
      }else {
        mutationBuilder.mutations.push(mutation.mutationName);
        resources.push(mutation.mutationName);
      }

    });
    var path;
    if(tag.includes("Service")){
      path = `${pathToOutput}/domain/service/`;
    }else if (fileLocations[tag.replace("Controller", "") + "Type"]===undefined) {
      path = `${pathToOutput}/domain/service/`;
    } else {
      path = `${pathToOutput}/domain/${fileLocations[tag.replace("Controller", "") + "Type"]}/`;
    }
    var name = `${tag}Mutations.js`;

    imports.add(new Import({
      resources: ["postToUrl", "deleteToUrl", "putToUrl"],
      source: "framework/ofbizCon",
      pathDepth: pathDepth + 1
    }));

    imports.add(new Import({
      resources: ["ResponseType", "KeyValueInputType"],
      source: "framework/helpTypes",
      pathDepth: pathDepth + 1
    }));

    var importArray = [];
    imports.forEach((specificImport) => {
      if(!importArray.includes(specificImport.generate)){
        importArray.push(specificImport.generate);
      }
    });

    //keep indentation
    const content = `import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
} from 'graphql';
` + importArray.join('') + fileContent;
    const file = {
      path: path,
      name: name,
      content: content,
      encoding: 'utf8'
    };
    createFile(file);

    //add to mutation builder
    mutationBuilder.imports.push({
      resources: resources,
      source: path.replace(pathToOutput + "/", "") + name.replace(".js", ""),
      pathDepth: 2
    });

  });

  //build imports
  mutationBuilder.imports = mutationBuilder.imports.map((specificImport) => {
    return new Import(specificImport);
  });

  //generate MutationBuilder and write to file
  const file = {
    path: `${pathToOutput}/domain/mutationBuilder/`,
    name: 'generatedMutations.js',
    content: new MutationBuilder(mutationBuilder).generate,
    encoding: 'utf8'
  };

  createFile(file);

}

function generateInputDefFromSwagger(typeName){

  var fields = resolveFields(typeName);

  const typeDefInput = {
    typeName: typeName,
    typeDescription: `input type for ${typeName}`,
    fields: fields,
  };

  return typeDefInput;
}

function generateResponseDefFromSwagger(typeName){
  var fields = resolveFields(typeName);

  const responseTypeDef = {
    typeName: typeName,
    typeDescription: `response type for ${typeName}`,
    fields: fields,
  };

  return responseTypeDef;
}

function resolveFields(typeName){


  const properties = Object.keys(swagger.definitions[typeName].properties);
  var fields = [];
  properties.forEach((property) => {
    var type = swagger.definitions[typeName].properties[property].type;
    if(type===undefined){
      type = swagger.definitions[typeName].properties[property].$ref;
    }
    type = convertType(type, typeName, property);
    fields.push(new TypeField({
      fieldName: property,
      fieldType: type
    }));
  });

  return fields;
}

function convertType(swaggerType, typeName, property){

  let convertedType = null;
  switch (swaggerType) {
    case "number":
      convertedType = "GraphQLFloat";
      break;
    case "string":
      convertedType = "GraphQLString";
      break;
    case "boolean":
      convertedType = "GraphQLBoolean";
      break;
    case "integer":
      convertedType = "GraphQLInt";
      break;
    case "array":
      convertedType = "new GraphQLList(" + convertType(swagger.definitions[typeName].properties[property].items.type, typeName, property) + ")";
      break;
    default:
      convertedType = "GraphQLString";
  }
  return convertedType;

}

function generateTypes(){
  folders.forEach((folder) => {
    allEntities[folder].forEach((entity) => {

      const imports = new Set();
      const objectType = entity.objectType;
      const inputType = entity.inputType;

      const specificImports = allImports[folder][objectType.entityName];
      if(specificImports!==undefined){
        Object.keys(specificImports).forEach((reference) => {
          imports.add(new Import({
            pathDepth: 2,
            resources: [`${reference}Type`],
            source: `${allImports[folder][objectType.entityName][reference]}/${reference}/${reference}Type`
          }));
        });
      }
      const typeDef = {
        typeName: objectType.entityName,
        typeDescription: `Type for ${objectType.entityName} in ${folder}`,
        fields: objectType.fields.map((field) => {return new TypeField(field);}),
        additionalImports: Array.from(imports)
      };

      const typeDefInput = generateInputDefFromSwagger(inputType.entityName);

      const file = {
        path: `${pathToOutput}/domain/${folder}/${typeDef.typeName}/`,
        name: `${typeDef.typeName}Type.js`,
        content: new ObjectTypeTemplate(typeDef).generate,
        encoding: 'utf8'
      };
      createFile(file);
      fileLocations[typeDef.typeName + "Type"] = `${folder}/${typeDef.typeName}`;

    });
  });
}
