"use client";

import React, { useState, useEffect, useRef } from "react";
import MetronomeView from "../components/metronome-view/metronome-view";
import MetronomeSelecter from "../components/metronome-selector/metronome-selecter";
// import NoteViewer from "../components/note-viewer/note-viewer";
import NoteViewerNew from "../components/note-viewer/note-viewer-new";
import { getNoteValue } from "../utils/beat-calc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import metronomeUtil from "../metronome/metronome-util";
import Footer from "../components/footer/footer";
import CountDown from "../components/count-down/count-down";

export default function Home() {
  const playIcon = <FontAwesomeIcon icon={faPlay} />;
  const pauseIcon = <FontAwesomeIcon icon={faPause} />;

  const [beatValue, setBeatValue] = useState(1);
  const [beatCount, setBeatCount] = useState(4);
  const [startTime, setStartTime] = useState(0);
  const [tempo, setTempo] = useState("100");
  const [rhythm, setRhythm] = useState<any[]>([]);
  const [newRhythm, setNewRhythm] = useState(true);
  const [displayMetModal, setDisplayMetModal] = useState(false);
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [metronomeText, setMetronomeText] = useState(playIcon);
  const [worker, setWorker] = useState(null);
  const metronomeRef = useRef(null);

  useEffect(() => {
    if ("serviceWorker" in navigator && !worker) {
      navigator.serviceWorker.register("rhythm-finder/metronome-worker.js").then((registration) => {
        console.log("Service Worker registered:", registration);
        if (registration.active) {
          // @ts-ignore
          setWorker(registration.active);
          registration.addEventListener("message", (event) => {
            if (event.data.type === "tick") {
              playClick();
            }
          });
        }
        else {
          navigator.serviceWorker.ready.then((sw) => {
            // @ts-ignore
            setWorker(sw.active);
            sw.addEventListener("message", (event) => {
              if (event.data.type === "tick") {
                playClick();
              }
            });
          });
        }
      });

      // navigator.serviceWorker.addEventListener("message", (event) => {
      //   if (event.data.type === "tick") {
      //     playClick();
      //   }
      // });
    }
  });

  const playClick = () => {
    // const starting = metronomeUtil.play(tempo);
    // setStartTime(starting);
    console.log("playClick");

  }

  // useEffect(() => {
  //   // call api or anything
  //   const basePath = process.env.NEXT_PUBLIC_RESOURCE_PATH ?? "/rhythm-finder";
  //   metronomeUtil.init(basePath);
  // });

  const addRhythm = () => {
    if (newRhythm) {
      const currentTime = new Date().getTime();
      let startingRest = currentTime - startTime - 100;
      let startingValue;
      let pickUp = false;
      if (Math.abs(startingRest) >= (60000 / parseInt(tempo)) * 0.25) {
        startingValue = getNoteValue(Math.abs(startingRest), parseInt(tempo));
        if (startingRest < 0) {
          pickUp = true;
        }
      }
      setRhythm([
        {
          noteTime: currentTime,
          startingValue,
          pickUp,
          diff: 0,
          noteValue: beatValue,
        },
      ]);
      setNewRhythm(false);
    } else {
      const newTime = new Date().getTime();
      const prevNote = rhythm[rhythm.length - 1];
      const diff = newTime - prevNote.noteTime;
      prevNote.diff = diff;
      prevNote.noteValue = getNoteValue(diff, tempo) * beatValue;
      setRhythm([
        ...rhythm,
        { noteTime: newTime, diff: 0, noteValue: beatValue },
      ]);
    }
  };

  const toggleMetronome = () => {
    if (!worker) return;

    if (metronomeOn) {
      // @ts-ignore
      worker.postMessage({ command: "stop" });
      setMetronomeText(playIcon);
      setNewRhythm(true);

      // metronomeUtil.stop();
    } else {
      // @ts-ignore
      worker.postMessage({ command: "start", tempo });
      setMetronomeText(pauseIcon);

      // const starting = metronomeUtil.play(tempo);
      // setStartTime(starting);
    }
    setMetronomeOn(!metronomeOn);
  };

  const onMetModalSelect = () => {
    setDisplayMetModal(!displayMetModal);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <MetronomeSelecter tempo={tempo} onSelect={onMetModalSelect} />
      {displayMetModal && (
        <MetronomeView
          tempo={tempo}
          setTempo={setTempo}
          metronomeOn={metronomeOn}
          toggleMetronome={toggleMetronome}
          onClose={onMetModalSelect}
        />
      )}
      <CountDown metronomeOn={metronomeOn} tempo={tempo} />
      <NoteViewerNew
        rhythmList={rhythm}
        maxBeatCount={beatCount}
        maxBeatValue={beatValue}
      />
      {/* <NoteViewer
        rhythmList={rhythm}
        maxBeatCount={beatCount}
        maxBeatValue={beatValue}
      /> */}
      <Footer
        tempo={tempo}
        metronomeText={metronomeText}
        metronomeOn={metronomeOn}
        toggleMetronome={toggleMetronome}
        addRhythm={addRhythm}
      />
    </main>
  );
}
