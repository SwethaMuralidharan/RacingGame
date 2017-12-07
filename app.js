
var Game = {};
//let spacerWidth,letterWidth,containerWidth; -- Mistake, moves to front when the game ends.
Game.initialize = function(letters, container_el, score_el, spacer_el,spacerWidth,letterWidth,containerWidth) {
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
  this.spacerWidth = spacerWidth || 1; //empty space move width
  this.letterWidth = letterWidth || 10; // set of existing letters moving right width
  this.containerWidth = containerWidth || 500; // entire box width



  this.score = 0;
  this.letterAccelerateByPercent = 0.10;
  this.letterAddSpeed = 1000; // milliseconds => every 1 second, new letter gets added.
  this.currentLetters = []; // array to retain currently existing letter set on screen.
  this.timerID = null; // set by startTimer()
  this.spacerTimerID = null; // set by spacerTimer()


  this.startTimer();
  this.spacerTimer();

  return this;
};

Game.startTimer = function() {
  /*

  The setInterval() method calls a function or evaluates an expression at specified intervals (in milliseconds).
  The setInterval() method will continue calling the function until clearInterval() is called, or the window is closed.
  The ID value returned by setInterval() is used as the parameter for the clearInterval() method.

*/
  var element = this;
  this.timerID = setInterval(function(){
    element.checkIfAtEnd();
    element.checkIfLetterAddShouldAccelerate();
    element.appendLetter();
    element.lettersHTML();
    element.render();
  }, this.letterAddSpeed);
};

Game.spacerTimer = function() {
  /* the spacer bar keeps moving 1px for every 100ms until we reach the end . */
  var element = this;
  this.spacerTimerID = setInterval(function(){
    element.checkIfAtEnd();
    element.currentSpacerWidth = element.currentSpacerWidth + element.spacerWidth;
    element.$spacer.width(element.currentSpacerWidth);
  }, 100);
};

Game.checkIfAtEnd = function() {
  if (this.letterWidth != 0 && this.containerWidth != 0) {
    var widthSum = this.currentLetters.length * this.letterWidth + this.currentSpacerWidth + this.spacerWidth;
    console.log(`Moved distance in pixels ${widthSum}`);
    if(widthSum == this.containerWidth){
      alert("Congratulations! You have Completed. Now Play again and beat your own score.!");
    }
    if (widthSum >= this.containerWidth) {
      console.log("AT END");
      this.stop();

    }

  }
};
Game.stop = function()
{
  clearInterval(this.timerID);
  clearInterval(this.spacerTimerID);
  this.trimFat();
};
Game.trimFat = function()
{
  var widthSum = this.currentLetters.length * this.letterWidth + this.currentSpacerWidth + this.spacerWidth;
  if (widthSum > this.containerWidth)
  {
    this.currentSpacerWidth = this.containerWidth - (this.currentLetters.length * this.letterWidth);
    /*if 2 letters remains at the end, 500-2 =498px is csw; */
    // adjust spacer width to updated width now. so that letters doesn't go at the beginning.
    this.$spacer.width(this.currentSpacerWidth);
  }
};

Game.checkIfLetterAddShouldAccelerate = function() {
  if (this.score != 0 && this.score % 20 == 0) {
    this.letterAddSpeed = this.letterAddSpeed - (this.letterAddSpeed * this.letterAccelerateByPercent);
    this.resetAddLetterTimer();
  }
};
Game.resetAddLetterTimer = function() {
  clearInterval(this.timerID);
  this.startTimer();
};
Game.appendLetter = function() {
  this.currentLetters.push(this.randomLetter());
};
Game.randomLetter = function() {
  var numberLimit = this.letters.length;
  var index = Math.floor((Math.random() * numberLimit) + 1);
  return this.letters[index - 1];
};

Game.lettersHTML = function() {
  var html = "";
  $.each(this.currentLetters, function(k,v) {
    html += "<div class='letter'>" + v.toUpperCase() + "</div>";
  });
  return html;
};
Game.render = function() {
  this.checkIfAtEnd();
  this.$container.html(this.lettersHTML());
  this.$score.html(this.score);
};
Game.checkKey = function(key) {
  /* Get keycode from user entered key and check if its available in the current set of letters.
  inArray() is the jquery method which returns index. (-1 if no match).
  */
  var character = String.fromCharCode(key.which).toLowerCase();
  console.log(character, this.currentLetters, $.inArray(character, this.currentLetters));

  if ($.inArray(character, this.currentLetters) > -1) {
    this.removeFromCurrentLetters(character);
    this.increaseScore();
  } else if ($.inArray(character, this.letters) > -1) {
    this.decreaseScore();
  }
};
Game.increaseScore = function() {
  this.score = this.score + 1;
};

Game.decreaseScore = function() {
  this.score = this.score - 1;
};

Game.removeFromCurrentLetters = function(character) {
  var letterIndex = $.inArray(character, this.currentLetters);
  if (letterIndex > -1) {
    this.currentLetters.splice(letterIndex, 1);
    /*The splice() method changes the contents of an array by removing existing elements  at index. */
  }
};

$(document).ready(function()
{
  var lettersArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
  "t","u", "v", "x", "y", "z"];
  // START
  /*Spacing in between class specifiers means a ascendant -> descendant relationship.
 */
  var game = Game.initialize(lettersArray, $("#container #letters"), $("#score"), $("#container #spacer"));

  $(window).on("keyup", function(event) {

    game.checkKey(event);
    /* Escape key press, stop the game */
        if (event.which == 27)
          game.stop();
      });


  // DEBUG
  console.log(game.$container);
});
