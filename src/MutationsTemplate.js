class MutationsTemplate{

  constructor(newVariables){
    if(newVariables!==null&&newVariables!==undefined){
      this.mutationName = newVariables.mutationName;
      this.returnType = newVariables.returnType;
      this.mutationDescription = newVariables.mutationDescription;
      this.args = newVariables.args;
      this.method = newVariables.method;
      this.fetchUrl = newVariables.fetchUrl;
      this.bodyInput = newVariables.bodyInput;
      if(this.bodyInput===null||this.bodyInput===undefined||this.bodyInput===""){
        this.bodyInput = "null";
      }
    }
  }


  get generate(){

    this.template = `

const ${this.mutationName} = {
  type: ${this.returnType},
  description: ${this.mutationDescription},
  args:{${this.args.map((arg) => {return `${arg.fieldName}: {type: ${arg.fieldType}}`;})}},
  resolve: (root, args, {req}) => {
    return ${this.method}ToUrl(\`${this.fetchUrl}\`, ${this.bodyInput}, req);
  }
};
export {${this.mutationName}};
`;

    return this.template;
  }

}

export {MutationsTemplate};
