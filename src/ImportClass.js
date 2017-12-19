class Import{
  constructor(props){
    this.resources = props.resources;
    this.source = props.source;
    this.pathPrefix = "";
    if (props.pathDepth!==undefined) {
      this.pathDepth = props.pathDepth;
    }else {
      this.pathDepth = 0;
    }

    if (props.ownPath!==undefined) {
      this.ownPath = props.ownPath.replace(/\/$/, "");
      this.pathDepth = this.ownPath.match("/");
      if(this.pathDepth===null){
        this.pathDepth = 0;
      }
    }
    for (var i = 0; i < this.pathDepth; i++) {
      this.pathPrefix += "../";
    }
  }

  get generate(){

    return `import {${this.resources}} from '${this.pathPrefix}${this.source}.js';\n`;
  }

}

export {Import};
