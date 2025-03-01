export default function TempoSlider({
  tempo,
  setTempo,
  metronomeOn,
  toggleMetronome
}) {

  const changeTempo = (tempo: number) => {
    if (metronomeOn) {
      toggleMetronome();
    }
    setTempo(tempo);
  }

  const lowerTempo = () => {
    changeTempo(parseInt(tempo) - 1);
  }
  const raiseTempo = () => {
    changeTempo(parseInt(tempo) + 1);
  }

  const min = 40;
  const max = 220;
  const getBackgroundSize = () => {
    return {
      backgroundSize: `${((parseInt(tempo) - 40) * 100) / (max - min)}% 100%`,
      maxWidth: '8rem',
    };
  };

  return (
    <div className='slider-holder'>
      <button className="slider-button" onClick={lowerTempo}>-</button>
      <input
        type="range"
        min={min}
        max={max}
        onChange={(e) => {
          changeTempo(Number(e.target.value));
        }}
        style={getBackgroundSize()}
        value={tempo}
      />
      <button className="slider-button" onClick={raiseTempo}>+</button>
    </div>
  )
}