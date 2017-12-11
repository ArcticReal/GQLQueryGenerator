class MutationsTemplate{

  constructor(newVariables){
    if(newVariables!==null&&newVariables!==undefined){
      this.typeName = newVariables.typeName;
      this.fetchUrl = newVariables.fetchUrl;
    }

    const template = `
const create${this.typeName}Mutation = {
  type: ${this.typeName}Type,
  description: create a ${this.typeName},
  args:{
    ${this.typeName}: ${this.typeName}InputType
  }.
  resolve: (root, args, {req}) => {
    return postToUrl('${this.fetchUrl}', \`\${args.${this.typeName}}\`, req)
  }
}`;

  }
}
