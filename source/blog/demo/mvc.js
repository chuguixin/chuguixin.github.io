(function() {

    var mvc = {};

    mvc.Model = function() {
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

        //观察者模式
        var observers = [];

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
        //获取HTML引用
        var num1 = document.querySelector('#J_num1'),
            num2 = document.querySelector('#J_num2'),
            calculate = document.querySelector('#J_calculate'),
            result = document.querySelector('#J_result');

        //传递用户交互给controller
        num1.onchange = num2.onchange = calculate.onchange = function() {
            controller.change({
                num1: num1.value,
                num2: num2.value,
                calculate: calculate.value
            });
        };

        //暴露接口给model
        this.render = function(model) {
            var vals = model.getVals();
            result.innerHTML = vals.result;
            num1.value = vals.num1;
            num2.value = vals.num2;
        }
    }

    mvc.Controller = function() {
        var model, view;

        //初始化model和view
        this.init = function() {
            model = new mvc.Model;
            view = new mvc.View(this);
            model.register(view);
            model.notify();
        };

        //处理用户交互
        //ps.像model中处理了计算逻辑，我认为，input的合法性检验是可以被model和controller任何一个接受的
        //业务逻辑
        this.change = function(vals) {
            var calculateType = vals.calculate,
                num1 = vals.num1 = +vals.num1,
                num2 = vals.num2 = +vals.num2;
            if (isNaN(vals.num1) || isNaN(vals.num1)) {
                alert('错误输入！');
                return model.notify();
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

            model.setVals(vals);
            model.notify();
        };
    }


    var controller = new mvc.Controller;
    controller.init();

})();
