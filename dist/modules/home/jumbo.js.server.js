
module.exports = function(Breaker){const IMEX = Breaker.UI._imex;
IMEX.pathname = '/modules/myapp@0.1.0/home/jumbo.js';
IMEX.include('/modules/myapp@0.1.0/home/button.js')
IMEX.onload=function(){
const {Button} = IMEX.require('/modules/myapp@0.1.0/home/button.js');


const UI = Breaker.UI;

const Jumbotron = UI.CreateComponent('jumbo',function () {
    this.onCreation = function () {
        this.state = {
          buttons: UI.CreateList([
            Button.instance(),
            Button.instance(),
            Button.instance(),
            Button.instance(),
            Button.instance(),
            Button.instance(),
          ]),
        };
      }
      this.onServer = function (args,ready) {
        this.state = {
          buttons: UI.CreateList([
            Button.instance(),
            Button.instance(),
            Button.instance(),
            Button.instance(),
            Button.instance(),
            Button.instance(),
          ]),
          };
      }
      this.public = function () {
        return {
          action: function (action) {
            UI.getPublicData(UI.getParentInstance(this))[action.act](action.args);
          }.bind(this),
        };
      };
  
   
  
    this.tempData = [
      {
        id: "run",
        title: "Create 1,000 rows",
        action: { act: "create", args: 1000 },
      },
      {
        id: "runlots",
        title: "Create 10,000 rows",
        action: { act: "create", args: 10000 },
      },
      {
        id: "add",
        title: "Append 1,000 rows",
        action: { act: "append", args: 1000 },
      },
      { id: "update", title: "Update every 10th row", action: { act: "update" } },
      { id: "clear", title: "Clear", action: { act: "clear" } },
      { id: "swaprows", title: "Swap Rows", action: { act: "swap" } },
    ];
    return (
      function(args,state,Component,Node){return [`<div ${Component.isIndependent?`bee-I="${Node.id='c'}" bee-path=${JSON.stringify(Component.pathname)} bee-N=${JSON.stringify(Component.name)}`:''} class="jumbotron${Component.isIndependent?` bee-${Component.parentId}`:''}"><div><div class="col-md-6"><h1>Breaker (keyed)</h1></div><div class="col-md-6"><div>`,function(args,state){return (
                    this.state.buttons.map(
                        this.tempData,
                        function (e, i, data) {
                          return UI.render(e, data[i]);
                        },
                        this
                      )
                  )},`</div></div></div></div>`]}
    );
});
  

IMEX.export_temporal = {Jumbotron}

return IMEX.export_temporal;
}
}