class ResponseTypeTemplate{
  constructor(newVariables){
    const variables = newVariables;
    //keep indentation
    const template = (
`import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
} from 'graphql';

const ${variables.typeName}ResponseType = new GraphQLObjectType({
  name: '${variables.typeName}ResponseType',
  description: '${variables.typeDescription}',

  fields: () => ({${variables.fields.map(field => field.generate)}
  })
});

export {${variables.typeName}ResponseType};
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






export {ResponseTypeTemplate};
