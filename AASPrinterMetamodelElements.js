/*
 * Copyright (c) 2021 Lenze SE
 * SPDX-License-Identifier: Apache-2.0
 */

class AASPrinterMetamodelElements extends PrinterHtmlElements {
   constructor(rootElement) {
      super(rootElement);
      /* bind this pointer */
      this.printAAS = this.printAAS.bind(this);
      this.printSubmodel = this.printSubmodel.bind(this);
      this.printError = this.printError.bind(this);
      this.print = this.print.bind(this);
      this.printAsset = this.printAsset.bind(this);
      this.printArray = this.printArray.bind(this);
      this.printKeys = this.printKeys.bind(this);
      this.printKey = this.printKey.bind(this);
      this.printLocalityInformation = this.printLocalityInformation.bind(this);
      this.printIdentifier = this.printIdentifier.bind(this);
      this.printAdministrativeInformation =
         this.printAdministrativeInformation.bind(this);
      this.printLangStringSet = this.printLangStringSet.bind(this);
      this.printLangString = this.printLangString.bind(this);
      this.printEntity = this.printEntity.bind(this);
      this.printFile = this.printFile.bind(this);
      this.printFileByType = this.printFileByType.bind(this);
      this.printGenericFile = this.printGenericFile.bind(this);
      this.printFileImage = this.printFileImage.bind(this);
      this.printBlob = this.printBlob.bind(this);
      this.printProperty = this.printProperty.bind(this);
      this.printMultiLanguageProperty =
         this.printMultiLanguageProperty.bind(this);
      this.printRange = this.printRange.bind(this);
      this.printReferenceElement = this.printReferenceElement.bind(this);
      this.printBasicEvent = this.printBasicEvent.bind(this);
      this.printSubmodelElementCollection =
         this.printSubmodelElementCollection.bind(this);
      this.printRelationshipElement = this.printRelationshipElement.bind(this);
      this.printAnnotatedRelationshipElement =
         this.printAnnotatedRelationshipElement.bind(this);
      this.printQualifier = this.printQualifier.bind(this);
      this.printFormula = this.printFormula.bind(this);
      this.printOperation = this.printOperation.bind(this);
      this.printOperationVariable = this.printOperationVariable.bind(this);
      this.printDataType = this.printDataType.bind(this);
      this.createValueElement = this.createValueElement.bind(this);
      this.getCategoryByObject = this.getCategoryByObject.bind(this);
      this.printGenericSubmodelElement =
         this.printGenericSubmodelElement.bind(this);
      this.printString = this.printString.bind(this);
      this.printValue = this.printValue.bind(this);
      /* AAS Part 2 */
      this.printRegistry = this.printRegistry.bind(this);
      this.printAssetAdministrationShellDescriptor =
         this.printAssetAdministrationShellDescriptor.bind(this);
      this.printSubmodelDescriptor = this.printSubmodelDescriptor.bind(this);
      this.printEndpoint = this.printEndpoint.bind(this);
      /* Helper */
      this.handleLinkTypes = this.handleLinkTypes.bind(this);
      this.isLink = this.isLink.bind(this);
      this.submitValue = this.submitValue.bind(this);
      this.callOperation = this.callOperation.bind(this);
      this.findChildElementUpward = this.findChildElementUpward.bind(this);
      this.findPropertyElementUpward = this.findPropertyElementUpward.bind(this);
      this.findElementByHtmlId = this.findElementByHtmlId.bind(this);
      this.findElementsByType = this.findElementsByType.bind(this);
      this.timedUpdateValues = this.timedUpdateValues.bind(this);
      /* variables */
      this.valueUpdateArray = new Array();

      this.colors = new Object();
      this.colors.AASColor = "bg-lenzeblue";
      this.colors.submodelColor = "bg-lenzemiddleblue2";
      this.colors.assetColor = "bg-lenzemiddleblue1";
      this.colors.referenceColor = "bg-lenzegreen";
      this.colors.submodelElementColor = "bg-lenzecyan";
      this.colors.operationColor = "bg-primary";
      this.colors.qualifierColor = "bg-secondary";
      this.colors.errorColor = "bg-danger";
      /*
       * We need to make sure the container for our async submodels is ready
       * even if our aas is not printed already
       */
      this.aasContainer = this.createBootstrapContainerFluid();

      window.setInterval(this.timedUpdateValues, 2000);
   }

   printAAS(HTMLElement, object) {
      this.treeRoot = object;
      var childObjs = object.childObjs;

      var card = this.createBootstrapCard(0, 0);
      var cardBody = this.createBootstrapCardBody(0, 1);
      var container = this.aasContainer;

      card.appendChild(cardBody);
      HTMLElement.appendChild(card);

      var collapsable = this.insertBootstrapCardElement(cardBody, container,
            "bg-light", "text-black");

      this.insertBootstrapCardTitle(cardBody,
            document.createTextNode("Asset Administration Shell"),
            this.colors.AASColor, "text-white", collapsable.id);

      this.print(container, object);
   }

   printSubmodel(HTMLElement, object) {
      var childObjs = object.childObjs;

      var HTMLObject = this.printNode(HTMLElement, object, childObjs.idShort.tData,
            "Submodel", this.colors.submodelColor, false);

      this.print(HTMLObject.container, object);
   }

   printError(object, name) {
      // We can only print Errors on the most upper level for now
      console.log("Fixme: Add HTMLContainer to object-tree and print error in its domain");
      var HTMLObject = this.printNode(this.rootElement, object, name,
            "Error", this.colors.errorColor, true);

      this.print(HTMLObject.container, object);


      //this.rootElement.appendChild(HTMLObject);
   }

   print(HTMLElement, object) {
      var childObjs = object.childObjs;
      for(var key in childObjs) {
         var element = childObjs[key];
         if (key == "parentObj" ||
             !this.isObject(element) ||
             !this.elementExists(element, "tType")) {
            continue;
         }
         switch (element.tType) {
         case "String":
            this.printString(HTMLElement, element, key);
            break;
         case "Value":
            this.printValue(HTMLElement, element, key);
            break;
         case "Array":
            this.printArray(HTMLElement, element, key);
            break;
         case "Keys":
            this.printKeys(HTMLElement, element, key);
            break;
         case "Key":
            this.printKey(HTMLElement, element, key);
            break;
         case "ModelType":
            this.printString(HTMLElement, element, key);
            break;
         case "EntityType":
            this.printString(HTMLElement, element, key);
            break;
         case "KeyType":
            this.printString(HTMLElement, element, key);
            break;
         case "Identifier":
            this.printIdentifier(HTMLElement, element, key);
            break;
         case "AdministrativeInformation":
            this.printAdministrativeInformation(HTMLElement, element, key);
            break;
         case "IdentifierType":
            this.printString(HTMLElement, element, key);
            break;
         case "AssetKind":
            this.printString(HTMLElement, element, key);
            break;
         case "ModelingKind":
            this.printString(HTMLElement, element, key);
            break;
         case "Asset":
            this.printAsset(HTMLElement, element, key);
            break;
         case "LangStringSet":
            this.printLangStringSet(HTMLElement, element, key);
            break;
         case "LangString":
            this.printLangString(HTMLElement, element, key);
            break;
         case "Entity":
            this.printEntity(HTMLElement, element, key);
            break;
         case "File":
            this.printFile(HTMLElement, element, key);
            break;
         case "Blob":
            this.printBlob(HTMLElement, element, key);
            break;
         case "Property":
            this.printProperty(HTMLElement, element, key);
            break;
         case "MultiLanguageProperty":
            this.printMultiLanguageProperty(HTMLElement, element, key);
            break;
         case "Range":
            this.printRange(HTMLElement, element, key);
            break;
         case "DataType":
            this.printDataType(HTMLElement, element, key);
            break;
         case "Range":
            this.printRange(HTMLElement, element, key);
            break;
         case "ReferenceElement":
            this.printReferenceElement(HTMLElement, element, key);
            break;
         case "BasicEvent":
            this.printBasicEvent(HTMLElement, element, key);
            break;
         case "SubmodelElementCollection":
            this.printSubmodelElementCollection(HTMLElement, element, key);
            break;
         case "RelationshipElement":
            this.printRelationshipElement(HTMLElement, element, key);
            break;
         case "AnnotatedRelationshipElement":
            this.printAnnotatedRelationshipElement(HTMLElement, element, key);
            break;
         case "Qualifier":
            this.printQualifier(HTMLElement, element, key);
            break;
         case "Formula":
            this.printFormula(HTMLElement, element, key);
            break;
         case "Operation":
            this.printOperation(HTMLElement, element, key);
            break;
         case "OperationVariable":
            this.printOperationVariable(HTMLElement, element, key);
            break;
         case "AssetAdministrationShell":
         case "Submodel":
         case "Submodels":
            /* fallthrough - handled seperately */
            break;
         /* Extra Elements from AAS Part 2 */
         case "AssetAdministrationShellDescriptor":
            this.printAssetAdministrationShellDescriptor(HTMLElement, element, key);
            break;
         case "SubmodelDescriptor":
            this.printSubmodelDescriptor(HTMLElement, element, key);
            break;
         case "SubmodelDescriptor":
            this.printSubmodelDescriptor(HTMLElement, element, key);
            break;
         case "Endpoint":
            this.printEndpoint(HTMLElement, element, key);
            break;
         // Generic error to show the user something went wrong
         case "tError":
            this.printError(HTMLElement, element, key);
         default:
            console.log("Unhandled Type in print: " + element.tType, element);
            break;
         }
      }
   }

   printAsset(HTMLElement, object, name) {
      var HTMLObject = this.printNode(HTMLElement, object, name, "",
            this.colors.assetColor, true);

      this.print(HTMLObject.container, object);
   }

   printArray(HTMLElement, object, name) {
      if (!this.elementExists(object.tHints, "noPrint") ||
          object.tHints.noPrint == false) {
         var HTMLObject = this.printNode(HTMLElement, object, name, "",
               this.colors.submodelColor, false);

         this.print(HTMLObject.container, object);
      }
      else
         this.print(HTMLElement, object);
   }

   printKeys(HTMLElement, object, name) {
      if (!this.elementExists(object.tHints, "noPrint") ||
          object.tHints.noPrint == false) {
         var HTMLObject = this.printNode(HTMLElement, object, name, "",
               this.colors.referenceColor, false);

         this.print(HTMLObject.container, object);
      }
      else
         this.print(HTMLElement, object);
   }

   printKey(HTMLElement, object, name) {
      
      var childObjs = object.childObjs;

      var content = [];
      if (!this.elementExists(object.hints, "noName") ||
          object.hints.noName == false)
         content.push(document.createTextNode(name));

      content.push(document.createTextNode("ID Type: " + childObjs.idType.tData));
      content.push(document.createTextNode(this.printLocalityInformation(childObjs.local.tData)));
      content.push(document.createTextNode("Referenced Type: " + childObjs.type.tData));

      var dataElement = null;

      if (childObjs.type.tData == "AssetAdministrationShell") {
         if (childObjs.local.tData) {
            var browserURL =
            this.findPropertyElementUpward(object, "tBrowserURL");
            var baseURL =
            this.findPropertyElementUpward(object, "tLocalRootURL");
            if (!this.isNull(browserURL) && !this.isNull(baseURL)) {
               var referenceURL = baseURL + "/" + encodeURIComponent(childObjs.value.tData) + "/"
                                   + "aas";
               var completeURL = browserURL + "?endpoint=" + referenceURL;
               dataElement = this.createHTMLLink(completeURL,
                     document.createTextNode(childObjs.value.tData));
            }
         }
         // handle non-local references here!
         console.log("Non-local reference as URL");
      }

      // default
      if (this.isNull(dataElement))
         dataElement = document.createTextNode(childObjs.value.tData);

      content.push(dataElement);

      this.createRowWithContent(HTMLElement, 2, content, true);
   }

   printLocalityInformation(local) {
      if (local)
         return "Local Reference";
      else
         return "Remote Reference";
   }

   printIdentifier(HTMLElement, object, name) {
      var childObjs = object.childObjs;
      var link = false;
      var node = null;

      var eclass_check = childObjs.id.tData.substr(0, 4);
      if (eclass_check == "0173") {
         link = true;
         node = this.createHTMLLink(
               "https://www.eclasscontent.com/index.php?action=cc2prdet&language=en&version=10.1&pridatt="
               + encodeURIComponent(childObjs.id.tData),
               document.createTextNode(childObjs.id.tData));
         node.target = "_blank";
      }
      if (!link)
         node = document.createTextNode(childObjs.id.tData);
      var content = [
         document.createTextNode(name),
         document.createTextNode("ID Type: " + childObjs.idType.tData),
         node
         ];
      this.createRowWithContent(HTMLElement, 2, content, true);
   }

   printAdministrativeInformation(HTMLElement, object, name) {
      this.print(HTMLElement, object);
   }

   printLangStringSet(HTMLElement, object, name) {
      var HTMLObject = this.printGenericSubmodelElement(HTMLElement, object,
            name, "Lang String Set");

      this.print(HTMLObject.container, object);
   }

   printLangString(HTMLElement, object, name) {
      var childObjs = object.childObjs;
      var language = this.createValueElement(childObjs.language, name);
      var text = this.createValueElement(childObjs.description, name);
      var content = [
         language,
         text,
         ];
      this.createRowWithContent(HTMLElement, 2, content, true);
   }

   printEntity(HTMLElement, object, name) {
      var childObjs = object.childObjs;
      var HTMLObject = this.printGenericSubmodelElement(HTMLElement, object,
            childObjs.idShort.tData, "Entity");

      this.print(HTMLObject.container, object);
   }

   printFile(HTMLElement, object, name) {
      var childObjs = object.childObjs;
      var HTMLObject = this.printGenericSubmodelElement(HTMLElement, object,
            childObjs.idShort.tData, "File");
      this.printFileByType(HTMLObject.container, object);
   }

   printFileByType(HTMLElement, object) {
      if (!this.elementExists(object.childObjs, "mimeType"))
         this.printGenericFile(HTMLElement, object);
      else {
         var type = object.childObjs.mimeType.tData.toLowerCase();
         switch (type) {
         case "image/jpeg":
         case "image/png":
            this.printFileImage(HTMLElement, object);
            break;
         default:
            console.log("TODO: Print file by type: ", type, object);
            this.printGenericFile(HTMLElement, object);
            break;
         }
      }
   }

   printGenericFile(HTMLElement, object) {
      var fileURL = this.handleLinkTypes(object);
      if (fileURL) {
         // TODO: Fix the placeholderName
         var bodyElement = this.createHTMLLink(fileURL,
            document.createTextNode(fileURL), "_blank");
         var content = [
            document.createTextNode("File Link"),
            bodyElement,
            ];
         this.createRowWithContent(HTMLElement, 2, content, true);
      }
      this.print(HTMLElement, object);
   }

   printFileImage(HTMLElement, object) {
      var imageURL = this.handleLinkTypes(object);
      if (imageURL) {
         // TODO: Fix the placeholderName
         var placeHolderName = "Image: " + object.childObjs.idShort.tData;
         var bodyElement = this.createImage(imageURL, placeHolderName);
         var content = [
            document.createTextNode("Image"),
            bodyElement,
            ];
         this.createRowWithContent(HTMLElement, 2, content, true);
      }

      this.print(HTMLElement, object);
   }

   printBlob(HTMLElement, object, name) {
      var childObjs = object.childObjs;
      var HTMLObject = this.printGenericSubmodelElement(HTMLElement, object,
            childObjs.idShort.tData, "Blob");

      this.print(HTMLObject.container, object);
   }

   printProperty(HTMLElement, object, name) {
      var childObjs = object.childObjs;
      var HTMLObject = this.printGenericSubmodelElement(HTMLElement, object,
            childObjs.idShort.tData, "Property");

      this.print(HTMLObject.container, object);
   }

   printMultiLanguageProperty(HTMLElement, object, name) {
      var childObjs = object.childObjs;
      var HTMLObject = this.printGenericSubmodelElement(HTMLElement, object,
            childObjs.idShort.tData, "Multi Language Property");

      this.print(HTMLObject.container, object);
   }

   printRange(HTMLElement, object, name) {
      var childObjs = object.childObjs;
      var HTMLObject = this.printGenericSubmodelElement(HTMLElement, object,
            childObjs.idShort.tData, "Range");

      this.print(HTMLObject.container, object);
   }

   printReferenceElement(HTMLElement, object, name) {
      var childObjs = object.childObjs;
      var HTMLObject = this.printGenericSubmodelElement(HTMLElement, object,
            childObjs.idShort.tData, "Reference Element");

      this.print(HTMLObject.container, object);
   }

   printBasicEvent(HTMLElement, object, name) {
      var childObjs = object.childObjs;
      var HTMLObject = this.printGenericSubmodelElement(HTMLElement, object,
            childObjs.idShort.tData, "Basic Event");

      this.print(HTMLObject.container, object);
   }

   printSubmodelElementCollection(HTMLElement, object, name) {
      var childObjs = object.childObjs;
      var HTMLObject = this.printGenericSubmodelElement(HTMLElement, object,
            childObjs.idShort.tData, "Submodel Element Collection");

      this.print(HTMLObject.container, object);
   }

   printRelationshipElement(HTMLElement, object, name) {
      var childObjs = object.childObjs;
      var HTMLObject = this.printGenericSubmodelElement(HTMLElement, object,
            childObjs.idShort.tData, "Relationship Element");

      this.print(HTMLObject.container, object);
   }

   printAnnotatedRelationshipElement(HTMLElement, object, name) {
      var childObjs = object.childObjs;
      var HTMLObject = this.printGenericSubmodelElement(HTMLElement, object,
            childObjs.idShort.tData, "Annotated Relationship Element");

      this.print(HTMLObject.container, object);
   }

   printQualifier(HTMLElement, object, name) {
      var childObjs = object.childObjs;
      var HTMLObject = this.printNode(HTMLElement, object, 
           childObjs.type.tData, "Qualifier", this.colors.qualifierColor,
           false);

      this.print(HTMLObject.container, object);
   }

   printFormula(HTMLElement, object, name) {
      var HTMLObject = this.printNode(HTMLElement, object, name,
            "Formula", this.colors.qualifierColor, false);

      this.print(HTMLObject.container, object);
   }

   printOperation(HTMLElement, object, name) {
      var childObjs = object.childObjs;
      var HTMLObject = this.printNode(HTMLElement, object, 
            childObjs.idShort.tData, "Operation", this.colors.operationColor,
            false);

      var formGroup = this.createMultiElementForm(HTMLObject.container,
            object, this.callOperation);

      this.print(formGroup, object);
   }

   printOperationVariable(HTMLElement, object, name) {
      if (!this.elementExists(object.tHints, "noPrint") ||
            object.tHints.noPrint == false) {
         var HTMLObject = this.printNode(HTMLElement, object, "",
            "OperationVariable", this.colors.submodelElementColor, false);

         this.print(HTMLObject.container, object);
      }
      else
         this.print(HTMLElement, object);
   }

   printDataType(HTMLElement, object, name) {
      var childObjs = object.childObjs;
      this.printString(HTMLElement, childObjs.dataObjectType, name)
   }

   createValueElement(object, valueName = null, update = false) {
      var childObjs = object.childObjs;
      var bodyElement = null;
      var category = "CONSTANT";
      if (valueName == "value")
         category = this.getCategoryByObject(object);

      if (category == "")
         category = "CONSTANT";

      switch (category) {
      default:
         /* fallthrough */
         console.log("Unhandled category found: " + category);
      case "DEFAULT":
      case "CONSTANT":
            if (this.isLink(object))
               bodyElement = this.createHTMLLink(object.tData,
                  document.createTextNode(object.tData));
            else
               bodyElement = document.createTextNode(object.tData);
         break;
      case "VARIABLE":
         var idData = "";

         if (object.parentObj.childObjs.hasOwnProperty("idShort"))
            idData = object.parentObj.childObjs.idShort.tData;
//         else
//            idData = childObjs.idShort.tData;

         bodyElement = this.createBootstrapContainerFluid();
         bodyElement.classList.add("pl-0");
         object.HTMLcontainer = this.createSingleElementForm(bodyElement,
               idData, object.tData, object, this.submitValue);
         if (!update &&
             object.parentObj.parentObj.tType != "OperationVariable")
            this.valueUpdateArray.push(object);

         break;
      case "PARAMETER":
         bodyElement = this.createBootstrapContainerFluid();
         bodyElement.classList.add("pl-0");

         var output = document.createTextNode(object.tData);

         bodyElement.appendChild(output);

         object.HTMLcontainer = bodyElement;
         object.tHTMLID = object.HTMLcontainer.id;
         break;
      }
      return bodyElement;
   }

   getCategoryByObject(object) {
      if (this.elementExists(object.parentObj.childObjs, "category"))
         return object.parentObj.childObjs.category.tData;
      // default
      return "CONSTANT";
   }

   printGenericSubmodelElement(HTMLElement, object, name, titlename) {
      return this.printNode(HTMLElement, object, name, titlename,
            this.colors.submodelElementColor, false);
   }

   printString(HTMLElement, object, valueName) {
      this.printValue(HTMLElement, object, valueName);
   }

   printValue(HTMLElement, object, valueName) {
      var bodyElement = this.createValueElement(object, valueName);
      var content = [
         document.createTextNode(valueName),
         bodyElement,
         ];
      this.createRowWithContent(HTMLElement, 2, content, true);
   }

   printRegistry(HTMLElement, object) {
      this.treeRoot = object;
      var childObjs = object.childObjs;

      var card = this.createBootstrapCard(0, 0);
      var cardBody = this.createBootstrapCardBody(0, 1);
      var container = this.aasContainer;

      card.appendChild(cardBody);
      HTMLElement.appendChild(card);

      var collapsable = this.insertBootstrapCardElement(cardBody, container,
            "bg-light", "text-black");

      this.insertBootstrapCardTitle(cardBody,
            document.createTextNode("Asset Administration Shell Registry"),
            this.colors.AASColor, "text-white", collapsable.id);

      this.print(container, object);
   }

   printAssetAdministrationShellDescriptor(HTMLElement, element, key) {
      var HTMLObject = this.printNode(HTMLElement, element, key, "",
          this.colors.submodelElementColor, false);

      this.print(HTMLObject.container, element);
   }

   printSubmodelDescriptor(HTMLElement, element, key) {
      var HTMLObject = this.printNode(HTMLElement, element, key, "",
          this.colors.submodelElementColor, false);

      this.print(HTMLObject.container, element);
   }

   printEndpoint(HTMLElement, element, key) {
      var name = null;
      if (this.elementExists(element.childObjs, "address"))
         name = new URL (element.childObjs.address.tData).origin;
      else
         name = "No Address set";
      var HTMLObject = this.printNode(HTMLElement, element, name, "",
          this.colors.referenceColor, false);

      this.print(HTMLObject.container, element);
   }

   handleLinkTypes(object) {
      if (this.elementExists(object.childObjs, "value")) {
         var fURL = object.childObjs.value.tData;
         if (this.isNull(fURL) || fURL == "")
            return null;
         if (!(fURL.startsWith("http://") ||
               fURL.startsWith("https://"))) {
            var rootUrl = this. findPropertyElementUpward(object,
               "tRootURL");
            // Relative path from current element
            if (!fURL.startsWith("/"))
               fURL = object.tURL + "/" + fURL;
            // Absolute path from root element
            else
               fURL = rootUrl + fURL;
         }
         return fURL;
      }
      return null;
   }

   isLink(element) {
      if (typeof(element.tData) != "string")
         return false;
      var url = "";
      try {
         url = new URL(element.tData);
      }
      catch (_) {
         return false;
      }
      return true;
   }

   // PUT on /submodelElements/$name/value
   submitValue(val) {
      var valueType = "string";
      var elementID = val.target.id;
      var value = val.target.getElementsByTagName("input")[0].value;
      var element = this.findElementByHtmlId(elementID, this.treeRoot);

      if (element.parentObj.childObjs.hasOwnProperty("valueType"))
         valueType = element.parentObj.childObjs.valueType.tData;

      var data = this.convertToJSON(value, valueType);

      this.aasParser.AjaxHelper.putJSON(element.tURL,JSON.stringify(data),
            null, null, null);
   }

   // POST on /submodelElements/$name/invoke
   callOperation(val) {

      var outputJSON = new Object();
      outputJSON.timeout = 10;
      outputJSON.requestId = "";
      outputJSON.inputArguments = new Array();
      outputJSON.inoutputArguments = new Array();

      var elementID = val.target.id;
      var operationElement = this.findElementByHtmlId(elementID, this.treeRoot);

      //console.log("Operation called with: ", operationElement.tURLInvoke,
      //   operationElement, val);

      var var_array = this.findElementsByType("OperationVariable", operationElement);
      var i = 0;
      // filter output only Variables
      while (i < var_array.length) {
         var element = var_array[i];
         if (element.parentObj.tName == "outputVariable") {
            var_array.splice(i, 1);
            i--;
         }
         i++;
      }

      for (var valName in var_array) {
         var varElement = var_array[valName];
         if (this.elementExists(varElement.childObjs, "value")) {
            var valueObj = varElement.childObjs.value;
            switch (valueObj.tType) {
            case "Property":
               var value = valueObj.childObjs.value.HTMLcontainer.value;
               var valJSON = varElement.tOriginalJSON;
               valJSON.value.value = this.convertToJSON(value,
                  valueObj.childObjs.valueType.childObjs.dataObjectType.tData);
               if (varElement.parentObj.tName == "inputArguments" ||
                   varElement.parentObj.tName == "inputVariable")
                   outputJSON.inputArguments.push(valJSON);
               if (varElement.parentObj.tName == "inoutputArguments" ||
                   varElement.parentObj.tName == "inoutputVariable")
                   outputJSON.inoutputArguments.push(valJSON);
               break;
            default:
               break;
            }
         }
      }

      this.aasParser.AjaxHelper.postJSON(operationElement.tURLInvoke,
         JSON.stringify(outputJSON), null, null, null);
   }

   findChildElementUpward(object, name) {
      if (this.elementExists(object.childObjs, name))
         return object.childObjs[name];

      if (this.elementExists(object, "parentObj"))
         return this.findChildElementUpward(object["parentObj"], name);

      return null;
   }

   findPropertyElementUpward(object, name) {
      if (this.elementExists(object, name))
         return object[name];

      if (this.elementExists(object, "parentObj"))
         return this.findPropertyElementUpward(object["parentObj"], name);

      return null;
   }

   findElementByHtmlId(name, root) {
      for(var key in root) {
         if (key == "parentObj" ||
             key == "HTMLcontainer" ||
             !this.isObject(root[key]))
            continue;
         var child = root[key];
         if (child.hasOwnProperty("tHTMLID") && (child.tHTMLID == name))
            return child;
         else {
            if (this.isObject(child)) {
               var element = this.findElementByHtmlId(name, child);
               if (element != null)
                  return element;
            }
         }
      }
      return null;
   }

   findElementsByType(type, rootElement, parentType = null, parentName = null) {
      var result = new Array();
      if (!this.isObject(rootElement) ||
         !rootElement.hasOwnProperty("childObjs"))
         return;
      var childs = rootElement.childObjs;
      for (var key in childs) {
         var child = childs[key];
         if (this.isObject(child)) {
            if (child.hasOwnProperty("tType") && child.tType == type &&
                (parentType == null || child.parentObj.tType == parentType))
               result.push(child);
            var arr_tmp = this.findElementsByType(type, child);
            if (arr_tmp.length > 0)
               result.push.apply(result, arr_tmp);
         }
      }
      return result;
   }

   timedUpdateValues() {
      var values = this.valueUpdateArray;
      for (var key in values) {
         var transObj = new Object();
         transObj.context = values[key];
         transObj.printer = this;
         this.aasParser.getByURL(transObj,
               values[key].tURL,
               this.updateValue,
               null);
      }
   }

   // unbound for this -> context
   updateValue(ret) {
      var value = null;
      var context = this.object.context;
      var printer = this.object.printer;
      // new Basyx
      if (!printer.isObject(ret))
         value = ret;
      // old Basyx && AASX Package explorer
      else {
         // very old Basyx, remove me?
         if (printer.elementExists(ret, "entity")) {
            ret = ret.entity;
         }
         value = ret.value;
      }
      context.data = value;
      if (!printer.isObject(value)) {
         if (document.activeElement != context.HTMLcontainer)
            context.HTMLcontainer.value = value;
      }
   }
}
