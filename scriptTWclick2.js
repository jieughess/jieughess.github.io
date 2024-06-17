// Get references to the color blocks and timetable elements
const colorBlocks = document.querySelectorAll('#color-palette > div');
const timetable = document.querySelector('#timetable');
const refreshBtn = document.querySelector('#refresh-btn');
let selectedColor = null;

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
  
  selectedColor = selectedBlock.style.backgroundColor;

  // Add click event listener to timetable grid cells
  timetable.addEventListener('click', colorCell);

  // Add hover event listeners to timetable grid cells
  const gridCells = timetable.querySelectorAll('.grid-cell');
  gridCells.forEach(cell => {
    cell.addEventListener('mouseover', hoverCell);
    cell.addEventListener('mouseout', unhoverCell);
  });
}

function hoverCell(e) {
  e.target.classList.add('hovered');
}

function unhoverCell(e) {
  e.target.classList.remove('hovered');
}

function colorCell(e) {
  const target = e.target;
  if (target.classList.contains('grid-cell') && selectedColor) {
    const previousColor = target.style.backgroundColor;
    const colorId = getColorId(selectedColor);
    if (previousColor) {
      const prevColorId = getColorId(previousColor);
      colorCounts[prevColorId]--;
      updateCounter(prevColorId);
    }
    target.style.backgroundColor = selectedColor;
    colorCounts[colorId]++;
    updateCounter(colorId);
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

function removeColor(e) {
  const target = e.target;
  if (target.classList.contains('grid-cell')) {
    const prevColor = target.style.backgroundColor;
    const colorId = getColorId(prevColor);
    if (colorId) {
      colorCounts[colorId]--;
      updateCounter(colorId);
    }
    target.style.backgroundColor = '';
  }
}

// Add click event listener to the refresh button
refreshBtn.addEventListener('click', refreshTimetable);

function refreshTimetable() {
  const gridCells = timetable.querySelectorAll('.grid-cell');
  gridCells.forEach(cell => {
    cell.style.backgroundColor = '';
  });
}
