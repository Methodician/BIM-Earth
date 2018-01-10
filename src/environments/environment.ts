// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  mapbox: {
    accessToken: 'pk.eyJ1IjoibWV0aG9kaWNpYW4iLCJhIjoiY2o5cnE2ZnAwMDF2eDJ4cGNjcGw3d3R5ciJ9.lHLDj02OMqPGC51TNbZxDg'
  },
  firebaseConfig: {
    apiKey: "AIzaSyBVhiA0_4TJvz8WmSQr6SE0OsdTNnIFSqM",
    authDomain: "bim-earth-dev.firebaseapp.com",
    databaseURL: "https://bim-earth-dev.firebaseio.com",
    projectId: "bim-earth-dev",
    storageBucket: "bim-earth-dev.appspot.com",
    messagingSenderId: "720001690050"
  }
};
