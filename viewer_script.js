const availabilityMap = new Map();
const userMap = new Map();
const grid = document.getElementById("grid");
setTimeLabels();
for (let i = 0; i < 336; i++) {
    addTile(grid);
}

function addTile(grid) {
    const newTile = document.createElement("button");
    //newTile.addEventListener("mouseover", event => selectTile(event, newTile));
    //newTile.addEventListener("mousedown", event => selectTile(event, newTile));
    grid.appendChild(newTile);
}

function setTimeLabels() {
    const timeGrid = document.getElementById("time-labels");
    timeGrid.appendChild(document.createElement("div"));
    for (let i = 0; i < 24; i++) {
        const label = document.createElement("div");
        label.style.textAlign = "right";
        label.innerHTML = `${i}:00`
        timeGrid.appendChild(label);
        timeGrid.appendChild(document.createElement("div"));
    }
}

async function loadResponses() {
    const message = document.getElementById("message");
    const event = document.getElementById("event").value;
    if (event === "") {
        message.innerHTML = "Please enter an event";
        return;
    }

    const response = await fetch(`http://localhost:3000/api/v1/schedules/${event}`, {
        method: "GET",
        mode: "cors"
    });
    const responseObj = await response.json();

    if (response.status === 200) {
        if (responseObj.length > 0) {
            message.innerHTML = `SUCCESS: responses loaded for event ${responseObj[0].event}`;
        } else {
            message.innerHTML = `FAILURE: no responses found for event ${event.toLowerCase()}`;
            return;
        }
    } else {
        message.innerHTML = "FAILURE: " + responseObj.info;
        return;
    }

    availabilityMap.clear();
    userMap.clear();
    for (user of responseObj) {
        availabilityMap.set(user.name, []);
        userMap.set(user.name, false);
    }

    for (i = 0; i < 336; i++) {
        for (user of responseObj) {
            availabilityMap.get(user.name).push(parseInt(user.availability[i]));
        }
    }

    document.getElementById("instructions").style.display = "block";
    makeResponseButtons();
    updateAvailability();
}

function makeResponseButtons() {
    const div = document.getElementById("response-buttons");
    div.textContent = '';
    const names = availabilityMap.keys();
    while (true) {
        let currentName = names.next();
        if (currentName.done) break;
        let newButton = document.createElement("button");
        newButton.innerHTML = currentName.value;
        newButton.classList.add("selector");
        newButton.addEventListener("click", () => {
            newButton.classList.toggle("selected");
            userMap.set(currentName.value, !userMap.get(currentName.value));
            updateAvailability();
        });
        div.appendChild(newButton);
    }
    const finalButton = document.createElement("button");
    finalButton.innerHTML = "enable all";
    finalButton.classList.add("selector");
    finalButton.addEventListener("click", () => toggleAll());
    div.parentElement.appendChild(finalButton);
}

function toggleAll() {
    const buttons = document.getElementById("response-buttons").children;
    let showingAvailability = false;

    for (status of userMap.values()) {
        showingAvailability = (status.toString() === "true") ? true : showingAvailability;
    }

    if (showingAvailability) {
        for (i = 0; i < buttons.length; i++) {
            buttons.item(i).classList.remove("selected");
            userMap.set(buttons.item(i).innerHTML, false);
        }
    } else {
        for (i = 0; i < buttons.length; i++) {
            buttons.item(i).classList.add("selected");
            userMap.set(buttons.item(i).innerHTML, true);
        }
    }

    updateAvailability();
}

function updateAvailability() {
    const finalButton = document.getElementById("response-buttons").parentElement.lastElementChild;
    const activatedNames = [];
    for([name, status] of userMap) {
        if (status.toString() === "true") {
            activatedNames.push(name);
        }
    }

    if (activatedNames.length > 0) {
        let averageAvailability = [];
        if (activatedNames.length > 1) {
            for (i = 0; i < 336; i++) {
                let currentSum = 0;
                for (name of activatedNames) {
                    currentSum += availabilityMap.get(name)[i];
                }
                averageAvailability.push(currentSum/activatedNames.length);
            }
        } else {
            averageAvailability = availabilityMap.get(activatedNames[0]);
        }

        for (let i = 7; i < grid.children.length; i++) {
            let multiplier = (averageAvailability[i-7]-1)/4;
            grid.children.item(i).style.backgroundColor = `rgb(${255*(1-multiplier)},${255*multiplier},100)`;
        }

        finalButton.innerHTML = "disable all";
    } else {
        for (let i = 7; i < grid.children.length; i++) {
            grid.children.item(i).style.backgroundColor = "transparent";
        }
        finalButton.innerHTML = "enable all";
    }
}