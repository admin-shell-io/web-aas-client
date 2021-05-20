/*
 * Copyright (c) 2021 Lenze SE
 * SPDX-License-Identifier: Apache-2.0
 */

class BaseCookieHandler {
   constructor() {
      this.setCookie = this.setCookie.bind(this);
      this.deleteCookie = this.deleteCookie.bind(this);
      this.updateCookie = this.updateCookie.bind(this);
      this.cookieExists = this.cookieExists.bind(this);
      this.getCookie = this.getCookie.bind(this);
   }

   setCookie(cookieName, data, expires = null) {
      if (this.cookieExists(cookieName))
         return false;
      var expiresStr = "";
      if (expires)
         expiresStr = "expires: " + expires;
      Cookies.set(cookieName, data, { expiresStr });
      return true;
   }

   deleteCookie(cookieName) {
      if (!this.cookieExists(cookieName))
         return false;
      Cookies.remove(cookieName);
      return true;
   }

   updateCookie(cookieName, data, expires = null) {
      if (this.cookieExists(cookieName))
         this.deleteCookie(cookieName);
      return this.setCookie(cookieName, data, expires);
   }

   cookieExists(cookieName) {
      if (Cookies.get(cookieName))
         return true;
      return false;
   }

   getCookie(cookieName) {
      if (!this.cookieExists(cookieName))
         return null;
      return Cookies.get(cookieName);
   }
}
