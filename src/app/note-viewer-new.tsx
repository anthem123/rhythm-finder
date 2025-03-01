import PropTypes from 'prop-types';
import React, { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Voice, Formatter } from "vexflow";

export default function NoteViewer({
  rhythmList,
  maxBeatCount,
  maxBeatValue
}) {

  // if (rhythmList.length === 0) {
  //   return <div></div>
  // }

  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create a renderer attached to the container
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(400, 150);
    const context = renderer.getContext();
    context.setFont("Arial", 10, "").setBackgroundFillStyle("#fff");

    // Create a stave
    const stave = new Stave(10, 40, 300);
    stave.addClef("treble").addTimeSignature("4/4");
    stave.setContext(context).draw();

    // Create notes
    const notes = [
      new StaveNote({ keys: ["c/4"], duration: "q" }),
      new StaveNote({ keys: ["d/4"], duration: "q" }),
      new StaveNote({ keys: ["e/4"], duration: "q" }),
      new StaveNote({ keys: ["f/4"], duration: "q" }),
    ];

    // Create a voice in 4/4 and add the notes
    const voice = new Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);

    // Format and justify the notes to fit in the stave
    new Formatter().joinVoices([voice]).format([voice], 250);

    // Render the voice
    voice.draw(context, stave);
  }, []);

  return <div ref={containerRef}></div>;
}

NoteViewer.propTypes = {
  rhythmList: PropTypes.array.isRequired,
  maxBeatCount: PropTypes.number.isRequired,
  maxBeatValue: PropTypes.number.isRequired
}; 