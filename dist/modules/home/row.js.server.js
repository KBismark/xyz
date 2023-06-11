
module.exports = function(Breaker){const IMEX = Breaker.UI._imex;
IMEX.pathname = '/modules/myapp@0.1.0/home/row.js';


IMEX.onload=function(){
const UI = Breaker.UI;

const Row = UI.CreateComponent('row',function () {
    this.onCreation = function () {
        this.state = this.initArgs;
        this.state.selected = false;
    }
    this.onServer = function (args,ready) {
      this.state = this.initArgs;
      this.state.selected = false;
  }
    this.public = function () {
        return {
            select: function (selected) {
                this.state.selected = selected;
            }.bind(this),
            updateLabel: function () {
                this.state.label += " !!!";
            }.bind(this),
        };
    }
  
  return (
    function(args,state,Component,Node){return [`<tr ${Component.isIndependent?`bee-I="${Node.id='d'}" bee-path=${JSON.stringify(Component.pathname)} bee-N=${JSON.stringify(Component.name)}`:''} key="row" class="${Component.isIndependent?`bee-${Component.parentId}`:''} ${{value:state.selected?"danger":"",$dep:["selected"]}.value}"><td class="col-md-1">`,function(args,state){return (state.id)},`</td><td class="col-md-4"><a onclick="Breaker.select(this,'click')">`,function(args,state){return (UI.CreateDynamicNode(function (state) { return state.label }, ["label"]))},`</a></td><td class="col-md-1"><a onclick="Breaker.select(this,'click')"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>`]}
  );
});


IMEX.export_temporal = {Row}

return IMEX.export_temporal;

}
}