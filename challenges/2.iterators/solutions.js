// CHALLENGE 1

function sumFunc(arr) {
  let result = 0;
  for (let i = 0; i < arr.length; i += 1) {
    result += arr[i];
  }
  return result;
}

// Uncomment the lines below to test your work
// const array = [1, 2, 3, 4];
// console.log(sumFunc(array)); // -> should log 10

function returnIterator(arr) {
  let i = 0;
  return function() {
    var elem = arr[i];
    i += 1;
    return elem;
  };
}

// Uncomment the lines below to test your work
// const array2 = ["a", "b", "c", "d"];
// const myIterator = returnIterator(array2);
// console.log(myIterator()); // -> should log 'a'
// console.log(myIterator()); // -> should log 'b'
// console.log(myIterator()); // -> should log 'c'
// console.log(myIterator()); // -> should log 'd'

// CHALLENGE 2

function nextIterator(arr) {
  let i = 0;
  return {
    next: function() {
      let elem = arr[i];
      i += 1;
      return elem;
    }
  };
}

// Uncomment the lines below to test your work
// const array3 = [1, 2, 3];
// const iteratorWithNext = nextIterator(array3);
// console.log(iteratorWithNext.next()); // -> should log 1
// console.log(iteratorWithNext.next()); // -> should log 2
// console.log(iteratorWithNext.next()); // -> should log 3

// CHALLENGE 3

function sumArray(arr) {
  let iterator = nextIterator(arr);
  let result = 0;
  while (true) {
    let nextVal = iterator.next();
    if (nextVal === undefined) {
      break;
    }
    result += nextVal;
  }
  return result;
}

// Uncomment the lines below to test your work
// const array4 = [1, 2, 3, 4];
// console.log(sumArray(array4)); // -> should log 10

// CHALLENGE 4

function setIterator(set) {
  const it = set[Symbol.iterator]();
  return {
    next: function() {
      return it.next().value;
    }
  };
}

// Uncomment the lines below to test your work
// const mySet = new Set('hey');
// const iterateSet = setIterator(mySet);
// console.log(iterateSet.next()); // -> should log 'h'
// console.log(iterateSet.next()); // -> should log 'e'
// console.log(iterateSet.next()); // -> should log 'y'

// CHALLENGE 5

function indexIterator(arr) {
  let i = 0;

  return {
    next: function() {
      const pair = [i, arr[i]];
      i += 1;
      return pair;
    }
  };
}

// Uncomment the lines below to test your work
// const array5 = ['a', 'b', 'c', 'd'];
// const iteratorWithIndex = indexIterator(array5);
// console.log(iteratorWithIndex.next()); // -> should log [0, 'a']
// console.log(iteratorWithIndex.next()); // -> should log [1, 'b']
// console.log(iteratorWithIndex.next()); // -> should log [2, 'c']

// CHALLENGE 6

function Words(string) {
  this.str = string;
}

Words.prototype[Symbol.iterator] = function() {
  const words = this.str.split(" ");
  let i = 0;
  return {
    next: function() {
      const pairs = {
        value: words[i],
        done: words[i] === undefined
      };
      i += 1;
      return pairs;
    }
  };
};

// Uncomment the lines below to test your work
// const helloWorld = new Words("Hello World");
// for (word of helloWorld) {
//   console.log(word);
// } // -> should log 'Hello' and 'World'

// CHALLENGE 7

function valueAndPrevIndex(array) {
  let curr = 0;
  let ret = "";
  return {
    sentence: function() {
      if (curr === 0) {
        ret = array[curr] + " was found, it is the first ";
      } else {
        ret = array[curr] + " was found after index " + (curr - 1);
      }

      curr += 1;
      return ret;
    }
  };
}

// const returnedSentence = valueAndPrevIndex([4, 5, 6]);
// console.log(returnedSentence.sentence());
// console.log(returnedSentence.sentence());
// console.log(returnedSentence.sentence());

//CHALLENGE 8

// function* createConversation(str) {
//   setInterval(() => {
//     if (str === "english") {
//       yield("hello there");
//     } else {
//       yield("gibberish");
//     }
//   }, 3000);
// }

// console.log(createConversation("english").next());

//CHALLENGE 9
function waitForVerb(noun) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(noun + " " + "jumps");
    }, 3000);
  });
}

async function f(noun) {
  console.log(await waitForVerb(noun));
}

// f("dog");
