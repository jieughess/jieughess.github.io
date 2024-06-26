// Get references to the color blocks and timetable elements
const colorBlocks = document.querySelectorAll('#color-palette > div');
const timetable = document.querySelector('#timetable');
const refreshBtn = document.querySelector('#refresh-btn');
let selectedColor = null;
let isMouseDown = false;

// Initialize color counts
const colorCounts = {
  1: 0, 6: 0, 15: 0, 2: 0, 10: 0, 3: 0, 19: 0, 8: 0, 11: 0, 4: 0,
  5: 0, 7: 0, 9: 0, 12: 0, 13: 0, 14: 0, 16: 0, 17: 0, 18: 0
};

// Add click event listeners to color blocks
colorBlocks.forEach(block => {
  block.addEventListener('click', selectColor);
});

// Handle color selection
function selectColor(e) {
  const selectedBlock = e.currentTarget;
  // Remove the 'selected' class from all color blocks
  colorBlocks.forEach(block => block.classList.remove('selected'));
  // Add the 'selected' class to the clicked color block
  selectedBlock.classList.add('selected');

  if (selectedBlock.dataset.id === 'erase') {
    selectedColor = null;
  } else {
    selectedColor = selectedBlock.style.backgroundColor;
  }
}

// Add mouse event listeners to timetable
timetable.addEventListener('mousedown', startColoring);
timetable.addEventListener('mousemove', dragColoring);
timetable.addEventListener('mouseup', stopColoring);
timetable.addEventListener('mouseleave', stopColoring);

// Add hover event listeners to timetable grid cells
const gridCells = timetable.querySelectorAll('.grid-cell');
gridCells.forEach(cell => {
  cell.addEventListener('mouseover', hoverCell);
  cell.addEventListener('mouseout', unhoverCell);
});

function hoverCell(e) {
  e.target.classList.add('hovered');
}

function unhoverCell(e) {
  e.target.classList.remove('hovered');
}

function startColoring(e) {
  isMouseDown = true;
  colorCell(e);
}

function dragColoring(e) {
  if (isMouseDown) {
    colorCell(e);
  }
}

function stopColoring() {
  isMouseDown = false;
}

function colorCell(e) {
  const target = e.target;
  if (target.classList.contains('grid-cell')) {
    const previousColor = target.style.backgroundColor;
    if (selectedColor) {
      const colorId = getColorId(selectedColor);
      if (previousColor) {
        const prevColorId = getColorId(previousColor);
        colorCounts[prevColorId]--;
        updateCounter(prevColorId);
      }
      target.style.backgroundColor = selectedColor;
      colorCounts[colorId]++;
      updateCounter(colorId);
    } else {
      if (previousColor) {
        const prevColorId = getColorId(previousColor);
        colorCounts[prevColorId]--;
        updateCounter(prevColorId);
      }
      target.style.backgroundColor = '';
    }
    updateUnfilledCount(); // Update count after coloring a cell
  }
}

function getColorId(color) {
  const colorBlock = Array.from(colorBlocks).find(block => block.style.backgroundColor === color);
  return colorBlock ? colorBlock.dataset.id : null;
}

function updateCounter(colorId) {
  const counterElement = document.querySelector(`.color-palette[data-id="${colorId}"] .counter`);
  if (counterElement) {
    counterElement.textContent = colorCounts[colorId];
  }
}

// Add click event listener to the refresh button
refreshBtn.addEventListener('click', refreshTimetable);

function refreshTimetable() {
  const gridCells = timetable.querySelectorAll('.grid-cell');
  gridCells.forEach(cell => {
    cell.style.backgroundColor = '';
  });
  // Reset all color counts
  Object.keys(colorCounts).forEach(key => {
    colorCounts[key] = 0;
    updateCounter(key);
  });
  updateUnfilledCount(); // Update count after refreshing
}

// Function to count unfilled (white) boxes
function countUnfilledBoxes() {
  const gridCells = document.querySelectorAll('.grid-cell');
  let count = 0;
  gridCells.forEach(cell => {
    if (!cell.style.backgroundColor || cell.style.backgroundColor === 'white') {
      count++;
    }
  });
  return count;
}

// Function to update the unfilled box count
function updateUnfilledCount() {
  const count = countUnfilledBoxes();
  document.getElementById('count').textContent = count;
}

// Call updateUnfilledCount initially and after any changes to the grid
updateUnfilledCount();
