/*
 * Copyright (c) 2021 Lenze SE
 * SPDX-License-Identifier: Apache-2.0
 */

class AASPrinterGeneric extends AASPrinterMetamodelElements {
   constructor() {
      super(document.getElementById("rootElement"));
      /* bind this pointer */
      /* Helper */
      //this.findChildElementUpward = this.findChildElementUpward.bind(this);
      //this.findPropertyElementUpward = this.findPropertyElementUpward.bind(this);
      //this.findElement = this.findElement.bind(this);
      /* variables */
      this.treeRoot = null;
      this.parser = new AASParser(this);

      /*
       * We need to make sure the container for our async submodels is ready
       * even if our aas is not printed already
       */
      //this.aasContainer = this.createBootstrapContainerFluid();

      this.parser.run();

      //window.setInterval(this.timedUpdateValues, 2000);
      
      // load: /api/v1/registry
   }

}


function onLoadAASPrinter() {
   var aasPrinter = new AASPrinterGeneric();
}
