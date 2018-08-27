import React, { Component } from 'react';
import WordCard from './WordCard';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dictionary: [
        {
          word: 'das Madchen',
          type: 'noun',
          translation: 'girl',
        },
        {
          word: 'der Man',
          type: 'noun',
          translation: 'man',
        },
      ],
    };
  }

  render() {
    const { dictionary } = this.state;
    return (
      <div className="App">
        {dictionary.map(entry => (
          <WordCard key={entry.word} entry={entry} />
        ))}
      </div>
    );
  }
}

export default App;
