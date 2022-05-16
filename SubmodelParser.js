/*
 * Copyright (c) 2021 Lenze SE
 * SPDX-License-Identifier: Apache-2.0
 */

class SubmodelParser extends ParserBase {
   constructor(printer, parentElement = null, URL = null) {
      super();
      /* general */
      this.run = this.run.bind(this);
      this.trimSuffixSlash = this.trimSuffixSlash.bind(this);
      /* Submodel */
      this.parseSubmodelRaw = this.parseSubmodelRaw.bind(this);

      this.printer = printer;
      this.AjaxHelper = new AjaxHelper();
      /* Variables */
      this.submodelURLStr = URL;
      if (parentElement == null) {
         this.parentElement = this.newTreeObject("treeRoot", null,
                                            "AssetAdministrationShellRoot");
         //this.treeRoot = this.parentElement;
      }
      else
         this.parentElement = parentElement;
   }

   run() {
      //var aasStorageHandler = new AASWebStorageHandler();
      if (this.submodelURLStr == null) {
         this.submodelURLStr = this.getQueryVariable("endpoint");
         if (this.submodelURLStr) {
            this.submodelURLStr = decodeURIComponent(this.submodelURLStr);
            this.submodelURLStr = this.trimSuffixSlash(this.submodelURLStr);
            //aasStorageHandler.setCurrentAAS(shellURL);
         }
      }

      // Set extra base URL
      this.submodelURL = new URL(this.submodelURLStr);
      //this.treeRoot.tURL = aasStorageHandler.getCurrentAAS();
      //this.treeRoot.tURL = this.submodelURLStr;

      this.getByURL(this.parentElement,
            this.submodelURLStr,
            this.parseSubmodelRaw,
            this.setErrorSubmodel);
   }

   trimSuffixSlash(URL) {
      if (!URL.endsWith("/"))
         return URL;
      return URL.slice(0, - 1);
   }

   setError(errObj) {
      console.log(errObj);
   }

   parseSubmodelRaw(JSON) {
      var submodelJSON = JSON;
      if(this.elementExists(submodelJSON, "entity"))
         submodelJSON = submodelJSON.entity;
      if (this.elementExists(submodelJSON, "idShort"))
         var submodel = this.parseSubmodel(submodelJSON, this.submodelURLStr,
         this.parentElement);
      this.printer.printSubmodel(
         this.printer.rootElement, submodel, this.printer.expandedView);
   }

   /* unbound for compound -> this */
   setErrorSubmodel() {
      if (this.retry < 1) {
         this.retry++;
         this.parentObj.AjaxHelper.getJSON(this.URL,
                                           this.parentObj.parseSubmodelRaw,
                                           this.parentObj.setErrorSubmodel,
                                           this);
         return;
      }

      var nextURL = "";
      var nextRun = false;
      if (this.object.URLArray.data.length > 0) {
         nextURL = this.object.URLArray.data[this.object.URLArray.data.length -1]
         this.object.URLArray.data.pop();
         nextRun = true;
      }
      if (nextRun) {
         this.parentObj.getByURL(this.object,
                                 nextURL,
                                 this.parentObj.parseSubmodelRaw,
                                 this.parentObj.setErrorSubmodel);
         return;
      }

      var error = new Object();
      error.component = "Submodel";
      error.errorString = "Retrieving the Submodel failed";
      error.URL = this.URL;
      this.parentObj.setError(error);
   }
}
