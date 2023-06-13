// import * as d from "./index.js";
// console.log(d); 



const B = require("./index");

async function serve() {
  await B.RenderPage({
    write: function (data) {
      console.log(data);
    }
  }, App);
  console.log("------------------------------------HELLOOOOOOOO--------------------------------------------");
}



function App(Breaker) {
  
const { UI } = Breaker;
const IMEX = UI._imex;

IMEX.pathname = "/module/reax@1.1.0/components/button.js";
// let er = 2;

// const Button =  UI.CreateComponent(function () {
//     this.onServer = async function test(resumer) {
//         this.state = {
//             count:6
//         }
//         let value = await come(function (results) {
//             let df = er - 1;
//             setTimeout(function () {
                
//                 results({ status: 1, value: 9+df });
                
              
//             }, 1000 * (3-er));
//             er--;
//         })
//         this.state.count += value;
//         //console.log(this);
//         resumer();
//         // return value+5
//       }

//     return function (args, state) {
//         return ["<button>Clicked ", function (args, state) {
//             return state.count < 16 ? Buttons() : UI.CreateDynamicNode(function (state) {
//                 return state.count+" ok Kbis"
//             },["count"]);
//         }, "times.</button>"];
//     }
// });

// let cvb = 1;
// const Button3 =  UI.CreateComponent(function () {
//     this.onServer = function test(resumer) {
//         let i = cvb; cvb++;
//         this.state = {
//             index:i
//         }
//     //     let value = await come(function (results) {
//     //         setTimeout(function () {
                
//     //             results({ status: 1, value: 9+i });
                
              
//     //         }, 500 * (i));
//     //     })
//     //     //this.state.count += value;
//     //     //console.log(this);
//     //     resumer();
//     //     // return value+5
//         return false;
//       }

//     return function (args, state) {
//         return ["<button>Clicked ", function (args, state) {
//             return `A list item ${args} ${state.index}`;
//         }, "times.</button>"];
//     }
// });

// const Buttons =  UI.CreateComponent(function () {
    
//     this.onServer = async function test(resumer) {
//         this.state = {
//             count: 6,
//             list:UI.CreateList([])
//         }
//         let value = await come(function (results) {
//             setTimeout(function () {
                
//                 results({ status: 1, value: 2 });
                
              
//             }, 1000);
//         })
//         this.state.count += value;
//         this.state.list.insertBefore(0,[1,2,3,4,5,6,7].map((e, idx) => Button3.instance()),{data:null,handler: function (item, idx, data, args, This) {
//             if (item.isComponent) { UI.render(item, idx);}
//         }})
//            // = this.state.list.map((e, idx) => Button3.instance())
//         //console.log(this);
//         resumer();
//         // return value+5
//       }

//     return function (args, state) {
//         return ["<all>Clicked ", function (args, state) {
//             return state.list
//             // UI.CreateList([...state.list, "Okay boy"]).map(null, function (item, idx, data, args, This) {
//             //     if (item.isComponent) { UI.render(item, idx);}
//             // })
//         }, "times.</all>"];
//     }
// });



// const App =  UI.CreateComponent(function () {
    
//     this.onServer = async function test(resumer){
//         let value = await come(function (results) {
//             setTimeout(function () {
//                 resumer();
//               results({ status: 1, value: 9 });
              
//           }, 0);
//         })
//        // console.log('TTTT');
//         return value+5
//       }

//     return function (args, state) {
//         return ["<div><h1> Welcome name!</h1> ", function (args, state) {
//             return Button()
//         }, function (args, state) {
//             return UI.render(Button.instance())
//         }, "</div>"];
//     }
// })




// function come(executer) {
//     let promise = new Promise(function (resolver, rejecter) {
//       executer(function (results) {
//         results.status?resolver(results.value):rejecter(results.value)
//       })
//     })
//     return promise;
// }
  
//   async function test(){
//     let value = await come(function (results) {
//       setTimeout( function(){
//         results({ status: 1, value: 9 });
//       }, 0);
//     })
//     console.log('TTTT');
//     return value+5
//   }

// UI.CreateApp("/", App(), null)



// const {
//     setState,
//     setClass,
//     getInstance,
//     getParentInstance,
//     getPublicData,
//     update,
//   } = Breaker.ui;
  
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
  let u = 1;
  const Row = UI.CreateComponent("row",function () {
    // this.onParentMounting = function ({ index }) {
    //   this.index = index;
    // };
    // this.public = function () {
    //   return {
    //     select: function (selected) {
    //       setClass(
    //         this,
    //         "row",
    //         { danger: selected ? 1 : 0 }
    //       );
    //     }.bind(this),
    //     setIndex: function (newIndex) {
    //       this.index = newIndex;
    //     }.bind(this),
    //   };
    // }
    // this.clearAttrOnDetach(true);
    this.isIndependent = true;
    this.onServer = function (args,ready) {
      this.state = this.initArgs;
      this.state.selected = false;
      setTimeout(() => {
        UI.setDataSource({ url: `/get_dt?name=kbis&id=10098023e-${this.state.id}`, data: this.state });
        ready();
      }, 1000);
      return true;
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
      function(args,state,Component,Node){return [`<tr ${Component.isIndependent?`bee-I="${Node.id='a'}" bee-path="${JSON.stringify(Component.pathname)}" bee-N="${JSON.stringify(Component.name)}"`:''} key="row" class="${Component.isIndependent?`bee-${Component.parentId}`:''} ${{value:state.selected?"danger":"",$dep:["selected"]}.value}"><td class="col-md-1">`,function(args,state){return (state.id)},`</td><td class="col-md-4"><a>`,function(args,state){return (UI.CreateDynamicNode(function (state) { return state.label }, ["label"]))},`</a></td><td class="col-md-1"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></a></td><td class="col-md-6"></tr>`]}
    );
  });
  
  const Button = UI.CreateComponent("button",function () {
   
    this.onServer = function (args) {
        this.action = args.action;
        
    }
    return (
      function(args,state,Component,Node){return [`<div ${Component.isIndependent?`bee-I="${Node.id='c'}" bee-path="${JSON.stringify(Component.pathname)}" bee-N="${JSON.stringify(Component.name)}"`:''} class="col-sm-6 smallpad${Component.isIndependent?` bee-${Component.parentId}`:''}"><button key="button" type="button" class="btn btn-primary btn-block" id="${args.id}">`,function(args,state){return (args.title)},`</button></div>`]}
    );
  });
  
  const Jumbotron = UI.CreateComponent("jumbo",function () {
    this.onServer = function () {
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
          getPublicData(getParentInstance(this))[action.act](action.args);
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
      function(args,state,Component,Node){return [`<div ${Component.isIndependent?`bee-I="${Node.id='e'}" bee-path="${JSON.stringify(Component.pathname)}" bee-N="${JSON.stringify(Component.name)}"`:''} class="jumbotron${Component.isIndependent?` bee-${Component.parentId}`:''}"><div class="row"><div class="col-md-6"><h1>Breaker (keyed)</h1></div><div class="col-md-6"><div class="row">`,function(args,state){return (
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
  this.isIndependent = true;
    this.onServer = function () {
      this.state = {
        jumbotronInstance: Jumbotron.instance(),
        selected: null,
        renderedData: []
        };
        let i = 0;
       const data = this.state.renderedData = buildData(17)
        const rows = new Array(17)
          while (i < 17) {
            rows[i] = Row.instance(data[i]);
            i++;
        }
        this.rowsList = UI.CreateList(rows);
        
    }
    
  
    this.public = function () {
      return {
        create: function (total) {
          let list = this.rowsList;
          let l = list.size(), i = 0;
          if (l) {
            list.remove(0)
          }
          const rows = new Array(total)
          while (i < total) {
            rows[i] = Row.instance();
            i++;
          }
          list.insertBefore(0, rows)
          setState(this, {
            renderList: true,
            renderedData: buildData(total),
          });
        }.bind(this),
    
        append: function (total) {
          let list = this.rowsList;
          let i = 0;
          const rows = new Array(total)
          while (i < total) {
            rows[i] = Row.instance();
            i++;
          }
          list.insertBefore(-1, rows);
          setState(this, {
            renderList: true,
            renderedData: this.state.renderedData.concat(buildData(total)),
          });
        }.bind(this),
    
        clear: function () {
          let list = this.rowsList;
          let l = list.size();
          if (l) {
            list.remove(0);
            setState(this, {
              renderedData: [],
              selected: null,
              removed: [],
            });
          }
         
        }.bind(this),
    
        update: function () {
          let list = this.rowsList;
          let listData = list.get();
          let l = listData.length, i;
          const data = this.state.renderedData;
          for (i = 0; i < l; i += 10) {
            data[i].label = data[i].label + " !!!";
            update(listData[i], data[i]);
          }
        }.bind(this),
    
        swap: function () {
          let list = this.rowsList;
          let listData = list.get();
          let l = listData.length;
          if (l > 998) {
            let row1 = listData[1], row2 = listData[998];
            list.remove(1, 1);
            list.remove(988, 988);
            list.insertBefore(1, row2);
            list.insertBefore(998, row1);
            let data = this.state.renderedData;
            let temp = data[1];
            data[1] = data[998];
            data[998] = temp;
            setState(this, { renderList: false })
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
          let rowIndex = list.get().findIndex((value)=>row==value);
          list.remove(rowIndex, rowIndex);
          let data = this.state.renderedData;
          this.state.renderedData = [...data.slice(0, rowIndex), ...data.slice(rowIndex + 1)];
          setState(this, { renderList: false });
          if (this.state.selected == row) {
            this.state.selected = null;
          }
        }.bind(this),
      }
    };
  
    return (
      function(args,state,Component,Node){return [`<div ${Component.isIndependent?`bee-I="${Node.id='g'}" bee-path="${JSON.stringify(Component.pathname)}" bee-N="${JSON.stringify(Component.name)}"`:''} class="container${Component.isIndependent?` bee-${Component.parentId}`:''}">`,function(args,state){return (UI.render(this.state.jumbotronInstance))},`<table class="table table-hover table-striped test-data"><tbody>`,function(args,state){return (
                  this.rowsList.map(this.state.renderedData, function (row, index, data) {
                  return UI.render(row, {
                        ...data[index],
                        index: index,
                      });
                  })
                )},`</tbody></table><span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></div>`]}
    );
  };
  
  UI.CreateApp(
    "/",
    UI.render(UI.CreateComponent("main",Main).instance()),
   // document.getElementById("page")
    undefined
  );
  
}



serve();
console.log("1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111");