'use strict';

const aSlice = Array.prototype.slice;
let styleSheets =  document.querySelectorAll('link[rel=\'stylesheet\'], style');

const selectorSplitter    = /\s*,\s*/;
const idSpecificity       = /#[a-zA-Z0-9-_]+/g;
const classSpecificity    = /(\.|:)[a-zA-Z0-9-_]+/g;
const elementSpecificity  = /\s*[a-zA-Z0-9-_]+/g;
const important           = /!important/g;

const sheets = [];
const rules = [];

const analysers = [];

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
    this.cssText = cssStyleRule.cssText;
    this.selectorText = cssStyleRule.selectorText;
    this.domPosition = index;
    let selectorsTexts = this.selectorText.split(selectorSplitter);
    this.selectors = selectorsTexts.map(selector=>new Selector(selector, this.domPosition));
    if (1<this.selectors.length){
      this.selectors.sort(specificitySort);
    }

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
    for ( let i = styles.length - 1; i >= 0; i-- ) {
      let propertyName = styles[i];
      this.styles.push(new Style(propertyName, styles[propertyName]));
    }
  }

}

class Style {
  constructor (name, value) {
    this.name = name;
    this.value = value;
    this.important = important.test(this.value);
  }
}


// utils
function specificitySort (a,b) {
  const aSpec = a.specificity;
  const bSpec = b.specificity;

  for ( let i = 0, len = aSpec.length; i < len; i++  ) {
    if ( aSpec[ i ] !== bSpec[ i ] ) {
      if ( aSpec[ i ] > bSpec[ i ] ) {
        return -1;
      } else {
        return 1;
      }
    }
  }
  return 0;
}



function generateRules () {
  sheets.length = 0;
  rules.length = 0;

  aSlice.apply( styleSheets ).forEach((styleSheet,index)=>{
    new StyleSheet(styleSheet, index);
  });

  rules.sort((a,b)=>{
    return specificitySort(a.selectors[0],b.selectors[0]);
  });

  // rules.forEach((rule)=>{
  //   if (rule.selectors && 1 < rule.selectors.length) {
  //     console.log(rule);
  //   }
  // });
}


function runAnalysers () {

  return Promise.all(analysers.map((fn)=>fn(rules)))
    .then((res)=> res, (err)=>{
      console.error(err);
    })
  ;
}


analysers.push(

  function (rules) {
    return new Promise((resolve, reject) => {
      resolve({
        title: 'Number of rules',
        value: rules.length
      });
    });
  },

  function (rules) {
    return new Promise((resolve, reject) => {
      const colors = {};
      rules.forEach((rule)=>{
        rule.styles.styles.forEach((style) => {
          if ('color' === style.name) {
            colors[style.value] = true;
          }
        });
      });


      resolve({
        title: 'Number of colors',
        value: Object.keys(colors)
      });
    });
  },

  function (rules) {
    return new Promise((resolve, reject) => {
      let importants = 0;
      rules.forEach((rule)=>{
        rule.styles.styles.forEach((style) => {
          if (style.important) {
            importants++;
          }
        });
      });
      resolve({
        title: 'number of !importants',
        value: importants
      });
    });
  },

  function (rules) {
    return new Promise((resolve, reject) => {
      let mostStyles = 0;
      rules.forEach((rule) => {
        let styleLength = rule.styles.styles.length;
        if (styleLength > mostStyles) {
          mostStyles = styleLength;
        }
      });
      resolve({
        title: 'Most number of styles per rstyleRule',
        value: mostStyles
      });
    });
  },

  function (rules) {
    return new Promise((resolve, reject) => {
      let rule = rules[0];
      let highest = rule.selectors[0].specificity;

      resolve({
        title: 'Highest specificity',
        value: `ids: ${highest[0]}, classes: ${highest[1]}, elements: ${highest[2]}, position: ${highest[3]}
${rule.cssText}`
      });
    });
  }
  ,

  function (rules) {
    return new Promise((resolve, reject) => {
      let rule = rules[rules.length - 1 ];
      let selectors = rule.selectors;
      let selector = selectors[selectors.length - 1];
      let lowest = selector.specificity;

      resolve({
        title: 'Lowest specificity',
        value: `ids: ${lowest[0]}, classes: ${lowest[1]}, elements: ${lowest[2]}, position: ${lowest[3]}
${rule.cssText}`
      });
    });
  }

);



generateRules();
runAnalysers().then((results) => {

  let overlay = document.createElement('div');

  overlay.style.background = 'white';
  overlay.style.color = 'white';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.float = 'left';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.position = 'fixed';
  overlay.style.zIndex = 100000;
  overlay.style.padding = '20px';

  let title = document.createElement('h1');
  title.textContent = 'CSSInfo stats for: ' + window.location.host;
  title.style.paddingBottom = '30px';
  overlay.appendChild(title);

  for (let result of results) {
    let line = document.createElement('h1');

    line.textContent = `${result.title}: ${result.value}`;
    line.style.fontSize = '24px';
    title.style.marginBottom = '0';
    overlay.appendChild(line);
  }

  document.body.appendChild(overlay);

});
