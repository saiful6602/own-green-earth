1) What is the difference between var, let, and const?

2) What is the difference between map(), forEach(), and filter()?

3) What are arrow functions in ES6?

4) How does destructuring assignment work in ES6?

5) Explain template literals in ES6. How are they different from string concatenation?








Answer:

1) What is the difference between var, let, and const?

1. var = The old way of making variables. It can be changed and even re-made again.
2. let = The modern way. It can be changed, but you cannot make it again with the same name in the same place.
3. const = Once you set it, you cannot change it at all. It stays fixed.

Example,
1. var = a box you can change and reuse many times.
2. let = a box you can change but cannot create another with the same name nearby.
3. const = a locked box, you can’t change what’s inside.









2) What is the difference between map(), forEach(), and filter()?

1. map() = Makes a new array by changing each item.
2. forEach() = Just goes through each item, but does not make a new array.
3. filter() = Makes a new array but only keeps items that pass a test (condition).

Example,

You have apples: [small, big, medium].
1. map()= make them (small for small glass juice, big for big glass juice, medium for medium glass juice).
2. forEach()= just look at each apple one by one.
3. filter()= keep only [big, medium], remove small.








3) What are arrow functions in ES6?

Normal function:

function sayHi(name) {
  return "Hi " + name;
}


Arrow function:

let sayHi = (name) => "Hi " + name;








4) How does destructuring assignment work in ES6?

Destructuring is just a way to take values from an object or array and put them into separate variables quickly.

1.Example with array:

let colors = ["red", "green", "blue"];
let [c1, c2, c3] = colors;

console.log(c1); 

output: red

2.Example with object:

let person = {name: "Saiful", age: 22};
let {name, age} = person;

console.log(name); 

output: Saiful

*writing of person.name every time,I can directly use name.







5) Explain template literals in ES6. How are they different from string concatenation?

Template literals are just a new way to write strings using backticks (`).

1.You can add variables inside ${ }.

2.You can write text in many lines easily.

Example:
let name = "Saiful";
let message = `Hello, ${name}! Welcome.`;

console.log(message); 
output: Hello, Saiful! Welcome.

explanation:
1.Old way: "Hello, " + name + "!"
2.New way: `Hello, ${name}!`

So, template literals = cleaner and more natural way of writing strings.


