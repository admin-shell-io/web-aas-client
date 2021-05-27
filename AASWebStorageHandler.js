/*
 * Copyright (c) 2021 Lenze SE
 * SPDX-License-Identifier: Apache-2.0
 */
  
class AASWebStorageHandler {
   constructor() {
      this.setCurrentAAS = this.setCurrentAAS.bind(this);
      this.getCurrentAAS = this.getCurrentAAS.bind(this);
      this.addAASURL = this.addAASURL.bind(this);
      this.removeAASURL = this.removeAASURL.bind(this);
      this.removeHost = this.removeHost.bind(this);
      this.hostExists = this.hostExists.bind(this);
      this.getAASMap = this.getAASMap.bind(this);
      this.readAASMapFromStorage = this.readAASMapFromStorage.bind(this);
      this.writeAASMap = this.writeAASMap.bind(this);

      this.aasStorageSet = "aasMap";
      this.currentAAS = "currentAAS";

      this.aasMap = null;
   }

   setCurrentAAS(aasURL) {
      window.localStorage.setItem(this.currentAAS, aasURL);
      this.addAASURL(aasURL);
   }

   getCurrentAAS() {
      var storageData = window.localStorage.getItem(this.currentAAS);
      if (storageData)
         return storageData;
      return null;
   }

   addAASURL(aasURL, skipCommit = false) {
      var url = new URL(aasURL);
      var hostMap = null;
      this.getAASMap();
      if (this.hostExists(url.origin)) {
         hostMap = this.aasMap.get(url.origin);
      }
      else {
         hostMap = new Map();
         this.aasMap.set(url.origin, hostMap);
         var sortArr = Array.from(this.aasMap);
         sortArr.sort();
         this.aasMap = new Map(sortArr);
      }

      if (hostMap.has(url.pathname))
         return true;

      hostMap.set(url.pathname, url.href);
      var sortArr = Array.from(hostMap);
      sortArr.sort();
      hostMap = new Map(sortArr);

      this.aasMap.set(url.origin, hostMap);
      if (!skipCommit)
         this.writeAASMap();
      return true;
   }

   removeAASURL(aasURL, skipCommit = false) {
      var url = new URL(aasURL);
      this.getAASMap();
      var hostMap = null;
      if (!this.hostExists(url.origin))
         return false;
      hostMap = this.aasMap.get(url.origin);
      if (!hostMap.has(url.pathname))
         return false;
      hostMap.delete(url.pathname, url.href);
      if (hostMap.size == 0)
        this.aasMap.delete(url.origin);
      if (!skipCommit)
         this.writeAASMap();
      return true;
   }

   removeHost(hostURL, skipCommit = false) {
      var url = new URL(hostURL);
      this.getAASMap();
      if (!this.hostExists(url.origin))
         return false;
      this.aasMap.delete(url.origin);
      if (!skipCommit)
         this.writeAASMap();
      return true;
   }

   hostExists(hostURL) {
      var url = new URL(hostURL);
      this.getAASMap();
      if (this.aasMap.has(url.origin))
         return true;
      return false;
   }

   getAASMap() {
      if (this.aasMap)
         return this.aasMap;
      this.aasMap = this.readAASMapFromStorage();
      return this.aasMap;
   }

   readAASMapFromStorage() {
      var storageData = window.localStorage.getItem(this.aasStorageSet);
      if (storageData) {
         try {
            var map = new Map(Object.entries(JSON.parse(storageData)));
            for (var [key, value] of map)
               map.set(key, new Map(Object.entries(value)));
            return map;
         }
         catch(e) {
            return new Map();
         }
      }
      return new Map();
   }

   writeAASMap() {
      var map = new Map(this.aasMap);
      for (var [key, value] of map)
         map.set(key, Object.fromEntries(value));
      window.localStorage.setItem(this.aasStorageSet,
         JSON.stringify(Object.fromEntries(map)));
   }
}
