import React from "react";
import { NavLink } from "react-router-dom";

export class Home extends React.Component {
  render() {
    return (
      <div className="container">
        <h1>Is This Guy Good?</h1>
        <p className="lead">Test your knowledge of MLB relievers</p>
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
          <li>
            This system has every <b>reliever's</b> stats as of this morning.
          </li>
          <li>
            Everyone who has an <b>ERA</b> between <b>3.00</b> and <b>4.20</b>{" "}
            has been removed.
          </li>
          <li>
            Everything in <b>Bold</b> can be changed on the{" "}
            <NavLink to="/settings">Settings</NavLink> page.
          </li>
          <li>
            "Reliever" is defined as someone who has pitched in at least one
            game and has been the starting pitcher in half as many games (or
            fewer) compared to their appearances
          </li>
          <li>
            This will include some position players who have pitched. I think
            that's fun too.
          </li>
        </ol>
        <h2>Rules:</h2>
        <ol>
          <li>
            Click <NavLink to="/play">Play</NavLink>
          </li>
          <li>You will see one of these relievers, chosen arbitrarily.</li>
          <li>
            Click "Good" if you think his ERA is below 3.00. Click "Bad" if you
            think his ERA is above 4.20.
          </li>
        </ol>
        <br />
        <br />
      </div>
    );
  }
}

export default Home;
