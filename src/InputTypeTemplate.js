
class InputTypeTemplate{
  constructor(newVariables){
    const variables = newVariables;
    //keep indentation
    const template = (`


const ${variables.typeName}InputType = new GraphQLInputObjectType({
  name: '${variables.typeName}InputType',
  description: '${variables.typeDescription}',

  fields: () => ({${variables.fields.map(field => field.generate)}
  })
});

export {${variables.typeName}InputType};
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






export {InputTypeTemplate};
