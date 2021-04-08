
var white = '#fff';
var red = '#f00';
var green = '#0f0';

Letter.letter_pk = 0;
function Letter(letter) {
    this.pk = Letter.letter_pk++;
    this.letter = letter;
    this.id = this.letter + '-' + this.pk;
    this.backgroundColor = white;
    this.setBackgroundColor = function(color) {
        this.backgroundColor = color;
        if (getObj(this.id)) {
            getObj(this.id).style.backgroundColor = color;
        }
    }
    this.display = function() {
        if (isIPhone) {
            return '<div class="letter" id="' + this.id + '" onClick="clickLetter(\'' + this.letter + '\', this)"><img src="http://jotto.augiehill.com/images/letters/iphone/' + this.letter + '.png" /></div>';
        } else {
            return '<div class="letter" id="' + this.id + '" onClick="clickLetter(\'' + this.letter + '\', this)"><img src="http://jotto.augiehill.com/images/letters/' + this.letter + '.png" /></div>';
        }
    }
}

Letter.letter_set_pk = 0;
function LetterSet(string) {
    this.pk = Letter.letter_set_pk++;
    this.string = string;
    this.numTheSameAsSecret;
    this.array = [];
    for (var i = 0; i < string.length; i++) {
        this.array[i] = new Letter(string.charAt(i));
    }
    this.display = function() {
        var r = '';
        for (var i = 0; i < this.array.length; i++) {
            r = r + this.array[i].display();
        }
        return r;
    }
    this.containsLetter = function(l) {
        for (var i = 0; i < this.string.length; i++) {
            if (this.string.charAt(i) == l) {
                return true;
            }
        }
        return false;
    }
    this.indexOfLetter = function(l) {
        for (var i = 0; i < this.string.length; i++) {
            if (this.string.charAt(i) == l) {
                return i;
            }
        }
        return -1;
    }
    this.getLetter = function(index) {
        return this.string.charAt(index);
    }
    this.setColor = function(index, color) {
        this.array[index].setBackgroundColor(color);
    }
    this.setLetterColor = function(letter, color) {
        var letterIndex = this.indexOfLetter(letter);
        if (letterIndex != -1) {
            this.setColor(letterIndex, color);
        }
    }
    this.getColor = function(index) {
        return this.array[index].backgroundColor;
    }
    this.getColorOfLetter = function(letter) {
        for (var i = 0; i < this.array.length; i++) {
            if (this.array[i].letter == letter) {
              return this.array[i].backgroundColor;
            }
        }
        return null;
    }
    this.changeColorAll = function(c) {
        for (var i = 0; i < this.array.length; i++) {
            this.array[i].setBackgroundColor(c);
        }
    }
    this.changeColorAllFrom = function(c1,c2) {
        for (var i = 0; i < this.array.length; i++) {
            if (this.array[i].backgroundColor == c1) {
                this.array[i].setBackgroundColor(c2);
            }
        }
    }
    this.applyColorsFrom = function(ls) {
        for (var i = 0; i < this.array.length; i++) {
            for (var j = 0; j < ls.array.length; j++) {
                if (this.array[i].letter == ls.array[j].letter && ls.array[j].backgroundColor != white) {
                    this.array[i].setBackgroundColor(ls.array[j].backgroundColor);
                }
            }
        }
    }
    this.countLettersWithColor = function(c) {
        var count = 0;
        for (var i = 0; i < this.array.length; i++) {
            if (this.array[i].backgroundColor == c) {
                count++;
            }
        }
        return count;
    }
    this.countSameLetters = function(ls) {
        var count = 0;
        for (var i = 0; i < this.array.length; i++) {
            if (ls.containsLetter(this.array[i].letter)) {
                count++;
            }
        }
        return count;
    }
    this.getSameLetters = function(ls) {
        var r = [];
        for (var i = 0; i < this.array.length; i++) {
            if (ls.containsLetter(this.array[i].letter)) {
                r[r.length] = this.array[i].letter;
            }
        }
        return r;
    }
    this.countSameLettersWithColor = function(ls,c) {
        var count = 0;
        for (var i = 0; i < this.array.length; i++) {
            if (ls.containsLetter(this.array[i].letter)) {
                if (this.array[i].backgroundColor == c && ls.getColorOfLetter(this.array[i].letter) == c) {
                    count++;
                }
            }
        }
        return count;
    }
    this.getSameLettersWithColor = function(ls,c) {
        var r = [];
        for (var i = 0; i < this.array.length; i++) {
            if (ls.containsLetter(this.array[i].letter)) {
                if (this.array[i].backgroundColor == c && ls.getColorOfLetter(this.array[i].letter) == c) {
                    r[r.length] = this.array[i].letter;
                }
            }
        }
        return r;
    }
    this.countDifferentLetters = function(ls) {
        var count = 0;
        for (var i = 0; i < this.array.length; i++) {
            if (!ls.containsLetter(this.array[i].letter)) {
                count++;
            }
        }
        return count;
    }
    this.getDifferentLetters = function(ls) {
        var r = [];
        for (var i = 0; i < this.array.length; i++) {
            if (!ls.containsLetter(this.array[i].letter)) {
                r[r.length] = this.array[i].letter;
            }
        }
        return r;
    }
    this.getDifferentLettersWithColor = function(ls,c) {
        var r = [];
        for (var i = 0; i < this.array.length; i++) {
            if (!ls.containsLetter(this.array[i].letter) && this.array[i].backgroundColor == c) {
                r[r.length] = this.array[i].letter;
            }
        }
        return r;
    }
    this.getLettersWithColor = function(c) {
        var r = [];
        for (var i = 0; i < this.array.length; i++) {
            if (this.array[i].backgroundColor == c) {
              r[r.length] = this.array[i].letter;
            }
        }
        return r;
    }
}

function getNumberTheSame(word1, word2) {
  var same = 0;
  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 5; j++) {
      if (word1.charAt(i) == word2.charAt(j)) { 
        same++;
      }
    }
  }
  return same;
}