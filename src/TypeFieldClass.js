class TypeField{
  constructor(props){ //fieldName, fieldType, fetchUrl, parentType, loader, args
    if(props!==undefined&&props!==null){
      this.fieldName = props.fieldName;
      this.fieldType = props.fieldType;
      this.resolve = props.fetchUrl;
      this.parentType = props.parentType;
      this.loader = props.loader;
      this.args = props.args;
    }
  }


  get generate(){
    if(this.fieldType===undefined||this.fieldType===null||this.fieldType==='')
      throw new Error(`Error while generating field ${this.fieldName} for parent ${this.parentType}: fieldType ${this.fieldType} is not supported`);
    if (this.resolve===undefined||this.resolve===null||this.resolve==='') {
      //For right indentation don't move this
      this.template = (`
    ${this.fieldName}: {type: ${this.fieldType}}`);

    }else {
      if(this.parentType===undefined||this.parentType===null||this.parentType===''){
        this.parentType = `parent`;
      }
      if(this.loader===undefined||this.loader===null||this.loader==='')
        this.loader = `ofbizArray`;

      //For right indentation don't move this
      this.template = (`
    ${this.fieldName}: {
      type: ${this.fieldType},
      args : {${this.args}},
      resolve: (${this.parentType}, args, {loaders}) => loaders.${this.loader}.load('${this.resolve}')
    }`);
    }
    return this.template;
  }

}

export {TypeField};
