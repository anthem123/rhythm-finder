import metronome from './metronome/metronome'

export default function TempoSlider({
  tempo,
  setTempo,
  setMetronomeOn,
  toggleMetronome
}) {

  const lowerTempo = () => {
    setMetronomeOn(false);
    toggleMetronome();
    setTempo(parseInt(tempo) - 1);
  }
  const raiseTempo = () => {
    setMetronomeOn(false);
    toggleMetronome();
    setTempo(parseInt(tempo) + 1);
  }

  const min = 40;
  const max = 220;
  const getBackgroundSize = () => {
    return { backgroundSize: `${((parseInt(tempo) - 40) * 100) / (max - min)}% 100%` };
  };

  return (
    <div>
      <button className="slider-button" onClick={lowerTempo}>-</button>
      <input
        type="range"
        min={min}
        max={max}
        onChange={(e) => {
          setMetronomeOn(false);
          toggleMetronome();
          setTempo(e.target.value);
        }}
        style={getBackgroundSize()}
        value={tempo}
      />
      <button className="slider-button" onClick={raiseTempo}>+</button>
    </div>
  )
}