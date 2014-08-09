(function() {

    var app = {};

    app.Model = function() {
        var num1 = 0,
            num2 = 0,
            calculateType = '',
            result = 0;

        this.calculate = function(vals) {
            calculateType = vals.calculate;
            num1 = vals.num1;
            num2 = vals.num2;

            if (calculateType === 'minus') {
                result = num1 - num2;
            } else if (calculateType === 'time') {
                result = num1 * num2;
            } else if (calculateType === 'divide') {
                result = num1 / num2;
            } else {
                result = num1 + num2;
            }
        };

        this.getVals = function() {
            return {
                num1: num1,
                num2: num2, 
                result: result
            };
        };
    };

    app.View = function() {
        var num1 = document.querySelector('#J_num1'),
            num2 = document.querySelector('#J_num2'),
            calculate = document.querySelector('#J_calculate'),
            result = document.querySelector('#J_result');

        this.render = function(vals) {
            result.innerHTML = vals.result;
            num1.value = vals.num1;
            num2.value = vals.num2;
        }

        this.init = function() {
            var presenter = new app.Presenter(this);

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

        var model = new app.Model();

        view.render(model.getVals());

        this.change = function(vals) {
            vals.num1 = +vals.num1;
            vals.num2 = +vals.num2;
            if (isNaN(vals.num1) || isNaN(vals.num1)) {
                alert('错误输入！');
                return view.render(model.getVals());
            }
            model.calculate(vals);
            view.render(model.getVals());
        };
    }

    var view = new app.View();
    view.init();

})();