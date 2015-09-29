---
layout: post
title: "MVC vs MVP vs MVVM"
date: 2014-08-11 16:59
comments: true
categories: 
- JavaScript
tags:
- MVC
- MVP
- MVVM
- JavaScript
---

先说一下本文讨论什么吧。主要讨论一下MV\*的原理，以及MV\*与JavaScript的结合。*不*讨论常见的Framework的横向对比。所以，隐约觉得，又是一篇枯燥的长文。

为什么要写这么一篇文章？一年前毕业，正式成为一个全职的前端选手，了解到JavaScript中的MV\*类的框架，不明觉厉，碍于水平限制一直没有过多了解。近几个月，断断续续用Backbone/Angular/Ractive写过一些小的Demo，使用之后的感觉是仿佛在按照Framework要求的API在拼凑，而对所谓的MV\*的每一部分没有清晰的认识，最终结果是，使用过一段时间后很容易忘记API，忘记API之后它们就成了陌生的框架。当然这个问题与我使用的深度有很大很直接的关系，但同时我认为也与自身缺少对原理的认知有关系。所以，花了一些时间学习了一下原理，稍作记录。

<!-- more -->

世界上本来就有设计模式，用的人多了，设计模式就有了名字。在我查找各种相关文献资料的过程中，我发现，即使对MVC这种非常传统的模式进行描述，各家的说法虽大同小异，但也众说纷纭。我选择了接受最主流的说法，并尽量用被广泛接受的方式实现代码描述。

另外，在每种模式下，我会实现一个非常简单的四则运算表达式的应用，以使抽象的描述能具象的落地到代码上。这个例子，大概效果可以[先看一下](http://jser.it/blog/demo/mvc.html)。就酱，从MVC说起。

## MVC

首先，历史背景自行脑补。下面是引自[wikipedia对MVC的简介](http://zh.wikipedia.org/wiki/MVC)：
>MVC模式（Model-View-Controller）是软件工程中的一种软件架构模式，把软件系统分为三个基本部分：模型（Model）、视图（View）和控制器（Controller）。

同时，wikipedia给出了各个components之间的作用关系：
>除了将应用程序划分为三种组件，模型 - 视图 - 控制器（MVC）设计定义它们之间的相互作用。[2]

>模型（Model） 用于封装与应用程序的业务逻辑相关的数据以及对数据的处理方法。“模型”有对数据直接访问的权力，例如对数据库的访问。“模型”不依赖“视图”和“控制器”，也就是说，模型不关心它会被如何显示或是如何被操作。但是模型中数据的变化一般会通过一种刷新机制被公布。为了实现这种机制，那些用于监视此模型的视图必须事先在此模型上注册，从而，视图可以了解在数据模型上发生的改变。（比较：观察者模式（软件设计模式））

>视图（View）能够实现数据有目的的显示（理论上，这不是必需的）。在视图中一般没有程序上的逻辑。为了实现视图上的刷新功能，视图需要访问它监视的数据模型（Model），因此应该事先在被它监视的数据那里注册。

>控制器（Controller）起到不同层面间的组织作用，用于控制应用程序的流程。它处理事件并作出响应。“事件”包括用户的行为和数据模型上的改变。

另外，[这篇论文](http://heim.ifi.uio.no/~trygver/1979/mvc-2/1979-12-MVC.pdf)应该是较早较正式提出了MVC的概念，尝试阅读一下，与wikipedia给出的描述，差异不大。

大师Addy Osmani在他著名的《Learning JavaScript Design Patterns》（本书英文版为开源的，国内有中文翻译版）中也对传统的Smalltalk-80 MVC有[如下描述](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#detailmvcmvp)：
>A Model represented domain-specific data and was ignorant of the user-interface (Views and Controllers). When a model changed, it would inform its observers.

>A View represented the current state of a Model. The Observer pattern was used for letting the View know whenever the Model was updated or modified.

>Presentation was taken care of by the View, but there wasn't just a single View and Controller - a View-Controller pair was required for each section or element being displayed on the screen.

>The Controllers role in this pair was handling user interaction (such as key-presses and actions e.g. clicks), making decisions for the View.

同时，他也曾经在smashingmagazine发表过一篇很有实战意义的文章，[Journey Through The JavaScript MVC Jungle](http://www.smashingmagazine.com/2012/07/27/journey-through-the-javascript-mvc-jungle/)，描述如下,相差无几：

>Models represent the domain-specific knowledge and data in an application. Think of this as being a ‘type’ of data you can model — like a User, Photo or Note. Models should notify anyone observing them about their current state (e.g Views).

>Views are typically considered the User-interface in an application (e.g your markup and templates), but don’t have to be. They should know about the existence of Models in order to observe them, but don’t directly communicate with them.

>Controllers handle the input (e.g clicks, user actions) in an application and Views can be considered as handling the output. When a Controller updates the state of a model (such as editing the caption on a Photo), it doesn’t directly tell the View. This is what the observing nature of the View and Model relationship is for.

从上面的描述中，我尝试提取一些对实现代码描述有意义的关键词：

1. model是一个数据对象
2. view是一个不应该有逻辑的对象，展示model的状态
3. controller负责处理用户交互，修改Model
4. Observer模式，View观察Model

那么落到代码上，我们要实现一个上面提到的很简单的例子。首先实现一个model，按照我的理解，需要有如下功能：

1. 记录数据：两个被运算的数字，一个结果
2. 需要实现观察者模式，在数据修改后notify
3. 暴露接口，供view使用

所以，代码应该如下：

```javascript Model in MVC
mvc.Model = function() {
    //记录数据
    var num1 = 0,
        num2 = 0,
        result = 0;

    //对外接口
    this.setVals = function(vals){
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
```

而view需要做的是：

1. 取得UI的元素，与HTML产生联系
2. 把用户交互交给controller
3. 暴漏提供给model notify的接口

代码如下：
```html View in MVC
<div>
    <input id="J_num1">
    <select id="J_calculate">
        <option value="plus">+</option>
        <option value="minus">-</option>
        <option value="time">*</option>
        <option value="divide">/</option>
    </select>
    <input id="J_num2">
    <span>=</span>
    <span id="J_result">value</span>
</div>
```

```javascript View in MVC
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
```

最后，是controller，相比其它mv\*中的\*，mvc中的controller简单一些：

1. 初始化并将view注册到model
2. 处理view传递过来的用户交互
3. 业务逻辑（也就是具体运算，关于这个，我认为部分放到model也可接受）

所以，代码如下：

```javascript Controller in MVC
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
```

最后，我们的初始化可以从controller开始：

```javascript MVC init
var controller = new mvc.Controller;
controller.init();
```

最终代码在[这里](http://jser.it/blog/demo/mvc.html)。

从上面，我们可以看到，MVC的模式的确帮助我们组织代码更加清晰，但是，我能看到的缺点是：

1. model和view还是没有解耦
2. view不够单纯，而且需要了解model
3. view是事件的源头，可能会掺杂一些逻辑（这也与前端的特殊性有关）
4. model完全暴露

下面，我们尝试用MVP的模式做一下这个demo。

## MVP

所谓的MVP，Model-View-Presenter。同样，历史背景自行补充，我们直接去看[wikipedia的描述](http://zh.wikipedia.org/wiki/Model_View_Presenter)：

>Model 定义使用者接口所需要被显示的资料模型，一个模型包含着相关的商业逻辑。

>View 视图为呈现使用者接口的终端，用以表现来自 Model 的资料，和使用者命令路由再经过 Presenter 对事件处理后的资料。

>Presenter 包含着元件的事件处理，负责检索 Model 取得资料，和将取得的资料经过格式转换与 View 进行沟通。

同样，在Addy Osmani的《Learning JavaScript Design Patterns》的[这个章节](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#detailmvcmvp)中对MVP也有描述，我们截取部分：

>...The P in MVP stands for presenter. It's a component which contains the user-interface business logic for the view...

>...The most common implementation of MVP is one which uses a Passive View (a view which is for all intents and purposes "dumb"), containing little to no logic...In MVP, the P observes models and updates views when models change...

同时，在一次[演讲](https://speakerdeck.com/addyosmani/digesting-javascript-mvc)中对MVP有如下描述：

>Like MVC, but with a heavier focus on decoupled UI development.

>The P (Presenter) plays the role of the Controller with the View handling userinput.

>Presenter retrieves data (Model) and formats it for display in the View.

他的个人网站上也有一篇[文章](http://addyosmani.com/blog/understanding-mvc-and-mvp-for-javascript-and-backbone-developers/)，还没有细读，但是粗略翻阅，描述差异不大。

另外，在SO上也有一个[很棒的回答](http://stackoverflow.com/questions/2056/what-are-mvp-and-mvc-and-what-is-the-difference)。摘录几句：

>...In MVP, the Presenter contains the UI business logic for the View...
 
>...One common attribute of MVP is that there has to be a lot of two-way dispatching. For example, when someone clicks the "Save" button, the event handler delegates to the Presenter's "OnSave" method. Once the save is completed, the Presenter will then call back the View through its interface so that the View can display that the save has completed...

>...Two primary variations...Passive View: The View is as dumb as possible and contains almost zero logic...Supervising Controller: The Presenter handles user gestures...

根据这些，我们应该可以得到：

1. view对model是不了解的，被动的
2. presenter取代controller，但比controller做的事情要多
3. presenter持有model，并使用model的接口
4. model和view之间不再存在观察者关系

下面，按照我的理解实现一下代码：

首先，我们在实现的MVP中的model将比MVC中的model简洁很多，最直观的是不再需要观察者模式的实现，model由presenter控制并暴露数据：

```javascript  Model in MVP
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
```

然后是view，MVP中的view跟MVC中的view有一个差别是不再了解model，代码上可以直观看到没有model的引用，它使用的数据由presenter提供，所以，我的是实现是：

```javascript  View in MVP
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
```
因为示例的原因，代码的数量上并没有最直观的变化，但是，还是能看出来差异，比如对model的无视，对presenter的依赖。

接下来，实现presenter。它代替了MVC中的controller，并因为对model和view的持有，从而实现model和view的解耦。它要做的事情，有但不仅有：

1. 对应好view和model的关系，将model数据告诉view
2. 处理view的用户交互
3. 在model后，更新view的展示
4. 业务逻辑（这一部分，也可以交由model）

所以，实现的presenter如下：

```javascript Presenter in MVP
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
```
最后，我们的初始化，可以从view开始：

```javascript MVP init
var view = new app.View();
view.init();
```
最终整合的代码在[这里](http://jser.it/blog/demo/mvp.html)。

在MVP小节的最后，我尝试总结一下这种模式的优劣。首先，MVP的模式最明显的就是实现了model和view的解耦（因为我们的实例比较简单，可能带来的收益不够明显），model和view都有所简化，当然，也有一定的不足，当我们把实践范围限定在前端开发的时候很严重的问题依旧是事件依旧来自view层，难免会造成view层产生一些不应该的逻辑，不够纯粹。

接下来，是MVVM。

## MVVM

首先，仍然是直接上[wikipedia](http://en.wikipedia.org/wiki/Model_View_ViewModel)(木有中文的词条)，截取我认为比较重要的部分：

>...MVVM facilitates a clear separation of the development of the graphical user interface (either as markup language or GUI code) from the development of the business logic or back end logic known as the model (also known as the data model to distinguish it from the view model). The view model of MVVM is a value converter[6] meaning that the view model is responsible for exposing the data objects from the model in such a way that those objects are easily managed and consumed. In this respect, the view model is more model than view, and handles most if not all of the view’s display logic...

>...MVVM was designed to make use of data binding functions...

>...the view model is a “model of the view” meaning it is an abstraction of the view that also serves in mediating between the view and the model which is the target of the view data bindings...

然后，还是引用大师Addy Osmani的《Learning JavaScript Design Patterns》的[JavaScript MV\* Patterns](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#detailmvcmvp)章节：

>...The ViewModel can be considered a specialized Controller that acts as a data converter. It changes Model information into View information, passing commands from the View to the Model...

还有，在上文中提到的[演讲](https://speakerdeck.com/addyosmani/digesting-javascript-mvc)中，他对MVVM的总结是：

>Similarly like MVC, but the ViewModel provides data bindings between the Model and View. Converts Model data and passes it on to the View for usage.

同样，大师有一篇借KnockoutJS介绍MVVM的文章，[Understanding MVVM – A Guide For JavaScript Developers](http://addyosmani.com/blog/understanding-mvvm-a-guide-for-javascript-developers/)，值得一看。

我在SO上同样发现了一个[回答](http://stackoverflow.com/questions/667781/what-is-the-difference-between-mvc-and-mvvm)，其中有多种说法，并且引用了很多文章，可以择优学习。

到这里，稍微总结一下，我看到的MVVM：

1. (Two-Way)Data Binding，数据(双向)绑定，这个是所有论述中都有提到的MVVM的特色
2. view将更加倾向于纯粹的展示
3. model面向于来源，更加纯粹的数据
4. view-model将是整个模式中最关键的部分，将数据转化到展示

在我们按照MVVM的方式实现上述的demo之前，我们先稍微了解一下双向绑定的实现。

所谓的双向绑定就是view层的form发生变化，model要相应变化；model层发生数据变化，相应的view层要展示变化。那么，如何实现双向绑定？首先，从view到model，我们很容易想到，在form的元素上绑定相关的事件（click/keyup/change等）即可轻松实现，而难点是model到view的方向。现在，市面上MVVM的框架很多，但是双向绑定的实现无外乎以下三种：

1. wrapper objects
2. dirty checking
3. getters and setters

`wrapper objects`的做法正如其名字那样，需要在我们的纯粹的数据对象上包装一层，实现set/get等方法，然后通过观察者模式，在`model.set`的时候，触发model到view方向的变化。这样的方式，便于我们接受和理解，但是也使我们不能接触到纯粹的数据，每次set也显得不够简洁。在熟悉的框架中，像backbone/ember等都采用了这样方式对object进行封装。

`dirty checking`应该是伴随着AngularJS的流行，被广大JSer了解到，当然其中就有我。大家经常听到的解释便是，Angular会定时轮训model中的value，与之前记录的oldValue进行对比，如果不同就触发model到view方向的变化。但是，通过我之前的尝试，我认为应该是在执行angular提供的特定操作之后，才会去执行check，比如$http响应，ng-event等等。对于此，我还在继续学习中，不误导大家。这种方式，保持了object的原始和纯粹，修改属性也更加简洁，但很容易大家就能想到存在性能问题，虽然各种极限数据表明，不会影响用户体验，用户感受不到这样的性能变化，但是从一个程序员的角度来说，这的确只能是一个优秀的方案，还不完美的方案。

`getters and setters`是使用了ES5引入的set/get的方式，并且与Object.defineProperty结合，在set中添加相关的逻辑。这种做法的好处是，不会实现存在`dirty checking`的性能诟病，同时没有`wrapper objects`使用的繁琐。但是，同样存在问题，我们无法使用这种方式捕捉属性的增/删。也是不够完美的方案。

而我在本文中实现demo的时候，选择了最简单但是最未来的方式——`Object.observe`（这是ES7的api，但是在chrome 36正式版中已经默认开启，所以这个MVVM模式的demo也需要在chrome中查看）。可能有些同学对这个api不太了解，这里有两篇文章以及一个视频，是我接触这个api过程中发现得很棒的资料。readwrite上的[Why Javascript Developers Should Get Excited About Object.observe()](http://readwrite.com/2014/07/24/object-observe-javascript-api-impact)以及html5rocks上的[Data-binding Revolutions with Object.observe()](http://www.html5rocks.com/en/tutorials/es7/observe/)，jsconf的一个talk：[The future of data-binding is Object.observe()](http://2013.jsconf.eu/speakers/addy-osmani-plight-of-the-butterfly-everything-you-wanted-to-know-about-objectobserve.html)。

了解了`Object.observe`之后，在用其实现model的时候，我们便很容易理解model可以只是一个简单的object，提供相关的数据即可，所以model不再需要特别展示代码。而view则可以是带有占位符的html文本（当然，可以是html，可以是template，或者什么其它东西）。听说过angular的人就应该很容易理解下面这段html的大概意思。我们粗糙地这么写吧：

```html View in MVVM
<div id="J_mvvmContainer">
    <input id="J_num1" mvvm-value="{% raw %}{{num1}}{% endraw %}">
    <select id="J_calculate" mvvm-value="{% raw %}{{calculate}}{% endraw %}">
        <option value="plus">+</option>
        <option value="minus">-</option>
        <option value="time">*</option>
        <option value="divide">/</option>
    </select>
    <input id="J_num2" mvvm-value="{% raw %}{{num2}}{% endraw %}">
    <span>=</span>
    <span id="J_result">{% raw %}{{result}}{% endraw %}</span>
</div>
```

接下来是相对复杂一些的`view-model`的实现。根据我们上面的描述，`view-model`所做的事情应该是：

1. 解析view，保存view的引用，处理view的事件
2. 观察model
3. 结合1&&2，双向绑定。

更多的解释，我们放到接下来的代码注释中。

```javascript View-Model in MVVM
mvvm.VM = function(opt) {
    //m2v用于存储model和view的对应
    //获取初始化的view和model
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

    //处理view的事件，可以触发从view到model的变化
    view.addEventListener('change', function(event) {
        var key = event.target.getAttribute('mvvm-value');
        model[key] = event.target.value;
    }, true);

    //观察model，在修改model的时候，出发model到view方向的变化
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


//功能函数：根据{% raw %}{{xxx}}{% endraw %}和model组成新的字符串
function formatHtml(tmpl, model) {
    var splitArray1 = tmpl.split('{ {');
    if (splitArray1.length < 2) {
        return tmpl;
    }
    var str = '';
    splitArray1.forEach(function(item) {
        if (item.indexOf('} }') > 0) {
            var temp = item.split('}}');
            var key = temp[0].trim();
            str += model[key] + temp[1];
        } else {
            str += item;
        }
    });
    return str;
}

//功能函数：渲染一个node。
//我们一般只需要处理nodeType === 3和nodeType === 2的节点，这是数据展示的基本单元
function renderNode(node, type, owner) {
    var self = this;
    owner = owner ? owner : node;
    if (type == 'new') {
        var key;
        owner.originalTmpl = node.nodeType == 2 ? node.value : node.textContent;
        owner.originalTmpl.split('{ {').forEach(function(item) {
            item.indexOf('} }') > 0 && (key = item.split('} }')[0]) && (self.m2v[key] || (self.m2v[key] = [])).push(owner);
        });
        node.value = key;
    }
    if (node.nodeType == 3) {
        node.textContent = formatHtml(node.originalTmpl, self.model);
    } else {
        owner.value = formatHtml(owner.originalTmpl, self.model);
    }
}

//功能函数：渲染每一个dom元素
//同样根据nodeType，做不同的处理
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
```
这是非常粗糙甚至丑陋的一个实现，因为主要是针对我们的demo做了很多特定的简化，如果有什么问题请直言不讳提出。

最后，我们初始化如下：

```javascript MVVM init
var vm = mvvm.init({
    model: {
        num1: 0,
        num2: 0,
        result: 0,
        calculate: 'plus'
    },
    selector: '#J_mvvmContainer'
});
```

最终的实现在[这里](http://jser.it/demo/mvvm.html)。

同样，我们尝试总结一下MVVM的优劣。总体来说，MVVM解决了大多数我们前面MVC/MVP的问题，view和model很好地做到了解耦，view和model更加纯粹，model更适合面向数据来源（比如ajax请求），开发体验非常棒的双向绑定等等。但是，在我看来，如果说MVVM存在不安因素，那也就是view-model的复杂性。实际生产环境，我们肯定要依赖框架，所以，我们在享受双向绑定等功能的时候，也让我们把对项目的掌控部分地交给了框架，结果是，框架很大程度上决定了代码的性能和拓展（论框架优劣的重要性）。



## Summary

到这里，我已经把我对MV\*的理解和盘托出。最后，稍作一点补充/总结。

#### MV\*与PubSub模式

在上文中，我们不断提到并且使用的一种模式是观察者模式，但在JavaScript中，这种传统的模式多被PubSub模式所替代。也因此，在很多文章中，对这两种模式是等同对待的，比如很多人读过的汤姆大叔的[深入理解JavaScript系列（32）：设计模式之观察者模式](http://www.cnblogs.com/TomXu/archive/2012/03/02/2355128.html)。当然，因为两种模式的核心目标都是通知变化，所以这么理解也无可厚非，不过，如果深入一些，我们还是会发现他们之间存在差异。再次提到Addy Osmani的《Learning JavaScript Design Patterns》，他在[The Observer Pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#observerpatternjavascript)章节中也提到了这两种模式的差异。我认为，最主要的差别便是，PubSub模式提供事件通道，通过事件对象传递消息。这样的好处便是，松散耦合，而不必像观察者模式中对象直接获取到其它对象的引用并调用方法。

PubSub模式可以非常顺畅地与JavaScript结合。首先，JavaScript的语言核心ECMAScript的实现，便是事件驱动；其次，作为是一个前端程序员，我们对DOM事件的接受和熟悉程度毋容置疑。也因此，基于这种模式实现的框架或者库，在JavaScript生态系统中，无论是前后端，都比比皆是。而涉及到本文讨论的MV\*，我们肯定会想到[`Backbone.Events`](http://backbonejs.org/#Events)。它是backbone的很关键的一部分，维护了model和view之间的通信，同时又可以暴露给我们使用。后面，我会使用backbone重新实现一下上面的demo。

#### Framework

之所以会说到Framework，是因为在实际项目中，我们必然会选择一款适合的框架。正如一开始所说的那样，我不对它们进行横向比较，首先因为我对这些框架都没有深入使用，个中优劣不敢妄言，其次，在这方面有大量非常优秀的资料，推荐几篇我略读过的：

1. [TodoMVC](http://todomvc.com/)，囊括主流的MV\*框架，介绍特点，帮助选择（又是Addy Osmani牵头的项目）
2. [A Comparison of Angular, Backbone, CanJS and Ember](http://sporto.github.io/blog/2013/04/12/comparison-angular-backbone-can-ember/)：看题目就知道说什么。[译文](http://www.ituring.com.cn/article/38394)
3. [Rich JavaScript Applications – the Seven Frameworks](http://blog.stevensanderson.com/2012/08/01/rich-javascript-applications-the-seven-frameworks-throne-of-js-2012/)：同样顾名思义。[译文](http://www.ituring.com.cn/article/details/8108)
4. [开源前端框架纵横谈](http://www.programmer.com.cn/15552/)：科普文，但是科普得很到位。

另外，关于Framework，说起前端MVC，很多人直接的反应就是backbone。但是，按照我们上面对MVC的理解，backbone真的是MVC吗？相信很多人对此都应该清晰了，backbone不能算作是真正的MVC。比如，我粗糙地[用backbone实现一下上面的demo](http://jser.it/demo/backboneDemo.html)，为了与上文实例更贴近，没有使用模板，代码中有注释。从代码中可以看出，如果非得说得明明白白，我认为，backbone的model可以是MVC中的model，而backbone的view更像是MVC中view和部分controller，而`Backbone.Router`则是另一部分controller，那么，按照这样理解，backbone的view还像MVP的View+Presenter，所以[Backbone.js Is Not An MVC Framework](http://lostechies.com/derickbailey/2011/12/23/backbone-js-is-not-an-mvc-framework/)，我们只能称之为“The Backbone Way”。如果真的要在JavaScript中寻找MVC，[maria](http://peter.michaux.ca/maria/)应该是一个很棒的选择。

实际项目中，我们到底选用哪一款框架？[TodoMVC](http://todomvc.com/)的角色更像一个列表，提供了很多选择，到底何种场景下适合哪个框架？我相信，只有使用了才能了解。

只有理解了原理，我们才能“不必拘泥于原理”。

#### Future

伴随着前端开发复杂性和专业性的增长，我认为一个合适的Framework会真正给前端代码带来变化。无论是老当益壮的Backbone，还是当打之年的angular，再或是意气风发年少清纯（注重UI渲染）的React，乃至初生牛犊后台强硬（web components）的polymer，变数仍在，拭目以待。

从明天开始，选择一个框架，面朝未来，春暖花开。