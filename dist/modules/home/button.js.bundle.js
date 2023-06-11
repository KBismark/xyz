

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


