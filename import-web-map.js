const path = require('path');
module.exports =() => (
{
  '/modules/myapp@0.1.0': path.resolve(`${__dirname}`,'./src/modules/home/front.js'),
  "/modules/myapp@0.1.0/home/front.js": path.join(`${__dirname}/dist/modules`,"/home/front.js"),
  "/modules/myapp@0.1.0/home.js": path.join(`${__dirname}/dist/modules`,"/home.js"),
})