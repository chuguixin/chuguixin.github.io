---
layout: post
title: "Numbers &amp; Bitwise operators in JavaScript"
date: 2014-06-13 17:59
comments: true
categories: JavaScript
---

这个故事，从Mozilla开发者社区的<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find#Polyfill" target="_blank">这个页面</a>说起，某一次查看这个api的时候，看到这个Polyfill有几行代码：

```javascript event-loop
var list = Object(this);
var length = list.length >>> 0;
```
由于我对位运算符号的了解比较少，大概能明白的只是`list.length >>> 0`对`list.length`做无符号右移，而返回值是`>=`的整数，但背后的运算过程，就不能说得清楚了。恶补一下相关知识，于是，就有了这篇文章。


当下，计算机如此普及，我相信，一个非程序员也都了解：计算机的世界只有0和1。而一个程序员应该了解：0/1组成的东西叫机器数，有原码, 反码, 补码等。而一个JS程序员应该了解：JS中的数字是不分类型的，也就是没有byte/int/float/double等的。而一个稍微研究ES规范的JS程序员应该了解：JS的number是IEEE 754标准下64-bits的双精度数值。而我们接下来要做的，就是对这堆陈述句进行`为什么`和`怎么了`。

从硬件的角度上讲，维护两个状态比较容易，比如一个二极管的导通或者截止，一个电脉冲的高或者低，从而在实现集成电路时候可以更加简单高效，这是我认为计算机最终都是0和1的最主要原因。（个人理解，可能有所偏颇，当然这也不是本文的重点）

只有0和1，如何表示1234567890这么多数字呢？