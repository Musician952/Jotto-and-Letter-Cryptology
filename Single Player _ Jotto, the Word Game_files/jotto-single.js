
var alphabet = new LetterSet("abcdefghijklmnopqrstuvwxyz");
var computerAid = true;
var secretWord = '';
var name = 'Anonymous';
var guesses = new Array();
var gameID = '0';
var gameKey = '';
var isIPhone = false;

function begin(n,l,d,c) {
  // get the player's name
  if (n != '') {
      name = n;
  } else {
      error('startError', 'Please enter a name before playing.');
      // require user to enter a name
      return;
  }
 
  // hide the start form
  hide('start-form');
  show('gameboard');

  // should the computer help?
  if (c != 'true') {
      c = 'false';
  }
  computerAid = (c == 'true');
  if (computerAid) {
    getObj('showComputerAid').innerHTML = 'On';
  } else {
    getObj('showComputerAid').innerHTML = 'Off';
    hide('report');
  }

  // show
  getObj('showName').innerHTML = name;
  getObj('showLetters').innerHTML = l;
  getObj('showDifficulty').innerHTML = d;

  // facebook
  var facebook = '';
  

  // get the secret word for this game
  ajax.get('http://jotto.augiehill.com/scripts/secret.jsp?letters=' + l + facebook + '&computer=' + c + '&name=' + getWebSafeString(name) + '&difficulty=' + getWebSafeString(d), function(r) {
      var inputText = new InputText(r);
      var isError = inputText.getNextLine();
      if (isError == 'true') {
          var error = inputText.getNextLine();
      } else {
          gameID = inputText.getNextLine();
          getObj('gameID').value = gameID;
          gameKey = inputText.getNextLine();
          getObj('gameKey').value = gameKey;
      }

      // set up the letter board
      getObj('alphabet').innerHTML = alphabet.display();

      // start the game
      freshGuess();
  });
}

var lastTimeout;
function error(id, e) {
  if (lastTimeout) { 
      clearTimeout(lastTimeout);
  }
  getObj(id).innerHTML = e;
  show(id);
  lastTimeout = setTimeout('hide(\''+ id + '\')', 3000);
}

function submitGuess() {
    // get the guess
    var guessNum = guesses.length;
    var guess = getObj('guess-' + guessNum).value;
    if (guess == null || guess == '') {
        return false;
    }
    if (guess.length < 5) {
        return false;
    }
    // disable the text field to prevent double guesses
    getObj('guess-' + guessNum).setAttribute('disabled', 'disabled');
    guess = guess.toLowerCase().substring(0, 5);

    // process guess
    try {
      // same letter used more than once?
      for (var i = 0; i < 5; i++) {
        if (guess.lastIndexOf(guess.charAt(i)) != guess.indexOf(guess.charAt(i))) {
          throw 'Same letter used more than once';
        }
      }

      // not a word?
      if (!Dictionary.contains(guess)) {
        throw 'Not a known word.';
      }

      // already guessed?
      for (var j = 0; j < guessNum; j++) {
        if (guesses[j].string == guess) {
          throw 'Already guessed.';
        }
      }

      // ajax, then process
      ajax.get('http://jotto.augiehill.com/scripts/numberTheSame.jsp?gameID=' + gameID + '&gameKey=' + gameKey + '&guessNum=' + guessNum + '&word=' + getWebSafeString(guess), function(t) {
          var inputText = new InputText(t);
          var guessNum = inputText.getNextLine();
          var r = inputText.getNextLine();
          try {
            // error
            if (r == -1) {
                throw("An unknown error occurred.");
            }
            // win
            if (r == 99) {
                
                goTo('single-win.jsp?gameID=' + gameID + '&gameKey=' + gameKey + '&guess-' + guessNum + '=' + getWebSafeString(guess));
            }

            // good guess! make an object
            guesses[guessNum] = new LetterSet(guess);
            guesses[guessNum].numTheSameAsSecret = r;

            // tell the user the result
            guessContainerElement = getObj('guess-container-' + guessNum);
            if (guessContainerElement != null) {
                guessContainerElement.innerHTML = guesses[guessNum].display() + '&nbsp;&nbsp;&nbsp;&nbsp;' + r;
            }

            // computer help
            if (computerAid) {
                processGuess();
            } else {
                guesses[guessNum].applyColorsFrom(alphabet);
            }

            // get a new guess
            freshGuess();
          } catch (err) {
            error('error', err);
            // clear the text
            getObj('guess-' + guessNum).value = '';
            getObj('guess-' + guessNum).removeAttribute('disabled');
            getObj('guess-' + guessNum).focus();
          }
      });
    } catch (err) {
      error('error', err);
      // clear the text
      getObj('guess-' + guessNum).value = '';
      getObj('guess-' + guessNum).removeAttribute('disabled');
      getObj('guess-' + guessNum).focus();
    }
    return false;
}

function handleEnter(field, event) {
  var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
  if (keyCode == 13) {
    return false;
  }
  return true;
}

function handleKeyUp() {
    if (submitGuess()) {
        getObj('guesses-form').submit();
    }
}

function freshGuess() {
  getObj('new-guesses-' + guesses.length).innerHTML = '<div id="new-guesses-' + (guesses.length + 1) + '"></div><div class="guess" id="guess-container-' + guesses.length + '"><input type="text" maxlength="5" name="guess-' + guesses.length + '" id="guess-' + guesses.length + '" class="guess-text" onkeypress="return handleEnter(this,event)" onkeyup="handleKeyUp()"></div>';
  // try one way
  document.forms['guesses-form'].elements['guess-' + guesses.length].focus();
  // try the other
  getObj('guess-' + guesses.length).focus();
}

function updateFoundLetters() {
    var array = alphabet.getLettersWithColor(green);
    if (array.length > 0) {
        var string = '';
        for (var i = 0; i < array.length; i++) {
            string = string + array[i];
        }
        getObj("found-letters").innerHTML = new LetterSet(string).display();
    } else {
        getObj("found-letters").innerHTML = '&nbsp;';
    }
}

function clickLetter(l,o) {
  if (!computerAid) {
    if (o.style.backgroundColor == '#ffffff' || o.style.backgroundColor == 'rgb(255, 255, 255)') {
      o.style.backgroundColor = '#ff0000';
      setLetterColor(l,red);
    } else if (o.style.backgroundColor == '#ff0000' || o.style.backgroundColor == 'rgb(255, 0, 0)') {
      o.style.backgroundColor = '#00ff00';
      setLetterColor(l,green);
    } else if (o.style.backgroundColor == '#00ff00' || o.style.backgroundColor == 'rgb(0, 255, 0)') {
      o.style.backgroundColor = '#ffffff';
      setLetterColor(l,white);
    } else {
      o.style.backgroundColor = '#ff0000';
      setLetterColor(l,red);
    }
    updateFoundLetters();
  }
}

function setLetterColor(l,c) {
    // was this color already determined? stop
    if (computerAid && alphabet.getColorOfLetter(l) != white) {
        return false;
    }

    alphabet.setLetterColor(l, c);
    for (var i = 0; i < guesses.length; i++) {
      guesses[i].setLetterColor(l,c);
    }

    // check the alphabet for completeness
    if (computerAid) {
      if (alphabet.countLettersWithColor(green) == 5) {
          var whiteLetters = alphabet.getLettersWithColor(white);
          for (var i = 0; i < whiteLetters.length; i++) {
              setLetterColor(whiteLetters[i], red);
          }
      } else if (alphabet.countLettersWithColor(red) == alphabet.array.length - 5) {
          var whiteLetters = alphabet.getLettersWithColor(white);
          for (var i = 0; i < whiteLetters.length; i++) {
              setLetterColor(whiteLetters[i], green);
          }
      }
    }
    updateFoundLetters();
    return true;
}

function processGuess() {
    guesses[guesses.length - 1].applyColorsFrom(alphabet);
    
    // Basics
    var changeMade = true;
    while (changeMade) {
        changeMade = false;
        for (var i = guesses.length - 1; i >= 0; i--) {
            // are the remaining white all red?
            if (guesses[i].numTheSameAsSecret == guesses[i].countLettersWithColor(green)) {
              // all the white letters are red
              for (var l = 0; l < 5; l++) {
                if (guesses[i].getColor(l) == white) {
                  setLetterColor(guesses[i].getLetter(l), red);
                  changeMade = true;
                }
              }
            }
            // are the remaining white all green?
            else if (guesses[i].countLettersWithColor(white) == guesses[i].numTheSameAsSecret - guesses[i].countLettersWithColor(green)) {
              // all the white letters are green
              for (var l = 0; l < 5; l++) {
                if (guesses[i].getColor(l) == white) {
                  setLetterColor(guesses[i].getLetter(l), green);
                  changeMade = true;
                }
              }
            }
        }
    }

  changeMade = true;
  while (changeMade) {
      changeMade = false;
      /**
       * LEGEND
       *  (_) = GREEN
       *  |_| = RED
       *   _  = WHITE
       **/
      // go through all of the guesses backwards to reevaluate
        for (var i = guesses.length-1; i >= 0; i--) {
          /**
           * Update the guesses that have found all the wrong letters determined and still have neutrals.
           * Example:
           *   before:   |L||I||G||H|T           1
           *   after:    |L||I||G]|H|(T)         1
           */
           if (5 - guesses[i].numTheSameAsSecret == guesses[i].countLettersWithColor(red) && guesses[i].countLettersWithColor(white) > 0) {
               var whiteLetters = guesses[i].getLettersWithColor(white);
               for (var m = 0; m < whiteLetters.length; m++) {
                   changeMade = changeMade || setLetterColor(whiteLetters[m], green);
               }
           }
           /**
            * Update the guesses that have found some of the right letters and all of the wrong letters and still has neutrals
            * Example:
            *   before:   (N)|I||G|HT           3
            *   after:    (N)|I||G|(H)(T)       3
            */
           if (guesses[i].countLettersWithColor(white) == guesses[i].numTheSameAsSecret - guesses[i].countLettersWithColor(green)) {
               var whiteLetters = guesses[i].getLettersWithColor(white);
               for (var m = 0; m < whiteLetters.length; m++) {
                   changeMade = changeMade || setLetterColor(whiteLetters[m], green);
               }
           }

          /**
           * Update the guesses that have found all the right letters and still have neutrals.
           * Example:
           *   before:   (N)IGHT           1
           *   after:    (N)|I||G||H||T|   1
           */
           if (guesses[i].numTheSameAsSecret == guesses[i].countLettersWithColor(green) && guesses[i].countLettersWithColor(white) > 0) {
               var whiteLetters = guesses[i].getLettersWithColor(white);
               for (var m = 0; m < whiteLetters.length; m++) {
                   changeMade = changeMade || setLetterColor(whiteLetters[m], red);
               }
           }

           // go backwards through the guesses up to the top
           for (var j = 0; j < i; j++) {

              /**
               * Compare two guesses. Order matters.
               * Example:
               *    before:   NIGHT      2
               *              LIGHT      1
               *    after:   (N)IGHT     2
               *             |L|IGHT     1
               */
              if (5 - guesses[j].countSameLetters(guesses[i]) == guesses[j].numTheSameAsSecret - guesses[i].numTheSameAsSecret) {
                 // for all of the letters in the word
                 for (var k = 0; k < 5; k++) {
                    if (!guesses[i].containsLetter(guesses[j].getLetter(k))) {
                       changeMade = changeMade || setLetterColor(guesses[j].getLetter(k), green);
                    }
                    if (!guesses[j].containsLetter(guesses[i].getLetter(k))) {
                       changeMade = changeMade || setLetterColor(guesses[i].getLetter(k), red);
                    }
                 }

              }
              /**
               * Same thing as above, reversed order.
               */
              else if (5 - guesses[i].countSameLetters(guesses[j]) == guesses[i].numTheSameAsSecret - guesses[j].numTheSameAsSecret) {
                // for all of the letters in the word
                for (var k = 0; k < 5; k++) {
                  if (!guesses[i].containsLetter(guesses[j].getLetter(k))) {
                    changeMade = changeMade || setLetterColor(guesses[j].getLetter(k), red);
                  }
                  if (!guesses[j].containsLetter(guesses[i].getLetter(k))) {
                    changeMade = changeMade || setLetterColor(guesses[i].getLetter(k), green);
                  }
                }

              }

              /**
               * Example:
               *    before:
               *             (in alphabet) 4 green
               *              M|O||D|(A)L      2
               *              Y|I|(E)L|D|      2
               *    after:    (in alphabet) 5 green
               *              |M||O||D|(A)(L)      2
               *              |Y||I|(E)(L)|D|      2
               */
              /** GAVE INCORRECT RESULTS (Game #1939)
              if (alphabet.countLettersWithColor(green) == 4 && guesses[i].countLettersWithColor(white) == 2 && guesses[j].countLettersWithColor(white) == 2 && guesses[i].countSameLettersWithColor(guesses[j], white) == 1) {
                  // same white letter between the two is green
                  changeMade = changeMade || setLetterColor(guesses[i].getSameLettersWithColor(guesses[j], white)[0], green);
                  // different letters between the two are red
                  changeMade = changeMade || setLetterColor(guesses[i].getDifferentLettersWithColor(guesses[j], white)[0], red);
                  changeMade = changeMade || setLetterColor(guesses[j].getDifferentLettersWithColor(guesses[i], white)[0], red);
              }
                **/

              /**
               * Example:
               *    before:   |L|IGHT    1
               *              NIGHT      1
               *    after:    |L|IGHT    1
               *              |N|IGHT    1
               */
              if (guesses[i].numTheSameAsSecret == guesses[j].numTheSameAsSecret && guesses[i].countDifferentLetters(guesses[j]) > 0 && guesses[i].countSameLetters(guesses[j]) > 0) {
                  var differentRedLettersInI = guesses[i].getDifferentLettersWithColor(guesses[j], red);
                  var differentLettersInJ = guesses[j].getDifferentLetters(guesses[i]);
                  if (5 - guesses[i].countSameLetters(guesses[j]) == differentRedLettersInI.length) {
                      // all different letters in j should be red, too
                      for (var k = 0; k < differentLettersInJ.length; k++) {
                          changeMade = changeMade || setLetterColor(differentLettersInJ[k], red);
                      }
                  }
                  var differentRedLettersInJ = guesses[j].getDifferentLettersWithColor(guesses[i], red);
                  var differentLettersInI = guesses[i].getDifferentLetters(guesses[j]);
                  if (5 - guesses[j].countSameLetters(guesses[i]) == differentRedLettersInJ.length) {
                      // all different letters in i should be red, too
                      for (var k = 0; k < differentLettersInI.length; k++) {
                          changeMade = changeMade || setLetterColor(differentLettersInI[k], red);
                      }
                  }
              }

              /**
               * Conditions:   In i, # white == 2
               *               In j, # the same with secret == 1 AND # green == 0
               *               The 2 white letters in i are also white in j
               * Action:       All white letters in j that are not white in i should now be red.
               *
               * Example:
               *    before:   H(A)T(E)|D|     3
               *              |L|IGHT         1
               *    after:    H(A)T(E)|D|     3
               *              |L||I||G|HT     1
               */
              if (guesses[i].countLettersWithColor(white) == 2 && guesses[j].numTheSameAsSecret == 1 && guesses[j].countLettersWithColor(green) == 0) {
                  var whiteLettersInI = guesses[i].getLettersWithColor(white);
                  if (guesses[j].getColorOfLetter(whiteLettersInI[0]) == white && guesses[j].getColorOfLetter(whiteLettersInI[1]) == white) {
                      for (var k = 0; k < 5; k++) {
                          if (whiteLettersInI[0] != guesses[j].getLetter(k) && whiteLettersInI[1] != guesses[j].getLetter(k) && guesses[j].getColor(k) == white) {
                              changeMade = changeMade || setLetterColor(guesses[j].getLetter(k), red);
                          }
                      }
                  }
              }

              /**
               * Compare groups of words - up to 5.
               * Here's one that probably won't come up too much:  I started the first game with
                  the combo "quack, vixen, fjord, tombs, glyph".  The total of all of their scores
                  was six.  That can only happen if there's an O in the secret word.  The
                  generalization here is, "If a set of words has the maximum total score that it
                  can theoretically have (given current knowledge), then the unknown letters with
                  the most overlap are positive."  (The statement could stand to be a little more
                  specific, but the grammar would have been awful.)
               *
               */
               // check for j, i group
               if (5 + guesses[i].countSameLetters(guesses[j]) == guesses[i].numTheSameAsSecret + guesses[j].numTheSameAsSecret) {
                   var sameLetters = guesses[i].getSameLetters(guesses[j]);
                   for (var a = 0; a < sameLetters.length; a++) {
                       changeMade = changeMade || setLetterColor(sameLetters[a], green);
                   }
               }
               /**
                * Caused an error on 'dough' in http://jotto.augiehill.com/single-game.jsp?i=1354
               for (var k = j+1; k < i; k++) {
                  // check for j, i, k group
                  if (5 + guesses[i].countSameLetters(guesses[j]) + guesses[i].countSameLetters(guesses[k]) == guesses[i].numTheSameAsSecret + guesses[j].numTheSameAsSecret + guesses[k].numTheSameAsSecret && guesses[i].countSameLetters(guesses[j]) == guesses[i].countSameLetters(guesses[k]) && guesses[i].countSameLetters(guesses[j]) == guesses[j].countSameLetters(guesses[k])) {
                     var sameLetters = guesses[i].getSameLetters(guesses[j]);
                     for (var a = 0; a < sameLetters.length; a++) {
                         changeMade = changeMade || setLetterColor(sameLetters[a], green);
                     }
                  }
                  for (var l = k+1; l < i; l++) {
                      // check for j, i, k, l group
                      if (5 + guesses[i].countSameLetters(guesses[j]) + guesses[i].countSameLetters(guesses[k]) + guesses[i].countSameLetters(guesses[l]) == guesses[i].numTheSameAsSecret + guesses[j].numTheSameAsSecret + guesses[k].numTheSameAsSecret + guesses[l].numTheSameAsSecret && guesses[i].countSameLetters(guesses[j]) == guesses[i].countSameLetters(guesses[k]) && guesses[i].countSameLetters(guesses[j]) == guesses[j].countSameLetters(guesses[k]) && guesses[i].countSameLetters(guesses[j]) == guesses[j].countSameLetters(guesses[l])) {
                         var sameLetters = guesses[i].getSameLetters(guesses[j]);
                         for (var a = 0; a < sameLetters.length; a++) {
                             changeMade = changeMade || setLetterColor(sameLetters[a], green);
                         }
                      }
                      for (var m = l+1; m < i; m++) {
                        // check for j, i, k, l, m group
                        if (5 + guesses[i].countSameLetters(guesses[j]) + guesses[i].countSameLetters(guesses[k]) + guesses[i].countSameLetters(guesses[l]) + guesses[i].countSameLetters(guesses[m]) == guesses[i].numTheSameAsSecret + guesses[j].numTheSameAsSecret + guesses[k].numTheSameAsSecret + guesses[l].numTheSameAsSecret + guesses[m].numTheSameAsSecret && guesses[i].countSameLetters(guesses[j]) == guesses[i].countSameLetters(guesses[k]) && guesses[i].countSameLetters(guesses[j]) == guesses[j].countSameLetters(guesses[k]) && guesses[i].countSameLetters(guesses[j]) == guesses[j].countSameLetters(guesses[l]) && guesses[i].countSameLetters(guesses[j]) == guesses[j].countSameLetters(guesses[m])) {
                           var sameLetters = guesses[i].getSameLetters(guesses[j]);
                           for (var a = 0; a < sameLetters.length; a++) {
                               changeMade = changeMade || setLetterColor(sameLetters[a], green);
                           }
                        }
                      }
                   }
               }
               **/
           }
        }
  }
}