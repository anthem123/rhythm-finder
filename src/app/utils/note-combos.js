const noteComboList = [
  '8-8',
  '16-16-16-16',
  '16r-16-16-16',
  '16r-8-16',
  '8-16-16',
  '8r-16-16',
  '16-8-16',
  '16-16-8',
  '8d-16',
  '16-8d',
]

const valueNoteMapping = (noteValue, noteType) => {
  switch (noteValue) {
    case .5:
      return noteType === 'note' ? '8' : '8r';
    case .75:
      return '8d'
    case .25:
      return noteType === 'note' ? '16' : '16r';
    default:
      return '--na--';
  }
}

export const checkBeatCombo = (beat) => {
  let comboString;
  beat.subDivisions.forEach(sub => {
    if (comboString) {
      comboString = comboString + '-' + valueNoteMapping(sub.value, sub.type);
    } else {
      comboString = valueNoteMapping(sub.value, sub.type);
    }
  });
  if (noteComboList.includes(comboString)) {
    beat.rhythmCombo = comboString;
  }
}