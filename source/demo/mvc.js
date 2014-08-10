(function() {

    var mvc = {};

    mvc.Model = function() {
        var num1 = 0,
            num2 = 0,
            calculateType = '',
            result = 0;

        var observers = [];

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

        this.register = function(observer) {
            observers.push(observer);
        }

        this.notify = function() {
            for (var i = 0, item; item = observers[i]; i++) {
                item.render && item.render(this);
            }
        }
    };

    mvc.View = function(controller) {
        var num1 = document.querySelector('#J_num1'),
            num2 = document.querySelector('#J_num2'),
            calculate = document.querySelector('#J_calculate'),
            result = document.querySelector('#J_result');

        num1.onchange = num2.onchange = calculate.onchange = function() {
            controller.change({
                num1: num1.value,
                num2: num2.value,
                calculate: calculate.value
            });
        };

        this.render = function(model) {
            var vals = model.getVals();
            result.innerHTML = vals.result;
            num1.value = vals.num1;
            num2.value = vals.num2;
        }
    }

    mvc.Controller = function() {
        var model, view;

        this.init = function() {
            model = new mvc.Model;
            view = new mvc.View(this);
            model.register(view);
            model.notify();
        };

        this.change = function(vals) {
            vals.num1 = +vals.num1;
            vals.num2 = +vals.num2;
            if (isNaN(vals.num1) || isNaN(vals.num1)) {
                alert('错误输入！');
                return model.notify();
            }
            model.calculate(vals);
            model.notify();
        };
    }


    var controller = new mvc.Controller;
    controller.init();

})();
