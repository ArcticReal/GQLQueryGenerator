class MutationBuilder{
  constructor(props){
    this.imports = props.imports;
    this.mutationNames =props.mutations;
  }

  get generate(){
return `${this.imports.map((imprt) => {return imprt.generate;}).join('')}
const generatedMutations = {
${this.mutationNames.map((mutationName) => {
  return `  ${mutationName}: ${mutationName}`;
}).join(',\n')}
};

export {generatedMutations};`;
  }

}

export {MutationBuilder};
