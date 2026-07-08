async function submitEvent() {
    const event = document.getElementById("event").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    if (event.length === 0 || password.length === 0) {
        message.innerHTML = "Please enter both an event and a password";
        return;
    }

    const response = await fetch(`http://localhost:3000/api/v1/passwords/${event}`, {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password: password
        })
    });
    const responseObj = await response.json();

    if (response.status === 201) {
        message.innerHTML = "SUCCESS: " + responseObj.info;
        const link = `file:///home/bmeyer/Documents/webdev/schedule-site/index.html?event=${event}`;
        message.innerHTML += `<br><br>Sendable response link:<br><a href="${link}">${link}</a>`;
    } else {
        message.innerHTML = "FAILURE: " + responseObj.info;
    }
}

async function deleteEvent() {
    const event = document.getElementById("event").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    if (event.length === 0 || password.length === 0) {
        message.innerHTML = "Please enter both an event and a password";
        return;
    }

    const response = await fetch(`http://localhost:3000/api/v1/passwords/${event}`, {
        method: "DELETE",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password: password
        })
    });
    const responseObj = await response.json();

    if (response.status === 200) {
        message.innerHTML = "SUCCESS: " + responseObj.info;
    } else {
        message.innerHTML = "FAILURE: " + responseObj.info;
    }
}