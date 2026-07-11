let availabilityLevel = 5;
const grid = document.getElementById("grid");
setTimeLabels();
prepareLevelButtons();
prepareKeydownListeners();
checkURL();
for (let i = 0; i < 224; i++) {
    addTile(grid);
}

function addTile(grid) {
    const newTile = document.createElement("button");
    ["mouseover", "mousedown"].forEach(e =>
        newTile.addEventListener(e, event => selectTileMouse(event, newTile)));
    ["touchstart", "touchmove"].forEach(e => 
        newTile.addEventListener(e, () => selectTileTouch(newTile)));
    grid.appendChild(newTile);
}

function selectTileMouse(event, tile) {
    if (event.buttons > 0 && !tile.classList.contains(`level-${availabilityLevel}`)) {
        tile.classList.remove(...tile.classList);
        tile.classList.add(`level-${availabilityLevel}`);
    }
}

function selectTileTouch(tile) {
    if (!tile.classList.contains(`level-${availabilityLevel}`)) {
        tile.classList.remove(...tile.classList);
        tile.classList.add(`level-${availabilityLevel}`);
    }
}

function setTimeLabels() {
    const timeGrid = document.getElementById("time-labels");
    timeGrid.appendChild(document.createElement("div"));
    for (let i = 8; i < 24; i++) {
        const label = document.createElement("div");
        label.style.textAlign = "right";
        label.innerHTML = `${i}:00`
        timeGrid.appendChild(label);
        timeGrid.appendChild(document.createElement("div"));
    }
}

function prepareLevelButtons() {
    const levelButtons = document.querySelectorAll(".selector");
    levelButtons.forEach(levelButton => {
        levelButton.addEventListener("click", () => {
            document.querySelector(".selected").classList.remove("selected");
            availabilityLevel = parseInt(levelButton.innerHTML);
            levelButton.classList.add("selected");
        });
    });
}

function prepareKeydownListeners() {
    document.onkeydown = event => {
        try {
            const key = parseInt(event.key);
            if (key >= 1 && key <= 5) {
                document.querySelector(".selected").classList.remove("selected");
                availabilityLevel = key;
                document.querySelector(`.level-${key}.selector`).classList.add("selected");
            }
        } catch (error) {
            return;
        }
    };
}

function checkURL() {
    const eventInput = document.getElementById("event");
    const url = new URLSearchParams(window.location.search);
    eventInput.value = url.get('event');
}

async function submit() {
    const message = document.getElementById("message");
    const name = document.getElementById("name").value;
    const event = document.getElementById("event").value;
    if (name === "" || event === "") {
        message.innerHTML = "Please enter a name and event.";
        return;
    }

    let availability = "";
    for (let i = 7; i < grid.children.length; i++) {
        if (grid.children.item(i).classList.length === 0) {
            message.innerHTML = "Please fill out every time slot on the grid.";
            return;
        }
        availability += grid.children.item(i).className.slice(-1);
    }

    const data = {
        name: name,
        availability: availability
    };

    message.innerHTML = "loading...";

    const response = await fetch(`https://schedule-api-five.vercel.app/api/v1/schedules/${event}`, {
        method: "PUT",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    const responseObj = await response.json();

    if (response.status === 200 || response.status === 201) {
        message.innerHTML = "SUCCESS: " + responseObj.info;
    } else {
        message.innerHTML = "FAILURE: " + responseObj.info;
    }
}

async function remove() {
    const message = document.getElementById("message");
    const name = document.getElementById("name").value;
    const event = document.getElementById("event").value;
    if (name === "" || event === "") {
        message.innerHTML = "Please enter a name and event.";
        return;
    }

    message.innerHTML = "loading...";

    const response = await fetch(`https://schedule-api-five.vercel.app/api/v1/schedules/${event}/${name}`, {
        method: "DELETE",
        mode: "cors",
    });
    const responseObj = await response.json();

    if (response.status === 200) {
        message.innerHTML = "SUCCESS: " + responseObj.info;
    } else {
        message.innerHTML = "FAILURE: " + responseObj.info;
    }
}