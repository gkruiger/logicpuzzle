# Logicpuzzle
Solves the Zebra puzzle, a logic puzzle in which you have to find the right combinations by reasoning.

Solution/output:

![Demo screenshot](../master/solution.png "Solution")

Live demo: https://gkruiger.github.io/logicpuzzle/

## Your own puzzle
You can let the application solve other logic puzzles. To make this happen, you need to feed the algoritm by changing the input variables right in the beginning of the (../blob/master/logicpuzzle.js) file.  

`
const logicPuzzle = {
  actors: ...  
  attributes: ...  
  hints: ... 
}
`

Hint types supported so far:
- Relations
- Next to
- Left to

If your puzzle has other types of hints, you need to build the support for these types yourself.
This logic should be defined in the createRules() function.

Happy puzzling!
