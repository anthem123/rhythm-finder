import { checkBeatCombo } from "./note-combos";

const notes = [4, 3, 2, 1.5, 1, 0.75, 0.5, 0.25];

export const getNoteValue = (duration, tempo) => {
  if (tempo === undefined) {
    return null;
  }

  const aproxBeat = (duration * tempo) / 60000;
  const closestNote = (Math.round(aproxBeat / 0.25) * 0.25).toFixed(2);
  return parseFloat(closestNote);
};

const getBeatCount = (measure) => {
  let value = 0;
  measure.forEach((sub) => (value += sub.value));
  return value;
};

const addBeatToMeasure = (musicInfo, maxBeatValue, maxBeatCount) => {
  const { beat, measure } = musicInfo;
  checkBeatCombo(beat);
  if (beat.rhythmCombo == undefined) {
    beat.subDivisions.forEach(sub => measure.push(JSON.parse(JSON.stringify(sub))));
  } else {
    measure.push(JSON.parse(JSON.stringify(beat)))
  }
  
  if (getBeatCount(measure) === maxBeatValue * maxBeatCount) {
    musicInfo.fullScore.push(JSON.parse(JSON.stringify(measure)));
    measure.length = 0;
  }
  beat.subDivisions.length = 0;
  beat.value = 0;
  beat.rhythmCombo = undefined;
}

const addSubDivisionToBeat = (
  subdivision,
  musicInfo,
  maxBeatValue,
  maxBeatCount
) => {
  const beat = musicInfo.beat;
  const currentBeatValue = getBeatCount(musicInfo.beat.subDivisions);
  if (currentBeatValue + subdivision.value <= maxBeatValue) {
    beat.value += subdivision.value;
    beat.subDivisions.push(JSON.parse(JSON.stringify(subdivision)));
    if (beat.value === maxBeatValue) {
      addBeatToMeasure(musicInfo, maxBeatCount);
    }
  } else {
    const beatValueLeft = maxBeatValue - currentBeatValue;
    beat.value = maxBeatValue;
    beat.subDivisions.push({ type: subdivision.type, value: beatValueLeft });
    addBeatToMeasure(musicInfo, maxBeatCount);
    musicInfo.fullScore.push(JSON.parse(JSON.stringify(musicInfo.measure)));

    const newBeatValue = subdivision.value - beatValueLeft;
    beat.value = newBeatValue;
    beat.subDivisions.length = 0;
    beat.subDivisions.push({ type: "rest", value: newBeatValue });
  }
};

const setPickUp = (maxBeatCount, maxBeatValue, rhythm, musicInfo) => {
  const measureLength = maxBeatCount * maxBeatValue
  let restToAdd = measureLength - rhythm.startingValue;
  // Add full rests until we reach the note
  while (restToAdd >= measureLength) {
    addSubDivisionToBeat(
      { value: maxBeatValue, type: "rest" },
      musicInfo,
      maxBeatValue,
      maxBeatCount
    )
    restToAdd -= measureLength;
  }
  const noteValue = rhythm.diff !== 0 ? rhythm.noteValue : rhythm.startingValue;
  // If we have any extra rests, add them here then the note. Or just add the note
  if (restToAdd > 0) {
    addSubDivisionToBeat(
      { value: restToAdd, type: "rest" },
      musicInfo,
      maxBeatValue,
      maxBeatCount
    );
    addSubDivisionToBeat(
      { value: noteValue, type: "note" },
      musicInfo,
      maxBeatValue,
      maxBeatCount
    );
  } else {
    addSubDivisionToBeat(
      { value: noteValue, type: "note" },
      musicInfo,
      maxBeatValue,
      maxBeatCount
    );
  }
};

export const formatRhythm = (rhythmList, maxBeatValue, maxBeatCount) => {
  const musicInfo = {
    fullScore: [],
    measure: [],
    beat: {
      value: 0,
      subDivisions: [],
    }
  }
  for (const rhythm of rhythmList) {
    // If we have a value before or after the end of the countdown
    if (rhythm.startingValue && rhythm.startingValue > 0) {
      // If the value is before the end of the count down
      if (rhythm.pickUp) {
        setPickUp(maxBeatCount, maxBeatValue, rhythm, musicInfo);
        // If the starting note is after the end, add the rest first
      } else {
        addSubDivisionToBeat({ type: "rest", value: rhythm.startingValue },
          musicInfo,
          maxBeatValue,
          maxBeatCount
        )
        addSubDivisionToBeat({ type: "note", value: rhythm.noteValue },
          musicInfo,
          maxBeatValue,
          maxBeatCount
        )
      }
      continue;
    }

    if (musicInfo.beat.value === 0 && notes.includes(rhythm.noteValue)) {
      musicInfo.beat.value = rhythm.noteValue;
      musicInfo.beat.subDivisions.push({ type: "note", value: rhythm.noteValue });
      // If that beat is a full value add to measure
      if (musicInfo.beat.value % maxBeatValue === 0) {
        addBeatToMeasure(musicInfo, maxBeatValue, maxBeatCount);
      }
    }
    // If adding the next note creates a whole beat
    // Add all to the measure
    else if ((musicInfo.beat.value + rhythm.noteValue) % maxBeatValue === 0 && notes.includes(rhythm.noteValue)) {
      musicInfo.beat.value += rhythm.noteValue;
      musicInfo.beat.subDivisions.push({ type: "note", value: rhythm.noteValue });
      addBeatToMeasure(musicInfo, maxBeatValue, maxBeatCount);
    }
    // If adding the next note to the beat doesn't equal a full beat, just add it to the beat
    else if (musicInfo.beat.value + rhythm.noteValue < maxBeatValue) {
      addSubDivisionToBeat({ type: "note", value: rhythm.noteValue }, musicInfo, maxBeatValue, maxBeatCount);
    }
    // The next note gives an odd value, split up the note
    else {
      let remainder = (musicInfo.beat.value + rhythm.noteValue) % maxBeatValue;
      // To account for non-notes adding up to a full beat
      // ei: .75 rest + 1.25 note adds to 2 but should be broken up
      // to .75 rest + .25 note + 1 rest
      if (remainder === 0 && musicInfo.beat.value + rhythm.noteValue > maxBeatValue) {
        remainder = musicInfo.beat.value + rhythm.noteValue - maxBeatValue;
      }
      const newValue = rhythm.noteValue - remainder;
      musicInfo.beat.value += newValue;
      musicInfo.beat.subDivisions.push({ type: "note", value: newValue });
      addBeatToMeasure(musicInfo, maxBeatValue, maxBeatCount);

      if (remainder > 0) {
        addSubDivisionToBeat({ type: "rest", value: remainder }, musicInfo, maxBeatValue, maxBeatCount);
      }
    }
  }
  // Pad end of measure with rests
  if (musicInfo.beat.value > 0) {
    const beatLeft = maxBeatValue - musicInfo.beat.value;
    addSubDivisionToBeat({ type: "rest", value: beatLeft }, musicInfo, maxBeatValue, maxBeatCount);
  }

  if (musicInfo.measure.length > 0) {
    while (getBeatCount(musicInfo.measure) < (maxBeatValue * maxBeatCount)) {
      musicInfo.measure.push({ type: "rest", value: maxBeatValue });
    }
    musicInfo.fullScore.push(JSON.parse(JSON.stringify((musicInfo.measure))));
  }

  return musicInfo.fullScore;
};
