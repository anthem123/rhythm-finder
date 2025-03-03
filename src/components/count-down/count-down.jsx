import React, { useState, useEffect } from "react";

export default function CountDown({ metronomeOn, tempo }) {
  const [countDown, setCountDown] = useState(1);

  useEffect(() => {
    if (metronomeOn && countDown < 5) {
      const interval = setInterval(() => {
        setCountDown(countDown + 1);
      }, 60000 / tempo);

      return () => clearInterval(interval);
    }
  }, [countDown, metronomeOn, tempo]);

  if (metronomeOn && countDown < 5) {
    if (countDown < 3) {
      return <div suppressHydrationWarning>Countdown: {countDown}</div>;
    } else if (countDown === 3) {
      return <div suppressHydrationWarning>Ready</div>;
    } else if (countDown === 4) {
      return <div suppressHydrationWarning>Start!</div>;
    }
  }
  if (!metronomeOn && countDown > 1) {
    setCountDown(1);
  }
  return null;
}
