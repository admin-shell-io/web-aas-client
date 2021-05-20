# web-aas-client
This project provides a viewer for Asset Administration Shells, which can be
used client-side. It provides a pure javascript web application to communicate
with AAS Servers using json to generically show the AAS content to a user. You
can also view a basyx-registry.

# Current Restrictions
1. Cross-Origin Resource Sharing (CORS): Due to security restrictions, servers
by default don't allow to access data from different localtions. You need to
[enable CORS on your server](https://enable-cors.org/server.html) or use a
CORS-Plugin in your browser (See below).
2. http/https: Based on Browser-Security restrictions, the combination of both
protocols isn't possible. You can't combine an AAS via http and Client via https
and vice versa.

# Prerequisites
1. AAS-Server: You need an AAS-Server that hosts your AASs. At this point,
the server can be based on the aasx-server, the aasx-package-explorer or basyx.
2. Web-server for the web-aas-client: 
3. Web Browser: You can use any modern web browser to use the web-aas-client
4. CORS-Plugin: Due to the mentioned restrictions you might need a CORS-Plugin
for your browser.

# Usage
1. You can access the AAS-client via ServerEndpoint/aasBrowser.html; Attach the
link to your AAS: 
```
aasBrowser.html?shell=http://myAASServer...
```
2. You can access the registry-client via ServerEndpoint/registryBrowser.html;
Attach the link to your registry:
```
registryBrowser.html?registry=http://myRegistryServer...
```