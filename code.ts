
/*
function createRectangles(){
  // This plugin creates 5 rectangles on the screen.
  const numberOfRectangles = 5

  // This file holds the main code for plugins. Code in this file has access to
  // the *figma document* via the figma global object.
  // You can access browser APIs in the <script> tag inside "ui.html" which has a
  // full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).
  const nodes: SceneNode[] = [];
  for (let i = 0; i < numberOfRectangles; i++) {
    const rect = figma.createRectangle();
    rect.x = i * 150;
    rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
    figma.currentPage.appendChild(rect);
    nodes.push(rect);
  }
  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);
}

*/

// Set to keep track of visited parent nodes
let currentNodeChildren: SceneNode[] = [];

// Function to find a vector element recursively
function findVectorElement(node: SceneNode): boolean {
  let result = false;
  
  if ('children' in node) {
    // If the node has children, recursively search through its children
    for (const child of node.children) {
      result = findVectorElement(child);
    }
  }

  if (node.type === 'VECTOR') {
    // If the node is a vector element and it has a parent
    console.log('this should be true');
    result = true;
  }
  
  return result;
}

//Need to fix vector flattening to accomodate other layots
//Must keep on flattening svg while there is an svg sibling
function flattenVectors(node: SceneNode):void{
  console.log('test function ran')
  let endWhile = false;
  if('children' in node){
    for (const child of node.children){
      endWhile = findVectorElement(child);
      if(endWhile) {
        figma.flatten([node]);
        break;
      }
    }
  }
}

function autoLayoutSimpleButtons(node: SceneNode):void{

}

// Function to start the search from the selected node
function startSearch(): void {
  // Get the currently selected node
  const selectedNode = figma.currentPage.selection[0] as SceneNode;
  // Check if a node is selected
  if (selectedNode && 'children' in selectedNode) {
    currentNodeChildren = [...selectedNode.children]
    for (const child of currentNodeChildren) {
          flattenVectors(child);
    }
  } else {
    console.log('Please select a node.');
  }
}

startSearch();


// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.
figma.closePlugin();
