import "./note-viewer.css";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Voice, Formatter, Dot, Beam } from "vexflow";
import { formatRhythm } from "@/utils/beat-calc";

const dottedValues = [3, 1.5, .75];

const convertValueToVexValue = (noteValue: number, noteType: string) => {
  switch (noteValue) {
    case 4:
      return noteType === "rest" ? "wr" : "w";
    case 3:
      return noteType === "rest" ? "hdr" : "hd";
    case 2:
      return noteType === "rest" ? "hr" : "h";
    case 1.5:
      return noteType === "rest" ? "qdr" : "qd";
    case 1:
      return noteType === "rest" ? "qr" : "q";
    case 0.75:
      return noteType === "rest" ? "8dr" : "8d";
    case 0.5:
      return noteType === "rest" ? "8r" : "8";
    case 0.25:
      return noteType === "rest" ? "16r" : "16";
    default:
      throw new Error(`Unsupported note value: ${noteValue}`);
  }
};

const createStaveNote = (beat: { value: number; type: any; }) => {
  const staveNote = new StaveNote({
    keys: ["f/4"],
    duration: convertValueToVexValue(beat.value, beat.type),
  });
  if (dottedValues.includes(beat.value)) {
    Dot.buildAndAttach([staveNote], { all: true });
  }
  return staveNote;
};

export default function NoteViewer({ rhythmList, maxBeatCount, maxBeatValue }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    } else {
      // @ts-ignore
      containerRef.current.innerHTML = "";
    }

    // Create a renderer attached to the container
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(400, 400);
    const context = renderer.getContext();
    context.setFont("Arial", 10, "").setBackgroundFillStyle("#fff");

    const formattedRhythm = formatRhythm(
      rhythmList,
      maxBeatValue,
      maxBeatCount,
    );

    let position = 40;
    let firstLoop = true;
    for (const measure of formattedRhythm) {
      // Create a stave
      const stave: Stave = new Stave(10, position, 300);
      stave.addClef("percussion");
      if (firstLoop) {
        stave.addTimeSignature(`${maxBeatCount}/4`);
        firstLoop = false;
      }

      stave.setContext(context).draw();
      const beamList: Array<Beam> = [];
      
      // Gather notes for measure
      const measureNotes: Array<StaveNote> = [];
      for (const beat of measure) {
        if (beat.subDivisions) {
          const toBeBeamed: Array<StaveNote> = [];
          
          for (const subDivision of beat.subDivisions) {
            const newNote = createStaveNote(subDivision);
            measureNotes.push(newNote);
            if (beat.rhythmCombo) {
              toBeBeamed.push(newNote);
            }
          }
          if (toBeBeamed.length > 1) {
            const beams = Beam.generateBeams(toBeBeamed);
            beams.forEach(something => beamList.push(something));
          }
        } else {
          measureNotes.push(createStaveNote(beat));
        }
      }
      // Add notes to stave
      const voice = new Voice({ num_beats: maxBeatCount, beat_value: 4 * maxBeatValue });
      voice.addTickables(measureNotes);
      new Formatter().joinVoices([voice]).format([voice], 200);
      voice.draw(context, stave);

      beamList.forEach(beam => beam.setContext(context).draw());

      position += 50;
    }
  }, [maxBeatCount, maxBeatValue, rhythmList]);

  if (rhythmList.length === 0) {
    return <div></div>;
  }

  return <div className="note-viewer" ref={containerRef}></div>;
}

NoteViewer.propTypes = {
  rhythmList: PropTypes.array.isRequired,
  maxBeatCount: PropTypes.number.isRequired,
  maxBeatValue: PropTypes.number.isRequired,
};
