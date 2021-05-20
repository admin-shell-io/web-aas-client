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
      this.printHostEntries = this.printHostEntries.bind(this);
      this.printURLEntry = this.printURLEntry.bind(this);
      this.removeEntry = this.removeEntry.bind(this);

      this.htmlParent = htmlParent;
      this.toggleElement = toggleElement;
      this.baseContainer = null;

      this.aasCookieHandler = new AASCookieHandler();

      this.listBody = null;

      this.tBrowserURL = window.location.origin + window.location.pathname;

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
      this.listBody = this.printBody(this.baseContainer);

      this.printHostEntries(this.listBody);


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

   printHostEntries(parentElement) {
      var aasMap = this.aasCookieHandler.getAASMap();
      for (var [key, urlMap] of aasMap) {
         var node = this.printNode(parentElement, null, key, "Host", 
                                        this.colors.AASColor, false);
         var img = this.createImage(
           "local_icons/Breeze/actions/22/edit-delete.svg", "X", 22, 22);
         img.classList.add("align-baseline");
         img.classList.add("float-right");
         img.setAttribute("data-html-target", "#" + node.contentRow.id);
         img.onclick = this.removeEntry;
         
         node.contentRow.setAttribute("data-target", key);
         node.contentRow.setAttribute("data-type", "HostURL");

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
            this.printURLEntry(node.container, node.contentRow, entry, "URL");
         }
      }
   }

   printURLEntry(HTMLElement, parentElement, url, valueName) {
      var fullUrl = this.tBrowserURL + "?shell=" + encodeURIComponent(url);
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
         row.setAttribute("data-type", "AASURL");

      img.setAttribute("data-html-target", "#" + row.id);
      img.setAttribute("data-html-parent-target", "#" + parentElement.id);

      img.onclick = this.removeEntry;
   }

   removeEntry(target) {
      var elementId = target.target.getAttribute("data-html-target");
      var element = this.listBody.querySelector(elementId);
      var url = element.getAttribute("data-target");
      var type = element.getAttribute("data-type");
      switch (type) {
      case "AASURL":
         this.aasCookieHandler.removeAASURL(url);
         if (!this.aasCookieHandler.hostExists(url)) {
            elementId = target.target.getAttribute("data-html-parent-target");
            element = this.listBody.querySelector(elementId);
         }
         break;
      case "HostURL":
         this.aasCookieHandler.removeHost(url);
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

