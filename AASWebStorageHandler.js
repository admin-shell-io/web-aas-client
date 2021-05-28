/*
 * Copyright (c) 2021 Lenze SE
 * SPDX-License-Identifier: Apache-2.0
 */
  
class AASWebStorageHandler {
   constructor() {
      this.setCurrentAAS = this.setCurrentAAS.bind(this);
      this.setCurrentRegistry = this.setCurrentRegistry.bind(this);
      this.getCurrentAAS = this.getCurrentAAS.bind(this);
      this.getCurrentRegistry = this.getCurrentRegistry.bind(this);
      this.addAASURL = this.addAASURL.bind(this);
      this.addRegistryURL = this.addRegistryURL.bind(this);
      this.addURLToMap = this.addURLToMap.bind(this);
      this.removeAASURL = this.removeAASURL.bind(this);
      this.removeRegistryURL = this.removeRegistryURL.bind(this);
      this.removeURLFromMap = this.removeURLFromMap.bind(this);
      this.removeAASHost = this.removeAASHost.bind(this);
      this.removeRegistryHost = this.removeRegistryHost.bind(this);
      this.removeHostFromMap = this.removeHostFromMap.bind(this);
      this.AASHostExists = this.AASHostExists.bind(this);
      this.registryHostExists = this.registryHostExists.bind(this);
      this.hostExists = this.hostExists.bind(this);
      this.getAASMap = this.getAASMap.bind(this);
      this.getRegistryMap = this.getRegistryMap.bind(this);
      this.readMapFromStorage = this.readMapFromStorage.bind(this);
      this.writeAASMap = this.writeAASMap.bind(this);
      this.writeRegistryMap = this.writeRegistryMap.bind(this);
      this.writeMap = this.writeMap.bind(this);

      this.aasStorageSet = "aasMap";
      this.registryStorageSet = "registryMap";
      this.currentAAS = "currentAAS";
      this.currentRegistry = "currentRegistry";

      this.aasMap = null;
      this.registryMap = null;
      
      this.getAASMap();
      this.getRegistryMap();
   }

   setCurrentAAS(aasURL) {
      window.localStorage.setItem(this.currentAAS, aasURL);
      this.addAASURL(aasURL);
   }

   setCurrentRegistry(registryURL) {
      window.localStorage.setItem(this.currentRegistry, registryURL);
      this.addRegistryURL(registryURL);
   }

   getCurrentAAS() {
      var storageData = window.localStorage.getItem(this.currentAAS);
      if (storageData)
         return storageData;
      return null;
   }

   getCurrentRegistry() {
      var storageData = window.localStorage.getItem(this.currentRegistry);
      if (storageData)
         return storageData;
      return null;
   }

   addAASURL(aasURL, skipCommit = false) {
      var ret = this.addURLToMap(aasURL, this.aasMap);
      if (ret)
         this.aasMap = ret;
      if (!skipCommit)
         this.writeAASMap();
      if (ret)
         return true;
      return false;
   }

   addRegistryURL(registryURL, skipCommit = false) {
      var ret = this.addURLToMap(registryURL, this.registryMap);
      if (ret)
         this.registryMap = ret;
      if (!skipCommit)
         this.writeRegistryMap();
      if (ret)
         return true;
      return false;
   }

   addURLToMap(URL_, map) {
      var url = new URL(URL_);
      var hostMap = null;
      if (this.hostExists(url.origin, map)) {
         hostMap = map.get(url.origin);
      }
      else {
         hostMap = new Map();
         map.set(url.origin, hostMap);
         var sortArr = Array.from(map);
         sortArr.sort();
         map = new Map(sortArr);
      }

      if (hostMap.has(url.pathname))
         return null;

      hostMap.set(url.pathname, url.href);
      var sortArr = Array.from(hostMap);
      sortArr.sort();
      hostMap = new Map(sortArr);

      map.set(url.origin, hostMap);
      return map;
   }

   removeAASURL(aasURL, skipCommit = false) {
      var ret = this.removeURLFromMap(aasURL, this.aasMap);
      if (ret)
         this.aasMap = ret;
      if (!skipCommit)
         this.writeAASMap();
      if (ret)
         return true;
      return false;
   }

   removeRegistryURL(registryURL, skipCommit = false) {
      var ret = this.removeURLFromMap(registryURL, this.registryMap);
      if (ret)
         this.registryMap = ret;
      if (!skipCommit)
         this.writeRegistryMap();
      if (ret)
         return true;
      return false;
   }

   removeURLFromMap(URL_, map) {
      var url = new URL(URL_);
      var hostMap = null;
      if (!this.hostExists(url.origin, map))
         return null;
      hostMap = map.get(url.origin);
      if (!hostMap.has(url.pathname))
         return null;
      hostMap.delete(url.pathname, url.href);
      if (hostMap.size == 0)
        map.delete(url.origin);
      return map;
   }

   removeAASHost(hostURL, skipCommit = false) {
      var ret = this.removeHostFromMap(hostURL, this.aasMap);
      if (ret)
         this.registryMap = ret;
      if (!skipCommit)
         this.writeAASMap();
      if (ret)
         return true;
      return false;
   }

   removeRegistryHost(registryURL, skipCommit = false) {
      var ret = this.removeHostFromMap(registryURL, this.registryMap);
      if (ret)
         this.registryMap = ret;
      if (!skipCommit)
         this.writeRegistryMap();
      if (ret)
         return true;
      return false;
   }

   removeHostFromMap(URL_, map) {
      var url = new URL(URL_);
      if (!this.hostExists(url.origin, map))
         return null;
      map.delete(url.origin);
      return map;
   }

   AASHostExists(hostURL, map) {
      return this.hostExists(hostURL, this.aasMap);
   }

   registryHostExists(hostURL, map) {
      return this.hostExists(hostURL, this.registryMap);
   }

   hostExists(hostURL, map) {
      var url = new URL(hostURL);
      if (map.has(url.origin))
         return true;
      return false;
   }

   getAASMap() {
      if (this.aasMap)
         return this.aasMap;
      this.aasMap = this.readMapFromStorage(this.aasStorageSet);
      return this.aasMap;
   }

   getRegistryMap() {
      if (this.registryMap)
         return this.registryMap;
      this.registryMap = 
         this.readMapFromStorage(this.registryStorageSet);
      return this.registryMap;
   }

   readMapFromStorage(storageIndicator) {
      var storageData = window.localStorage.getItem(storageIndicator);
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
      this.writeMap(this.aasMap, this.aasStorageSet);
   }

   writeRegistryMap() {
      this.writeMap(this.registryMap, this.registryStorageSet);
   }

   writeMap(map, storageIndicator) {
      var map = new Map(map);
      for (var [key, value] of map)
         map.set(key, Object.fromEntries(value));
      window.localStorage.setItem(storageIndicator,
         JSON.stringify(Object.fromEntries(map)));
   }
}
