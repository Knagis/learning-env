import "grid";

// Initializes the grid structure, specifies the number of rows/columns and size of each cell
initGrid(10, 10, 40);

// Draw some cells with colors
setColor(0, 0, "red");
setColor(0, 1, "blue");
setColor(0, 2, "black");
setColor(0, 3, "green");
setColor(0, 4, "yellow");
setColor(0, 5, "brown");

// Draw a line
let i = 0;
while (i < 10) {
    setColor(9, i, "pink");
    i = i + 1;
}

// Do something when you click on the grid
onClick((x, y) => {
    setColor(x, y, "lightblue");
});

// defines a variable
let previousColor = "white";

// Do something when mouse pointer enters a cell
onEnter((x, y) => {
    previousColor = getColor(x, y);
    setColor(x, y, "gray");
});

// Do something when mouse pointer leaves a cell
onLeave((x, y) => {
    setColor(x, y, previousColor);
});
