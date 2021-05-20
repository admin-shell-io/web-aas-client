/*
 * Copyright (c) 2021 Lenze SE
 * SPDX-License-Identifier: Apache-2.0
 */

class AjaxHelper {
   constructor() {
      /* AJAX */
      this.getJSON = this.getJSON.bind(this);
      this.putJSON = this.putJSON.bind(this);
      this.postJSON = this.postJSON.bind(this);
   }

   getJSON(URL,
         callback_success,
         callback_error,
         ctx = null) {
      $.ajax({
         url: URL,
         type: 'GET',
         dataType: 'json',
         crossDomain: true,
         success: callback_success,
         error: callback_error,
         context: ctx
      });
      return true;
   }

   putJSON(URL,
         value,
         callback_success,
         callback_error,
         ctx = null) {
      $.ajax({
         url: URL,
         type: 'PUT',
         beforeSend: function(xhr) {
            if (xhr.overrideMimeType) {
               xhr.overrideMimeType("application/json");
            }},
            dataType: 'json',
            crossDomain: true,
            success: callback_success,
            error: callback_error,
            data: value,
            context: ctx
      });
      return true;
   }

   postJSON(URL,
         value,
         callback_success,
         callback_error,
         ctx = null) {
      $.ajax({
         url: URL,
         type: 'POST',
         beforeSend: function(xhr) {
            if (xhr.overrideMimeType) {
               xhr.overrideMimeType("application/json");
            }},
            dataType: 'json',
            crossDomain: true,
            success: callback_success,
            error: callback_error,
            data: value,
            context: ctx
      });
      return true;
   }
}
