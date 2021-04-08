
function getObj(n) {
    if (document.getElementById) {
      return document.getElementById(n);
    } else if (document.all) {
      return document.all[n];
    } else if (document.layers) {
      return document.layers[n];
    }
    return null;
}

function show(e) {
  getObj(e).style.display = 'block';
}

function showInline(e) {
  getObj(e).style.display = 'inline';
}

function hide(e) {
  getObj(e).style.display = 'none';
}

function goTo(url) {
  document.location.href = url;
}

function getWebSafeString(string) {
    string = string.replace("%", "%25");
    string = string.replace(" ", "%20");
    string = string.replace("!", "%21");
    string = string.replace("\"", "%22");
    string = string.replace("#", "%23");
    string = string.replace("&", "%26");
    string = string.replace("'", "%27");
    string = string.replace("+", "%2b");
    string = string.replace(",", "%2c");
    string = string.replace("/", "%2f");
    string = string.replace("=", "%3d");
    string = string.replace("?", "%3f");
    return string;
}

String.prototype.trim = function() {
    text = this.replace(/^\s+/, '');
    return text.replace(/\s+$/, '');
};

/**
 * Given any text with multiple lines, use this object to parse through the lines one at a time.
 */
function InputText(text) {
    // replace all forms of carriage return with the one we're looking for
    this.text = text.replace(/(\r\n|\r|\n)/g, '\n');

    // method removes and returns the next line of text
    this.getNextLine = function() {
        // nothing left
        if (this.text == null) {
            return null;
        }
        // get the end of the line
        var endOfLine = -1;
        for (var index = 0; index < this.text.length; index++) {
            if (this.text.charAt(index) == '\n') {
                endOfLine = index;
                break;
            }
        }
        // get the text to return
        var returnText;
        if (endOfLine != -1) {
            returnText = this.text.substring(0, endOfLine);
            this.text = this.text.substring(endOfLine+1);
            // nothing left? make text null instead of blank
            if (this.text == '') {
                this.text = null;
            }
        } else {
            returnText = this.text;
            this.text = null;
        }
        return returnText;
    }
}