/*
 * Copyright (c) 2021 Lenze SE
 * SPDX-License-Identifier: Apache-2.0
 */

function getQueryVariable(variable) {
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if(pair[0] == variable) {
         return pair[1];}
   }
   return null;
}

class AASParser extends ParserBase {
   constructor(aasPrinter) {
      super();
      /* general */
      this.run = this.run.bind(this);
      this.trimSuffixSlash = this.trimSuffixSlash.bind(this);
      /* AAS */
      this.parseAASRaw = this.parseAASRaw.bind(this);

      this.AASPrinter = aasPrinter;
      this.AjaxHelper = new AjaxHelper();
      /* Variables */
      this.aasURL = "";
      this.submodelsURL  = "";

      this.AASRoot = this.newTreeObject("AASRoot", null,
                                        "AssetAdministrationShellRoot");
      this.treeRoot = this.AASRoot;
   }

   run() {
      var cookieHandler = new AASCookieHandler();

      var shellURL = getQueryVariable("shell");
      if (shellURL) {
         shellURL = decodeURIComponent(shellURL);
         shellURL = this.trimSuffixSlash(shellURL);
         cookieHandler.setCurrentAAS(shellURL);
      }

      // Set extra base URL
      var aasURL = new URL(cookieHandler.getCurrentAAS());
      this.AASRoot.tRootURL = this.trimSuffixSlash(aasURL.origin);
      this.AASRoot.tLocalRootURL = this.trimSuffixSlash(this.AASRoot.tRootURL);
      var split = aasURL.pathname.split("/");
      for (var i = 1; i < split.length - 2; i++)
         this.AASRoot.tLocalRootURL += "/" + split[i];
      // Set extra browser URL
      this.AASRoot.tBrowserURL = window.location.origin
         + window.location.pathname;
      this.AASRoot.tURL = cookieHandler.getCurrentAAS();

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
         that.AASPrinter.printError(error, "");
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
      that.AASPrinter.printError(error, "");
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
      that.AASPrinter.printError(error, "");
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
      this.AASPrinter.printAAS(this.AASPrinter.rootElement, aas);
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

   /* unbound for compound -> this */
   parseSubmodelRaw(JSON) {
      var submodelJSON = JSON;
      if(this.parentObj.elementExists(submodelJSON, "entity"))
         submodelJSON = submodelJSON.entity;
      if (this.parentObj.elementExists(submodelJSON, "idShort"))
         var submodel = this.parentObj.parseSubmodel(submodelJSON, this.URL,
         this.object.parentObj.parentObj.childObjs.submodels);
      this.parentObj.AASPrinter.printSubmodel(
         this.parentObj.AASPrinter.aasContainer, submodel);
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
