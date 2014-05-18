---
layout: post
title: "Async JavaScript"
date: 2014-05-18 17:35
comments: true
categories: JavaScript
---
最近看了一些JavaScript异步编程方面文章，也反复读了几遍薄薄的<a href="http://book.douban.com/subject/24319975/" target="_blank">《Async JavaScript》</a>。总结一下，供自己后续学习使用，并分享给大家。

首先，有几个问题。什么是异步编程/异步函数？异步函数和回调函数有什么关系？为什么异步编程经常与JavaScript同时出现？JavaScript中的异步函数的机制是怎样的？那么现在异步编程有什么解决方案？未来的JavaScript异步编程是什么样子？如果你对上述几个问题已经虽不至“如数家珍”但已是“一目了然”，那么再往下的内容就不适合你。那么，我们开始正餐：

###什么是异步函数？
对于一个jser而言，学习和使用JavaScript的过程中，“异步编程”的出现频率应该是极高的，或许仅次于“事件驱动”、“单线程”等等。那么什么异步编程呢？什么是异步函数呢？言简意赅的说：异步函数就是会导致将来运行**一个取自事件队列的函数**的函数。这里的重点是“取自事件队列”，关于这个概念，我们暂且按下不表，将在后面进行分析，我们现在只需要知道异步函数是会导致将来某个时刻运行另外一个函数的函数。

###异步函数和回调函数有什么关系？
又是一个高频词汇，“回调函数”。在网上的很多文章中都能看到，包括阮一峰老师的<a href="http://www.ruanyifeng.com/blog/2012/12/asynchronous%EF%BC%BFjavascript.html" target="_blank">Javascript异步编程的4种方法</a>中，都将回调函数作为了异步编程的一个解决方案进行总结。对于此，我认为这种理解是不恰当的，回调函数和异步函数是两个完全不同的东西。

所谓回调函数：In computer programming, a callback is **a piece of executable code that is passed as an argument to other code**, which is expected to call back (execute) the argument at some convenient time. **The invocation may be immediate as in a synchronous callback or it might happen at later time, as in an asynchronous callback.** In all cases, the intention is to specify a function or subroutine as an entity that is, depending on the language, more or less similar to a variable.(from <a href="http://en.wikipedia.org/wiki/Callback_(computer_programming)" target="_blank">wikipedia</a>)

从wikipedia的说法中我们可以清晰的看到：首先，回调函数是作为参数传入到另外一段代码中的一段可执行代码，也就是它所强调的是回调函数是需要被当做参数传入到其它代码中的；其次，我们看到，回调函数可以是同步的，也可以是异步的，这取决于使用者。如果我们进入到wikipedia的页面，我们能额外发现一些其它的知识，比如回调函数会出现在拥有某些特性的语言中，那么函数是一等公民的JavaScript当然也就完美支持回调函数了。

那么，现在这两个概念应该比较清晰了，我们再举个例子，稍微说明。比如：
```javascript
function callbackFunc(){
    console.log('callback executed!');
}

setTimeout(callbackFunc,1000);

function syncFunc(callbackFunc){
    callbackFunc();
}

```
在上面的代码片段中，setTimeout是一个异步函数，因为它导致了大约1秒后callbackFunc的运行；而callbackFunc对于setTimeout来说，它是一个回调函数。同时，callbackFunc对于syncFunc来说，它也是一个回调函数，而且是同步执行的，那么syncFunc不能被称为异步函数。

###JavaScript中的异步机制
每一个jser都应该了解，JavaScript是单线程的。所谓“单线程”，就是同一时刻只能执行一个任务，或者说只能有一个函数一个代码片段在执行。那么，我们就很容易想到，如果是单线程，Ajax请求是如何实现的？下面，我们从Ajax可是，说明一下JavaScript的异步机制。
首先，当我们：
```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET','your/ajax/url',true);
xhr.send();

```
