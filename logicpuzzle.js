/*
All input needs to solve the puzzle:
- Actors
- Attributes
- Hints
*/

const logicPuzzle = {
    actors: {
        name: 'Nationaliteit',
        elements: ['Leuken', 'Altweerterheide', 'Tungelroy', 'Swartbroek', 'Stramproy']
    },
    attributes: [{
        name: 'Positie',
        elements: ['1', '2', '3', '4', '5']
    }, {
        name: 'Caravan',
        elements: ['Hout', 'Luxe', 'Steen', 'Kunststof', 'Roest']
    }, {
        name: 'Drank',
        elements: ['Rode Wijn', 'Cognac', 'Water', 'Gin-Tonic', 'Cola']
    }, {
        name: 'Club',
        elements: ['Rapiditas', 'FC Laar', 'BSW', 'HV Weert', 'RKSVV']
    }, {
        name: 'Woonhuis',
        elements: ['Appartement', 'Tweekapper', 'Rijtjeshuis', 'Boerderij', 'Vrijstaand']
    }],

    hints: [
        {relation: {a: 'Leuken', b: 'Roest', bool: true}},
        {relation: {a: 'Altweerterheide', b: 'Appartement', bool: true}},
        {relation: {a: 'Rapiditas', b: 'Tweekapper', bool: true}},
        {rule: {a: 'Rijtjeshuis', type: 'nextTo', c: 'Positie', b: 'FC Laar'}},
        {relation: {a: '1', b: 'Stramproy', bool: true}},
        {relation: {a: 'Tungelroy', b: 'Rode Wijn', bool: true}},
        {relation: {a: 'Cognac', b: 'BSW', bool: true}},
        {relation: {a: '3', b: 'Water', bool: true}},
        {relation: {a: 'Swartbroek', b: 'HV Weert', bool: true}},
        {rule: {a: 'Hout', type: 'leftOf', c: 'Positie', b: 'Steen'}},
        {rule: {a: 'RKSVV', type: 'nextTo', c: 'Positie', b: 'Boerderij'}},
        {rule: {a: 'RKSVV', type: 'nextTo', c: 'Positie', b: 'Gin-Tonic'}},
        {relation: {a: 'Hout', b: 'Cola', bool: true}},
        {rule: {a: 'Stramproy', type: 'nextTo', c: 'Positie', b: 'Kunststof'}},
        {relation: {a: 'Luxe', b: 'FC Laar', bool: true}},
    ]
};


// An element is any single actor or attribute, like 'Noor' or 'Rood'
class Element {
  groupName;
  name;

  constructor(name, groupName) {
    this.name = name;
    this.groupName = groupName;
  }

  toString() {
    return `${this.name} (${this.groupName})`;
  }

  getName() {return this.name}
  getGroupName() {return this.groupName}
}

// A relation is a combination of two elements, like 'Noor' and 'Rood' (a 'box' in the schema)
// A relation can be true ('X' in the schema), false ('-' in the schema) or unknown (' ' in the schema).
class Relation {
  elementA;
  elementB;
  bool;

  constructor(elementA, elementB, bool) {
    this.elementA = elementA;
    this.elementB = elementB;
    this.bool = bool;
  }

  toString() {
    return `${this.elementA} - ${this.elementB} is ${this.bool}`;
  }

  setBool(bool) {this.bool = bool}

  getA() {return this.elementA}
  getB() {return this.elementB}
  getBool() {return this.bool}
}

// A rule can be a general rule that applies to all logic puzzles, or set by a hint
// A rules has 1 or more conditions that must be true or flase.
// If all conditions are met, 1 of more statements can be set to true or false.
class Rule {

  conditions = [];
  statements = [];

  constructor() {
    //
  }

  addCondition(relation, bool) {
    let newRelation = new Relation(relation.getA(), relation.getB());
    newRelation.setBool(bool);
    this.conditions.push(newRelation);
  }  

  addStatement(relation, bool) {
    let newRelation = new Relation(relation.getA(), relation.getB());
    newRelation.setBool(bool);
    this.statements.push(newRelation);
  }

  toString() {
    let strA = "";
    for(let condition of this.conditions) {
      if(strA !== "") {
        strA += ', and '
      }
      strA += condition.toString();
    }
    
    let strB = "";
    for(let statement of this.statements) {
      if(strB !== "") {
        strB += ', and '
      }
      strB += statement.toString();
    }
    
    let str = `If ${strA}, then ${strB}`;

    return str;
  }

  getConditions() {return this.conditions}
  getStatements() {return this.statements}
}

// Basically is a relation.
// Should rewrite this, but I dont want to.
class Hint {

  relation;

  constructor(relation) {
    this.relation = relation;
  }

  toString() {
    return this.relation.toString();
  }

  getRelation() {return this.relation}
}

// Main shizzle.
function solve() {

  drawLogigram();

  // Sets up the big table for solving the puzzle
  function drawLogigram() {
    let div = document.getElementById("logigram");
    let table = document.createElement('table');
    let tr;
    let td;
    let span;
    
    // First row, with attribute names
    tr = document.createElement('tr');
    td = document.createElement('td');
    td.setAttribute('class', 'noBorder');
    tr.appendChild(td);
    td = document.createElement('td');
    td.setAttribute('class', 'noBorder');
    tr.appendChild(td);
  
    for(let i=0; i<logicPuzzle.attributes.length; i++) {
      td = document.createElement('td');
      tr.appendChild(td);
      td = document.createElement('td');
      td.setAttribute('colspan', 5);
      td.setAttribute('class', 'groupNamesHorizontal');
      td.innerHTML = logicPuzzle.attributes[i].name;
      tr.appendChild(td);
    }
    table.appendChild(tr);  
  
    // Second row, with attribute elements
    tr = document.createElement('tr');
    td = document.createElement('td');
    td.setAttribute('class', 'noBorder');
    tr.appendChild(td);
    td = document.createElement('td');
    td.setAttribute('class', 'noBorder');
    tr.appendChild(td);
  
    for(let i=0; i<logicPuzzle.attributes.length; i++) {
      td = document.createElement('td');
      tr.appendChild(td);
      for(let element of logicPuzzle.attributes[i].elements) {
        td = document.createElement('td');
        td.setAttribute('class', 'elementNamesHorizontal');
        span = document.createElement('span');
        span.innerHTML = element;
        td.appendChild(span);
        tr.appendChild(td);
      }
    }
    table.appendChild(tr);  
  
    tr = document.createElement('tr');
    table.appendChild(tr);  
  
    // Add rows for actors
    tr = document.createElement('tr');
    td = document.createElement('td');
    td.setAttribute('class', 'groupNamesVertical');
    td.setAttribute('rowspan', logicPuzzle.actors.elements.length)
    span = document.createElement('span');
    span.innerHTML = logicPuzzle.actors.name;
    td.appendChild(span);
    tr.appendChild(td);
    
    for(let i=0; i<logicPuzzle.actors.elements.length; i++) {
      if(i!=0) {
        tr = document.createElement('tr');
      }
      td = document.createElement('td');
      td.setAttribute('class', 'elementNamesVertical');
      td.innerHTML = logicPuzzle.actors.elements[i]
      tr.appendChild(td);
  
      for(let j=0; j<logicPuzzle.actors.elements.length; j++) {
        td = document.createElement('td');
        tr.appendChild(td);
        for(let k=0; k<logicPuzzle.actors.elements.length; k++) {
          td = document.createElement('td');
          td.setAttribute('class', 'relation');
          td.setAttribute('elementA', logicPuzzle.actors.elements[i]);
          td.setAttribute('elementB', logicPuzzle.attributes[j].elements[k]);
          tr.appendChild(td);
        }
      }
      table.appendChild(tr);  
    }
  
    // Add all attributes
    for(let i=logicPuzzle.attributes.length-1; i>0; i--) {
      
      tr = document.createElement('tr');
      table.appendChild(tr);  
  
      tr = document.createElement('tr');
      td = document.createElement('td');
      td.setAttribute('class', 'groupNamesVertical');
      td.setAttribute('rowspan', logicPuzzle.actors.elements.length)
      span = document.createElement('span');
      span.innerHTML = logicPuzzle.attributes[i].name;
      td.appendChild(span);
      tr.appendChild(td);
      
      for(let j=0; j<logicPuzzle.attributes[i].elements.length; j++) {
        if(j!=0) {
          tr = document.createElement('tr');
        }
        td = document.createElement('td');
        td.setAttribute('class', 'elementNamesVertical');
        td.innerHTML = logicPuzzle.attributes[i].elements[j]
        tr.appendChild(td);
        for(let k=0; k<i; k++) {
          td = document.createElement('td');
          tr.appendChild(td);
          for(let l=0; l<logicPuzzle.attributes.length; l++) {
            td = document.createElement('td');
            td.setAttribute('class', 'relation');
            td.setAttribute('elementA', logicPuzzle.attributes[i].elements[j]);
            td.setAttribute('elementB', logicPuzzle.attributes[k].elements[l]);
            tr.appendChild(td);
          }
        }
        table.appendChild(tr);  
  
      }
    }
  
    div.appendChild(table);  
  }

  let elements = [];
  let relations = [];
  let rules = [];
  let hints = [];

  createElements();
  createRelations();
  createRules();
  createHints();

  processHints();

  // Add all individual actors and all elements of every attribute to the array
  function createElements() {
    for(let actor of logicPuzzle.actors.elements) {
      elements.push(
        new Element(
          actor,
          logicPuzzle.actors.name
        )
      )
    }
  
    for(let attribute of logicPuzzle.attributes) {
      for(let element of attribute.elements) {
        elements.push(
          new Element(
            element,
            attribute.name
          )
        )
      }
    }
  }  
    
  // Adds every relation between an element and another element to the array
  // Only adds A-B, not B-A.
  function createRelations() {
    let size = logicPuzzle.actors.elements.length;
    for(let a=0; a<elements.length; a++) {
      for(let b=Math.floor(a/size)*size+size; b<elements.length; b++) {
        relations.push(new Relation(
          elements[a],
          elements[b]
        ));
      }
    }
  }

  function createRules() {

    // If from one group of relations, one relation is true, the other relations are false    
    for(baseRelation of relations) {
      let rule = new Rule();

      rule.addCondition(baseRelation, true);

      for(otherRelation of relations) {
        if(
          (
            otherRelation.getA().getName() == baseRelation.getA().getName()
            &&
            otherRelation.getB().getGroupName() == baseRelation.getB().getGroupName()
            &&
            otherRelation.getB().getName() != baseRelation.getB().getName()
          ) || (
            otherRelation.getB().getName() == baseRelation.getB().getName()
            &&
            otherRelation.getA().getGroupName() == baseRelation.getA().getGroupName()
            &&
            otherRelation.getA().getName() != baseRelation.getA().getName()
          )
        ) {
          rule.addStatement(otherRelation, false);
        }
      }

      rules.push(rule);
    }    

    // If relations A-B is true and relation B-C is false, relation A-C is also false
    for(relationAB of relations) {

      for(relationBC of relations) {
        let rule = new Rule();
        rule.addCondition(relationAB, true);
        rule.addCondition(relationBC, false);
        if(
          relationAB.getA().getName() == relationBC.getB().getName() && 
          relationAB.getB().getGroupName() != relationBC.getA().getGroupName() 
        ) {
          rule.addStatement(
            new Relation(
              getElementByName(relationAB.getB().getName()),
              getElementByName(relationBC.getA().getName())
            ),
            false
          );
          rules.push(rule);
        }
        if(
          relationAB.getA().getName() == relationBC.getA().getName() &&
          relationAB.getB().getGroupName() != relationBC.getB().getGroupName()
        ) {
          rule.addStatement(
            new Relation(
              getElementByName(relationAB.getB().getName()),
              getElementByName(relationBC.getB().getName())
            ),
            false
          );
          rules.push(rule);
        }
        if(
          relationAB.getB().getName() == relationBC.getB().getName() &&
          relationAB.getA().getGroupName() != relationBC.getA().getGroupName()
        ) {
          rule.addStatement(
            new Relation(
              getElementByName(relationAB.getA().getName()),
              getElementByName(relationBC.getA().getName())
            ),
            false
          );
          rules.push(rule);
        }
        if(
          relationAB.getB().getName() == relationBC.getA().getName() &&
          relationAB.getA().getGroupName() != relationBC.getA().getGroupName()
        ) {
          rule.addStatement(
            new Relation(
              getElementByName(relationAB.getA().getName()),
              getElementByName(relationBC.getB().getName())
            ),
            false
          );
          rules.push(rule);
        }
      }
    } 
    
    // If from one group of relations, all relations but one are false, the one relation is true.    
    for(baseRelation of relations) {
      let rule = new Rule();
      rule.addStatement(baseRelation, true);
      for(otherRelation of relations) {
        if(
          otherRelation.getA().getName() == baseRelation.getA().getName()
          &&
          otherRelation.getB().getGroupName() == baseRelation.getB().getGroupName()
          &&
          otherRelation.getB().getName() != baseRelation.getB().getName()
        ) {
          rule.addCondition(otherRelation, false);
        }
      }
      rules.push(rule);

      rule = new Rule();
      rule.addStatement(baseRelation, true);
      for(otherRelation of relations) {
        if(
          (otherRelation.getB().getName() == baseRelation.getB().getName())
          &&
          (otherRelation.getA().getGroupName() == baseRelation.getA().getGroupName())
        ) {
          if(otherRelation.getA().getName() != baseRelation.getA().getName()) {
            rule.addCondition(otherRelation, false);
          }
        }
      }
      rules.push(rule);
    }
    
  }

  // Processes all hints:
  // Hints that are in fact relations, are added to the hints array.
  // Hints that are rules are processed by type. 
  // For each type, those rules lead to more specific rules, which are added to the rules array.
  // For each type, those rules lead also to relations, which are added to the relations array. 
  function createHints() {

    for(let hint of logicPuzzle.hints) {
      
      // Relations
      if (hint.relation != undefined) {
        hints.push(
          new Hint(
            new Relation(
              getElementByName(hint.relation.a),
              getElementByName(hint.relation.b),
              hint.relation.bool
            )
          )
        )
      }

      // Rules
      if (hint.rule != undefined) {  
   
        if(hint.rule.type != 'leftOf' && hint.rule.type != 'nextTo') {
          window.alert('Illegal hint type');
        }

        if(hint.rule.type == 'leftOf') {

          let elementsForC = getElementsByGroupName(hint.rule.c);

          // A can't be the biggest
          hints.push(
            new Hint(
              new Relation(
                getElementByName(hint.rule.a),
                getElementByName(elementsForC[elementsForC.length-1]),
                false
              )
            )
          )
          
          // B can't be the smallest
          hints.push(
            new Hint(
              new Relation(
                getElementByName(hint.rule.b),
                getElementByName(elementsForC[0]),
                false
              )
            )
          )

          // If A is known, B is known too
          for(let i=0; i<elementsForC.length-1; i++) {
            let rule = new Rule();
            rule.addCondition(
              new Relation (
                getElementByName(hint.rule.a),
                getElementByName(elementsForC[i])
              ),
              true
            );

            rule.addStatement(
              new Relation (
                getElementByName(hint.rule.b),
                getElementByName(elementsForC[i+1])
              ),
              true
            );

            rules.push(rule);
          }


          // If B is known, A is known too
          for(let i=1; i<elementsForC.length; i++) {
            let rule = new Rule();
            rule.addCondition(
              new Relation (
                getElementByName(hint.rule.b),
                getElementByName(elementsForC[i])
              ),
              true
            );

            rule.addStatement(
              new Relation (
                getElementByName(hint.rule.a),
                getElementByName(elementsForC[i-1])
              ),
              true
            );
            
            rules.push(rule);
          }

          // If A is false for some position, B is false for the position to the left
          for(let i=0; i<elementsForC.length-1; i++) {
            let rule = new Rule();
            rule.addCondition(
              new Relation (
                getElementByName(hint.rule.a),
                getElementByName(elementsForC[i])
              ),
              false
            );

            rule.addStatement(
              new Relation (
                getElementByName(hint.rule.b),
                getElementByName(elementsForC[i+1])
              ),
              false
            );

            rules.push(rule);
          }

          // If B is false for some position, A is false for the position to the right
          for(let i=0; i<elementsForC.length-1; i++) {
            let rule = new Rule();
            rule.addCondition(
              new Relation (
                getElementByName(hint.rule.b),
                getElementByName(elementsForC[i+1])
              ),
              false
            );

            rule.addStatement(
              new Relation (
                getElementByName(hint.rule.a),
                getElementByName(elementsForC[i])
              ),
              false
            );

            rules.push(rule);
          }
        } 

        if(hint.rule.type == 'nextTo') {
          
          // A-B can't exist
          hints.push(
            new Hint(
              new Relation(
                getElementByName(hint.rule.a),
                getElementByName(hint.rule.b),
                false
              )
            )
          );

          let elementsForC = getElementsByGroupName(hint.rule.c);

          // If A is known, all but the positions next to A can be eliminated for B
          for(let i=0; i<elementsForC.length; i++) {
            let rule = new Rule();

            rule.addCondition(
              new Relation (
                getElementByName(hint.rule.a),
                getElementByName(elementsForC[i])
              ),
              true
            );

            for(let j=0; j<elementsForC.length; j++) {
              if(j != i-1 && j != i+1) {
                rule.addStatement(
                  new Relation (
                    getElementByName(hint.rule.b),
                    getElementByName(elementsForC[j])
                  ),
                  false
                );
              }
            }

            rules.push(rule);
          }

          // If B is known, all but the positions next to B can be eliminated for A
          for(let i=0; i<elementsForC.length; i++) {
            let rule = new Rule();

            rule.addCondition(
              new Relation (
                getElementByName(hint.rule.b),
                getElementByName(elementsForC[i])
              ),
              true
            );

            for(let j=0; j<elementsForC.length; j++) {
              if(j != i-1 && j != i+1) {
                rule.addStatement(
                  new Relation (
                    getElementByName(hint.rule.a),
                    getElementByName(elementsForC[j])
                  ),
                  false
                );
              }
            }
            
            rules.push(rule);
          }
        }
      }
    }    
  }

  // Process all hints, deducing included
  function processHints() {
    for(hint of hints) {
      setRelation(
        hint.getRelation()
      );

      // Just do it three times te be sure that the complete table is filled.
      // I'm sure there is a bug somewhere, but I don't feel like finding it...
      checkRules();
      checkRules();
      checkRules();
    }
  }

  // Makes a relation true or false
  // which leads to a - or a X in the table
  function setRelation(relation) {
    let bool = relation.getBool();
    relation.setBool(undefined);
    relation = getRelation(relation);
    if(relation.getBool() == undefined) {
      relation.setBool(bool);
    }

    let selector = `[elementa="${relation.getA().getName()}"][elementb="${relation.getB().getName()}"]`
    td = document.querySelector(selector);
    if(td == null) {
      selector = `[elementa="${relation.getB().getName()}"][elementb="${relation.getA().getName()}"]`
      td = document.querySelector(selector);
    }
    
    bool ? td.innerHTML = '<div style="color: green">X</div>' : td.innerHTML = '<div style="color: red">-</div>';
  }

  // Returns the relation from the array that matches
  function getRelation(relationA) {
    for(let relationB of relations) {
      if(relationA.getBool() == undefined || relationA.getBool() == relationB.getBool()) {
        if (
          (relationA.getA() == relationB.getA() && relationA.getB() == relationB.getB()) 
          || 
          (relationA.getA() == relationB.getB() && relationA.getB() == relationB.getA())
        ) {
          return relationB;
        }
      }
    }
    return null;
  }  

  // Tries to find a rule that can be applied
  function checkRules() {
    for(let rule of rules) {
      // Check if all conditions of the rule apply
      let check = true;
      for(let condition of rule.getConditions()) {
        if(!existRelation(condition)) {
          check = false;
        }
      }
      
      // Check if statements have not been applied yet
      if(check) {
        check = false;
        for(statement of rule.getStatements()) {
          if(!getRelation(statement)) {
            check = true;
          }
        }

        // Yay, found one!
        if(check) {
          for(statement of rule.getStatements()) {
            setRelation(statement);
          }
        }
      }
    }
  }

  // Helper functions ...

  function getElementsByGroupName(groupName) {
    for(let attribute of logicPuzzle.attributes) {
      if(attribute.name == groupName) {
        return attribute.elements;
      }
    }
  }
  
  function getElementByName(elementName) {
    for(let element of elements) {
      if(element.getName() == elementName) {
        return element;
      }
    }
  }

  function existRelation(relationA) {
    return !(getRelation(relationA) == null);
  }
}

solve();