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

# 2. Promise

Async Promise, like `fetch`, is a new kind of facade function in javascript, it has two parts: the first part is the web brwoser stuff, it fires the http request to the server, and the second part, returns a object with a "value" placeholder for the value it gets back from the server. Once the data gets back from the server, the value will be replaced with that data, and the promise automatically triggers a `onfullfilment` function.
Solution 2

## 2.1 Basic Promise

```js
function display(data) {
  // 1
  console.log(data);
}

const futureData = fetch("http://twitter/jasen/tweets/1"); // 2

futureData.then(display); // 3

console.log("Me first"); // 4
```

What does the above code does?

1: creates a space in the memory, and put the function into the memory and give it a name called `display`

2: creates a space in the memory, and call it `futureData`. Then it calls the fetch facade function fetch, one part of fetch triggers an XMLHttpRequest from the browser, and simutainously, the fetch returns an object like this `{ value: undefined, onFullfilment: [] }`, where the onFullfilment is like an array of functions that will be called when the data from the XMLHttpRequest comes back.

3: call the `.then` method on `futureData` object, and under the hood, it pushes the `display` function into the `onFullfilment` array.

4: console.log "Me first".

When the data (let's say it's a string of "hi") comes back from the server, "hi" will be assigned to `futureData.value`, and tiggers the `onFullfilment` methods with "hi" as the argument.

The `.then` doesn't necessary what inside will be called later, it pushes the inner function into the `onFullfilment` array.

## 2.2 How our promise deferred functionality gets back into javascript

```js
function display(data) {
  // 1
  console.log(data);
}

function pritHello() {
  // 2
  console.log("hello");
}

function blockFor300ms() {
  // 3
  // blocks js thread for 300ms with a loop
}

setTimeout(printHello, 0); // 4

const futureData = fetch("http://twitter/jasen/tweets/1"); // 5

futureData.then(display); // 6

blockFor300ms(); // 7
// which will run first?
console.log("Me first"); // 8
```

Let's take a look what is happening

1, 2, 3: register `display`, `pritHello` and `blockFor300ms` on the memory.

4: trigger the `timer` on the web browser with a reference of `printHello` and 0.

4.1: the timer immeditely completed, and returns the `printHello` call to the javascript callback queue.

5: register the memory for `futureData`, and call the `fetch` facade, which does two things: makes an XMLHttpRequest (web browser) to get data, and returns back `{ value: undefined, onFullfilment: [] }` to the javascript code.

6: it pushes the `display` function to the `onFullfilment` array by calling the `.then` method.

7: runs the `blockFor300ms` function, and now the call stack is blocked.

7.1: but let's say at 290ms, the response from fetch comes back with `"hi"`, it will return the call of `dispay("hi")` to the javascript. But here, it's not pushes it to the "callback queue", it pushes `dispay("hi")` to another queue called "Microtask Queue".

8: after 300ms, the `blockFor300ms` completed, and removed away from the call stack, and `Me first` gets printed to the console.

Right now, we have two queues:

1. The callback queue, with `printHello()`
2. The microTask queue with `dispay("hi")`
   It turn out, the microTask Queue has higher piority than the callback queue, which means the event loop will ALWAYS check if the microTask queue is ready to push to the call stack before the callback queue.

So, now, the call stack is empty, and the `display("hi")` gets to run first, and after this, the microTask queue is also empty, the `printHello()` gets executed.

# 3. Iterators

We regularly have lists or collections or data when we want to go through each one of them and do some stuff to the element

```js
const numbers = [2, 4, 6, 1, 9];

for (let i = 0; i < numbers.length; i += 1) {
  console.log(numbers[i]);
}
```

The above implementation is hard to reason because we have to keep tracking on `i` as well as the current `number[i]`.

## 3.1 Function returns a function

```js
function createFn() {
  // 1
  function add2(num) {
    return num + 2;
  }
  return add2;
}

const newFn = createFn(); // 2
const result = newFn(4); // 3
```

1: register `createFn` on memory (global execution context).
2: call the `createFn` and get the result of the reference in memory of `add2` (not the add2 itself), and store the value on `newFn`
3: call the `newFn` with 4 and store the value on `result`

## 3.2 Return next element with a function

```js
function createFn(arr) {
  let i = 0;
  function inner() {
    const elem = arr[i];
    i += 1;
    return elem;
  }
  return inner;
}

const returnNextElem = createFn([1, 2, 3, 4]);
```

It turned out, if we return a function from a function, it not just return the function itself, it also return the data inside the execution context with the function.

When `returnNextElem` executed, it looks for the `arr` and `i` in its local execution context, but it doesn't found them, next, it will start to look at the execution context returned with the function, not the global execution context.

Each time we call `returnNextElem`, we gets back the next element of the `arr`.

Any function like the above one, when gets called each time it gives me the next flow of data is called iterator.

# 4. Generator

Generator creates the flow of data like we did earlier, each time we call `next`, we will get the next piece of the data

```js
function* createFlow() {
  yield 3;
  yield 4;
  yield 5;
}

const flow = createFlow();
flow.next(); // { value: 3, done: false }
flow.next(); // { value: 4, done: false }
flow.next(); // { value: 5, done: false }
flow.next(); // { value: undefined, done: true }
```

Let's build a generator liked function

```js
function gen(values) {
  let i = 0;
  let ret;

  return {
    next: function() {
      ret = {
        value: values[i],
        done: i < values.length
      };
      return ret;
    }
  };
}
```

## 5.1 Generator work through

We can also dynamically set what data flows to us

```js
// a
function* createFlow() {
  const num = 10; // a1
  const newNum = yield num; // a2
  yield 5 + num; // a3
  yield 6; // a4
}

const nextElem = createFlow(); // b
const elem1 = nextElem.next(); // 10 // c
const elem2 = nextElem.next(2); // 7 // d
const elem3 = nextElem.next(); // 6 // e
```

What happened with the above code?

**for simplicity reason, we just pretend the return of generator is just the value not the object with value and done**

a: declear a generator function in memory called create flow

b: store the returned value of `createFlow`, something like `{ next: fn }`, into `nextElem`

c: declear `elem1`, set its value of `nextElem.next()` call, notice here, the call is different to other function calls, it opens the `createFlow`'s execution context, which bring us back to a1.

a1: creates an variable num and assign 10 to it

a2: `yield` is a special keyword, it works like `return`, but it will kind of pause the execution context of `createFlow`, and it will throw the value 10 to line c, and at this time, `newNum` is undefined, it is waiting for the value come back from the outside call, and it hand over the control to line c.

c: it takes 10 and assign it to `elem1`, and it will continuesly run line d.

d: declear `elem2` and call `nextElem.next` with 2, now, it re-open the `createFlow`'s execution context, and it takes us back to line a2

a2: replace the `yield num` with value 2, and now, `newNum` will be assigned with 2

a3: throw the value of `5 + 2` to the line d.

d: get back 7 from the `nextElem.next(2)` call, and store it to vairable elem2.

e: delear another variable `elem3` and call `nextElem.next`, the call, again, will take us back to the `createFlow`'s execution context, and fires line a4

a4: throw 6 to the line e

e: get back 6 from `nextElem.next` call, and store it into variable `elem3`.

## 5.2 Async Generator

```js
// 1
function doWhenDataReceived(value) {
  // c
  returnNextElem.next(value);
}

// 2
function* createFlow() {
  // a
  const data = yield fetch("http://twitter.com/jasen/tweets/1");
  // b
  console.log(data);
}

// 3
const returnNextElem = createFlow();
// 4
const futureData = returnNextElement.next();
// 5
futureData.then(doWhenDataReceived);
```

What does it do when execute?

1: declear a function in memory called `doWhenDataReceived`

2: declear a generator function called `createFlow`

3: declear `returnNextElem` which value is the return value of the `createFlow` call (`{ next: fn }`)

4: declear `futureData` which is the output of the `returnNextElem.next`'s call, enters the `createFlow`'s context at a

a: declear `data` and give it undefined, and at the same time, the `fetch` fires, which is a facade function, does two things: fires the xhr from the browser and returns back a promise object. And the promise object will be thrown back to line 4.

4: now the `futureData` becomes to an promise object (`{ value: undefined, onFullfilled: [] }`).

5: add `doWhenDataReceived` to the `futureData`'s `onFullfilment` array.

_after twitter gives us back the data "hi":_

5: the `futureData.value` gets update with "hi", and it the `doWhenDataReceived` goes into the microTask queue, since here we don't have any calls on the call stack, `doWhenDataReceived` will be pushed into the call stack and executed with the string "hi" as the argument

c: it creates an execution context, and it calls the `returnNextElem.next` with the value "hi" and it takes us back to a

a: `data` will be assigned with the value "hi"

b: console.log the data which is "hi"
