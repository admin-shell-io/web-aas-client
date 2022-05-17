/*
 * Copyright (c) 2021 Lenze SE
 * SPDX-License-Identifier: Apache-2.0
 */

class Base {
   constructor(Base) {
      this.isNull = this.isNull.bind(this);
      this.isPrimitive = this.isPrimitive.bind(this);
      this.isObject = this.isObject.bind(this);
      this.isArray = this.isArray.bind(this);
      this.elementExists = this.elementExists.bind(this);
      this.convertToJSON = this.convertToJSON.bind(this);
      this.hasParentType = this.hasParentType.bind(this);
      this.hasInParentTreeType = this.hasInParentTreeType.bind(this);
      this.getParentByType = this.getParentByType.bind(this);
   }

   getQueryVariable(variable) {
      //var query = ;
      var vars = window.location.search.substring(1).split("&");
      for (var i = 0; i < vars.length; i++) {
         var pair = vars[i].split("=");
         if(pair[0] == variable)
            return pair[1];
      }
      return null;
   }

   isNull(SubElement) {
      if (SubElement == null)
         return true;
      return false;
   }

   isPrimitive(SubElement) {
      return (SubElement !== Object(SubElement));
   }

   isObject(SubElement) {
      return (SubElement === Object(SubElement));
   }

   isArray(SubElement) {
      if (!this.isObject(SubElement))
         return false;
      return (Array.isArray(SubElement));
   }

   elementExists(JSON, elementName) {
      if (JSON.hasOwnProperty(elementName) && (!this.isNull(JSON[elementName])))
         return true;
      return false;
   }

   convertToJSON(data, datatype) {
      switch(datatype) {
      default:
      case "String":
      case "string":
      case "str":
         return String(data);
         break;
      case "Integer":
      case "integer":
      case "int":
         var parsed = parseInt(data, 10);
         if (isNaN(parsed))
            return 0;
         return parsed;
         break;
      case "Double":
      case "double":
      case "Float":
      case "float":
         var parsed = parseFloat(data).toFixed(1);
         if (isNaN(parsed))
            return 0;
         return parsed;
         break;
      case "Boolean":
      case "boolean":
      case "bool":
         switch (data) {
         default:
            return false;
         break;
         case "1":
         case "true":
         case true:
         case 1:
            return true;
            break;
         case "0":
         case "false":
         case false:
         case 0:
            return false;
            break;
         }
         return parseBoolean(data);
         break;
      }
   }

   hasParentType(obj, type) {
      if (!this.elementExists(obj, "parentObj"))
         return false;
      if (obj.parentObj.tType === type)
         return true;
      return false;
   }

   hasInParentTreeType(obj, type) {
      if (!this.elementExists(obj, "parentObj"))
         return false;
      if (this.hasParentType(obj, type))
         return true;
      return this.hasInParentTreeType(obj.parentObj, type);
   }

      getParentByType(obj, type) {
      if (!this.elementExists(obj, "parentObj"))
         return null;
      if (this.hasParentType(obj, type))
         return obj.parentObj;
      return this.getParentByType(obj.parentObj, type);
   }
}
