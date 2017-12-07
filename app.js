// Requirements:
//
//  • Random letters appear in a containing <div> element, 1000px wide, at an interval of 1 second.
//
//  • Every 100 milliseconds, all the existing letters move right by 10px.
//
//  • Pressing a correct letter removes the oldest instance of that letter, and increases the score by 1 point.
//
//  • Pressing a letter that isn't on the page decreases the score by 1 point.
//
//  • Pressing Escape ends the game.
//
//  • If a letter gets all the way to the right-hand side of the container, the game is over.
//
//  • For every 20 letters that have been found, the interval of letter creation decreases by 10%.

var Game = {};

Game.initialize = function(letters, container_el, score_el, spacer_el, spacerWidth, letterWidth, containerWidth) {
  console.log(container_el);
  console.log(score_el);
  console.log(spacer_el);
  console.log(spacerWidth);
  console.log(letterWidth);
  console.log(containerWidth);
//Initializing values
this.letters = letters;
this.$container = container_el;
this.$score = score_el;
this.$spacer = spacer_el;

  this.currentSpacerWidth = 0;
  this.spacerWidth = spacerWidth || 1; // requirements call for 10px, but I found that's way too much for a playable game
  this.letterWidth = letterWidth || 10;
  this.containerWidth = containerWidth || 1000;



  this.score = 0;
  this.letterAccelerateByPercent = 0.10;
  this.letterAddSpeed = 1000; // milliseconds
  this.currentLetters = [];
  this.timerID = null; // set by startTimer()
  this.spacerTimerID = null; // set by spacerTimer()


  this.startTimer();
  this.spacerTimer();

  return this;
};


// DOM READY

$(document).ready(function()
{
  var lettersArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
  "t","u", "v", "x", "y", "z"];
  // START
  var game = Game.initialize(lettersArray, $("#container #letters"), $("#score"), $("#container #spacer"));



  // DEBUG
  console.log(game.$container);
});
