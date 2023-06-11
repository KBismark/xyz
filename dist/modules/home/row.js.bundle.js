

IMEX.pathname = '/modules/myapp@0.1.0/home/row.js';


!function(){


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
    Breaker.create(()=>'<tr key="row"><td class="col-md-1"><brk></brk></td><td class="col-md-4"><a><brk></brk></a></td><td class="col-md-1"><a><span aria-hidden="true" class="glyphicon glyphicon-remove"></span></a></td><td class="col-md-6"></td></tr>',
function(args,_$,_$ev,_$id,_$dp,_$set){
let state = this.state,_$fn;
let _a=_$,$_a;
_$fn=_$dp['row1'];_$fn.apply(this,[_a,state,_$set,_$fn,"row"])
let _b=_$.childNodes[1].firstChild,$_b;
$_b=_$ev.bind({key:2,ev:'click',id:_$id})
              _b.addEventListener('click',$_b,false)
let _c=_$.childNodes[2].firstChild,$_c;
$_c=_$ev.bind({key:3,ev:'click',id:_$id})
              _c.addEventListener('click',$_c,false)
return [{"row":{node:_a,$events:{},evc:{}},2:{node:_b,$events:{click:function (e, This) { UI.getPublicData(UI.getParentInstance(This)).select(UI.getInstance(This)); },},evc:{click:$_b,}},3:{node:_c,$events:{click:function (e, This) { UI.getPublicData(UI.getParentInstance(This)).remove(UI.getInstance(This)); },},evc:{click:$_c,}},}]},{'0':function(args,state){return (state.id)},'1':function(args,state){return (UI.CreateDynamicNode(function (state) { return state.label }, ["label"]))},length:2},
{'row1':function(el,state,set,fn,nme){let a={value:state.selected?"danger":"",$dep:["selected"]};el.setAttribute('class',`${a.value}`);if(set){fn.key=nme;fn.$dep=a.$dep||[]}},},function(_$){return {'0':_$.firstChild.firstChild,'1':_$.childNodes[1].firstChild.firstChild,}}, this)
  );
});


IMEX.export_temporal = {Row}

IMEX.export = IMEX.export_temporal;
IMEX.export_temporal = null;



}();


