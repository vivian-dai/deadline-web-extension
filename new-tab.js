const todayDisplay = document.getElementById("today-display");
const deadlinesList = document.getElementById("deadlines");
const deadlineName = document.getElementById("deadline-name");
const deadlineDueDate = document.getElementById("deadline-time");
const newButton = document.getElementById("add-new");
const deleteAllButton = document.getElementById("del-all");

todayDisplay.innerText = `Today is ${(new Date()).toLocaleString()}`;

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
        for(let deadline of result.deadlines) {
            const node = document.createElement("div");
            const dueDate = new Date(deadline.due);
            node.innerText = `${deadline.name} is due on ${dueDate.toLocaleString()} which is in ${timeUntil(dueDate)}`;
            deadlinesList.appendChild(node);
        }
    } else {
        deadlinesList.innerText = ":) no deadlines!";
    }
})

newButton.addEventListener("click", () => {
    if(deadlineName.value !== "" && deadlineDueDate.value !== "") {
        chrome.storage.local.get(["deadlines"], (result) => {
            let deadlinesArrNew = result.deadlines || [];
            deadlinesArrNew.push({name: deadlineName.value, due: deadlineDueDate.value});
            chrome.storage.local.set({"deadlines": deadlinesArrNew})
        })
    }
    
})

deleteAllButton.addEventListener("click", () => {
    chrome.storage.local.remove("deadlines", () => {
        location.reload();
    });
})