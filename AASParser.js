/*
 * Copyright (c) 2021 Lenze SE
 * SPDX-License-Identifier: Apache-2.0
 */

class AASParser extends ParserBase {
   constructor(printer) {
      super();
      /* general */
      this.run = this.run.bind(this);
      this.trimSuffixSlash = this.trimSuffixSlash.bind(this);
      /* AAS */
      this.parseAASRaw = this.parseAASRaw.bind(this);

      this.printer = printer;
      this.AjaxHelper = new AjaxHelper();
      /* Variables */
      this.aasURL = "";
      this.submodelsURL  = "";

      this.AASRoot = this.newTreeObject("AASRoot", null,
                                        "AssetAdministrationShellRoot");
      this.treeRoot = this.AASRoot;
   }

   run() {
      var aasStorageHandler = new AASWebStorageHandler();

      var shellURL = this.getQueryVariable("endpoint");
      if (shellURL) {
         shellURL = decodeURIComponent(shellURL);
         shellURL = this.trimSuffixSlash(shellURL);
         aasStorageHandler.setCurrentAAS(shellURL);
      }

      // Set extra base URL
      var aasURL = new URL(aasStorageHandler.getCurrentAAS());
      this.setRootURLS(this.AASRoot, aasURL, 2);
      this.AASRoot.tURL = aasStorageHandler.getCurrentAAS();

      this.getByURL(this.AASRoot,
            this.AASRoot.tURL,
            this.parseAASRaw,
            this.setErrorAAS);
   }

   trimSuffixSlash(URL) {
      if (!URL.endsWith("/"))
         return URL;
      return URL.slice(0, - 1);
   }

   /* unbound for compound -> this */
   setErrorAAS(status) {
      var URL = this.URL;
      var object = this.object;
      var that = this.parentObj;

      if (status.status == 401) {
         var error = that.newTreeObject("AASError", object,
            "tError");
         that.parseString("Could not retrieve AAS", "Description", error);
         that.parseString(URL, "URL", error);
         that.parseValue(status.status, "ErrorCode", error);
         that.printer.printError(error, "");
         return;
      }

      if (this.retry < 2) {
         this.retry++;
         this.parentObj.AjaxHelper.getJSON(this.URL,
                                        this.onSuccess,
                                        this.onError,
                                        this);
         return;
      }

      var error = that.newTreeObject("AASError", object,
         "tError");
      that.parseString("Could not retrieve AAS","Description", error);
      that.parseString(URL, "URL", error);
      if (status.status != 0)
         that.parseValue(status.status, "ErrorCode", error);
      that.printer.printError(error, "");
   }

   /* unbound for compound -> this */
   setErrorSubmodels(status) {
      if (this.retry < 10) {
         this.retry++;
         this.parentObj.AjaxHelper.getJSON(this.URL,
                                        this.parentObj.parseSubmodels,
                                        this.parentObj.setErrorSubmodelsRaw,
                                        this);
         return;
      }

      var URL = this.URL;
      var object = this.object;
      var that = this.parentObj;
      var error = that.newTreeObject("SubmodelError" + URL, object,
         "tError");
      that.parseString("Could not retrieve Submodel","Description", error);
      that.parseString(URL, "URL", error);
      if (status.status != 0)
         that.parseValue(status.status, "ErrorCode", error);
      that.printer.printError(error, "");
   }

   setError(errObj) {
      console.log(errObj);
   }

   parseAASRaw(JSON) {
      var AAS = JSON;
      if (JSON.hasOwnProperty("AAS"))
         AAS = JSON.AAS;
      if (JSON.hasOwnProperty("entity"))
         AAS = JSON.entity;
      var aas = this.parseAAS(AAS, this.AASRoot, true, this.parseSubmodelsRaw,
                    this.setErrorSubmodels);
      this.printer.printAAS(this.printer.rootElement, aas);
   }

   /* unbound for compound -> this */
   parseSubmodelsRaw(JSON) {
      var submodels = JSON;
      if (JSON.hasOwnProperty("entity"))
         submodels = JSON.entity;
      this.parentObj.parseSubmodels(submodels, this.object, true, 
                                    this.parentObj.parseSubmodelRaw,
                                    this.parentObj.setErrorSubmodel);
   }
}
