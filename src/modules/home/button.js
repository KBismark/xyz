
const UI = Breaker.UI;

const Button = UI.CreateComponent("Button", function () {
   
    this.onCreation = function (args) {
      this.action = args.action;
      }
      this.onServer = function (args,ready) {
        this.action = args.action;
      }
    return (
      <view>
        <div class="col-sm-6 smallpad">
          <button
            key="button"
            type="button"
            class="btn btn-primary btn-block"
            id={args.id}
            onClick={function (e, This) {
              UI.getPublicData(UI.getParentInstance(This)).action(This.action);
            }}
          >
            <>{args.title}</>
          </button>
        </div>
      </view>
    );
});
  

export {Button}