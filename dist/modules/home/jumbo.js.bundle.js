

IMEX.pathname = '/modules/myapp@0.1.0/home/button.js';


!function(){



const UI = Breaker.UI;

const Button = UI.CreateComponent("Button", function () {
   
    this.onCreation = function (args) {
      this.action = args.action;
      }
      this.onServer = function (args,ready) {
        this.action = args.action;
      }
    return (
      Breaker.create(()=>'<div class="col-sm-6 smallpad"><button key="button" type="button" class="btn btn-primary btn-block"><brk></brk></button></div>',
function(args,_$,_$ev,_$id,_$dp,_$set){
let state = this.state,_$fn;
let _a=_$.firstChild,$_a;
_a.setAttribute('id',args.id)
$_a=_$ev.bind({key:"button",ev:'click',id:_$id})
              _a.addEventListener('click',$_a,false)
return [{"button":{node:_a,$events:{click:function (e, This) { UI.getPublicData(UI.getParentInstance(This)).action(This.action); },},evc:{click:$_a,}},}]},{'0':function(args,state){return (args.title)},length:1},
{},function(_$){return {'0':_$.firstChild.firstChild,}}, this)
    );
});
  

IMEX.export_temporal = {Button}

IMEX.export = IMEX.export_temporal;
IMEX.export_temporal = null;



}();





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
      Breaker.create(()=>'<div class="jumbotron"><div class="row"><div class="col-md-6"><h1>Breaker (keyed)</h1></div><div class="col-md-6"><div class="row"><brk></brk></div></div></div></div>',
function(args,_$,_$ev,_$id,_$dp,_$set){
let state = this.state,_$fn;
return [{}]},{'0':function(args,state){return (
                    this.state.buttons.map(
                        this.tempData,
                        function (e, i, data) {
                          return UI.render(e, data[i]);
                        },
                        this
                      )
                  )},length:1},
{},function(_$){return {'0':_$.firstChild.childNodes[1].firstChild.firstChild,}}, this)
    );
});
  

IMEX.export_temporal = {Jumbotron}

IMEX.export = IMEX.export_temporal;
IMEX.export_temporal=null;


}
