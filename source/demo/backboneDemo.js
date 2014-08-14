(function() {

    //这里是Model类
    var Model = Backbone.Model.extend({
        defaults: {
            num1: 0,
            num2: 0,
            result: 0
        }
    });

    //这里是View类？
    //可以看到，这里有交互处理的逻辑
    var View = Backbone.View.extend({
        initialize: function() {
            this.domCache = {};
            this.domCache.num1 = this.el.querySelector('#J_num1');
            this.domCache.num2 = this.el.querySelector('#J_num2');
            this.domCache.calculate = this.el.querySelector('#J_calculate');
            this.domCache.result = this.el.querySelector('#J_result');

            this.render();
            this.model.bind('change', this.render.bind(this));
        },
        el: '#J_view',
        render: function() {
            var vals = this.model.toJSON();
            var domCache = this.domCache;
            domCache.result.innerHTML = vals.result;
            domCache.num1.value = vals.num1;
            domCache.num2.value = vals.num2;
        },
        events: {
            "change input": "change",
            "change select": "change"
        },
        change: function() {
            //这一部分应该是controller的责任
            var domCache = this.domCache;

            var vals = {},
                calculateType = domCache.calculate.value,
                num1 = vals.num1 = +domCache.num1.value,
                num2 = vals.num2 = +domCache.num2.value;

            if (isNaN(vals.num1) || isNaN(vals.num1)) {
                alert('错误输入！');
                return this.render();
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

            this.model.set(vals)
        }
    });

    //引导初始化，这时候的view更像是controller
    var view = new View({
        model: new Model
    });
})();
