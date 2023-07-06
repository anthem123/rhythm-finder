export default function Metronome({
  metronomeOn,
  tempo
  }) {
    let msTempo;
    if (tempo) {
      msTempo = 60000/tempo;
    } else {
      msTempo = 0;
    }
    const createMetStyle = (metronomeOn) => ({
      width: '100px',
      height: '100px',
      backgroundColor: '#000000',
      border: 'grey 1px solid',
      '-webkit-animation': metronomeOn ? `flickerAnimation ${msTempo}ms infinite` : '',
      '-moz-animation': metronomeOn ? `flickerAnimation ${msTempo}ms infinite` : '',
      '-o-animation': metronomeOn ? `flickerAnimation ${msTempo}ms infinite` : '',
      '-animation': metronomeOn ? `flickerAnimation ${msTempo}ms infinite` : '',
    });
    return (
      <div style={createMetStyle(metronomeOn)}></div>
    )
  }