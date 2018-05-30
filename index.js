function Animal (genus, species, name, parentElement, isAlive = true) {

  // THE "NEW" KEYWORD AND "THIS"
  //
  // When I call this function with the "new" keyword, its "this" becomes a brand new,
  // empty object which I can construct to my liking.
  //
  // Then "new" will return that "this" object, without me having to write "return this".
  // So I am using this function to construct and return a new object, which is why it is
  // called a "constructor".
  
  this.genus = genus.toLowerCase()
  this.species = species.toLowerCase()
  this.name = name
  this.isAlive = isAlive
  this.isHungry = true
  
  this.addElement(parentElement) 
  
  // "BIND" AND "THIS"
  //
  // Here we're binding the click handler function to our current context -- our current
  // "this". So whateverFunction.bind(this) lets us bind a SPONTANEOUSLY-CREATED COPY of
  // whateverFunction to the current CONTEXT.
  //
  // This effectively means that that function's code will run as though it had been 
  // written HERE, no matter where the function was originally written!!
  //
  // This is how we can be sure that our click function's internal "this" will always be
  // the same as our constructor's "this".
  //
  // If we want to refer to that particular bound copy of the function later, we'll want
  // to assign it to a variable or property we can reference, because any time we call
  // .bind() again, we'll get another brand new bound copy, not the original bound copy.

  this.boundClickEvent = this.eventListeners.click.bind(this)
  window.document.addEventListener("click", this.boundClickEvent)

}

Animal.prototype = { 

  // USING "THIS" IN THE PROTOTYPE OBJECT
  //
  // All instances of Animal which we create with "new Animal()" will inherit these
  // properties and methods.
  //
  // Any Function-keyword function we write at the top level of this prototype object
  // will be in the CONTEXT of the current instance of Animal. That means "this" in each
  // of those functions will be the instance of Animal by default.

  addElement: function (parentElement) {
    this.element = document.createElement("div")
    this.element.classList.add("animal", this.genus, this.species)
    this.element.id = name
    this.parentElement = parentElement
    this.parentElement.appendChild(this.element)
  },
  
  eat: function (food) {
    if (this.isHungry && food) {
      this.isHungry = false
    }
    console.log(this.name + " is eating " + food + "!")
  },
  
  sleep: function (hours) {
    console.log(this.name + " is sleeping!")
  },

  die: function (how) {
    this.isAlive = false
    console.log(this.name + " is dead! :(")
  },

  // Prototypes are supposed to have a constructor property which points back to the 
  // constructor function (Animal in this case). If you add all your methods by writing
  // "Animal.prototype.doWhatever = function () {}", then you won't have to redefine this
  // constructor property yourself. But in my case, I've completely overwritten the 
  // prototype object by writing "Animal.prototype = {}", so that I can be more concise,
  // but the catch is that I will want to manually assign the constructor property.
  //
  // This property is useful because it lets you dynamically get a reference back to 
  // whatever the constructor function was:
  //
  // For example, later "bernice.constructor" would return the "Animal" function

  constructor: Animal,

  eventListeners: {

    // NESTED OBJECTS
    //
    // By default, functions will get their CONTEXT from the object they're most
    // immediately attached to. So a function defined on an object WITHIN another object
    // will get its CONTEXT (it's "this"), by default, from the nested object, not the
    // "parent" object.
    //
    // Because the following functions are defined in a property object nested within 
    // Animal's prototype, rather than at the top-level of the prototype object itself,
    // the context will be the property object "eventListeners" by default, rather than
    // the prototype, even if we called them directly instead of passing them off to 
    // window.document's addEventListener function. Either way, if we want those
    // functions to run in the CONTEXT of our instance of Animal, we'll use .bind().

    click: function (event) {
      this.eat("ghost juice")
      window.document.removeEventListener("click", this.boundClickEvent)
    },

    contextmenu: function (event) {
      console.log(this)
    },

  },

}


function Mammal (genus, species, name, parentElement, isAlive = true) {

  // As we did in our Animal constructor, when we call "new Mammal()", a brand new, empty
  // object is created and that's what "this" will point to. That new object "this" is
  // pointing to is what we're constructing here.
  // 
  // So anytime we do something like "this.potato = 'yes, please'", we are defining a new
  // property on our new object.
  
  // And since .call() allows us to redefine a function's internal "this" (like .bind()
  // does) and immediately executes it, we can use it to run any arbitrary function's
  // code AS THOUGH that code had really been written in any CONTEXT of our choosing.
  //
  // So when we do "Animal.call(this)" here below, we are running whatever code is inside
  // our Animal constructor AS THOUGH it were inside our instance of Mammal -- as though  
  // all of that code had actually been written right HERE.

  Animal.call(this, genus, species, name, parentElement, isAlive)

  this.isWarmBlooded = true
  this.producesMilk = true
}

// To have our Mammal subclass inherit the prototype methods we defined on our
// Animal.prototype object, we use Object.create() to clone Animal's prototype onto
// Mammal's prototype. 

// When we do this, we will want to manually reassign the prototype's "constructor" 
// property.
//
// For example, later "bennie.constructor" would return the "Mammal" function

Mammal.prototype = Object.create(Animal.prototype)
Mammal.prototype.constructor = Mammal

// Finally, we can "instantiate" unique instances of our Animal and Mammal classes:

const bernice = new Animal("reptile", "lizard", "Bernice", document.querySelector("main"))
const bennie = new Mammal("canine", "wolf", "Bennie", document.querySelector("main"))

// Here, I am defining methods directly on "bennie". Since I'm not defining these on 
// bennie's prototype, these methods will be unique to bennie.

bennie.juggle = function () {
  console.log(this)
  console.log(this.name + " is juggling (mysteriously)!")
}

bennie.resurrect = function (how) {
  this.isAlive = true
  console.log("WTF?! " + this.name + " is alive!")

  if (how) {
    console.log("And this is how:", how)
  }
}

// Here, I am calling the juggle function, but it will execute in the CONTEXT of "bernice"
// instead of "bennie".

bennie.juggle.call(bernice) 

