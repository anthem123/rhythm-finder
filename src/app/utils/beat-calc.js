import { checkBeatCombo } from "./note-combos";

const notes = [4, 3, 2, 1.5, 1, 0.75, 0.5, 0.25];

export const getNoteValue = (duration, tempo) => {
  if (tempo === undefined) {
    return null;
  }

  const aproxBeat = (duration * tempo) / 60000;
  const closestBeat = (Math.round(aproxBeat / 0.25) * 0.25).toFixed(2);
  return parseFloat(closestBeat);
};

const getBeatCount = (measure) => {
  let value = 0;
  measure.forEach((sub) => (value += sub.value));
  return value;
};

const addBeatToMeasure = (beat, measure, fullScore, maxBeatCount) => {
  checkBeatCombo(beat);
  if (beat.rhythmCombo == undefined) {
    beat.subDivisions.forEach((sub) =>
      addSubDivisionToMeasure(
        JSON.parse(JSON.stringify(sub)),
        measure,
        fullScore,
        maxBeatCount
      )
    );
  } else {
    addSubDivisionToMeasure(
      JSON.parse(JSON.stringify(beat)),
      measure,
      fullScore,
      maxBeatCount
    );
  }
};

const addSubDivisionToMeasure = (
  subdivision,
  measure,
  fullScore,
  maxBeatCount
) => {
  const currentMeasureCount = getBeatCount(measure);
  if (currentMeasureCount + subdivision.value <= maxBeatCount) {
    measure.push(JSON.parse(JSON.stringify(subdivision)));
    if (getBeatCount(measure) === maxBeatCount) {
      fullScore.push(JSON.parse(JSON.stringify(measure)));
      measure.length = 0;
    }
  } else {
    const measureCountLeft = maxBeatCount - currentMeasureCount;
    measure.push({ type: subdivision.type, value: measureCountLeft });
    fullScore.push(JSON.parse(JSON.stringify(measure)));
    measure.length = 0;
    measure.push({ type: "rest", value: subdivision.value - measureCountLeft });
  }
};

const setPickUp = (maxBeatCount, maxBeatValue, rhythm, beat, measure, formattedRhythm) => {
  let restToAdd = maxBeatCount - rhythm.startingValue;
  // Add full rests until we reach the note
  while (restToAdd >= maxBeatValue) {
    addSubDivisionToMeasure(
      { value: maxBeatValue, type: "rest" },
      measure,
      formattedRhythm,
      maxBeatCount
    );
    restToAdd -= maxBeatValue;
  }
  const noteValue = rhythm.diff !== 0 ? rhythm.noteValue : rhythm.startingValue;
  // If we have any extra rests, add them here then the note. Or just add the note
  if (restToAdd > 0) {
    beat.value = restToAdd + noteValue;
    beat.subDivisions.push({ type: "rest", value: restToAdd });
    beat.subDivisions.push({ type: "note", value: noteValue });
  } else {
    beat.value = noteValue;
    beat.subDivisions.push({ type: "note", value: noteValue });
  }
};

export const formatRhythm = (rhythmList, maxBeatValue, maxBeatCount) => {
  const formattedRhythm = [];
  let measure = [];
  let beat = {
    value: 0,
    subDivisions: [],
  };
  for (const rhythm of rhythmList) {
    // If we have a value before or after the end of the countdown
    if (rhythm.startingValue && rhythm.startingValue > 0) {
      // If the value is before the end of the count down
      if (rhythm.pickUp) {
        setPickUp(maxBeatCount, maxBeatValue, rhythm, beat, measure, formattedRhythm)
        // If the starting note is after the end, add the rest first
      } else {
        beat.value = rhythm.startingValue;
        beat.subDivisions.push({ type: "rest", value: rhythm.startingValue });
        beat.subDivisions.push({ type: "note", value: rhythm.noteValue });
      }
      if (beat.value % maxBeatValue === 0) {
        addBeatToMeasure(beat, measure, formattedRhythm, maxBeatCount);
        beat = {
          value: 0,
          subDivisions: [],
        };
      }
      continue;
    }

    if (beat.value === 0 && notes.includes(rhythm.noteValue)) {
      beat.value = rhythm.noteValue;
      beat.subDivisions.push({ type: "note", value: rhythm.noteValue });
      // If that beat is a full value add to measure
      if (beat.value % maxBeatValue === 0) {
        addBeatToMeasure(beat, measure, formattedRhythm, maxBeatCount);
        beat = {
          value: 0,
          subDivisions: [],
        };
      }
    }
    // If adding the next note creates a whole beat
    // Add all to the measure
    else if (
      (beat.value + rhythm.noteValue) % maxBeatValue === 0 &&
      notes.includes(rhythm.noteValue)
    ) {
      beat.value += rhythm.noteValue;
      beat.subDivisions.push({ type: "note", value: rhythm.noteValue });
      addBeatToMeasure(beat, measure, formattedRhythm, maxBeatCount);
      beat = {
        value: 0,
        subDivisions: [],
      };
    }
    // If adding the next note to the beat doesn't equal a full beat, just add it to the beat
    else if (beat.value + rhythm.noteValue < maxBeatValue) {
      beat.value += rhythm.noteValue;
      beat.subDivisions.push({ type: "note", value: rhythm.noteValue });
    }
    // The next note gives an odd value, split up the note
    else {
      let remainder = (beat.value + rhythm.noteValue) % maxBeatValue;
      // To account for non-notes adding up to a full beat
      // ei: .75 rest + 1.25 note adds to 2 but should be broken up
      // to .75 rest + .25 note + 1 rest
      if (remainder === 0 && beat.value + rhythm.noteValue > maxBeatValue) {
        remainder = beat.value + rhythm.noteValue - maxBeatValue;
      }
      const newValue = rhythm.noteValue - remainder;
      beat.value += newValue;
      beat.subDivisions.push({ type: "note", value: newValue });
      addBeatToMeasure(beat, measure, formattedRhythm, maxBeatCount);
      beat = {
        value: 0,
        subDivisions: [],
      };
      if (remainder > 0) {
        beat.value = remainder;
        beat.subDivisions.push({ type: "rest", value: remainder });
        if (remainder % maxBeatValue === 0) {
          addBeatToMeasure(beat, measure, formattedRhythm, maxBeatCount);
          beat = {
            value: 0,
            subDivisions: [],
          };
        }
      }
    }
  }
  // Pad end of measure with rests
  if (beat.value > 0) {
    const beatLeft = maxBeatValue - beat.value;
    beat.subDivisions.push({ type: "rest", value: beatLeft });
    beat.subDivisions.forEach((sub) => measure.push(sub));
  }

  if (measure.length > 0) {
    while (getBeatCount(measure) < maxBeatValue * maxBeatCount) {
      measure.push({ type: "rest", value: maxBeatValue });
    }
    formattedRhythm.push(measure);
  }

  return formattedRhythm;
};
