// @flow
import * as React from 'react';
// import tick from '../assets/metronome.mp3';
import withClock from './with-clock';

function webAudioTouchUnlock(context) {
  return new Promise(function(resolve, reject) {
    if (context.state === 'suspended' && 'ontouchstart' in window) {
      var unlock = function() {
        context.resume().then(
          function() {
            document.body.removeEventListener('touchstart', unlock);
            document.body.removeEventListener('touchend', unlock);

            resolve(true);
          },
          function(reason) {
            reject(reason);
          }
        );
      };

      document.body.addEventListener('touchstart', unlock, false);
      document.body.addEventListener('touchend', unlock, false);
    } else {
      resolve(false);
    }
  });
}

class Tick extends React.Component {
  state = {
    AudioContext: null,
    tick: null,
    tock: null,
    loaded: false,
    scheduled: false,
  };

  getLookahead = () => (this.props.ms - this.props.counter) / 1000;

  play = (buffer) => {
    if (this.state.AudioContext) {
      const currentTime = this.state.AudioContext.currentTime;
      const source = this.state.AudioContext.createBufferSource();

      source.buffer = buffer;
      source.connect(this.state.AudioContext.destination);
      source.start(currentTime + this.getLookahead());

      this.setState({
        scheduled: true,
      });
    }
  };

  createAudioContext = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    this.setState({
      AudioContext: new AudioContext(),
    });
  };

  loadAudioAsync = (url, name) => {
    console.log(url);
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = () => {
      if (this.state.AudioContext) {
        this.state.AudioContext.decodeAudioData(request.response, (buffer) => {
          this.setState({
            [name]: buffer,
            loaded: true,
          });
        });
      }
    };

    request.onerror = (error) => {
      console.log(error);
    };

    request.send();
  };

  shouldSchedule = (lookAhead = 100) => {
    return (
      this.props.ms - this.props.counter < lookAhead && !this.state.scheduled
    );
  };

  log = (string) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(string);
    }
  };

  componentDidMount() {
    this.createAudioContext();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.shouldSchedule()) {
      this.log('tick');
      this.play(this.state.tick);
    }

    // when beat hits remove scheduled flag
    if (prevProps.beats !== this.props.beats) {
      this.setState({
        scheduled: false,
      });
    }

    if (this.state.AudioContext && !prevState.AudioContext) {
      webAudioTouchUnlock(this.state.AudioContext);
      this.loadAudioAsync('./metronome.mp3', 'tick');
    }
  }

  render() {
    return null;
  }
}

export default withClock(Tick);
