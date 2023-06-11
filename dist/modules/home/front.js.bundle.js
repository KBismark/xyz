

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



IMEX.pathname = '/modules/myapp@0.1.0';
IMEX.include('/modules/myapp@0.1.0/home/jumbo.js')
IMEX.include('/modules/myapp@0.1.0/home/row.js')
IMEX.onload=function(){
const { Jumbotron } = IMEX.require('/modules/myapp@0.1.0/home/jumbo.js');
const { Row } = IMEX.require('/modules/myapp@0.1.0/home/row.js');

const UI = Breaker.UI;
  
  const random = (max) => Math.round(Math.random() * 1000) % max;
  
  const A = [
    "pretty",
    "large",
    "big",
    "small",
    "tall",
    "short",
    "long",
    "handsome",
    "plain",
    "quaint",
    "clean",
    "elegant",
    "easy",
    "angry",
    "crazy",
    "helpful",
    "mushy",
    "odd",
    "unsightly",
    "adorable",
    "important",
    "inexpensive",
    "cheap",
    "expensive",
    "fancy",
  ];
  const C = [
    "red",
    "yellow",
    "blue",
    "green",
    "pink",
    "brown",
    "purple",
    "brown",
    "white",
    "black",
    "orange",
  ];
  const N = [
    "table",
    "chair",
    "house",
    "bbq",
    "desk",
    "car",
    "pony",
    "cookie",
    "sandwich",
    "burger",
    "pizza",
    "mouse",
    "keyboard",
  ];
  
  let nextId = 1;
  
  const buildData = function (count) {
    const data = new Array(count);
  
    for (let i = 0; i < count; i++) {
      data[i] = {
        id: nextId++,
        label: `${A[random(A.length)]} ${C[random(C.length)]} ${
          N[random(N.length)]
        }`,
      };
    }
  
    return data;
  };
 
  const Main = function () {
    this.onCreation = function () {
        this.state = {
          jumbotronInstance: Jumbotron.instance(),
          selected: null,
          renderedData: []
        };
        this.rowsList = UI.CreateList([]);
      }
      this.onServer = function (args,ready) {
        this.state = {
          jumbotronInstance: Jumbotron.instance(),
          selected: null,
          renderedData: []
        };
        this.rowsList = UI.CreateList([]);
      }
    
      this.public = function () {
        return {
          create: function (total) {
            let list = this.rowsList;
            let l = list.size(), i = 0;
            
            const rows = new Array(total);
            const data = buildData(total);
            //this.state.renderedData = data;
            while (i < total) {
              rows[i] = Row.instance(data[i]);
              i++;
            }
            
            if (l) {
              list.remove(0)
            }
            list.insertBefore(0, rows, { data: null, handler: (row) => { UI.render(row) } });
            // list.insertBefore(0, rows)
            // setState(this, {
            //   renderList: true,
            //   renderedData: buildData(total),
            // });
          }.bind(this),
      
          append: function (total) {
            let list = this.rowsList;
            let i = 0;
            const rows = new Array(total)
            const data = buildData(total);
            while (i < total) {
              rows[i] = Row.instance(data[i]);
              i++;
            }
           
            //this.state.renderedData = this.state.renderedData.concat(data);
            list.insertBefore(-1, rows, { data: null, handler: (row) => { UI.render(row) } });
            
          }.bind(this),
      
          clear: function () {
            let list = this.rowsList;
            let l = list.size();
            if (l) {
              list.remove(0);
              //this.state.renderedData = [];
              this.state.selected = null;
              // setState(this, {
              //   renderedData: [],
              //   selected: null,
              //   removed: [],
              // });
            }
           
          }.bind(this),
      
          update: function () {
            let list = this.rowsList;
            let listData = list.get();
            let l = listData.length, i;
            //const data = this.state.renderedData;
            for (i = 0; i < l; i += 10) {
              UI.getPublicData(listData[i]).updateLabel();
              // data[i].label = data[i].label + " !!!";
              // update(listData[i], data[i]);
            }
          }.bind(this),
      
          swap: function () {
            let list = this.rowsList;
            let listData = list.get();
            let l = listData.length;
            if (l > 998) {
              let row1 = listData[1], row2 = listData[998];
              list.remove(1, 1);
              list.remove(997, 997);
              list.insertBefore(1, row2);
              list.insertBefore(998, row1);
              // let data = this.state.renderedData;
              // let temp = data[1];
              // data[1] = data[998];
              // data[998] = temp;
              // setState(this, { renderList: false })
            }
          }.bind(this),
      
          select: function (row) {
            if (row == this.state.selected) {
              return;
            }
            var previous = this.state.selected;
            this.state.selected = row;
            if (previous) {
              UI.getPublicData(previous).select(false);
            }
            UI.getPublicData(row).select(true);
          }.bind(this),
          remove: function (row) {
            let list = this.rowsList;
            let rowIndex = list.get().findIndex((value) => row == value);
            list.remove(rowIndex, rowIndex);
            //let data = this.state.renderedData;
            //this.state.renderedData = [...data.slice(0, rowIndex), ...data.slice(rowIndex + 1)];
            if (this.state.selected == row) {
              this.state.selected = null;
            }
          }.bind(this),
        }
      };
  
    return (
      Breaker.create(()=>'<div class="container"><brk></brk><table class="table table-hover table-striped test-data"><tbody><tr></tr></tbody></table><span aria-hidden="true" class="preloadicon glyphicon glyphicon-remove"></span></div>',
function(args,_$,_$ev,_$id,_$dp,_$set){
let state = this.state,_$fn;
return [{}]},{'0':function(args,state){return (UI.render(this.state.jumbotronInstance))},'1':function(args,state){return (
                  this.rowsList.map(null,function(){})
                )},length:2},
{},function(_$){return {'0':_$.firstChild,'1':_$.childNodes[1].firstChild.firstChild,}}, this)
    );
  };
  
  UI.CreateApp(
    "/",
   // UI.render(UI.CreateComponent('main',Main).instance()),
   UI.CreateComponent('main',Main).instance(),
    typeof document!='undefined'? document.getElementById("page"):null
  );
  
  
IMEX.export_temporal = {}

IMEX.export = IMEX.export_temporal;
IMEX.export_temporal=null;


}
