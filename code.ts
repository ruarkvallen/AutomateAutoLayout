
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


// Function to log widths of immediate children
function logChildrenWidths() {
  // Get the currently selected node
  const selectedNode = figma.currentPage.selection[0] as SceneNode;

  // Check if a node is selected and if it has children
  if (selectedNode && 'children' in selectedNode) {
    // Iterate through each immediate child
    selectedNode.children.forEach((child: SceneNode) => {
      // Log the width of the child
      console.log(`Width of ${child.name}: ${child.width}`);
    });
  } else {
    console.log('Please select a node with children.');
  }
}


// Function to find a vector element recursively
function findVectorElement(node: SceneNode): void {
  if (node.type === 'VECTOR') {
    // If the node is a vector element, log that it's found
    console.log(`Found a vector element: ${node.name}`);
  } else if ('children' in node) {
    // If the node has children, recursively search through its children
    for (const child of node.children) {
      findVectorElement(child);
    }
  }
}

// Function to start the search from the selected node
function startSearch(): void {
  // Get the currently selected node
  const selectedNode = figma.currentPage.selection[0] as SceneNode;

  // Check if a node is selected
  if (selectedNode) {
    // Start searching for vector elements from the selected node
    findVectorElement(selectedNode);
  } else {
    console.log('Please select a node.');
  }
}



// Function to flatten the parent of a vector element
function flattenParent(node: SceneNode): void {
  if ('parent' in node && node.parent) {
    // Check if the parent is a group or frame
    if (node.parent.type === 'GROUP' || node.parent.type === 'FRAME') {
      // Detach the node from its parent and append it to the parent's parent
      if (node.parent.parent) {
        const parentParent = node.parent.parent;
        const index = node.parent.children.findIndex(child => child.id === node.id);
        node.parent.parent.appendChild(node);
        node.remove();
        console.log(`Flattened the parent of ${node.name}`);
      } else {
        console.log(`Cannot flatten parent of ${node.name}: Parent's parent does not exist.`);
      }
    }
  }
}

// Recursive function to find a vector element and flatten its parent
function findAndFlatten(node: SceneNode): void {
  if (node.type === 'VECTOR') {
    // If the node is a vector element, flatten its parent
    flattenParent(node);
    console.log(`Found a vector element: ${node.name}`);
  } else if ('children' in node) {
    // If the node has children, recursively search through its children
    for (const child of node.children) {
      findAndFlatten(child);
    }
  }
}

// Function to start the search from the selected node
function startSearchAndFlatten(): void {
  // Get the currently selected node
  const selectedNode = figma.currentPage.selection[0] as SceneNode;

  // Check if a node is selected
  if (selectedNode) {
    // Start searching for vector elements and flatten their parents from the selected node
    findAndFlatten(selectedNode);
  } else {
    console.log('Please select a node.');
  }
}

// Run the function to start the search and flatten
startSearchAndFlatten();

// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.
figma.closePlugin();
