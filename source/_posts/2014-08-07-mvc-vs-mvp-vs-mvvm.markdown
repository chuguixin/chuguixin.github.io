---
layout: post
title: "MVC vs MVP vs MVVM"
date: 2014-08-07 16:59
comments: true
categories: MVC MVP MVVM Patterns JavaScript
---

先说一下本文讨论什么吧。主要讨论一下纯粹的MV*原理，以及MV*如何发展跟JavaScript结合，比较这些MV*与常见Framework。不讨论常见的Framework的横向对比。所以，隐约觉得，又是一篇枯燥的长文。

为什么要写这么一篇文章？大约一年前的毕业季才了解到JavaScript中有MV*这类框架，不明觉厉。近几个月，断断续续用Backbone/Angular/Ractive写过一些小的Demo，使用之后的感觉是仿佛在按照Framework要求的API在拼凑，而对所谓的MV*的每一部分没有清晰的认识，最终结果是，使用过一段时间后很容易忘记API，忘记API之后它们就成了陌生的框架。当然这个问题与我使用的深度有很大很直接的关系，但同时我认为也与自身缺少对原理直观的认知有关系。所以，花了一些时间学习了一下原理，稍作记录。

世界上本没有设计模式，用的人多了也就有了设计模式。在我查找各种相关文献资料的过程中，我发现，即使对MVC这种非常传统的模式进行描述，各家的说法虽大同小异，但也众说纷纭。于是，我选择了接受最主流的说法，并尽量用被社区广泛接受的方式实现代码描述。

另外，在每种模式下，我会实现一个非常简单的四则运算表达式的应用，以使抽象的描述能具象的落地到代码上。这个例子，大概效果可以[先看一下](http://jser.it/demo/mvc.html)。就酱，从MVC说起。

##MVC

首先，历史背景自行脑补。下面是引自[wikipedia的MVC的简介](http://zh.wikipedia.org/wiki/MVC)：
>MVC模式（Model-View-Controller）是软件工程中的一种软件架构模式，把软件系统分为三个基本部分：模型（Model）、视图（View）和控制器（Controller）。

同时，wikipedia给出了各个components之间的作用关系：
>除了将应用程序划分为三种组件，模型 - 视图 - 控制器（MVC）设计定义它们之间的相互作用。[2]

>模型（Model） 用于封装与应用程序的业务逻辑相关的数据以及对数据的处理方法。“模型”有对数据直接访问的权力，例如对数据库的访问。“模型”不依赖“视图”和“控制器”，也就是说，模型不关心它会被如何显示或是如何被操作。但是模型中数据的变化一般会通过一种刷新机制被公布。为了实现这种机制，那些用于监视此模型的视图必须事先在此模型上注册，从而，视图可以了解在数据模型上发生的改变。（比较：观察者模式（软件设计模式））

>视图（View）能够实现数据有目的的显示（理论上，这不是必需的）。在视图中一般没有程序上的逻辑。为了实现视图上的刷新功能，视图需要访问它监视的数据模型（Model），因此应该事先在被它监视的数据那里注册。

>控制器（Controller）起到不同层面间的组织作用，用于控制应用程序的流程。它处理事件并作出响应。“事件”包括用户的行为和数据模型上的改变。

[这篇论文](http://heim.ifi.uio.no/~trygver/1979/mvc-2/1979-12-MVC.pdf)应该是较早较正式提出了MVC的概念，尝试阅读一下，与wikipedia给出的描述，差异不大。

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

本文中，我选择了一个非常简单的例子，用各种模式实现一个四则运算的算术表达式，大概效果可以先看一下[这里](/blog/demo/mvc.html)。根据上面的描述，我们首先实现一个model，需要有如下功能：

1. 记录数据：两个被运算的数字，一个操作符，一个结果
2. 需要实现观察者模式，在input修改后notify到view
3. 具体运算（关于这个，我认为可以放到controller或者model都可以接受）
4. view需要的model暴露数据的接口

所以，代码应该如下：

```javascript Model
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

```javascript View
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

最后，是controller，相比其它mv*中的*，mvc中的controller显得日子好过很多，没有特别繁重的劳作：

1. 初始化并关联model和view
2. 处理view传递过来的用户交互

所以，代码如下：

```javascript Controller
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

最后，我们只需要初始化controller即可：

```javascript init mvc
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

另外，在SO上也有一个[很棒的回答](http://stackoverflow.com/questions/2056/what-are-mvp-and-mvc-and-what-is-the-difference)。摘录几句：