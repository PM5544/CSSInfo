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

let domPosition = 0;

class StyleSheet {
  constructor (styleSheet) {
    this.sheet = styleSheet.sheet;

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
  constructor (cssStyleRule) {
    this.cssText = cssStyleRule.cssText;
    this.selectorText = cssStyleRule.selectorText;
    this.domPosition = domPosition++;
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

  aSlice.apply( styleSheets ).forEach((styleSheet)=>{
    new StyleSheet(styleSheet);
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
      let uniqueColors = Object.keys(colors);
      resolve({
        title: 'Number of colors',
        value: uniqueColors.length,
        html: uniqueColors.map((color)=>`<span style="background-color: ${color}; width: 10px; height: 10px; display: inline-block;"></span>`).join(' ')
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
        title: 'Number of !importants',
        value: importants
      });
    });
  },

  function (rules) {
    return new Promise((resolve, reject) => {
      let mostStyles = 0;
      let ruleWithMostStyles;
      rules.forEach((rule) => {
        let styleLength = rule.styles.styles.length;
        if (styleLength > mostStyles) {
          mostStyles = styleLength;
          ruleWithMostStyles = rule;
        }
      });

      console.log(ruleWithMostStyles);

      let formatted = format(ruleWithMostStyles.cssText);
      resolve({
        title: 'Most styles per styleRule',
        value: mostStyles,
        html: `<pre>${formatted}</pre>`
      });
    });
  },

  function (rules) {
    return new Promise((resolve, reject) => {
      let rule = rules[0];
      let highest = rule.selectors[0].specificity;

      let formatted = format(rule.cssText);
      resolve({
        title: 'Highest specificity',
        value: `ids: ${highest[0]}, classes: ${highest[1]}, elements: ${highest[2]}, position: ${highest[3]}`,
        html: `<pre>${formatted}</pre>`
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
      let formatted = format(rule.cssText);

      resolve({
        title: 'Lowest specificity',
        value: `ids: ${lowest[0]}, classes: ${lowest[1]}, elements: ${lowest[2]}, position: ${lowest[3]}`,
        html: `<pre>${formatted}</pre>`
      });
    });
  }

);

const replacers = [
  {from: /{/g, to: '{\n\t'},
  {from: /;\s}/g, to: '@@@'},
  {from: /;/g, to: ';\n\t'},
  {from: /@@@/g, to: ';\n}'}
];
function format (str) {
  replacers.forEach((replacer)=>{
    str = str.replace(replacer.from, replacer.to);
  })
  return str;
}

generateRules();
runAnalysers().then((results) => {

  let overlay = document.createElement('div');
  let fragment = document.createDocumentFragment();

  overlay.style.background = 'white';
  overlay.id = 'cssinfo';
  overlay.style.color = '#44123c';
  overlay.style.lineHeight = 1.1;
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.float = 'left';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.position = 'fixed';
  overlay.style.overflow = 'auto';
  overlay.style.zIndex = 10000;
  overlay.style.padding = '20px';
  overlay.style.display = 'none';

  let h1 = document.createElement('h1');
  h1.textContent = 'CSSInfo stats for: ' + window.location.href;
  h1.style.paddingBottom = '30px';
  fragment.appendChild(h1);

  for (let result of results) {

    let h2 = document.createElement('h2');
    h2.textContent = `${result.title}`;
    h2.style.fontSize = '20px';
    h2.style.marginBottom = '5px';
    h2.style.marginTop = '15px';

    let p = document.createElement('p');
    p.style.marginBottom = '5px';
    p.style.marginTop = '0px';
    p.textContent = `${result.value}`;

    fragment.appendChild(h2);
    fragment.appendChild(p);

    if (result.html) {
      let div = document.createElement('div');
      div.innerHTML = result.html;
      fragment.appendChild(div);
    }
  }

  overlay.appendChild(fragment);
  document.body.appendChild(overlay);

});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {

      let overlay = document.getElementById('cssinfo');
      overlay.style.display = 'block';
    }
  }
);