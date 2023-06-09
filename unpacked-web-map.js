const path = require('path');
module.exports = ()=>(
{
  "modules/myapp-0.1.0-1-test3.js": path.resolve(`${__dirname}/dist/modules`,".\\home\\breaker1\\test3.js"),
  "modules/myapp-0.1.0-2-wj1.js": path.resolve(`${__dirname}/dist/modules`,".\\home\\wj1.js"),
  "modules/myapp-0.1.0-3-wj1.js": path.resolve(`${__dirname}/dist/modules`,".\\wj1.js"),
  "modules/myapp-0.1.0-4-wj2.js": path.resolve(`${__dirname}/dist/modules`,".\\home\\wj2.js"),
  "modules/myapp-0.1.0-5-test3.js": path.resolve(`${__dirname}/dist/modules`,".\\breaker1\\test3.js"),
  "modules/myapp-0.1.0-6-wj2.js": path.resolve(`${__dirname}/dist/modules`,".\\wj2.js"),
}
)