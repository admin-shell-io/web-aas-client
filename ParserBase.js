/*
 * Copyright (c) 2021 Lenze SE
 * SPDX-License-Identifier: Apache-2.0
 */

class ParserBase extends Base {
   constructor() {
      super();

      this.parseAAS = this.parseAAS.bind(this);
      this.parseSubmodels = this.parseSubmodels.bind(this);
      this.addSubmodelURLS = this.addSubmodelURLS.bind(this);
      this.parseSubmodel = this.parseSubmodel.bind(this);
      this.parseAsset = this.parseAsset.bind(this);
      this.parseIdentifiable = this.parseIdentifiable.bind(this);
      this.parseReferable = this.parseReferable.bind(this);
      this.parseSubmodelElement = this.parseSubmodelElement.bind(this);
      this.parseEntity = this.parseEntity.bind(this);
      this.parseEvent = this.parseEvent.bind(this);
      this.parseOperation = this.parseOperation.bind(this);
      this.parseOperationVariable = this.parseOperationVariable.bind(this);
      this.parseSubmodelElementCollection =
         this.parseSubmodelElementCollection.bind(this);
      this.parseCapability = this.parseCapability.bind(this);
      this.parseDataElement = this.parseDataElement.bind(this);
      this.parseDataType = this.parseDataType.bind(this);
      this.parseRelationshipElement = this.parseRelationshipElement.bind(this);
      this.parseString = this.parseString.bind(this);
      this.parseValue = this.parseValue.bind(this);
      this.parseSecurity = this.parseSecurity.bind(this);
      this.parseSemantics = this.parseSemantics.bind(this);
      this.parseReference = this.parseReference.bind(this);
      this.parseDataSpecification = this.parseDataSpecification.bind(this);
      this.parseAdministrativeInformation =
         this.parseAdministrativeInformation.bind(this);
      this.parseIdentifier = this.parseIdentifier.bind(this);
      this.parseIdentifierType = this.parseIdentifierType.bind(this);
      this.parseKeyType = this.parseKeyType.bind(this);
      this.parseLangStringSet = this.parseLangStringSet.bind(this);
      this.parseLangString = this.parseLangString.bind(this);
      this.parseQualifiable = this.parseQualifiable.bind(this);
      this.parseConstraint = this.parseConstraint.bind(this);
      this.parseQualifier = this.parseQualifier.bind(this);
      this.parseFormula = this.parseFormula.bind(this);
      this.parseKind = this.parseKind.bind(this);
      this.parseModelingKind = this.parseModelingKind.bind(this);
      this.parseAssetKind = this.parseAssetKind.bind(this);
      this.parseArray = this.parseArray.bind(this);
      this.parseKeys = this.parseKeys.bind(this);
      this.parseKey = this.parseKey.bind(this);
      this.parseModelType = this.parseModelType.bind(this);
      this.parseRegistry = this.parseRegistry.bind(this);
      this.parseAssetAdministrationShellDescriptor =
         this.parseAssetAdministrationShellDescriptor.bind(this);
      this.parseSubmodelDescriptor = this.parseSubmodelDescriptor.bind(this);
      this.parseEndpoint = this.parseEndpoint.bind(this);
      /* Helper */
      this.getByURL = this.getByURL.bind(this);
      this.newTreeObject = this.newTreeObject.bind(this);
      this.newPropertyObject = this.newPropertyObject.bind(this);
      this.addChildTreeObject = this.addChildTreeObject.bind(this);
      this.setTreeObjectType = this.setTreeObjectType.bind(this);
      this.setURL = this.setURL.bind(this);
      this.copyParentURL = this.copyParentURL.bind(this);
      this.setURLsOperation = this.setURLsOperation.bind(this);
      this.fixSubmodelURL = this.fixSubmodelURL.bind(this);
      this.setRootURLS = this.setRootURLS.bind(this);
   }

   parseAAS(JSON, object, fetchSubmodels = false, submodelsCallback = null,
            submodelsErrorCallback = null) {
      console.log(JSON);
       var aas = this.newTreeObject(JSON.idShort, object,
       "AssetAdministrationShell");

       this.copyParentURL(aas);

      if (fetchSubmodels) {
         this.getByURL(aas,
                       aas.tURL + "/" + "submodels",
                       submodelsCallback,
                       submodelsErrorCallback);
      }

      // security [Security] - (0-1)
      if (this.elementExists(JSON, "security"))
         this.parseSecurity(JSON.security,
               "security",
               aas);
      // derivedFrom [Key(s)] - (0-1)
      if (this.elementExists(JSON, "derivedFrom"))
         this.parseKeys(JSON.derivedFrom, "derivedFrom", aas);
      // dataSpecification
      this.parseDataSpecification(JSON, name, aas);
      // Identifiable
      this.parseIdentifiable(JSON, name, aas);
      // Referable
      this.parseReferable(JSON, name, aas);
      // asset [Asset]
      if (this.elementExists(JSON, "asset"))
         this.parseAsset(JSON.asset, aas);
      // submodels [Array of Key(s)] - (0-n)
      if (this.elementExists(JSON, "submodels"))
         this.parseArray(JSON.submodels,
               "submodelsOverview",
               aas,
               this.parseKeys);
      // views [Array of Key(s)] - (0-n)
      if (this.elementExists(JSON, "views"))
         this.parseArray(JSON.views, "views", aas, this.parseKeys);

      console.log(aas);
      return aas;
   }

   parseSubmodels(JSON, object, fetchSubmodel = false, submodelCallback = null,
                  submodelErrorCallback = null) {
      if (!this.isArray(JSON)) {
         // Error ?
         return;
      }
      
      var submodelsTree = this.newTreeObject("submodels", object,
      "Submodels");

      var submodels = this.newPropertyObject("submodels", object,
      "Submodels");
      this.setURL(submodels, "submodels");

      for (var i = 0; i < JSON.length; i++) {
         var SubElement = JSON[i];

         var submodel = this.newTreeObject("Submodel" + i, submodels,
                                           "Submodel");

         if (this.elementExists(SubElement, "idShort"))
            this.parseString(SubElement.idShort, "idShort", submodel);
         // - endpoint.XYZ?

         this.addSubmodelURLS(submodel);
         if (fetchSubmodel && (submodel.URLArray.data.length > 0)) {
            var submodelPrinters = this.newPropertyObject("SubmodelPrinters",
                                                          submodels,
                                                          "SubmodelPrinters");
            submodelPrinters.printer = new Array();
            var nextURL =
               submodel.URLArray.data[submodel.URLArray.data.length -1];
            submodel.URLArray.data.pop();

            var printer = new SubmodelPrinterGeneric(
               object,
               this.printer.aasContainer,
               nextURL,
               false
               );
            submodelPrinters.printer.push(printer);
         }
      }
   }

   addSubmodelURLS(obj) {
      //ugly
      var submodels = obj.parentObj;
      var childObjs = obj.childObjs;

      var arrayObj = this.newPropertyObject("URLArray", obj, "tArray");
      arrayObj.data = new Array();

      if (this.elementExists(childObjs, "idShort")) {
         arrayObj.data.push(submodels.tURL + "/" + childObjs.idShort.tData
         + "/complete");
         arrayObj.data.push(submodels.tURL + "/" + childObjs.idShort.tData
         + "/submodel");
      }
   }

   parseSubmodel(JSON, URL, object) {
      var submodel = this.newTreeObject(JSON.idShort, object,
       "Submodel");

      submodel.tURL = URL;
      this.fixSubmodelURL(submodel);

      // Semanctics
      this.parseSemantics(JSON, name, submodel);
      // dataSpecification
      this.parseDataSpecification(JSON, name, submodel);
      // Identifiable
      this.parseIdentifiable(JSON, name, submodel);
      // Qualifiable
      this.parseQualifiable(JSON, name, submodel);
      // Kind
      this.parseKind(JSON, name, submodel);
      // Referable
      this.parseReferable(JSON, name, submodel);
      // submodelElements [SubmodelElement] - (0-n)
      if (this.elementExists(JSON, "submodelElement")) { // Missing s in Basyx
                                                         // JSON
         console.log("Basyx Bug: submodelElement!");

         var hints = new Object();
         hints.noPrint = true;
         this.parseArray(JSON.submodelElement,
               "submodelElements",
               submodel,
               this.parseSubmodelElement,
               hints,
               "submodelElement");
      }
      if (this.elementExists(JSON, "submodelElements")) {
         var hints = new Object();
         hints.noPrint = true;
         this.parseArray(JSON.submodelElements,
               "submodelElements",
               submodel,
               this.parseSubmodelElement,
               hints);
      }
      return submodel;
   }

   parseAsset(JSON, object) {
      var asset = this.newTreeObject("asset", object, "Asset");
      if (this.elementExists(JSON, "keys")) {
         var hints = new Object();
         hints.noPrint = true;
         this.parseKeys(JSON, "Asset", asset, hints);
      }

      // kind [AssetKind] - (1)
      if (this.elementExists(JSON, "kind"))
         this.parseAssetKind(JSON.kind, "kind", asset);
      // dataSpecification
      this.parseDataSpecification(JSON, name, asset);
      // Identifiable
      this.parseIdentifiable(JSON, name, asset);
      // Referable
      this.parseReferable(JSON, name, asset);

      // assetIdentificationModel [Key(s)] - (0-1)
      if (this.elementExists(JSON, "assetIdentificationModel"))
         this.parseKeys(JSON.assetIdentificationModel,
               "assetIdentificationModel",
               asset);
      // billOfMaterial [Key(s)] - (0-1)
      if (this.elementExists(JSON, "billOfMaterial"))
         this.parseKeys(JSON.billOfMaterial,  "billOfMaterial", asset);
   }

   parseIdentifiable(JSON, name, obj) {
      // administration [AdministrativeInformation] - (0-1)
      if (this.elementExists(JSON, "administration"))
         this.parseAdministrativeInformation(JSON.administration,
               "administration",
               obj);
      // identification [Identifier]
      if (this.elementExists(JSON, "identification"))
         this.parseIdentifier(JSON.identification, "identification", obj);
   }

   parseReferable(JSON, name, obj) {
      // idShort [String]
      if (this.elementExists(JSON, "idShort"))
         this.parseString(JSON.idShort, "idShort", obj);
      // category [String] - (0 -1)
      if (this.elementExists(JSON, "category"))
         this.parseString(JSON.category, "category", obj);
      // description [LangStringSet] - (0-1)
      if (this.elementExists(JSON, "description"))
         this.parseLangStringSet(JSON.description, "description", obj);
      // parent [Referable(Pointer)] - (0-1)
      if (this.elementExists(JSON, "parent"))
         this.parseKeys(JSON.parent, "parent", obj);
   }

   parseSubmodelElement(JSON, name, obj) {
      var subElement = this.newTreeObject(name, obj, "SubmodelElement");

      // Semanctics
      this.parseSemantics(JSON, name, subElement);
      // dataSpecification
      this.parseDataSpecification(JSON, name, subElement);
      // Referable
      this.parseReferable(JSON, name, subElement);
      // Qualifiable
      this.parseQualifiable(JSON, name, subElement);
      // Kind
      this.parseKind(JSON, name, subElement);

      var ElementType = "";

      if (this.elementExists(JSON, "modelType") &&
          this.elementExists(JSON.modelType, "name")) {
         ElementType = JSON.modelType.name;
      }

      switch (ElementType) {
      case "Operation":
         this.setURLsOperation(subElement);
         break;
      default:
         this.setURL(subElement);
         break;
      }

      switch (ElementType) {
      case "Entity":
         this.parseEntity(JSON, name, subElement);
         return;
      case "BasicEvent":
         this.parseEvent(JSON, name, subElement);
         return;
      case "Operation":
         this.parseOperation(JSON, name, subElement);
         return;
      case "SubmodelElementCollection":
         this.parseSubmodelElementCollection(JSON, name, subElement);
         return;
      case "Capability":
         this.parseCapability(JSON, name, subElement);
         return;
      case "DataElement":
         this.parseDataElement(JSON, name, subElement);
         return;
      case "ReferenceElement":
         this.parseDataElement(JSON, name, subElement);
         return;
      case "File":
         this.parseDataElement(JSON, name, subElement);
         return;
      case "blob":
         /* fallthrough */
      case "Blob":
         this.parseDataElement(JSON, name, subElement);
         return;
      case "Range":
         this.parseDataElement(JSON, name, subElement);
         return;
      case "MultiLanguageProperty":
         this.parseDataElement(JSON, name, subElement);
         return;
      case "Property":
         this.parseDataElement(JSON, name, subElement);
         return;
      case "RelationshipElement":
         this.parseRelationshipElement(JSON, name, subElement);
         return;
      case "AnnotatedRelationshipElement":
         this.parseRelationshipElement(JSON, name, subElement);
         return;
      default:
         console.log("Unknown SubmodelElement found:" + ElementType);
         return;
      }
   }

   parseEntity(JSON, name, obj) {
      // InheritedObject from SubmodelElement:
      // All inherited elements are already done
      this.setTreeObjectType(obj, "Entity");

      // statement [SubmodelElement] - (0-n)
      if (this.elementExists(JSON, "statement")) {
         var hints = new Object();
         hints.noPrint = true;
         this.parseArray(JSON.statement,
               "statement",
               obj,
               this.parseSubmodelElement,
               hints);
      }
      if (this.elementExists(JSON, "statements")) {
         console.log("AASX Package Explorer Bug: statements");
         var hints = new Object();
         hints.noPrint = true;
         this.parseArray(JSON.statements,
               "statement",
               obj,
               this.parseSubmodelElement,
               hints);
      }
      // entityType [EntityType]
      if (this.elementExists(JSON, "entityType"))
         this.parseEntityType(JSON.entityType, "entityType", obj);
      // asset [Asset]
      if (this.elementExists(JSON, "asset"))
         this.parseAsset(JSON.asset, obj);
   }

   parseEntityType(JSON, name, obj) {
      switch (JSON) {
      case "CoManagedEntity":
      case "SelfManagedEntity":
         break;
      default:
         return;
      }
      var entity = this.newTreeObject(name, obj, "EntityType");
      entity.tData = JSON;
   }

   parseEvent(JSON, name, obj) {
      // InheritedObject from SubmodelElement:
      // All inherited elements are already done
      var ElementType = "";

      if (this.elementExists(JSON, "modelType") &&
            this.elementExists(JSON.modelType, "name")) {
         ElementType = JSON.modelType.name;
      }

      switch (ElementType) {
      case "BasicEvent":
         this.setTreeObjectType(obj, "BasicEvent");
         if (this.elementExists(JSON, "observed"))
            this.parseKeys(JSON.observed, "observed", obj);
         return;
      default:
         console.log("Unhandled Event (SubmodelElement) found: " + ElementType);
         return;
      }
   }

   parseOperation(JSON, name, obj) {
      // InheritedObject from SubmodelElement:
      // All inherited elements are already done

      console.log("operation: ", JSON);

      this.setTreeObjectType(obj, "Operation");

      if (this.elementExists(JSON, "inputVariable")) {
         var hints = new Object();
         hints.noPrint = false;
         this.parseArray(JSON.inputVariable,
               "inputVariable",
               obj,
               this.parseOperationVariable,
               hints);
      }
      if (this.elementExists(JSON, "inputVariables")) { // basyx extra s
         var hints = new Object();
         hints.noPrint = false;
         hints.writable = true;
         this.parseArray(JSON.inputVariables,
               "inputVariable",
               obj,
               this.parseOperationVariable,
               hints,
               "inputVariables");
      }
      if (this.elementExists(JSON, "inputArguments")) {
         var hints = new Object();
         hints.noPrint = false;
         hints.writable = true;
         this.parseArray(JSON.inputArguments,
               "inputVariable",
               obj,
               this.parseOperationVariable,
               hints,
               "inputArguments");
      }
      if (this.elementExists(JSON, "inoutputVariable")) {
         var hints = new Object();
         hints.noPrint = false;
         this.parseArray(JSON.inoutputVariable,
               "inoutputVariable",
               obj,
               this.parseOperationVariable,
               hints);
      }
      if (this.elementExists(JSON, "inoutputVariables")) { // basyx extra s
         var hints = new Object();
         hints.noPrint = false;
         this.parseArray(JSON.inoutputVariables,
               "inoutputVariable",
               obj,
               this.parseOperationVariable,
               hints,
               "inoutputVariables");
      }
      if (this.elementExists(JSON, "inoutputArguments")) {
         var hints = new Object();
         hints.noPrint = false;
         this.parseArray(JSON.inoutputArguments,
               "inoutputVariable",
               obj,
               this.parseOperationVariable,
               hints,
               "inoutputArguments");
      }
      if (this.elementExists(JSON, "outputVariable")) {
         var hints = new Object();
         this.parseArray(JSON.outputVariable,
               "outputVariable",
               obj,
               this.parseOperationVariable,
               hints);
      }
      if (this.elementExists(JSON, "outputVariables")) { // basyx extra s
         var hints = new Object();
         hints.noPrint = false;
         this.parseArray(JSON.outputVariables,
               "outputVariable",
               obj,
               this.parseOperationVariable,
               hints,
               "outputVariables");
      }
      if (this.elementExists(JSON, "outputArguments")) {
         var hints = new Object();
         hints.noPrint = false;
         this.parseArray(JSON.outputArguments,
               "outputVariable",
               obj,
               this.parseOperationVariable,
               hints,
               "outputArguments");
      }
   }

   parseOperationVariable(JSON, name, obj) {
      var hints = new Object();
      hints.noPrint = true;
      var subObj = this.newTreeObject(name, obj, "OperationVariable");
      subObj.tHints = hints;
      subObj.tOriginalJSON = JSON;

      // value [SubmodelElement]
      if (this.elementExists(JSON, "value"))
         this.parseSubmodelElement(JSON.value, "value", subObj);
   }

   parseSubmodelElementCollection(JSON, name, obj) {
      // InheritedObject from SubmodelElement:
      // All inherited elements are already done
      this.setTreeObjectType(obj, "SubmodelElementCollection");
      // value [SubmodelElement] (0-n)

      // Skip creating one hirachy, we do not want the "value" Element as object
      if (this.elementExists(JSON, "value")) {
         var hints = new Object();
         hints.noPrint = true;
         this.parseArray(JSON.value,
               "value",
               obj,
               this.parseSubmodelElement,
               hints,
               "",
               true);
      }
      // ordered [Boolean] (0-1)
      if (this.elementExists(JSON, "ordered"))
         this.parseString(JSON.ordered, "ordered", obj);
      // allowDuplicates [Boolean] (0-1)
      if (this.elementExists(JSON, "allowDuplicates"))
         this.parseString(JSON.allowDuplicates, "allowDuplicates", obj);
   }

   parseCapability(JSON, name, obj) {
      // Nothing TODO, all Capability Attributes are parsed already
      this.setTreeObjectType(obj, "Capability");
      return;
   }

   parseDataElement(JSON, name, obj) {
      // InheritedObject from SubmodelElement:
      // All inherited elements are already done
      var ElementType = "";

      if (this.elementExists(JSON, "modelType") &&
            this.elementExists(JSON.modelType, "name")) {
         ElementType = JSON.modelType.name;
      }

      switch (ElementType) {
      case "ReferenceElement":
         this.setTreeObjectType(obj, "ReferenceElement");
         if (this.elementExists(JSON, "value"))
            this.parseReference(JSON.value, "value", obj);
         return;
      case "File":
         this.setTreeObjectType(obj, "File");
         if (this.elementExists(JSON, "value"))
            this.parseString(JSON.value, "value", obj);
         if (this.elementExists(JSON, "mimeType"))
            this.parseString(JSON.mimeType, "mimeType", obj);
         return;
      case "blob":
         /* fallthrough */
      case "Blob":
         this.setTreeObjectType(obj, "Blob");
         if (this.elementExists(JSON, "value"))
            this.parseString(JSON.value, "value", obj);
         if (this.elementExists(JSON, "mimeType"))
            this.parseString(JSON.mimeType, "mimeType", obj);
         return;
      case "Range":
         this.setTreeObjectType(obj, "Range");
         if (this.elementExists(JSON, "min"))
            this.parseString(JSON.min, "min", obj);
         if (this.elementExists(JSON, "max"))
            this.parseString(JSON.max, "max", obj);
         if (this.elementExists(JSON, "valueType"))
            this.parseDataType(JSON.valueType, "valueType", obj);
         return;
      case "MultiLanguageProperty":
         this.setTreeObjectType(obj, "MultiLanguageProperty");
         if (this.elementExists(JSON, "value"))
            this.parseLangStringSet(JSON.value, "value", obj);
         if (this.elementExists(JSON, "valueId"))
            this.parseReference(JSON.valueId, "valueId", obj);
         return;
      case "Property":
         this.setTreeObjectType(obj, "Property");
         if (this.elementExists(JSON, "value"))
            this.parseString(JSON.value, "value", obj);
         if (this.elementExists(JSON, "valueType"))
            this.parseDataType(JSON.valueType, "valueType", obj);
         if (this.elementExists(JSON, "valueId"))
            this.parseReference(JSON.valueId, "valueId", obj);
         return;
      default:
         console.log("Unhandled DataElement found: " + ElementType);
      return;
      }
   }

   parseDataType(JSON, name, obj) {
      var object = this.newTreeObject(name, obj, "DataType");

      if (!this.isObject(JSON))
         this.parseString(JSON, "dataObjectType", object);

      if (this.elementExists(JSON, "dataObjectType")) {
         if (this.isObject(JSON.dataObjectType)) {
            if (this.elementExists(JSON.dataObjectType, "name"))
               this.parseString(JSON.dataObjectType.name, "dataObjectType", object);
         }
         else
            this.parseString(JSON.dataObjectType, "dataObjectType", object);
      }
   }

   parseRelationshipElement(JSON, name, obj) {
      // InheritedObject from SubmodelElement:
      // All inherited elements are already done
      var ElementType = "";

      if (this.elementExists(JSON, "modelType") &&
            this.elementExists(JSON.modelType, "name")) {
         ElementType = JSON.modelType.name;
      }

      switch (ElementType) {
      case "RelationshipElement":
         this.setTreeObjectType(obj, "RelationshipElement");
         break;
      case "AnnotatedRelationshipElement":
         this.setTreeObjectType(obj, "AnnotatedRelationshipElement");
         // annotation [DataElement*] (0-n)
         if (this.elementExists(JSON, "annotation")) {
            var hints = new Object();
            hints.noPrint = true;
            this.parseArray(JSON.annotation,
                  "annotation",
                  obj,
                  this.parseDataElement,
                  hints);
         }
         break;
      default:
         console.log("Unhandled RelationshipElement found: " + ElementType);
         return;
      }

      // common attributes
      // first [Referable*]
      if (this.elementExists(JSON, "first"))
         this.parseKeys(JSON.first, "first", obj);
      // second [Referable*]
      if (this.elementExists(JSON, "second"))
         this.parseKeys(JSON.second, "second", obj);
   }

   parseString(JSON, name, obj) {
      this.parseValue(JSON, name, obj, "String");
   }

   parseValue(JSON, name, obj, tType = "Value") {
      var valueObj = this.newTreeObject(name, obj, tType);
      this.setURL(valueObj, name);
      valueObj.tData = JSON;
      if (valueObj.tUpdateMethod)
         valueObj.tUpdateMethod(valueObj);
   }

   parseSecurity(JSON, name, obj) {
      console.log("TODO: Security");
   }

   parseDataSpecification(JSON, name, obj) {
      // dataSpecification [Reference] - (0-n)
      if (this.elementExists(JSON, "dataSpecification"))
         this.parseArray(JSON.dataSpecification,
               "dataSpecification",
               obj,
               this.parseReference);
   }

   parseSemantics(JSON, name, obj) {
      // semanticId [Reference] - (0-1)
      if (this.elementExists(JSON, "semanticId"))
         this.parseReference(JSON.semanticId, "semanticId", obj);
   }

   parseReference(JSON, name, obj) {
      this.parseKeys(JSON, name, obj);
   }

   parseAdministrativeInformation(JSON, name, obj) {
      if (!this.elementExists(JSON, "version") &&
          !this.elementExists(JSON, "revision"))
         return;
      var element = this.newTreeObject(name, obj, "AdministrativeInformation");
      if (this.elementExists(JSON, "version"))
         this.parseString(JSON.version, "version", element);
      if (this.elementExists(JSON, "revision"))
         this.parseString(JSON.version, "revision", element);
   }

   parseIdentifier(JSON, name, obj) {
      if (!this.elementExists(JSON, "id") && !this.elementExists(JSON, "value"))
         return;
      if (!this.elementExists(JSON, "idType"))
         return;
      var identifier = this.newTreeObject(name, obj, "Identifier");
      if (this.elementExists(JSON, "id"))
         this.parseString(JSON.id, "id", identifier);
      this.parseIdentifierType(JSON.idType, "idType", identifier);
   }

   parseIdentifierType(JSON, name, obj) {
      var id = this.newTreeObject(name, obj, "IdentifierType");
      switch (JSON) {
      case "Custom":
      case "IRDI":
      case "IRI":
         id.tData = JSON;
         break;
      default:
         id.tData = "Custom";
         break;
      }
   }

   // Details of the Asset Administration Shell Part 1 V2 - Is really another
   // type?
   parseKeyType(JSON, name, obj) {
      var element = this.newTreeObject(name, obj, "KeyType");
      switch (JSON) {
      case "Custom":
      case "FragmentId":
      case "IdShort":
      case "IRDI":
      case "IRI":
         element.tData = JSON;
         break;
      default:
         element.tData = "Custom";
         break;
      }
   }

   parseLangStringSet(JSON, name, obj) {
      if (!this.isArray(JSON) || JSON.length < 1)
         return;
      var element = this.newTreeObject(name, obj, "LangStringSet");
      for(var key in JSON) {
         var SubElement = JSON[key];
         this.parseLangString(SubElement, key, element);
      }
   }

   parseLangString(JSON, name, obj) {
      if (!this.elementExists(JSON, "language"))
         return;
      var element = this.newTreeObject(name, obj, "LangString");
      this.parseString(JSON.language, "language", element);

      if (this.elementExists(JSON, "description"))
        this.parseString(JSON.description, "description", element);
      // old Basyx:
      if (this.elementExists(JSON, "text"))
         this.parseString(JSON.text, "description", element);
   }

   parseQualifiable(JSON, name, obj) {
      var hints = new Object();
      hints.noPrint = true;

      // qualifier [Constraint] - (0-n)
      if (this.elementExists(JSON, "qualifier"))
         this.parseArray(JSON.qualifier,
               "qualifier",
               obj,
               this.parseConstraint);
      // basyx bug, ought to be "qualifier"
      if (this.elementExists(JSON, "constraints")) {
         console.log("Basyx Bug: constraints instead of qualifier");
         this.parseArray(JSON.constraints,
               "constraints",
               obj,
               this.parseConstraint);
      }
      // basyx bug, ought to be "qualifier"
      if (this.elementExists(JSON, "qualifiers")) {
         console.log("Basyx Bug: qualifiers instead of qualifier");
         this.parseArray(JSON.qualifiers,
               "qualifiers",
               obj,
               this.parseConstraint,
               hints);
      }
   }

   parseConstraint(JSON, name, obj) {
      // Indicator: dependsOn [Reference] (0 - n)
      if (this.elementExists(JSON, "dependsOn"))
         this.parseFormula(JSON, name, obj);
      else
         this.parseQualifier(JSON, name, obj)
   }

   parseQualifier(JSON, name, obj) {
      var element = this.newTreeObject(name, obj, "Qualifier");

      // Semanctics
      this.parseSemantics(JSON, name, element);

      // type [QualifierType] (String)
      if (this.elementExists(JSON, "type"))
         this.parseString(JSON.type, "type", element);
      // valueType [DataTypeDef]
      if (this.elementExists(JSON, "valueType"))
         this.parseDataType(JSON.valueType, "valueType", element);
      // value [ValueDataType] (0 - 1)
      if (this.elementExists(JSON, "value"))
         this.parseString(JSON.value, "value", element);
      // valueId [Reference] (0 - 1)
      if (this.elementExists(JSON, "valueId"))
         this.parseReference(JSON.valueId, "valueId", element);
   }

   parseFormula(JSON, name, obj) {
      var element = this.newTreeObject(name, obj, "Formula");
      // dependsOn [Reference] - (0-n)
      if (this.elementExists(JSON, "dependsOn"))
         this.parseArray(JSON.dependsOn,
               "dependsOn",
               element,
               this.parseReference);
   }

   parseKind(JSON, name, obj) {
      // kind [ModelingKind] - (0-1) - Instance
      if (this.elementExists(JSON, "kind"))
         this.parseModelingKind(JSON.kind, "kind", obj);
   }

   parseModelingKind(JSON, name, obj) {
      switch(JSON) {
      default:
         /* return here */
         return;
      case "Template":
      case "Instance":
         break;
      }

      var modelingkind = this.newTreeObject(name, obj, "ModelingKind");
      modelingkind.tData = JSON;
   }

   parseAssetKind(JSON, name, obj) {
      switch(JSON) {
      default:
         /* return here */
         return;
      case "Type":
      case "Instance":
         break;
      }
      var assetkind = this.newTreeObject(name, obj, "AssetKind");
      assetkind.tData = JSON;
   }

   // callback: The method to call for every array element
   parseArray(JSON, name, obj, callback, hints = new Object(), URLname = name, skipObjHierachy = false) {
      if(JSON.length < 1)
         return;
      var subobj = null;
      if (skipObjHierachy)
         subobj = obj;
      else {
         subobj = this.newTreeObject(name, obj, "Array");
         this.setURL(subobj, URLname);
         subobj.tHints = hints;
      }

      for(var key in JSON) {
            var SubElement = JSON[key];
            var hints = new Object();
            hints.noPrint = true;
            callback(SubElement, key, subobj, hints);
      }
   }

   parseKeys(JSON, name, obj, hints = new Object()) {
      var subobj = this.newTreeObject(name, obj, "Keys");
      subobj.tHints = hints;
      if (this.elementExists(JSON, "keys") && JSON.keys.length > 0)
         for(var key in JSON.keys) {
            var SubElement = JSON.keys[key];
            var hints = new Object();
            hints.noName = true;
            this.parseKey(SubElement, key, subobj, hints);
         }
   }

   parseKey(JSON, name, obj, hints = new Object()) {
      var key = this.newTreeObject(name, obj, "Key");
      key.hints = hints;
      this.parseKeyType(JSON.idType, "idType", key);
      this.parseString(JSON.local, "local", key);
      this.parseString(JSON.value, "value", key);
      this.parseModelType(JSON.type, "type", key);
   }

   parseModelType(JSON, name, obj) {
      var type = this.newTreeObject(name, obj, "ModelType");
      switch (JSON) {
      case "Asset":
      case "AssetAdministrationShell":
      case "ConceptDescription":
      case "Submodel":
      case "AccessPermissionRule":
      case "AnnotatedRelationshipElement":
      case "BasicEvent":
      case "Blob":
      case "Capability":
      case "ConceptDictionary":
      case "DataElement":
      case "File":
      case "Entity":
      case "Event":
      case "MultiLanguageProperty":
      case "Operation":
      case "Property":
      case "Range":
      case "ReferenceElement":
      case "RelationshipElement":
      case "SubmodelElement":
      case "SubmodelElementCollection":
      case "View":
      case "GlobalReference":
      case "FragmentReference":
      case "Constraint":
      case "Formula":
      case "Qualifier":
         type.tData = JSON;
         break;
      default:
         type.tData = "Unknown model Type";
         break;
      }
   }

   parseRegistry(JSON, object) {
      var registry = this.newTreeObject("Registry" /*JSON.idShort*/, object,
         "AssetAdministrationShellRegistry");

      this.copyParentURL(registry);

      this.parseArray(JSON, "AssetAdministrationShellDescriptors", registry,
         this.parseAssetAdministrationShellDescriptor, new Object(),
         "AssetAdministrationShellDescriptors", true);
      return registry;
   }

   parseAssetAdministrationShellDescriptor(JSON, name, obj) {
      var name = null;
      if (this.elementExists(JSON, "identification") &&
          this.elementExists(JSON.identification, "id"))
          name = JSON.identification.id;
      else
          name = JSON.idShort;

      var registryElement = this.newTreeObject(name, obj,
         "AssetAdministrationShellDescriptor");

      // administration [AdministrativeInformation] - (0-1)
      if (this.elementExists(JSON, "administration"))
         this.parseAdministrativeInformation(JSON.administration,
            "adminstration", registryElement);
      // Identifiable
      this.parseIdentifiable(JSON, name, registryElement);
      // Referable
      this.parseReferable(JSON, name, registryElement);
      // globalAssetId [Reference] - (0-1)
      if (this.elementExists(JSON, "globalAssetId"))
         this.parseReference(JSON.globalAssetId, "globalAssetId",
            registryElement);
      // specificAssetId [IdentifierKeyValuePair] - (0-1)
      if (this.elementExists(JSON, "specificAssetId"))
         this.parseKeys(JSON.specificAssetId, "specificAssetId",
            registryElement);
      // Bug Should not exist, use globalAssetId/specificAssetId
      if (this.elementExists(JSON, "asset")) {
         console.log("Bug: Asset instead of globalAssetId/specificAssetId");
         this.parseAsset(JSON.asset, registryElement);
      }

      // endpoint [Reference] - (0-1)
      if (this.elementExists(JSON, "endpoint"))
         this.parseArray(JSON.endpoint,
               "endpoint",
               registryElement,
               this.parseKeys);
      // Bug endpoints -> endpoint
      if (this.elementExists(JSON, "endpoints")) {
         console.log("Bug: endpoints instead of endpoint");
         this.parseArray(JSON.endpoints,
               "endpoint",
               registryElement,
               this.parseEndpoint);
      }

      // submodelDescriptor [submodelDescriptor] - (0-n)
      if (this.elementExists(JSON, "submodelDescriptor"))
         this.parseArray(JSON.submodels,
               "submodelDescriptors",
               registryElement,
               this.parseSubmodelDescriptor);

      // Bug Should not exisit, use submodelDescriptor
      if (this.elementExists(JSON, "submodels")) {
         console.log("Bug: submodels instead of submodelDescriptor");
         this.parseArray(JSON.submodels,
               "submodelDescriptors",
               registryElement,
               this.parseSubmodelDescriptor);
      }
   }

   parseSubmodelDescriptor(JSON, name, obj) {
      var registryElement = this.newTreeObject(JSON.idShort, obj,
         "SubmodelDescriptor");

      // administration [AdministrativeInformation] - (0-1)
      if (this.elementExists(JSON, "administration"))
         this.parseAdministrativeInformation(JSON.administration,
            "adminstration", registryElement);
      // Identifiable
      this.parseIdentifiable(JSON, name, registryElement);
      // Referable
      this.parseReferable(JSON, name, registryElement);

      // endpoint [Reference] - (0-1)
      if (this.elementExists(JSON, "endpoint"))
         this.parseArray(JSON.endpoint,
               "endpoint",
               registryElement,
               this.parseKeys);
      // Bug endpoints -> endpoint
      if (this.elementExists(JSON, "endpoints")) {
         console.log("Bug: endpoints instead of endpoint");
         this.parseArray(JSON.endpoints,
               "endpoint",
               registryElement,
               this.parseEndpoint);
      }

      this.parseSemantics(JSON, "semantics", registryElement);
   }

   parseEndpoint(JSON, name, obj) {
      var endpoint = this.newTreeObject(name, obj,
         "Endpoint");
      if (this.elementExists(JSON, "address"))
         this.parseString(JSON.address, "address", endpoint);
      if (this.elementExists(JSON, "type"))
         this.parseString(JSON.type, "type", endpoint);

      if (this.elementExists(endpoint.childObjs, "type") &&
          endpoint.childObjs.type.tData.startsWith("http") &&
          this.elementExists(endpoint.childObjs, "address") &&
          !this.hasInParentTreeType(obj, "SubmodelDescriptor")) {
            if (this.addURLToList)
               this.addURLToList(endpoint.childObjs.address.tData);
         }
   }

   getByURL(object, urlStr, onSuccess, onError) {
      if (!urlStr)
         return;
      urlStr = urlStr.replaceAll("#", "%23");
      var compound = new Object();
      compound.URL = urlStr;
      compound.parentObj = this;
      compound.object = object;
      compound.onSuccess = onSuccess;
      compound.onError = onError;
      compound.retry = 0;

      this.AjaxHelper.getJSON(urlStr,
                              compound.onSuccess,
                              compound.onError,
                              compound);
      return;
   }

   newTreeObject(name, parentObj, type, overwrite = false) {
      if (!overwrite && this.isObject(parentObj) &&
          this.elementExists(parentObj.childObjs, name))
         return parentObj.childObjs[name];

      var obj = new Object();
      obj.parentObj = parentObj;
      obj.childObjs = new Object();
      obj.tType = type;
      obj.tHints = new Object();
      obj.tData = new Object();
      obj.tName = name;
      obj.tUpdateMethod = null;
      if (this.isObject(parentObj))
         parentObj.childObjs[name] = obj;
      return obj;
   }

   newPropertyObject(name, parentObj, type) {
      var obj = new Object();
      obj.parentObj = parentObj;
      obj.childObjs = new Object();
      if (this.isObject(parentObj))
         parentObj[name] = obj;
      return obj;
   }

   addChildTreeObject(obj, childObj, childObjName) {
      obj.childObjs[childObjName] =childObj;
   }

   setTreeObjectType(obj, type) {
      obj.tType = type;
   }

   setURL(object, name = "") {
      if (!this.elementExists(object.parentObj, "tURL"))
         return false;
      var parentURL = object.parentObj.tURL;

      if (name == "") {
         name = object.childObjs.idShort.tData;
      }
      object.tURL = parentURL + "/" + name;

      return true;
   }

   copyParentURL(object) {
      if (!this.elementExists(object.parentObj, "tURL"))
         return false;
      var parentURL = object.parentObj.tURL;
      object.tURL = parentURL;
      return true;
   }

   setURLsOperation(object, name = "") {
      if (!this.setURL(object, name))
         return;
      object.tURLInvoke = object.tURL + "/" + "invoke";
   }

   fixSubmodelURL(submodel) {
      // fix up AAS Package Explorer Rest Server URLS
      if (submodel.tURL.endsWith("/complete")) {
         var l = "complete".length;
         submodel.tOriginalURL = submodel.tURL;
         submodel.tURL = submodel.tURL.substr(0, submodel.tURL.length - l - 1)
            + "/submodel";
      }
   }

   setRootURLS(rootElement, URL, removePathElementsCount) {
      rootElement.tRootURL = this.trimSuffixSlash(URL.origin);
      rootElement.tLocalRootURL = rootElement.tRootURL;
      var temp_path = URL.pathname + URL.hash;
      var split = temp_path.split("/");
      for (var i = 1; i < split.length - removePathElementsCount; i++)
         rootElement.tLocalRootURL += "/" + split[i];
   }
}
