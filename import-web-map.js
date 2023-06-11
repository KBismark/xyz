const path = require('path');
module.exports =() => (
{
  "/modules/myapp@0.1.0/home/button.js": path.join(`${__dirname}/dist/modules`,"/home/button.js"),
  "/modules/myapp@0.1.0/home/row.js": path.join(`${__dirname}/dist/modules`,"/home/row.js"),
  "/modules/myapp@0.1.0/home/jumbo.js": path.join(`${__dirname}/dist/modules`,"/home/jumbo.js"),
  "/modules/myapp@0.1.0": path.join(`${__dirname}/dist/modules`,"/home/front.js"),
})