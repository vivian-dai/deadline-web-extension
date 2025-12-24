const todayDisplay = document.getElementById("today-display");
const deadlinesList = document.getElementById("deadlines");
const deadlineName = document.getElementById("deadline-name");
const deadlineDueDate = document.getElementById("deadline-time");
const newButton = document.getElementById("add-new");
const deleteAllButton = document.getElementById("del-all");

let deadlinesListArr = [];

function tick() {
    todayDisplay.innerText = `Today is ${(new Date()).toLocaleString()}`;
    deadlinesList.innerHTML = deadlinesListArr.length > 0 ? "" : ":) no deadlines!";
    for(let deadline of deadlinesListArr) {
        const node = document.createElement("div");
        node.id = `deadline-element-${deadline.name}`;
        const dueDate = new Date(deadline.due);
        const delButton = document.createElement("button");
        delButton.addEventListener("click", () => {
            chrome.storage.local.get(["deadlines"], (result) => {
                deadlinesListArr = result.deadlines.filter(d => d.name !== deadline.name);
                chrome.storage.local.set({"deadlines": deadlinesListArr});
            })
            delButton.parentElement.remove();
        });
        delButton.textContent = "X";
        node.innerHTML = `<b>${deadline.name}</b> is due on <i>${dueDate.toLocaleString()}</i> which is in <i>${timeUntil(dueDate)}</i>`;
        node.appendChild(delButton);
        deadlinesList.appendChild(node);
    }
}

function timeUntil(dueDate) {
    let milliDiff = dueDate - Date.now();
    let seconds = Math.floor(milliDiff/1000);
    let minutes = Math.floor(seconds/60);
    seconds %= 60;
    let hours = Math.floor(minutes/60);
    minutes %= 60;
    let days = Math.floor(hours/24);
    hours %= 24;
    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

chrome.storage.local.get(["deadlines"], (result) => {
    if(result.deadlines) {
        deadlinesListArr = result.deadlines;
    }
})

newButton.addEventListener("click", () => {
    if(deadlineName.value !== "" && deadlineDueDate.value !== "") {
        chrome.storage.local.get(["deadlines"], (result) => {
            let deadlinesArrNew = result.deadlines || [];
            deadlinesArrNew.push({name: deadlineName.value, due: deadlineDueDate.value});
            chrome.storage.local.set({"deadlines": deadlinesArrNew});
            location.reload();
        })
    }
    
})

deleteAllButton.addEventListener("click", () => {
    chrome.storage.local.remove("deadlines", () => {
        location.reload();
    });
})
tick();

setInterval(tick, 500);