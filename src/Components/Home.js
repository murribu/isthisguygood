import React from 'react';
import { NavLink } from "react-router-dom";

export class Home extends React.Component {
  render() {
    return (
      <div className="container">
        <h1>Is This Guy Good?</h1>
        <p className="lead">
          Test your knowledge of MLB relievers
        </p>
        <p>
          <a
            target="_new"
            href="https://blogs.fangraphs.com/effectively-wild-episode-1375-the-is-this-guy-good-game/"
          >
            Effectively Wild's episode #1375
          </a>{" "}
          inspired this game.
        </p>
        <h2>Setup:</h2>
        <ol>
          <li>This system has every reliever's stats as of this morning.</li>
          <li>Everyone who has an ERA between 3.00 and 4.20 has been removed.</li>
          <li>"Reliever" is defined as someone who has started half as many games (or less) compared to their appearances.</li>
          <li>This will likely include some position players. I think that's fun too.</li>
        </ol>
        <h2>Rules:</h2>
        <ol>
          <li>Click <NavLink to="/play">Play</NavLink></li>
          <li>You will see one of these relievers, chosen arbitrarily.</li>
          <li>Click "Good" if you think his ERA is below 3.00. Click "Bad" if you think his ERA is above 4.20.</li>
        </ol>
        <br />
        <br />
      </div>
      )
  }
}

export default Home;