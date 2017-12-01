class Import{
  constructor(props){
    this.resources = props.resources;
    this.source = props.source;
  }

  get generate(){

    return `import {${this.resources.map(resource => resource)}} from './${this.source}.js';\n`;
  }

}

export {Import};
