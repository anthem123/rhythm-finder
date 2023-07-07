export default function TempoSlider({
  tempo,
  setTempo,
}) {

  const lowerTempo = () => {
    setTempo(parseInt(tempo) - 1);
  }
  const raiseTempo = () => {
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
        onChange={(e) => setTempo(e.target.value)}
        style={getBackgroundSize()}
        value={tempo}
      />
      <button className="slider-button" onClick={raiseTempo}>+</button>
    </div>
  )
}