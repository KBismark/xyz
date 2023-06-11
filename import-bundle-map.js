const path = require('path')
const { getPath } = require('import-for-web')
const deps = {value:{dependencyMap:{},dependentsMap:{}}};
 const Map1 = 
{
  [`${path.join(`${__dirname}/dist/modules`,"/home/button.js")}`]: [],

  [`${path.join(`${__dirname}/dist/modules`,"/home/front.js")}`]: [
  path.join(`${__dirname}/dist/modules`,"/home/row.js"),
  path.join(`${__dirname}/dist/modules`,"/home/jumbo.js")
],

  [`${path.join(`${__dirname}/dist/modules`,"/home/jumbo.js")}`]: [
  path.join(`${__dirname}/dist/modules`,"/home/button.js")
],

  [`${path.join(`${__dirname}/dist/modules`,"/home/row.js")}`]: [],

}
const Map2 = {
  [`${path.join(`${__dirname}/dist/modules`,"/home/button.js")}`]: [
  path.join(`${__dirname}/dist/modules`,"/home/jumbo.js")
],

  [`${path.join(`${__dirname}/dist/modules`,"/home/front.js")}`]: [],

  [`${path.join(`${__dirname}/dist/modules`,"/home/jumbo.js")}`]: [
  path.join(`${__dirname}/dist/modules`,"/home/front.js")
],

  [`${path.join(`${__dirname}/dist/modules`,"/home/row.js")}`]: [
  path.join(`${__dirname}/dist/modules`,"/home/front.js")
],

}
deps.value.dependencyMap = {
  ...deps.value.dependencyMap, ...Map1
}
deps.value.dependentsMap = {
  ...deps.value.dependentsMap, ...Map2
}
module.exports = deps.value