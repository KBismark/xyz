
module.exports = function(Breaker){const IMEX = Breaker.UI._imex;
IMEX.pathname = '/modules/myapp@0.1.0/home/front.js';


IMEX.onload=function(){
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
      function(args,state,Component,Node){return [`<tr ${Component.isIndependent?`bee-I="${Node.id='a'}" bee-path=${JSON.stringify(Component.pathname)} bee-N=${JSON.stringify(Component.name)}`:''} key="row" class="${Component.isIndependent?`bee-${Component.parentId}`:''} ${{value:state.selected?"danger":"",$dep:["selected"]}.value}"><td class="ol-md-1">`,function(args,state){return (state.id)},`</td><td class="ol-md-4"><a onclick="Breaker.select(this,'click')">`,function(args,state){return (UI.CreateDynamicNode(function (state) { return state.label }, ["label"]))},`</a></td><td class="ol-md-1"><a onclick="Breaker.select(this,'click')"><span class="lyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="ol-md-6"></td></tr>`]}
    );
  });
  
  const Button = UI.CreateComponent("Button",function () {
   
    this.onCreation = function (args) {
      this.action = args.action;
      }
      this.onServer = function (args,ready) {
        this.action = args.action;
      }
    return (
      function(args,state,Component,Node){return [`<div ${Component.isIndependent?`bee-I="${Node.id='b'}" bee-path=${JSON.stringify(Component.pathname)} bee-N=${JSON.stringify(Component.name)}`:''} class="ol-sm-6 smallpad${Component.isIndependent?` bee-${Component.parentId}`:''}"><button key="button" type="button" class="tn btn-primary btn-block" id="${args.id}" onclick="Breaker.select(this,'click')">`,function(args,state){return (args.title)},`</button></div>`]}
    );
  });
  
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
      function(args,state,Component,Node){return [`<div ${Component.isIndependent?`bee-I="${Node.id='c'}" bee-path=${JSON.stringify(Component.pathname)} bee-N=${JSON.stringify(Component.name)}`:''} class="umbotron${Component.isIndependent?` bee-${Component.parentId}`:''}"><div><div class="ol-md-6"><h1>Breaker (keyed)</h1></div><div class="ol-md-6"><div>`,function(args,state){return (
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
            list.insertBefore(0, rows, { data: null, handler: (row) => { render(row) } });
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
            list.insertBefore(-1, rows, { data: null, handler: (row) => { render(row) } });
            
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
              getPublicData(listData[i]).updateLabel();
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
              getPublicData(previous).select(false);
            }
            getPublicData(row).select(true);
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
      function(args,state,Component,Node){return [`<div ${Component.isIndependent?`bee-I="${Node.id='d'}" bee-path=${JSON.stringify(Component.pathname)} bee-N=${JSON.stringify(Component.name)}`:''} class="ontainer${Component.isIndependent?` bee-${Component.parentId}`:''}">`,function(args,state){return (UI.render(this.state.jumbotronInstance))},`<table class="able table-hover table-striped test-data"><tbody>`,function(args,state){return (
                  this.rowsList.map(null,function(){})
                )},`</tbody></table><span class="reloadicon glyphicon glyphicon-remove" aria-hidden="true"></span></div>`]}
    );
  };
  
  UI.CreateApp(
    "/",
    UI.render(UI.CreateComponent('main',Main).instance()),
    typeof document!='undefined'? document.getElementById("page"):null
  );
  
  
IMEX.export_temporal = {}

return IMEX.export_temporal;

}
}