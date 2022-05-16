/*
 * Copyright (c) 2021 Lenze SE
 * SPDX-License-Identifier: Apache-2.0
 */

class SubmodelPrinterGeneric extends AASPrinterMetamodelElements {
   constructor(parentElement = null, parentHTMLEle = null, submodelURL = null, 
               expandedView = true) {
     var parentHTMLElement = null;
     if (parentHTMLEle == null)
        parentHTMLElement = document.getElementById("rootElement");
     else
        parentHTMLElement = parentHTMLEle;

      super(parentHTMLElement);

      this.expandedView = expandedView;
      /* variables */
      //this.treeRoot = treeRoot;
      this.parser = new SubmodelParser(this, parentElement, submodelURL);
      this.parser.run();

      window.setInterval(this.timedUpdateValues, 2000);
   }

}


function onLoadSubmodelPrinter() {
   var submodelPrinter = new SubmodelPrinterGeneric();
}
