---
layout: post
title: "MVC vs MVP vs MVVM"
date: 2014-08-07 16:59
comments: true
categories: MVC MVP MVVM Patterns JavaScript
---

先说一下本文讨论什么吧。主要讨论一下纯粹的MV\*原理，以及MV\*如何发展跟JavaScript结合，比较这些MV\*与常见Framework。*不*讨论常见的Framework的横向对比。所以，隐约觉得，又是一篇枯燥的长文。

为什么要写这么一篇文章？大约一年前的毕业季才了解到JavaScript中有MV\*这类框架，不明觉厉。近几个月，断断续续用Backbone/Angular/Ractive写过一些小的Demo，使用之后的感觉是仿佛在按照Framework要求的API在拼凑，而对所谓的MV\*的每一部分没有清晰的认识，最终结果是，使用过一段时间后很容易忘记API，忘记API之后它们就成了陌生的框架。当然这个问题与我使用的深度有很大很直接的关系，但同时我认为也与自身缺少对原理直观的认知有关系。所以，花了一些时间学习了一下原理，稍作记录。

<!-- more -->

世界上本来就有设计模式，用的人多了，设计模式就有了名字。在我查找各种相关文献资料的过程中，我发现，即使对MVC这种非常传统的模式进行描述，各家的说法虽大同小异，但也众说纷纭。我选择了接受最主流的说法，并尽量用被广泛接受的方式实现代码描述。

另外，在每种模式下，我会实现一个非常简单的四则运算表达式的应用，以使抽象的描述能具象的落地到代码上。这个例子，大概效果可以[先看一下](http://jser.it/demo/mvc.html)。就酱，从MVC说起。

##MVC

首先，历史背景自行脑补。下面是引自[wikipedia对MVC的简介](http://zh.wikipedia.org/wiki/MVC)：
>MVC模式（Model-View-Controller）是软件工程中的一种软件架构模式，把软件系统分为三个基本部分：模型（Model）、视图（View）和控制器（Controller）。

同时，wikipedia给出了各个components之间的作用关系：
>除了将应用程序划分为三种组件，模型 - 视图 - 控制器（MVC）设计定义它们之间的相互作用。[2]

>模型（Model） 用于封装与应用程序的业务逻辑相关的数据以及对数据的处理方法。“模型”有对数据直接访问的权力，例如对数据库的访问。“模型”不依赖“视图”和“控制器”，也就是说，模型不关心它会被如何显示或是如何被操作。但是模型中数据的变化一般会通过一种刷新机制被公布。为了实现这种机制，那些用于监视此模型的视图必须事先在此模型上注册，从而，视图可以了解在数据模型上发生的改变。（比较：观察者模式（软件设计模式））

>视图（View）能够实现数据有目的的显示（理论上，这不是必需的）。在视图中一般没有程序上的逻辑。为了实现视图上的刷新功能，视图需要访问它监视的数据模型（Model），因此应该事先在被它监视的数据那里注册。

>控制器（Controller）起到不同层面间的组织作用，用于控制应用程序的流程。它处理事件并作出响应。“事件”包括用户的行为和数据模型上的改变。

另外，[这篇论文](http://heim.ifi.uio.no/~trygver/1979/mvc-2/1979-12-MVC.pdf)应该是较早较正式提出了MVC的概念，尝试阅读一下，与wikipedia给出的描述，差异不大。

大师Addy Osmani在他著名的《Learning JavaScript Design Patterns》（本书英文版为开源的，国内有中文翻译版）中也提到对传统的Smalltalk-80 MVC有[如下描述](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#detailmvcmvp)：
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
2. view是一个不应该有逻辑的对象
3. controller负责处理用户交互，修改Model
4. Observer模式，View观察Model

那么落地上代码上，我们要实现一个上面提到的很简单的例子。首先实现一个model，按照我的理解，需要有如下功能：

1. 记录数据：两个被运算的数字，一个操作符，一个结果
2. 需要实现观察者模式，在input修改后notify到view
3. 具体运算（关于这个，我认为可以放到controller或者model都可以接受）
4. view需要的model暴露数据的接口

所以，代码应该如下：

```javascript Model in MVC
mvc.Model = function() {
    //记录数据
    var num1 = 0,
        num2 = 0,
        calculateType = '',
        result = 0;

    //具体运算，以及对外接口
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

最后，是controller，相比其它mv\*中的\*，mvc中的controller显得日子好过很多，没有特别繁重的劳作：

1. 初始化并将view注册到model
2. 处理view传递过来的用户交互

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
```

最后，我们的初始化可以从controller开始：

```javascript MVC init
var controller = new mvc.Controller;
controller.init();
```

最终代码在[这里](http://jser.it/demo/mvc.html)。

从上面，我们可以看到，MVC的模式的确帮助我们组织代码更加清晰，但是，我能看到的缺点是：

1. model和view还是没有解耦
2. view不够单纯，而且需要了解model
3. view是事件的源头，而事件却由controller处理（这也与前端的特殊性有关）

下面，我们尝试用MVP的模式做一下这个demo。

##MVP

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

他的个人网站上也有一篇[文章](http://addyosmani.com/blog/understanding-mvc-and-mvp-for-javascript-and-backbone-developers/)，还没有细读，但是应该值得细读一下。

另外，在SO上也有一个[很棒的回答](http://stackoverflow.com/questions/2056/what-are-mvp-and-mvc-and-what-is-the-difference)。摘录几句：

>...In MVP, the Presenter contains the UI business logic for the View...
 
>...One common attribute of MVP is that there has to be a lot of two-way dispatching. For example, when someone clicks the "Save" button, the event handler delegates to the Presenter's "OnSave" method. Once the save is completed, the Presenter will then call back the View through its interface so that the View can display that the save has completed...

>...Two primary variations...Passive View: The View is as dumb as possible and contains almost zero logic...Supervising Controller: The Presenter handles user gestures...

根据这些，我们应该可以得到：

1. view对model是不了解的，被动的
2. presenter取代controller，但比controller做的事情要多
3. presenter持有model，并对model进行
4. model和view之间不再存在观察者关系

下面，按照我的理解实现一下代码：

首先，我们在实现的MVP中的model将比MVC中的model简洁很多，最直观的是不再需要观察者模式的实现，model由presenter控制并暴露数据：

```javascript  Model in MVP
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

    //不再需要观察者模式
};
```

然后是view，MVP中的view跟MVC中的view有一个直观的差别是，不再model了解model，它可以直接使用presenter提供的数据，所以，我的是实现是：

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
因为示例的原因，代码的数量上并没有最直观的展示出MVP中view的特点，但是，还是能看出来一些差异，比如对model的无视，对presenter的依赖。

接下来，实现presenter。它代替了MVC中的controller，并因为对model和view的持有，从而实现了上面model和view的解耦。它要做的事情，有但不仅有：

1. 对应好view和model的关系，将model数据告诉view
2. 处理view的用户交互
3. 在model后，更新view的展示

所以，实现的presenter如下：

```javascript Presenter in MVP
app.Presenter = function(view) {

    //处理view和model的对应关系
    var model = new app.Model();
    view.render(model.getVals());

    //处理view事件
    this.change = function(vals) {
        vals.num1 = +vals.num1;
        vals.num2 = +vals.num2;
        if (isNaN(vals.num1) || isNaN(vals.num1)) {
            alert('错误输入！');
            return view.render(model.getVals());
        }
        //view改变时候，通知model
        model.calculate(vals);
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
最终整合的代码在[这里](http://jser.it/demo/mvp.html)。

在MVP的最后，我尝试总结一下这种模式的优劣。首先，MVP的模式最明显的就是实现了model和view的解耦（当然，我们的实例比较简单，可能带来的收益不够明显），model和view都有所简化，当然，也有一定的不足，当我们把实践范围限定在前端开发的时候很严重的问题依旧是事件依旧来自view层，难免会造成view层产生一些不应该的逻辑。

接下来，便是MVVM。

#MVVM

首先，仍然是直接上[wikipedia](http://en.wikipedia.org/wiki/Model_View_ViewModel)(木有中文的词条)，截取我认为比较重要的部分：

>...MVVM facilitates a clear separation of the development of the graphical user interface (either as markup language or GUI code) from the development of the business logic or back end logic known as the model (also known as the data model to distinguish it from the view model). The view model of MVVM is a value converter[6] meaning that the view model is responsible for exposing the data objects from the model in such a way that those objects are easily managed and consumed. In this respect, the view model is more model than view, and handles most if not all of the view’s display logic...

>...MVVM was designed to make use of data binding functions...

>...the view model is a “model of the view” meaning it is an abstraction of the view that also serves in mediating between the view and the model which is the target of the view data bindings...

然后，还是引用大师Addy Osmani的《Learning JavaScript Design Patterns》的[JavaScript MV\* Patterns](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#detailmvcmvp)章节：

>...The ViewModel can be considered a specialized Controller that acts as a data converter. It changes Model information into View information, passing commands from the View to the Model...

还有，在上文中提到的[演讲](https://speakerdeck.com/addyosmani/digesting-javascript-mvc)中，他对MVVM的总结是：

>Similarly like MVC, but the ViewModel provides data bindings between the Model and View.

>Converts Model data and passes it on to the View for usage.

同样，大师有一篇借KnockoutJS介绍MVVM的文章，[Understanding MVVM – A Guide For JavaScript Developers](http://addyosmani.com/blog/understanding-mvvm-a-guide-for-javascript-developers/)，值得一看。

我在SO上同样发现了一个[回答](http://stackoverflow.com/questions/667781/what-is-the-difference-between-mvc-and-mvvm)，其中有多种说法，并且引用了很多文章，可以择优学习。

到这里，稍微总结一下，我看到的MVVM：

1. (Two-Way)Data Binding，数据(双向)绑定，这个是所有论述中都有提到的MVVM的特色
2. view将更加倾向于纯粹的展示
3. model面向于来源，更加纯粹的数据
4. view-model将是整个模式中最关键的部分

在我们按照MVVM的方式实现上述的demo之前，我们先稍微了解一下双向绑定的实现。

所谓的双向绑定就是view层的form发生变化，model要相应变化；model层发生数据变化，相应的view层要展示变化。那么，如何实现双向绑定？首先，从view到model，我们很容易想到，在form的元素上绑定相关的事件（click/keyup/change等）即可轻松实现，而难点是model到view的方向。现在，市面上MVVM的框架很多，但是双向绑定的实现无外乎以下三种：

1. wrapper objects
2. dirty checking
3. getters and setters

`wrapper objects`的做法正如其名字那样，需要在我们的纯粹的数据对象上包装一层，实现set/get等方法，然后通过观察者模式，在model发生修改的时候，触发model到view方向的变化。这样的方式，便于我们接受和理解，但是也使我们不能接触到纯粹的数据，每次set也显得不够简洁。在熟悉的框架中，像backbone/ember等都采用了这样方式对object进行封装。

`dirty checking`应该是伴随着AngularJS的流行，被广大JSer了解到，当然其中就有我。大家经常听到的解释便是，Angular会定时轮训model中的value，与之前记录的oldValue进行对比，如果不同就触发model到view方向的变化。但是，通过我之前的尝试，我认为应该是在执行angular提供的特定操作之后，才会去执行check，比如$http响应，ng-event等等。对于此，我还在继续学习中，不误导大家。这种方式，保持了object的原始和纯粹，修改属性也更加简洁，但很容易大家就能想到存在性能问题，虽然各种极限数据表明，不会影响用户体验，用户感受不到这样的性能变化，但是从一个程序员的角度来说，这的确只能是一个优秀的方案，还不完美的方案。

`getters and setters`是使用了ES5引入的set/get的方式，并且与Object.defineProperty结合，在set中添加相关的逻辑。这种做法的好处是，不会实现存在`dirty checking`的性能诟病，同时没有`wrapper objects`使用的繁琐。但是，同样存在问题，我们无法使用这种方式捕捉属性的增/删。也是不够完美的方案。

而我在本文中实现demo的时候，选择了最简单但是最未来的方式——`Object.observe`（这是ES7的api，但是在chrome 36正式版中已经默认开启）。可能有些同学对这个api不太了解，这里有两篇文章以及一个视频，可以深入了解一下。readwrite上的[Why Javascript Developers Should Get Excited About Object.observe()](http://readwrite.com/2014/07/24/object-observe-javascript-api-impact)以及html5rocks上的[Data-binding Revolutions with Object.observe()](http://www.html5rocks.com/en/tutorials/es7/observe/)，jsconf的一个talk：[The future of data-binding is Object.observe()](http://2013.jsconf.eu/speakers/addy-osmani-plight-of-the-butterfly-everything-you-wanted-to-know-about-objectobserve.html)。