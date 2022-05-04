/*
 * Copyright (c) 2021 Lenze SE
 * SPDX-License-Identifier: Apache-2.0
 */

class AASListPrinter extends PrinterHtmlElements {
   constructor(toggleElement, htmlParent) {
      super();
      this.run = this.run.bind(this);
      this.show = this.show.bind(this);
      this.cleanModal = this.cleanModal.bind(this);
      this.printBaseElements = this.printBaseElements.bind(this);
      this.printHeader = this.printHeader.bind(this);
      this.printBody = this.printBody.bind(this);
      this.printDialogs = this.printDialogs.bind(this);
      this.printListBodys = this.printListBodys.bind(this);
      this.getHostEntriesByType = this.getHostEntriesByType.bind(this);
      this.printHostEntries = this.printHostEntries.bind(this);
      this.printURLEntry = this.printURLEntry.bind(this);
      this.removeAASEntry = this.removeAASEntry.bind(this);
      this.removeRegistryEntry = this.removeRegistryEntry.bind(this);
      this.removeEntry = this.removeEntry.bind(this);

      this.htmlParent = htmlParent;
      this.toggleElement = toggleElement;
      this.baseContainer = null;
      this.modalBody = null;
      this.listBodys = new Object();

      this.storageHandler = new AASWebStorageHandler();

      this.colors = new Object();
      this.colors.AASColor = "bg-lenzeblue";
      this.colors.submodelColor = "bg-lenzemiddleblue2";
      this.colors.assetColor = "bg-lenzemiddleblue1";
      this.colors.referenceColor = "bg-lenzegreen";
      this.colors.submodelElementColor = "bg-lenzecyan";
      this.colors.operationColor = "bg-primary";
      this.colors.qualifierColor = "bg-secondary";
      this.colors.errorColor = "bg-danger";
   }

   run() {
      this.cleanModal(this.htmlParent);
      this.baseContainer = this.printBaseElements(this.htmlParent);
      this.printHeader(this.baseContainer);
      this.modalBody = this.printBody(this.baseContainer);
      this.printDialogs(this.modalBody);
      this.listBodys = this.printListBodys(this.modalBody, this.listBodys);

      var aasEntries = this.getHostEntriesByType("AAS");
      this.printHostEntries(this.listBodys.aasListBody, aasEntries, "AAS");
      var registryEntries = this.getHostEntriesByType("Registry");
      this.printHostEntries(this.listBodys.registryListBody, registryEntries,
         "Registry");

      this.show(this.toggleElement);
   }

   show(element) {
      element.modal('show');
   }

   cleanModal(modalElement) {
      modalElement.replaceChildren();
   }

   printBaseElements(parentElement) {
      var divDialog = document.createElement("div");
      divDialog.classList.add('modal-dialog');
      divDialog.classList.add('modal-xl');
      divDialog.id = "aasModalDialog";

      var divContent = document.createElement("div");
      divContent.classList.add('modal-content');
      divContent.id = "aasModalContent";

      divDialog.appendChild(divContent);
      parentElement.appendChild(divDialog);
      
      return divContent;
   }

   printHeader(parentElement) {
      var divHeader = document.createElement("div");
      divHeader.classList.add('modal-header');
      divHeader.id = "aasModalHeader";

      var h = document.createElement("h3");
      h.classList.add('modal-title');
      h.id = "aasModalHeaderTitle";
      var text = document.createTextNode("Asset Administration Shell List");
      h.appendChild(text);

      var img = this.createImage(
         "local_icons/Breeze/actions/22/window-close.svg", "X", 22, 22);
      img.classList.add("float-right");

      var a = this.createHTMLLink("#", img, "");
      a.classList.add("close");
      a.setAttribute("data-dismiss", "modal"); 

      divHeader.appendChild(h);
      divHeader.appendChild(a);
      parentElement.appendChild(divHeader);
   }

   printBody(parentElement) {
      var divBody = document.createElement("div");
      divBody.classList.add('modal-body');
      divBody.id = "aasModalBody";

      parentElement.appendChild(divBody);
      return divBody;
   }

   printDialogs(parentElement) {
      var aasDialogCtn = this.printNode(parentElement, null, "",
         "New AAS", "bg-white", false, "text-black", 3).container;
      var registryDialogCtn =this.printNode(parentElement, null, "",
         "New Registry", "bg-white", false, "text-black", 3).container;
         
      aasDialogCtn.appendChild(document.createTextNode("Placeholder"));
      registryDialogCtn.appendChild(document.createTextNode("Placeholder"));
   }

   printListBodys(parentElement, listBodys) {
      listBodys.aasListBody = this.printNode(parentElement, null, "",
         "AAS List", "bg-white", false, "text-black", 3).container;
      listBodys.registryListBody = this.printNode(parentElement, null, "",
         "Registry List", "bg-white", false, "text-black", 3).container;
      return listBodys;
   }
   
   getHostEntriesByType(type) {
      if (type == "AAS")
         return this.storageHandler.getAASMap();
      else
         return this.storageHandler.getRegistryMap();
   }

   printHostEntries(parentElement, aasMap, type) {
      for (var [key, urlMap] of aasMap) {
         var node = this.printNode(parentElement, null, key, "Host", 
                                        this.colors.AASColor, false);
         var img = this.createImage(
           "local_icons/Breeze/actions/22/edit-delete.svg", "X", 22, 22);
         img.classList.add("align-baseline");
         img.classList.add("float-right");
         img.setAttribute("data-html-target", "#" + node.contentRow.id);

         node.contentRow.setAttribute("data-target", key);
         if (type == "AAS") {
            img.onclick = this.removeAASEntry;
            node.contentRow.setAttribute("data-type", "AASHostURL");
         }
         else {
            img.onclick = this.removeRegistryEntry;
            node.contentRow.setAttribute("data-type", "RegistryHostURL");
         }

         //var a = this.createHTMLLink("#", img);
         //a.setAttribute("data-html-target", "#" + node.contentRow.id);
         //a.onclick = this.removeEntry;
         
         
         var div_img = document.createElement("div");
         div_img.appendChild(img);

         div_img.classList.add("col-auto");
         div_img.classList.add("d-flex");
         div_img.classList.add("flex-wrap");
         div_img.classList.add("align-items-center");
         node.title.contentRow.appendChild(div_img);
         
         for (var [key2, entry] of urlMap) {
            this.printURLEntry(node.container, node.contentRow, entry, "URL", 
               type);
         }
      }
   }

   printURLEntry(HTMLElement, parentElement, url, valueName, type) {
      var browserURL = null;
      if (type == "AAS")
         browserURL = this.tAASBrowserURL;
      else
         browserURL = this.tRegistryBrowserURL;
      var fullUrl = browserURL + "?endpoint=" + encodeURIComponent(url);
      var bodyElement = this.createHTMLLink(fullUrl, 
         document.createTextNode(url), "_blank");

      var img = this.createImage(
         "local_icons/Breeze/actions/22/edit-delete.svg", "X", 22, 22);
      img.classList.add("align-baseline");
      img.classList.add("float-right");

      var div_img = document.createElement("div");
      div_img.appendChild(img);

      div_img.classList.add("col-auto");
      div_img.classList.add("d-flex");
      div_img.classList.add("flex-wrap");
      div_img.classList.add("align-items-center");
      var content = [
         document.createTextNode(valueName),
         bodyElement,
         img,
         ];
      var row = this.createRowWithContent(HTMLElement, 
         Array("col-2", "col", "col-auto"), content, true);
         row.setAttribute("data-target", url);
         if (type == "AAS") {
            img.onclick = this.removeAASEntry;
            row.setAttribute("data-type", "AASURL");
         }
         else {
            img.onclick = this.removeRegistryEntry;
            row.setAttribute("data-type", "RegistryURL");
         }

      img.setAttribute("data-html-target", "#" + row.id);
      img.setAttribute("data-html-parent-target", "#" + parentElement.id);
   }

   removeAASEntry(target) {
      this.removeEntry(target, "AAS");
   }

   removeRegistryEntry(target) {
      this.removeEntry(target, "Registry");
   }

   removeEntry(target, targetType) {
      var elementId = target.target.getAttribute("data-html-target");
      var element = null;
      if (targetType == "AAS")
         element = this.listBodys.aasListBody.querySelector(elementId);
      else
         element = this.listBodys.registryListBody.querySelector(elementId);
      var url = element.getAttribute("data-target");
      var type = element.getAttribute("data-type");
      switch (type) {
      case "AASURL":
         this.storageHandler.removeAASURL(url);
         if (!this.storageHandler.AASHostExists(url)) {
            elementId = target.target.getAttribute("data-html-parent-target");
            element = this.listBodys.aasListBody.querySelector(elementId);
         }
         break;
     case "RegistryURL":
         this.storageHandler.removeRegistryURL(url);
         if (!this.storageHandler.registryHostExists(url)) {
            elementId = target.target.getAttribute("data-html-parent-target");
            element = this.listBodys.registryListBody.querySelector(elementId);
         }
         break;
      case "AASHostURL":
         this.storageHandler.removeAASHost(url);
         break;
      case "RegistryHostURL":
         this.storageHandler.removeRegistryHost(url);
         break;
      default:
         return;
      }
      element.remove();
   }
}


function showAASList(parent) {
   var p = new AASListPrinter(parent, parent[0]);
   p.run();
}

