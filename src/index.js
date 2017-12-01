
import {ObjectTypeTemplate} from './ObjectTypeTemplate.js';

    const newVariables = {
      TypeName: "Product",
      TypeDescription: "this is a test type",
      fields: `{
        productId: {type: GraphQLString}
      }`
    };
console.log(new ObjectTypeTemplate(newVariables).generate);
