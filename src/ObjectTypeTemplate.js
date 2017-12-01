
class ObjectTypeTemplate{
  constructor(newVariables){
    const variables = newVariables;
    //keep indentation
    const template = (`
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql';

${variables.additionalImports.map(imp => {return imp.generate;}).join('')}

const ${variables.typeName} = new GraphQLObjectType({
  name: '${variables.typeName}',
  description: '${variables.typeDescription}',

  fields: () => ({${variables.fields.map(field => field.generate)}
  })
});

export {${variables.typeName}};
    `);
    this.template = template;
  }

  setVariables(newVariables){
    constructor(newVariables);
  }

  get generate(){
    return this.template;
  }
}






export {ObjectTypeTemplate};
