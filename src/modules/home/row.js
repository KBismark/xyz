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
    <view>
      <tr key="row" $class={{value:state.selected?"danger":"",$dep:["selected"]}}>
        <td class="col-md-1">
          <>{state.id}</>
        </td>
        <td class="col-md-4">
          <a onClick={function (e, This) {
            UI.getPublicData(UI.getParentInstance(This)).select(UI.getInstance(This));
          }}>
            <>{UI.CreateDynamicNode(function (state) { return state.label }, ["label"])}</>
          </a>
        </td>
        <td class="col-md-1">
          <a onClick={function (e, This) {
            UI.getPublicData(UI.getParentInstance(This)).remove(UI.getInstance(This));
          }}>
            <span class="glyphicon glyphicon-remove" aria-hidden="true" />
          </a>
        </td>
        <td class="col-md-6"></td>
      </tr>
    </view>
  );
});


export {Row}