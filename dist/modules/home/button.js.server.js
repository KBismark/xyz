
module.exports = function(Breaker){const IMEX = Breaker.UI._imex;
IMEX.pathname = '/modules/myapp@0.1.0/home/button.js';


IMEX.onload=function(){

const UI = Breaker.UI;

const Button = UI.CreateComponent("Button", function () {
   
    this.onCreation = function (args) {
      this.action = args.action;
      }
      this.onServer = function (args,ready) {
        this.action = args.action;
      }
    return (
      function(args,state,Component,Node){return [`<div ${Component.isIndependent?`bee-I="${Node.id='a'}" bee-path=${JSON.stringify(Component.pathname)} bee-N=${JSON.stringify(Component.name)}`:''} class="col-sm-6 smallpad${Component.isIndependent?` bee-${Component.parentId}`:''}"><button key="button" type="button" class="btn btn-primary btn-block" id="${args.id}" onclick="Breaker.select(this,'click')">`,function(args,state){return (args.title)},`</button></div>`]}
    );
});
  

IMEX.export_temporal = {Button}

return IMEX.export_temporal;

}
}