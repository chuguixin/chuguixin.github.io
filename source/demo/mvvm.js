(function() {
    var mvvm = {};

    mvvm.init = function(opt) {
        return new mvvm.VM(opt);
    }

    mvvm.VM = function(opt) {
        var m2v = this.m2v = {},
            view = this.view = document.querySelector(opt.selector),
            model = this.model = opt.model,
            self = this;

        this.renderNode = renderNode;
        this.renderDOM = renderDOM;

        for (var key in model) {
            m2v[key] = [];
        }

        this.renderDOM(view);

        view.addEventListener('change', function(event) {
            var key = event.target.getAttribute('mvvm-value');
            model[key] = event.target.value;
        }, true);

        Object.observe(this.model, function(changes) {
            changes.forEach(function(change) {
                m2v[change.name].forEach(function(warp) {
                    self.renderNode(warp);
                    var calculateType = model.calculate;
                    if (calculateType === 'minus') {
                        model.result = model.num1 - model.num2;
                    } else if (calculateType === 'time') {
                        model.result = model.num1 * model.num2;
                    } else if (calculateType === 'divide') {
                        model.result = model.num1 / model.num2;
                    } else {
                        model.result = Number(model.num1) + Number(model.num2);
                    }
                });
            });
        });
    }



    function formatHtml(tmpl, model) {
        var splitArray1 = tmpl.split('{{');
        if (splitArray1.length < 2) {
            return tmpl;
        }
        var str = '';
        splitArray1.forEach(function(item) {
            if (item.indexOf('}}') > 0) {
                var temp = item.split('}}');
                var key = temp[0].trim();
                str += model[key] + temp[1];
            } else {
                str += item;
            }
        });
        return str;
    }

    function renderNode(node, type, owner) {
        var self = this;
        owner = owner ? owner : node;
        if (type == 'new') {
            var key;
            owner.originalTmpl = node.nodeType == 2 ? node.value : node.textContent;
            owner.originalTmpl.split('{{').forEach(function(item) {
                item.indexOf('}}') > 0 && (key = item.split('}}')[0]) && (self.m2v[key] || (self.m2v[key] = [])).push(owner);
            });
            node.value = key;
        }
        if (node.nodeType == 3) {
            node.textContent = formatHtml(node.originalTmpl, self.model);
        } else {
            owner.value = formatHtml(owner.originalTmpl, self.model);
        }
    }

    function renderDOM(dom) {
        for (var i = 0, item; item = dom.attributes[i]; i++) {
            if (item.nodeName.toLowerCase().indexOf('mvvm-value') === 0) {
                this.renderNode(item, 'new', dom);
            }
        }
        for (var i = 0, item2; item2 = dom.childNodes[i]; i++) {
            if (item2.nodeType === 1) {
                this.renderDOM(item2)
            } else {
                this.renderNode(item2, 'new');
            }
        }
    }


    var vm = mvvm.init({
        model: {
            num1: 0,
            num2: 0,
            result: 0,
            calculate: 'plus'
        },
        selector: '#J_mvvmContainer'
    });

})();
