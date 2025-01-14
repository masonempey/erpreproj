self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "rootMainFilesTree": {},
  "pages": {
    "/": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/index.js"
    ],
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/booking/barber": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/booking/barber.js"
    ],
    "/booking/confirmation": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/booking/confirmation.js"
    ],
    "/booking/datetime": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/booking/datetime.js"
    ],
    "/booking/info": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/booking/info.js"
    ],
    "/booking/payment": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/booking/payment.js"
    ],
    "/booking/service": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/booking/service.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];