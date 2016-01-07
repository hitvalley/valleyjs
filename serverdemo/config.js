Valley.run({
  "pathConfig": {
    "client": "[root]client/",
    "server": "[root]server/",
    "webPath": "[root]web/",
    "vjsPath": "[root]valleyjs/",
    "conPath": "[webPath]controllers/",
    "viewPath": "[webPath]views/"
  },
  "viewConfig": {
    "viewExt": ".html",
    "encoding": "utf8"
  },
  "client": {
    "root": "/",
    "plugins": [
      "client/third/jquery/jquery-2.1.0.min",
      "client/jquerylib/lib"
    ]
  },
  "server": {
    "root": "<appPath>/"
  },
  "basicConfig": {
    "apiHost": "http://<host>:3007/",
    "linkHost": "http://<host>:3007/"
  },
  "urlRules": {
    "": "demo"
  }
});