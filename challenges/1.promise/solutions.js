// Q1
//Let's start by reviewing asynchronous functions! Using setTimeout, print the string 'Hello!' after 1000ms.

function sayHello() {
  setTimeout(() => {
    console.log("Hello!");
  }, 1000);
}

// Q2
// Create a promise. Have it resolve with a value of 'Resolved!' in resolve after a delay of 1000ms, using setTimeout. Print the contents of the promise after it has been resolved by passing console.log to .then
const myPromise = new Promise(resolve => {
  setTimeout(() => {
    resolve("Resolved!");
  }, 1000);
});

myPromise.then(console.log);

// Q3
// Create another promise. Now have it reject with a value of "Rejected!" without using setTimeout. Print the contents of the promise after it has been rejected by passing console.log to .catch
const anotherPromise = new Promise((_, reject) => {
  reject("Rejected!");
});

anotherPromise.catch(console.log);

// Q4
// Promises are asynchronous and we're now going to prove that they indeed are! Create a promise and have it resolve with the value of "Promise has been resolved!" Then uncomment the code at bottom of Challenge 4. What order do we expect "Promise has been resolved!" and "I'm not the promise!" to print? Why?
Promise.resolve("Promise has been resolved!").then(console.log);

// Q5
// Write a function delay that returns a promise. And that promise should return a setTimeout that calls resolve after 1000ms
function delay(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, 1000);
  });
}

// Q6
// This challenge we'll chain promises together using ".then" Create two variables: firstPromise and secondPromise Set secondPromise to be a promise that resolves to "Second!" Set firstPromise to be a promise that resolves to secondPromise Call the firstPromise with a ".then", which will return the secondPromise> promise. Then print the contents of the promise after it has been resolved by passing console.log to .then
let firstPromise;
const secondPromise = Promise.resolve("Second");
firstPromise = Promise.resolve(secondPromise);
firstPromise.then(console.log);

// Q7
// We have a API that gets data from a database, it takes an index parameter and returns a promise Your challenge is to use Promise.all to make 3 API calls and return all the data when the calls are complete
const fakePeople = [
  { name: "Rudolph", hasPets: false, currentTemp: 98.6 },
  { name: "Zebulon", hasPets: true, currentTemp: 22.6 },
  { name: "Harold", hasPets: true, currentTemp: 98.3 }
];

const fakeAPICall = i => {
  const returnTime = Math.floor(Math.random() * 1000);
  return new Promise((resolve, reject) => {
    if (i >= 0 && i < fakePeople.length) {
      setTimeout(() => resolve(fakePeople[i]), returnTime);
    } else {
      reject({ message: "index out of range" });
    }
  });
};

function getAllData() {
  return Promise.all([fakeAPICall(0), fakeAPICall(1), fakeAPICall(2)]).then(
    ([p1, p2, p3]) => {
      return {
        p1,
        p2,
        p3
      };
    }
  );
}
