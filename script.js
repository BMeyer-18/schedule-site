const test = document.getElementById("test");
const grid = document.getElementById("container");
for (let i = 0; i < 336; i++) {
    addTile(grid);
}

function addTile(grid) {
    const newTile = document.createElement("div");
    newTile.addEventListener("mouseover", event => selectTile(event, newTile));
    newTile.addEventListener("mousedown", event => selectTile(event, newTile));
    newTile.addEventListener("mouseout", () => {
        newTile.classList.remove("hovering");
    });
    grid.appendChild(newTile);
}

function selectTile(event, tile) {
    if (event.buttons > 0) {
        tile.classList.toggle("selected");
    } else if (!tile.classList.contains("selected")) {
        tile.classList.add("hovering");
    }
    test.innerHTML = tile.style.backgroundColor;
}