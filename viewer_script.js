const responseMap = new Map();
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

    responseMap.clear();
    responseMap.set("average", []);
    for (user of responseObj) {
        responseMap.set(user.name, []);
    }

    const responseCount = responseObj.length;
    for (i = 0; i < responseObj[0].availability.length; i++) {
        let responseSum = 0;
        for (user of responseObj) {
            responseSum += parseInt(user.availability[i]);
            responseMap.get(user.name).push(parseInt(user.availability[i]));
        }
        responseMap.get("average").push(responseSum/responseCount);
    }

    makeResponseButtons();
    showUserAvailability("average");
}

function makeResponseButtons() {
    const div = document.getElementById("response-buttons");
    div.textContent = '';
    const names = responseMap.keys();
    while (true) {
        let currentName = names.next();
        if (currentName.done) break;
        let newButton = document.createElement("button");
        newButton.innerHTML = currentName.value;
        newButton.addEventListener("click", () => showUserAvailability(currentName.value));
        div.appendChild(newButton);
    }
}

function showUserAvailability(name) {
    for (let i = 7; i < grid.children.length; i++) {
        let multiplier = (responseMap.get(name)[i-7]-1)/4;
        grid.children.item(i).style.backgroundColor = `rgb(${255*(1-multiplier)},${255*multiplier},100)`;
    }
}