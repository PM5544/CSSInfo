'use strict';

const aSlice = Array.prototype.slice;
let styleSheets =  document.querySelectorAll( "link[rel='stylesheet'], style" );

const selectorSplitter    = /\s*,\s*/;
const idSpecificity       = /#[a-zA-Z0-9-_]+/g;
const classSpecificity    = /(\.|:)[a-zA-Z0-9-_]+/g;
const elementSpecificity  = /\s*[a-zA-Z0-9-_]+/g;

const sheets = [];
const rules = [];

class StyleSheet {
  constructor (styleSheet, index) {
    this.sheet = styleSheet.sheet;
    this.domPosition = index;

    if ( this.sheet.cssRules) {
      this.rules = aSlice.apply( this.sheet.cssRules ).map((rule, index)=>{
        if (1 === rule.type) {
          return new Rule(rule, index)
        }
      });

      sheets.push(this);
    }
  }
}


class Rule {
  constructor (cssStyleRule, index) {
    this.selectorText = cssStyleRule.selectorText;
    this.domPosition = index;
    let selectorsTexts = this.selectorText.split(selectorSplitter);
    this.selectors = selectorsTexts.map(selector=>new Selector(selector, this.domPosition));
    this.styles = new Styles(cssStyleRule.style);
    rules.push(this);
  }
}

class Selector {
  constructor (selector, index) {
    this.selector = selector;
    this.domPosition = index;

    this.specificity = this.getSpecificity();
  }

  getSpecificity () {
    let str = '' + this.selector;

    // check the number id ids in the selector
    let ids  = str.match( idSpecificity );
    if ( ids ) {
        str = str.replace( idSpecificity, ' ' );
    }

    // check the number of classes and pseudo classes used in this selector
    let classes = str.match( classSpecificity );
    if ( classes ) {
        str = str.replace( classSpecificity, ' ' );
    }

    // check the number of element selectors classes used in this selector
    let elements = str.match( elementSpecificity );

    return [
      ids         ? ids.length        : 0, // number of id's in this selector
      classes     ? classes.length    : 0, // number of classes in this selector
      elements    ? elements.length   : 0, // number of element selectors in this selector
      this.domPosition // index of the stylesheet this rule is in and the index of this styleRule within that sheet
    ];
  }
}

class Styles {
  constructor (styles) {
    this.cssText = styles.cssText;
    this.styles = [];
    for ( let i = styles.length - 1; i <= 0; i-- ) {
      let propertyName = styles[i];
      // if('content'===propertyName){
      //   debugger;
      // }
      this.styles.push(new Style(propertyName, styles[propertyName]));
    }
  }
}

class Style {
  constructor (name, value) {
    this.name = name;
    this.value = value;
  }
}

aSlice.apply( styleSheets ).forEach((styleSheet,index)=>{
  new StyleSheet(styleSheet, index);
})

rules.forEach((rule)=>{
  // console.log(rule);
})
