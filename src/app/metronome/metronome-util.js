let audioContext = null;
let unlocked = false;
let isPlaying = false;      // Are we currently playing?
let currentBeat;        // What note is currently last scheduled?
let tempo = 100.0;          // tempo (in beats per minute)
let lookahead = 25.0;       // How frequently to call scheduling function 
//(in milliseconds)
let scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
// This is calculated from lookahead, and overlaps 
// with next interval (in case the timer is late)
let nextNoteTime = 0.0;     // when the next note is due.
let noteResolution = 0;     // 0 == 16th, 1 == 8th, 2 == quarter note
let noteLength = 0.05;      // length of "beep" (in seconds)
let notesInQueue = [];      // the notes that have been put into the web audio,
// and may or may not have played yet. {note, time}
let timerWorker = null;     // The Web Worker used to fire timer messages


// First, let's shim the requestAnimationFrame API, with a setTimeout fallback
// window.requestAnimFrame = window.requestAnimationFrame;

function nextNote() {
  // Advance current note and time...
  const secondsPerBeat = 60.0 / tempo;    // Notice this picks up the CURRENT 
  // tempo value to calculate beat length.
  nextNoteTime += secondsPerBeat;    // Add beat length to last beat time

  currentBeat++;    // Advance the beat number, wrap to zero
  if (currentBeat == 4) {
    currentBeat = 0;
  }
}

function scheduleNote(beatNumber, time) {
  // push the note on the queue, even if we're not playing.
  // notesInQueue.push( { note: beatNumber, time: time } );

  // create an oscillator
  let osc = audioContext.createOscillator();
  osc.connect(audioContext.destination);
  osc.frequency.value = 440.0;

  osc.start(time);
  osc.stop(time + noteLength);
}

function scheduler() {
  // while there are notes that will need to play before the next interval, 
  // schedule them and advance the pointer.
  while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
    scheduleNote(currentBeat, nextNoteTime);
    nextNote();
  }
}

const play = (newTempo) => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  if (!unlocked) {
    // play silent buffer to unlock the audio
    let buffer = audioContext.createBuffer(1, 1, 22050);
    let node = audioContext.createBufferSource();
    node.buffer = buffer;
    node.start(0);
    unlocked = true;
  }

  if (!isPlaying) {
    isPlaying = true;
    currentBeat = 0;
    nextNoteTime = audioContext.currentTime;
    tempo = newTempo;
    timerWorker.postMessage("start");
  }

  return new Date().getTime() + (60000 / parseInt(tempo) * 4);
}

const stop = () => {
  if (isPlaying) {
    isPlaying = false;
    if (timerWorker && !isPlaying) {
      timerWorker.postMessage('stop');
    }
  }
}

const init = basePath => {
  if (timerWorker === null) {
    timerWorker = new Worker(`${basePath}/metronome-worker.js`);
    timerWorker.onmessage = function (e) {
      if (e.data == "tick") {
        scheduler();
      }
    };
    timerWorker.postMessage({ "interval": lookahead });
  }
}

const metronomeUtil = { init, play, stop }

export default metronomeUtil;
