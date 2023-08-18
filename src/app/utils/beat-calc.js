const beatValues = [4, 2.5, 2, 1.75, 1.5, 1.25, 1, .75, .5, .25];
export const nonNotes = [2.5, 1.75, 1.5];

export const getNoteValue = (duration, tempo) => {
  if (tempo === undefined) {
    return 'null';
  }

  const mappedMs = beatValues.map(beat => {
    return {
      value: beat,
      ms: 60000/parseInt(tempo) * beat
  }});

  let msDiff = 99999999999999;
  let closestBeat;
  mappedMs.forEach(map => {
    if (Math.abs(duration - map.ms) < msDiff) {
      msDiff = Math.abs(duration - map.ms);
      closestBeat = map.value;
    }
  });
  return closestBeat;
}