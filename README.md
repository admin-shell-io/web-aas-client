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
2. Web-server for the web-aas-client: You need any common Web Server to deploy 
this project e.g.: Apache2 or IIS.
4. Web Browser: You can use any modern web browser to use the web-aas-client
5. CORS-Plugin: Due to the mentioned restrictions you might need a CORS-Plugin
for your browser.

# Usage
1. You can access the AAS-client via ServerEndpoint/aasBrowser.html; Attach the
link to your AAS: 
```
aasBrowser.html?endpoint=http://myAASServer/../aasEndpoint
```
2. You can access the registry-client via ServerEndpoint/registryBrowser.html;
Attach the link to your registry:
```
registryBrowser.html?endpoint=http://myRegistryServer/.../registstryEndpoint
```

# Examples
You can view the AAS on the AASX Server: 
[https://admin-shell-io.com:5001](https://admin-shell-io.com:5001)

To access the first AAS on that server with idShort Festo_3S7PM0CP4BD by web-aas-client please click:
[https://admin-shell-io.com/web-aas-client/aasBrowser.html?endpoint=https://admin-shell-io.com:51411/aas/Festo\_3S7PM0CP4BD](https://admin-shell-io.com/web-aas-client/aasBrowser.html?endpoint=https://admin-shell-io.com:51411/aas/Festo_3S7PM0CP4BD)
