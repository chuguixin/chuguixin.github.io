(function() {

    var app = {};

    app.Model = function() {
        //记录数据
        var num1 = 0,
            num2 = 0,
            result = 0;

        //对外接口
        this.setVals = function(vals) {
            num1 = vals.num1,
            num2 = vals.num2,
            result = vals.result
        }

        this.getVals = function() {
            return {
                num1: num1,
                num2: num2,
                result: result
            };
        };

        //不再需要观察者模式
    };

    app.View = function() {
        var num1 = document.querySelector('#J_num1'),
            num2 = document.querySelector('#J_num2'),
            calculate = document.querySelector('#J_calculate'),
            result = document.querySelector('#J_result');

        //不再需要持有model
        this.render = function(vals) {
            result.innerHTML = vals.result;
            num1.value = vals.num1;
            num2.value = vals.num2;
        }

        this.init = function() {
            //需要将自己告知presenter
            var presenter = new app.Presenter(this);
            //将事件逻辑交由presenter处理
            num1.onchange = num2.onchange = calculate.onchange = function() {
                presenter.change({
                    num1: num1.value,
                    num2: num2.value,
                    calculate: calculate.value
                });
            };


        }
    }

    app.Presenter = function(view) {

        //处理view和model的对应关系
        var model = new app.Model();
        view.render(model.getVals());

        //处理view的事件
        //计算逻辑
        this.change = function(vals) {
            var calculateType = vals.calculate,
                num1 = vals.num1 = +vals.num1,
                num2 = vals.num2 = +vals.num2;
            if (isNaN(vals.num1) || isNaN(vals.num1)) {
                alert('错误输入！');
                return view.render(model.getVals());
            }

            if (calculateType === 'minus') {
                vals.result = num1 - num2;
            } else if (calculateType === 'time') {
                vals.result = num1 * num2;
            } else if (calculateType === 'divide') {
                vals.result = num1 / num2;
            } else {
                vals.result = num1 + num2;
            }

            //view改变时候，通知model
            model.setVals(vals);
            //model改变时候，通知view
            view.render(model.getVals());
        };
    }

    var view = new app.View();
    view.init();

})();