---
layout: post
title: "Async JavaScript"
date: 2014-05-18 17:35
comments: true
categories: JavaScript
---
最近看了一些JavaScript异步编程方面文章，也反复读了几遍薄薄的<a href="http://book.douban.com/subject/24319975/" target="_blank">《Async JavaScript》</a>。总结一下，供自己后续学习使用，并分享给大家。

首先，有几个问题。什么是异步编程/异步函数？异步函数和回调函数有什么关系？为什么异步编程经常与JavaScript同时出现？JavaScript中的异步函数的机制是怎样的？那么现在异步编程有什么解决方案？未来的JavaScript异步编程是什么样子？如果你对上述几个问题已经虽不至“如数家珍”但已是“一目了然”，那么再往下的内容就不适合你。那么，我们开始正餐：

<!--more-->

###什么是异步函数？
对于一个jser而言，学习和使用JavaScript的过程中，“异步编程”的出现频率应该是极高的，或许仅次于“事件驱动”、“单线程”等等。那么什么异步编程呢？什么是异步函数呢？

言简意赅的说：异步函数就是会导致将来运行**一个取自事件队列的函数**的函数。这里的重点是“取自事件队列”，关于这个概念，我们暂且按下不表，将在后面进行分析，我们现在只需要知道异步函数是会导致将来某个时刻运行另外一个函数的函数。

###异步函数 VS 回调函数
又是一个高频词汇，“回调函数”。再次，我觉得有必要区分一下回调函数和异步函数的概念，虽然在很多人看来这有点不必要，但是对概念的理解往往是我们深入学习的第一个台阶。

所谓回调函数：In computer programming, a callback is **a piece of executable code that is passed as an argument to other code**, which is expected to call back (execute) the argument at some convenient time. **The invocation may be immediate as in a synchronous callback or it might happen at later time, as in an asynchronous callback.** In all cases, the intention is to specify a function or subroutine as an entity that is, depending on the language, more or less similar to a variable.(from <a href="http://en.wikipedia.org/wiki/Callback_(computer_programming)" target="_blank">wikipedia</a>)

从wikipedia的说法中我们可以清晰的看到：首先，回调函数是作为参数传入到另外一段代码中的一段可执行代码，也就是它所强调的是回调函数是需要被当做参数传入到其它代码中的；其次，我们看到，回调函数可以是同步的，也可以是异步的，这取决于使用者。如果我们进入到wikipedia的页面，我们能额外发现一些其它的知识，比如回调函数会出现在拥有某些特性的语言中，那么函数是一等公民的JavaScript当然也就完美支持回调函数了。

那么，现在这两个概念应该比较清晰了，我们再举个例子，稍微说明。比如：
```javascript callback VS async function
function callbackFunc(){
    console.log('callback executed!');
}

setTimeout(callbackFunc,1000);

function syncFunc(callbackFunc){
    callbackFunc();
}

```
在上面的代码片段中，setTimeout是一个异步函数，因为它导致了大约1秒后callbackFunc的运行；而callbackFunc对于setTimeout来说，它是一个回调函数。同时，callbackFunc对于syncFunc来说，它也是一个回调函数，但是被同步执行（在同一个事件循环里被执行），那么syncFunc不能被称为异步函数。

另外，在网上的一些文章中都能看到，很多人将回调函数作为了异步编程的一个解决方案进行总结，包括阮一峰老师的<a href="http://www.ruanyifeng.com/blog/2012/12/asynchronous%EF%BC%BFjavascript.html" target="_blank">Javascript异步编程的4种方法</a>。对于此，我认为这种分类是不太恰当的。如果将回调函数看做异步编程的一种解决方案，那么我们后面讲到的分布式事件、Promise以及强大的工作流控制库都是通过回调函数的形式来实现，岂不是都能看做是同一种解决方案？所以，我认为，回调函数并不是异步编程的一种解决方案。


###JavaScript中的异步机制
每一个jser都应该了解，JavaScript是单线程的。所谓“单线程”，就是同一时刻只能执行一个任务，或者说只能有一个函数一个代码片段在执行。那么，我们就很容易产生疑问，如果是单线程，那异步是如何实现的？

一句话回答：**事件驱动（event-driven）**。不只是JavaScript，几乎所有的单线程且异步的语言，都是通过event-driven实现的。下面，我希望用最易懂的文字描述清楚事件驱动：

首先，JavaScript是单线程执行的，但是JavaScript引擎的平台（比如浏览器或者nodejs等）是拥有若干线程的。比如，对于一个浏览器而言，有一条线程做渲染，有一条线程记录事件（比如click等），有一条线程执行JavaScript等等，这些线程在浏览器内核的协调控制下执行（比如，JavaScript线程执行期间，不能进行ui渲染）。这是单线程实现异步的基础。

其次，每一个异步函数都会对应至少一个event-handler，而上文中提到的*事件队列*便是event-handler在被处理的时候存放的地方。JavaScript引擎的线程会在适当的时机处理一系列的event-handler，适当的时机需要满足两个条件：1.该事件已经满足触发条件（比如，setTimeout(func,1000)后大约1000ms）；2.JavaScript的线程空闲。这里需要提到event-loop的存在，它的作用是不断的循环检测事件队列中是否有event-handler，如果有便会取出执行。我们可以这样理解event-loop：
```javascript event-loop
while(true){
    if(atLeastOneEventIsQueued){
        fireNextQueuedEvent();
    }
}
```

最后，事件“满足触发条件”（上文中适当的时机的条件1）是如何判断的？不同的事件的“触发条件”可能由不同的线程监控。比如，我们发送一个ajax请求，应该是浏览器新开一个线程发送http请求并在返回的时候通知JavaScript线程满足条件；而click一个button，应该就是浏览器的GUI线程通知JavaScript然后适时执行相应的event-handler。


我们举个例子，假设：我们处于一个页面，这个页面上有一个setTimeout正在执行延时1000ms执行*某段代码*；而在这个200ms的时候，我们点击了一个按钮，因为此时已经满足事件触发条件，且JavaScript线程空闲，所以按照我们的脚本浏览器会立即执行与这个事件绑定的另外*某段代码*；点击事件触发的*某段代码*会做两件事，一件事是注册一个setInterval要求每隔700ms执行*某段代码*；另一件是发送一个ajax请求，并要求请求返回后执行*某段代码*，这个请求会在1500ms后返回。在这之后，可能还会有其它的事件被触发。

上文中，每一个“*某段代码*”都是一个event-handler，而event-handler被触发的时机可能受前面event-handler的影响。我们按照每个event-handler的执行时间都非常短来处理，可以得到如下图所示（上方标示event-handler对应的异步函数，下方标示大致的时间）：

{% img center http://sxxz.u.qiniudn.com/async-javascript-event-driven.png %}

从图中我们能看到事件的执行顺序，这个很容易理解。现在想一下，如果点击事件的event-handler先执行一个while循环执行了100ms，然后再去setInterval和ajax请求，那么执行顺序又是怎样的呢？如果理解了JavaScript的事件驱动机制，这个就很容易了。留一段代码，大家自己尝试一下，是不是跟大家想的一样？
```javascript
var obj = {"num":1},start = new Date;
setTimeout(function(){obj.num= 2;},0);
while(new Date - start < 1000){}
alert(JSON.stringify(obj));
```
或许还可以想到我们平时遇到的一些问题背后的原因：

1.为什么大多情况下setInterval执行间隔会小于setTimeout？

2.为什么setTimeout会有最小间隔？[whatwg](http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html)和[w3c](http://www.w3.org/TR/2011/WD-html5-20110525/timers.html)的HTML5规范都规定4ms。

3.为什么建议将耗时的函数分多次执行？比如，process.nextTick。

###JavaScript异步编程解决方案
现在主要的异步编程的方案有三种：1.PubSub模式（分布式事件）；2.Promise对象；3.工作流控制库。
下面，我们将逐个进行分析：
在这些异步方案之前，我们经常能看到所谓的“金字塔厄运”：
```javascript
asyncFunc1(function(result1){
    //some codes
    asyncFunc2(function(result2){
        //some codes
        asyncFunc3(function(result3){
            //other codes
        });
    });
});
```
那么，我们的解决方案就是使我们能更加方便的组织异步代码，规避像上面那样的问题。

####PubSub模式（分布式事件）
所谓的PubSub模式其实很简单，比如我们平时使用的`dom.addEventListener`就是一个PubSub模式最鲜活的例子。在2000年[DOM Level 2](http://www.w3.org/TR/DOM-Level-2-Events/events.html)发布之前，我们可能需要使用类似于`dom.onclick`的方式去绑定事件。这样很容易产生问题，比如我们有两个event-handler需要绑定到同一个事件上，如果没有分布式事件的话，我们不能：
```javascript onclick
dom.onclick = eventHandler1;
dom.onclick = eventHandler2;
```
很明显，`onclick`只是`dom`的一个属性，同一个key不能对应多个value，第一个会被第二个覆盖掉，所以我们只能：
```javascript onclick
dom.onclick = function(){
    eventHandler1.apply(this,arguments);
    eventHandler1.apply(this,arguments);  
};
```
这样的坏处很多，比如不够灵活，代码冗长，不利于维护等等。

现在开始学习前端，可能已经没有老师或者书籍讲解这样的用法了。`dom.addEventListener`标准化之后，我们可以：
```javascript addEventListener
dom.addEventListener('click',eventHandler1);
dom.addEventListener('click',eventHandler2);
```
而像jQuery这样的类库，也自然磨平了不同浏览器的差异，提供了类似于`$dom.on()`的方法。如今，几乎所有的前端dom相关的类库都会提供类似的API。当然，在JavaScript世界的另一端，nodejs也有核心模块`Events`提供`EventEmitter`对象，从而很容易实现分布式事件：
```javascript EventEmitter
var Emitter = require('events').EventEmitter;
var emitter = new Emitter();
emitter.on('someEvent',function(stream){
    console.log(stream + 'from eventHandler1');
});
emitter.on('someEvent',function(stream){
    console.log(stream + 'from eventHandler2');
});
emitter.emit('someEvent','I am a stream!');
```
我们用DOM举例并不是说明PubSub模式就是事件监听，而是因为事件监听是一个典型的分布式事件的示例，只是我们的订阅和发布依托的对象不是一个常规的对象，而是一个浏览器的DOM对象，而在jQuery中这个对象就是jQuery对象了。下面，我们用最简单的代码实现一个PubSub模式：
```javascript PubSub模式简单实现
var PubSub = {handlers: {}};
PubSub.sub = function(event, handler){
    var handlers = this.handlers;
    !(event in handlers) && handlers[event] = [];
    handlers[event].push(handler);
    return this;
}
PubSub.pub = function(event){
    var handlers = (handlers[event] || []);
    var handlerArgs = [].slice.call(arguments, 1);
    for(var i = 0,item;item = handlers[i];i++){
        item.apply(this, handlerArgs);
    }
    return this;
}
```
如同我们看到的，上面的代码只是一个最简单甚至不安全的实现。在生产环境中，有很多成熟的框架，比如[PubSubJS](https://github.com/mroderick/PubSubJS)这样纯粹的PubSub模式的实现。同时，从上面的实现中，我们能发现，所有的event-handler都是同步执行的，这与我们浏览器中真实点击事件的事件处理时机还是有差异的，真实的点击事件的handler会在后续的event-loop中触发，同样，我们手动的`dom.click()`或者jQuery的`$dom.click()`都是同步执行的（大家可以测试一下）。

PubSub模式是大家最常用的一种方式，相对容易理解。基于这种事件化对象，实现了代码的分层次化，像大名如雷贯耳的Backbone.js也是使用了这样的技术。这是PubSub模式的好处。但是，事件不是万金油，有一些情况不适合用事件来处理，比如一些一次性转化且只有成功或者失败结果的流程，使用PubSub模式就有一些不合适。而这种情景下，Promise就显得更加适合我们。

####Promise对象
Promise在很多语言中都有各自的实现，而其与JavaScript的结缘要归功于JavaScript发展历史上有里程碑意义的Dojo框架。2007年Dojo的开发者受Twisted的启发，为Dojo添加了一个dojo.Deferred对象。2009年，Kris Zyp在CommonJS社区提出了[Promise/A规范](http://wiki.commonjs.org/wiki/Promises/A)。之后，风云变幻，nodejs异军突起（2010年初nodejs放弃了对Promise的原生支持），2011年jQuery1.5携带着“叛逆”的Promise实现以及崭新的ajax风火问世，从此Promise真正被JavaScript开发者所熟知。如今，更多的实现早已关注羽翼更加丰满的[Promise/A+规范](http://promisesaplus.com/)，jQuery对Promise的实现也对标准有所妥协，同时像[Q.js](https://github.com/kriskowal/q)的出现也使得JavaScript世界有了通吃客户端和服务器端的直观且纯粹的实现。就在不远的（2014年12月）将来，JavaScript发展史上有一个重大的时刻将会到来，ES6将成为正式标准，在众多夺人眼球的特性中，对[Promise的原生支持](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-operations-on-promise-objects)仍然不乏瞩目，如果再配以[Generator](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-generator-function-definitions)将是如虎添翼。稍远的将来，ES7会提供一个`async`关键字引导声明的函数，支持`await`，而此番花样将会如何让我们拭目以待。

废话一大篇，下面是正餐：

CommonJS社区的[Promise/A规范](http://wiki.commonjs.org/wiki/Promises/A)相对简洁，而[Promise/A+规范](http://promisesaplus.com/)规范对其作了一些补充，我们后面将以Promise/A+规范配以实例学习Promise。

什么是Promise？Promise是一个对象，它代表异步函数的返回结果。用代码表示也就是：
```javascript Promise
var promise = asyncFunction();
```
如果具象一点，我们常见的一个jQuery的ajax调用就是这样：
```javascript $.ajax with promise
var ajaxPromise = $.ajax('mydata');
ajaxPromise.done(successFunction);
ajaxPromise.fail(errorFunction);
ajaxPromise.always(completeFunction);
```
从上面的代码中，我们看到jQuery返回的Promise对象拥有若干方法，比如`done`、`fail`和`always`分别对应了ajax成功、失败以及无论成功失败都应该执行的回调，这些方法可以看做是规范之上的具体实现带给我们的语法糖。那么，真实的Promise规范是什么样？（其实，规范相对简短，大家可以稍花时间阅读，在此我们做一下主干介绍）

Promise的状态能且只能是下面三种的某一种：`pending`, `fulfilled`, `rejected`。这三种状态之间的关系：<br />
    *pending*:可以转变到fulfilled状态或者rejected状态
    *fulfilled*:不可以转变到其他任何状态，而且必须有一个不可改变的`value`
    *rejected*:不可以转变到其他任何状态，而且必须有一个不可改变的`reason`
关于`value`和`reason`，我们可以分别理解为`fulfilled`的结果和`rejected`的原因。

Promise必须要拥有一个`then`方法，用以访问当前或者最终的`value`或`reason`。`then`方法拥有两个参数，而且这两个参数都是可选的，用`promise.then(onFulfilled, onRejected)`分析如下：
    *onFulfilled*:如果不是函数，将被忽略。
                  如果是函数，只有且必须在promise状态转换为fulfilled之后被触发一次，并且只传递promise的`value`作为第一个参数。
    *onRejected*:如果不是函数，将被忽略。
                 如果是函数，只有且必须在promise状态转换为rejected之后被触发一次，并且只传递promise的`reason`作为第一个参数。

    另外：多次调用then绑定的回调函数，在`fulfilled`或`rejected`的时候，执行顺序与绑定顺序相对应。
          规范要求，调用需要在`then`之后的event loop中执行。

Promise的`then`方法必须返回一个promise对象，以供链式调用，如果onFulfilled或者onRejected有`throw`，那么后生成的Promise对象应该以抛出内容为`reason`转化为`rejected`状态。

在浅析Promise规范之后，我们可以完善一下本章节的第一段代码：
```javascript Promise Chain
var promise = asyncFunction();
promise = promise.then(onFulfilled1, onRejected1)
                 .then(onFulfilled2, onRejected2);

promise.then(onFulfilled3, onRejected3);
```

Promise/A规范的[实现众多](http://promisesaplus.com/implementations)，在我们的实际生产中，我们应该选择哪个实现呢？这个只能说因地制宜。
比如，当我们在[Q.js](https://github.com/kriskowal/q)和jQuery之间权衡的时候，大家可以在stackoverflow上找到[这种](http://stackoverflow.com/questions/13610741/use-jquery-or-q-js-for-promises)。随手贴个之前发的[weibo](http://weibo.com/1827726421/B02znb4MS?mod=weibotime)。

当然，现在应该有很多人和我一样，期待着ES6的原生Promise实现。ES标准化的Promise看上去是这样的：
```javascript Promise Chain
var promise = new Promise(function(resolve, reject) {
  // do a thing, possibly async, then…

  if (/* everything turned out fine */) {
    resolve("Stuff worked!");
  }
  else {
    reject(Error("It broke"));
  }
});

promise.then(function(result) {
  console.log(result); // "Stuff worked!"
}, function(err) {
  console.log(err); // Error: "It broke"
});
```
如果再配以
