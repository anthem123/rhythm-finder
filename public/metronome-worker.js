let interval = null;
let bpm = 100;

self.addEventListener("message", (event) => {
    if (event.data.command === "start") {
        bpm = event.data.tempo;
        startMetronome();
    } else if (event.data.command === "stop") {
        stopMetronome();
    } else if (event.data.command === "update-bpm") {
        bpm = event.data.tempo;
        restartMetronome();
    }
});

function startMetronome() {
    stopMetronome(); // Clear any previous interval
    const intervalTime = (60 / bpm) * 1000;

    interval = setInterval(() => {
        self.clients.matchAll().then((clients) => {
            clients.forEach((client) => client.postMessage({ type: "tick" }));
        });
    }, intervalTime);
}

function stopMetronome() {
    if (interval) clearInterval(interval);
}

function restartMetronome() {
    stopMetronome();
    startMetronome();
}