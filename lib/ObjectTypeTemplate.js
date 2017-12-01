"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ObjectTypeTemplate = function () {
  function ObjectTypeTemplate(newVariables) {
    _classCallCheck(this, ObjectTypeTemplate);

    var variables = newVariables;
    var template = "\n    import {\n      GraphQLSchema,\n      GraphQLObjectType,\n      GraphQLList,\n      GraphQLString,\n      GraphQLInt,\n      GraphQLBoolean,\n    } from 'graphql';\n    const " + variables.TypeName + " = new GraphQLObjectType({\n      name: '" + variables.TypeName + "',\n      description: '" + variables.TypeDescription + "',\n\n      fields: () => (" + variables.fields + ")\n    });\n\n    export {" + variables.TypeName + "};\n    ";
    this.template = template;
  }

  _createClass(ObjectTypeTemplate, [{
    key: "setVariables",
    value: function setVariables(newVariables) {
      constructor(newVariables);
    }
  }, {
    key: "generate",
    get: function get() {
      return this.template;
    }
  }]);

  return ObjectTypeTemplate;
}();

exports.ObjectTypeTemplate = ObjectTypeTemplate;