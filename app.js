
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
  this.spacerWidth = spacerWidth || 1;
  this.letterWidth = letterWidth || 10;
  this.containerWidth = containerWidth || 500;



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

Game.startTimer = function() {
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
    console.log(widthSum);
    if(widthSum == this.containerWidth){
      alert("Congratulations! You have Completed. Now Play again and beat your own score.!");
    }
    if (widthSum >= this.containerWidth) {
      console.log("AT END");
      this.stop();
    }

  }
};
Game.stop = function() {
  clearInterval(this.timerID);
  clearInterval(this.spacerTimerID);
  this.trimFat();
};
Game.trimFat = function() {
  var widthSum = this.currentLetters.length * this.letterWidth + this.currentSpacerWidth + this.spacerWidth;
  if (widthSum > this.containerWidth) {
    this.currentSpacerWidth = this.containerWidth - (this.currentLetters.length * this.letterWidth);
    // adjust spacer width
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
  }
};

$(document).ready(function()
{
  var lettersArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
  "t","u", "v", "x", "y", "z"];
  // START
  var game = Game.initialize(lettersArray, $("#container #letters"), $("#score"), $("#container #spacer"));

  $(window).on("keyup", function(event) {

    game.checkKey(event);



  // DEBUG
  console.log(game.$container);
});
