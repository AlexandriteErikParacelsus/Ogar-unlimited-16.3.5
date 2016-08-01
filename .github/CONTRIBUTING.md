#  Rules for editing

1. Make sure to test your changes, Before opening a pull request.
2. Make sure to follow the rules designated by Micheal Hobbs.

#  Rules for pull requests

1. Make sure to test your changes, Before opening a pull request.
2. Listen well to hound bot
3. Provide a description of what it does
4. Make sure to follow the rules designated by Micheal Hobbs here

# Current Issues

1. Poor Separations of Concerns - this makes it very hard to split parts of the code off into it's own process to support multi-processes. https://en.wikipedia.org/wiki/Separation_of_concerns

2. Poor Encapsulation - this makes issue 1 harder.

3. Poor/No patterns - This goes alone with 1 and 2. Currently, we are working on resolving this by converting the code to an MVC pattern. This will enable us to have a few model object that we can share/pass around and sync with other processes.
 
4. Non-Standard Formatting - I did not realize how much of an issue this was until I tried to merge master and dev. The lack of standard formatting actually cause git to give incorrect results which I had never seen before.
 
# Goals

1. Resolve Issues.

2. Split server process into multiple processes to greatly enhance performance.
 
3. Rewrite bot ai.

4. Device a plugin system with a bare metal api. The API will consist of only the minimal items developers will need to build plugins with out having to touch the core code base.


# Contributing
> This weekend I spent hours dealing with the results of poor coding practices. Nearly all of these appear to have come from the original Ogar project. However many of them have been copied in new work.

## Style, JSHint, Coding Practices, and a primer on ES6 

### Style - .editorconfig - http://editorconfig.org/#overview

### JSHint - http://jshint.com/about/

### Coding Practices

1. Always start each file with <code>'use strict';</code>  This enables a number of safe guards and enables a number of ES6 features in Node.js.

2. Use let over var. There is almost never a case where you should use var instead of let. http://stackoverflow.com/questions/762011/let-keyword-vs-var-keyword

3. Use const over var for require statements. The key word const says this will never change and should not change and will throw an exception if something tries to change it. https://nodejs.org/api/modules.html

4. Encapsulation - The Coders Honor Way 

* Why it's important: http://stackoverflow.com/questions/18300953/why-encapsulation-is-an-important-feature-of-oop-languages

* There are a number of different ways to do encapsulation in JavaScript. Some of the enforcing way are complete and/or cumbersome. We are in the process of converting over to what I call The Coders Honor Way. It's easy to setup and maintain but it's on your honor.

* The block of code below gives a brief overview. Basically it is just a pattern of how to access variables outside of the object that owns them. It uses the typical getter/setter type of contracts. It is not enforceable other than we will reject your pull request/commit if we catch you not using it. 

        'use strict';
        class GameServer {
          constructor() {
            let this.nodes = [];
          }
          getNodes() { return this.nodes; }
          addNode(node) { this.nodes.push(node); }
          removeNode(node) { /* code to remove a node */ }
        }
    
        class PlayerTracker {
          constructor(gameServer) {
            this.gameServer = gameServer;
          }
          update() {
            let newNode = {/* stuff */}; /* some new node
        
            this.gameServer.push(newNode); // This is wrong! It breaks encapsulation!!! VERY BAD!!!
    
            this.gameServer.addNode(newNode); // This is correct! Coder tested, mother approved!
          }
        }
        
### ES6

* Arrow function - The arrow function is just a short hand way to write an anonymous function
 
        let anArray = [1, 2, 3];
        anArray.forEach(function(num){ 
          console.log(num); 
        );
        
        // is the same as the arrow function version
        
        anArray.forEach((num)=>{ console.log(num); });
        
        // it also supports more than one variable
        
        anArray.forEach((element, index, array)=>{ 
          console.log('element: ' + element + '  is the ' + index + ' member of ' + array); 
        });
        
        // Also note that the { } are optional if your function can be expressed in one line
        anArray.forEach((num)=>console.log(num));
        
        // in the case of a one line function, whatever follows the arrow => is an implied return, thus the following works
        let newArray = [ 3, 1, 2 ];
        let sortedArray = newArray.sort((a, b)=>b-a);

## How to Setup Your Dev Environment

### Git

### Node.js & npm

### IDEs - Pick one below

#### Atom (Free)

1. install
2. .editorconfig
3. JSHint
4. ES6

#### Sublime (Free)

1. install
2. .editorconfig
3. JSHint
4. ES6

#### Visual Studio Code (Free)

1. install
2. .editorconfig
3. JSHint
4. ES6

#### WebStorm ($200 a year but it's AWESOME!)

1. install
2. .editorconfig
3. JSHint
4. ES6


# Todo :D
How to do a pull request and how to check that it passes travis-ci and hound-ci.

I'm sure there's more but that is all I can think of for right now. Also, we should do this as a mark down md file. That was they can just click on it on github and it will be all nicely formatted for them.
