class Import{
  constructor(props){
    this.resources = props.resources;
    this.source = props.source;
  }

  get generate(){

    return `import {${this.resources}} from './${this.source}.js';\n`;
  }

}

export {Import};
