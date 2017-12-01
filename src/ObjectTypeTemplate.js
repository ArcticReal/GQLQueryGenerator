
class ObjectTypeTemplate{
  constructor(newVariables){
    const variables = newVariables;
    const template = (`
    import {
      GraphQLSchema,
      GraphQLObjectType,
      GraphQLList,
      GraphQLString,
      GraphQLInt,
      GraphQLBoolean,
    } from 'graphql';
    const ${variables.TypeName} = new GraphQLObjectType({
      name: '${variables.TypeName}',
      description: '${variables.TypeDescription}',

      fields: () => (${variables.fields})
    });

    export {${variables.TypeName}};
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
