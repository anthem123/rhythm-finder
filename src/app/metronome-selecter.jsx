import React from 'react';

export default function MetronomeSelecter({
  tempo,
  onSelect
  }) {

    return (
      <button className="tempo-button" onClick={onSelect}>
        <span className='tempo-text'>{tempo}</span>
        <span className='tempo-bpm'>BPM</span>
      </button>
    )
  }