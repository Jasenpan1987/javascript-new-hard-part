# 1. Asynchronous Javascript

Javascript is single threaded, one command executed at a time, and has a synchronous execution model (each line of the code executed in order the code appears)

But let's say we want to get some data from an API, and show it on the console, what can we do?

Solution 1: running sychronously

```js
function display(data) {
  console.log(data);
}

const dataFromApi = fetchAndWait("http://twitter.com/jasen/tweets/1");

display(dataFromApi);

console.log("Me first");
```

During the time of `fetchAndWait` running, the thread is blocked, and no code can ever run. This is not a feasable solution.

In javascript, there are a number of **Browser Features** expose APIs to javascript.

Example: `setTimeout`

```js
function printHello() {
  console.log("hello");
}

setTimeout(printHello, 1000);

console.log("Me first");
```

`setTimeout` works like a facade, it exposes the `setTimeout` to the javascript, but what really happens is `setTimeout` is the timer in web browser, which running in a separate thread. After 1000, the timer will call `printHello` with it's execution context. So here, the javascript will not be blocked during the execution of the `timer` running. SetTimeout does nothing to javascript, it's a browser feature only.

But, what if this

```js
function printHello() {
  console.log("hello");
}

function printHi() {
  // we suppose this function will run for 2 seconds
  for (var i = 0; i < 100000000; i += 1) {
    console.log("hi");
  }
}

setTimeout(printHello, 1000);

printHi(); // after 2 seconds

console.log("Me first");
```

When we call `setTimeout`, it will be put into the browser code, and javascript will not care it anymore until the callback is called.

And in the javascript world, it will start to run `printHi` for 2 seconds, but after 1 second, the timer is completed, BUT, the javascript is still running, so the `printHello` will still not getting called.

After the `printHello` completed, the `Me first` will be logged, and finnally, the `printHello` will executed. Here javascript and the browser has a rule: the defered code only be able to come back to javascript when the call stack is empty, and the javascript engine will continuesly check whether the javascript call stack is empty, if so, it will push the defered call on to the call stack.

In general, the output will look like this

```js
Hi
Hi
...
10000000 times
Me first
hello
```

This mechanism is called **The event loop**.

http://csbin.io/promises

Solution 2: callback
