const { ipcRenderer } = require("electron");

const select = selector => document.querySelector(selector);

let container = select("#messages");
let progressBar = select("#progressBar");
let version = select("#version");

ipcRenderer.on("message", (event, text) => {
    let message = document.createElement("div");
    message.innerHTML = text;
    container.appendChild(message);
});

ipcRenderer.on("version", (event, text) => {
    version.innerText = text;
});

ipcRenderer.on("download-progress", (event, text) => {
    progressBar.style.width = `${text}%`;
});

const { read_csv } = require("../modules/read_csvs");
select("#form").addEventListener("submit", evt => {
    evt.preventDefault();
    const input = evt.target[0];
    const examList = document.getElementById("examList");
    read_csv(input.value, (skipLines = 0)).then(
        r => {
            alert(r.length);
            let i = 0;
            const exams = r.reduce((html, exam) => {
                //${i}.- ${exam["Last Name:"]} ${exam["First Name:"]}
                html += `<tr>${[0, 1, 2, 3, 4]
                    .map(i => `<td>${exam[i]}</td>`)
                    .join("")} </tr>`;
                i++;
                return html;
            }, "");
            examList.innerHTML = exams;
        },
        e => {
            alert(e);
        }
    );
    input.value = "";
});
