

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
