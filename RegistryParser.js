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

class RegistryParser extends ParserBase {
   constructor(registryPrinter) {
      super();
      /* general */
      this.run = this.run.bind(this);
      this.trimSuffixSlash = this.trimSuffixSlash.bind(this);
      /* AAS Registry */
      this.parseRegistryRaw = this.parseRegistryRaw.bind(this);
      this.addURLToList = this.addURLToList.bind(this);

      this.registryPrinter = registryPrinter;
      this.AjaxHelper = new AjaxHelper();
      /* Variables */
      this.registryURL = "";

      this.RegistryRoot = this.newTreeObject("RegistryRoot", null,
                                        "AssetAdministrationShellRegistryRoot");
      this.treeRoot = this.RegistryRoot;
      
      this.cookieHandler = new AASCookieHandler();
   }

   run() {
      var regURL = getQueryVariable("registry");
      if (regURL) {
         regURL = decodeURIComponent(regURL);
         regURL = this.trimSuffixSlash(regURL);
         //this.cookieHandler.setCurrentAAS(shellURL);
      }

      // Set extra base URL
      var registryURL = new URL(regURL); /*new URL(this.cookieHandler.getCurrentRegistry());*/
      this.RegistryRoot.tRootURL = this.trimSuffixSlash(registryURL.origin);
      this.RegistryRoot.tLocalRootURL = this.trimSuffixSlash(this.RegistryRoot.tRootURL);
      var split = registryURL.pathname.split("/");
      for (var i = 1; i < split.length - 2; i++)
         this.RegistryRoot.tLocalRootURL += "/" + split[i];
      // Set extra browser URL
      this.RegistryRoot.tBrowserURL = window.location.origin
         + window.location.pathname;
      this.RegistryRoot.tURL = registryURL.href;/*this.cookieHandler.getCurrentRegistry()*/;

      this.getByURL(this.RegistryRoot,
            this.RegistryRoot.tURL,
            this.parseRegistryRaw,
            this.setErrorRegistry);
   }

   addURLToList(URL) {
      this.cookieHandler.addAASURL(URL, true);
   }

   trimSuffixSlash(URL) {
      if (!URL.endsWith("/"))
         return URL;
      return URL.slice(0, - 1);
   }

   /* unbound for compound -> this */
   setErrorRegistry(status) {
      var URL = this.URL;
      var object = this.object;
      var that = this.parentObj;

      if (status.status == 401) {
         var error = that.newTreeObject("RegistryError", object,
            "tError");
         that.parseString("Could not retrieve the Registry", "Description", 
            error);
         that.parseString(URL, "URL", error);
         that.parseValue(status.status, "ErrorCode", error);
         that.registryPrinter.printError(error, "");
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

      var error = that.newTreeObject("RegistryError", object,
         "tError");
      that.parseString("Could not retrieve the Registry", "Description", error);
      that.parseString(URL, "URL", error);
      if (status.status != 0)
         that.parseValue(status.status, "ErrorCode", error);
      that.registryPrinter.printError(error, "");
   }

   parseRegistryRaw(JSON) {
      var RegistryJSON = JSON;
      if (JSON.hasOwnProperty("entity"))
         RegistryJSON = RegistryJSON.entity;
      var registry = this.parseRegistry(RegistryJSON, this.RegistryRoot);
      
      this.cookieHandler.writeAASMap();

      console.log(registry);

      this.registryPrinter.printRegistry(this.registryPrinter.rootElement, registry);
   }
}
