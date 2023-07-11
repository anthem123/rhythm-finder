const checkNoteDuration = (duration, beatMs, beatValue) => {
  const errorPercent = (100 - process.env.NEXT_PUBLIC_NOTE_ACCURACY) / 100;
  return duration >= (beatMs * beatValue * (1 - errorPercent))
    && duration <= (beatMs * beatValue * (1 + errorPercent));
}

const beatValues = [4, 2, 1.5, 1, .75, .5, .25]

export const getNoteValue = (duration, tempo) => {
  if (tempo === undefined) {
    return 'null';
  }
  const beatMs = 60000/parseInt(tempo);

  return beatValues.find(beatValue => checkNoteDuration(duration, beatMs, beatValue));
}