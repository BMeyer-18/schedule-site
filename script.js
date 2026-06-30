const test = document.getElementById("test"); //FOR DEBUGGING

const grid = document.getElementById("grid");
setTimeLabels();
for (let i = 0; i < 336; i++) {
    addTile(grid);
}

function addTile(grid) {
    const newTile = document.createElement("button");
    newTile.addEventListener("mouseover", event => selectTile(event, newTile));
    newTile.addEventListener("mousedown", event => selectTile(event, newTile));
    /*newTile.addEventListener("mouseout", () => {
        newTile.classList.remove("hovering");
    });*/
    grid.appendChild(newTile);
}

function selectTile(event, tile) {
    if (event.buttons > 0) {
        tile.classList.toggle("selected");
    } /*else if (!tile.classList.contains("selected")) {
        tile.classList.add("hovering");
    }*/
}

function setTimeLabels() {
    const timeGrid = document.getElementById("time-labels");
    timeGrid.appendChild(document.createElement("div"));
    for (let i = 0; i < 48; i++) {
        const label = document.createElement("div");
        label.style.textAlign = "right";
        if (i%2 == 0) {
            label.innerHTML = `${i/2}:00`
        } else {
            label.innerHTML = `${Math.floor(i/2)}:30`
        }
        timeGrid.appendChild(label);
    }
}

function submit() {
    const name = document.getElementById("name").value;
    const availability = [];
    for (let i = 7; i < grid.children.length; i++) {
        if (grid.children.item(i).classList.contains("selected")) {
            availability.push(1);
        } else {
            availability.push(0);
        }
    }
    const data = {
        name: name,
        availability: availability
    };
    test.innerHTML = JSON.stringify(data);
}