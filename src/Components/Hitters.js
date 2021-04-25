import React from "react";
import { Button } from "react-bootstrap";
import moment from "moment";
import "./Play.css";

export class Hitters extends React.Component {
  state = {
    hitter: null,
    show_team: false,
  };
  constructor(props) {
    super(props);
    this.toggleShowTeam = this.toggleShowTeam.bind(this);
    this.selectHitter = this.selectHitter.bind(this);
    this.good = this.good.bind(this);
    this.bad = this.bad.bind(this);
  }

  componentDidMount() {
    this.selectHitter();
  }

  componentDidUpdate(oldProps) {
    if (oldProps.hitters.length !== this.props.hitters.length) {
      this.selectHitter();
    }
  }

  selectHitter() {
    const filteredHitters = this.props.filteredHitters();
    if (filteredHitters.length > 0) {
      const hitter =
        filteredHitters[Math.floor(Math.random() * filteredHitters.length)];
      this.setState({ show_team: false, hitter });
    } else {
      this.setState({ hitter: null });
    }
  }
  displayHitter() {
    if (this.state.hitter) {
      return (
        <div>
          <h1 className="mt-5 text-center">
            {this.state.hitter.playerFullName}
          </h1>
          <h2 className="mt-2 text-center">Stat: {this.props.hitterstat}</h2>
        </div>
      );
    } else {
      if (this.state.loading) {
        return <h1 className="mt-5 text-center">loading...</h1>;
      } else {
        return (
          <h1 className="mt-5 text-center">
            You've guessed all of 'em. Either clear your history or wait until
            tomorrow to try again.
          </h1>
        );
      }
    }
  }

  displayTeam() {
    if (this.state.hitter) {
      if (this.state.show_team) {
        return (
          <h2 className="m-4 p-4 text-center">
            {this.state.hitter.teamShortName}
          </h2>
        );
      } else {
        return (
          <div className="text-center">
            <Button
              className="m-3 p-4 itgg-button"
              onClick={this.toggleShowTeam}
            >
              Show His Team
            </Button>
          </div>
        );
      }
    } else {
      return "";
    }
  }
  displayGoodAndBadButtons() {
    if (this.state.hitter) {
      return (
        <div className="text-center">
          <Button
            className="m-4 p-4 btn-success itgg-button"
            onClick={this.good}
          >
            Good
          </Button>
          <Button className="m-4 p-4 btn-danger itgg-button" onClick={this.bad}>
            Bad
          </Button>
          <Button
            className="m-4 p-4 btn-warning itgg-button"
            onClick={this.selectHitter}
          >
            Skip
          </Button>
        </div>
      );
    } else {
      return "";
    }
  }

  good() {
    this.props.addToHitterHistory(this.state.hitter, "good");
    process.nextTick(() => {
      this.selectHitter();
    });
  }

  bad() {
    this.props.addToHitterHistory(this.state.hitter, "bad");
    process.nextTick(() => {
      this.selectHitter();
    });
  }

  showHistory() {
    if (this.props.hitterhistory) {
      const reverse_history = this.props.hitterhistory.sort((a, b) => {
        return a.timestamp < b.timestamp ? 1 : -1;
      });
      const score = this.score();
      return (
        <div className="itgg-history ml-3 mr-3">
          <div>
            <h2 style={{ display: "inline-block" }}>
              Your History{" "}
              {score.correct +
                " / " +
                score.total +
                " (" +
                Math.round(score.percentage * 100) +
                "%)"}
            </h2>
            {this.props.hitterhistory.length > 0 ? (
              <Button
                onClick={this.props.clearHitterHistory}
                className="ml-2 mb-2"
              >
                Clear
              </Button>
            ) : (
              ""
            )}
          </div>
          <div className="itgg-history-item-container">
            {Object.keys(reverse_history).map(key => {
              const stat = reverse_history[key].stat || "avg";
              const upperlimit = reverse_history[key].upperlimit || 4.2;
              const lowerlimit = reverse_history[key].lowerlimit || 3;
              return (
                <div
                  className={
                    "itgg-history-item text-center p-2 " +
                    (this.props.correct(reverse_history[key])
                      ? "itgg-correct"
                      : "itgg-incorrect")
                  }
                  key={key}
                >
                  <div className="itgg-history-item-name">
                    <a
                      href={
                        "http://mlb.mlb.com/team/player.jsp?player_id=" +
                        reverse_history[key].hitter.player_id
                      }
                      target="_new"
                    >
                      {reverse_history[key].hitter.name_display_first_last}
                    </a>
                  </div>
                  <div className="itgg-history-item-name">
                    {reverse_history[key].hitter.team_name}
                  </div>
                  <div className="itgg-history-item-stat">
                    {reverse_history[key].hitter[stat]} {stat}
                  </div>
                  <div>You said {reverse_history[key].good_bad}</div>
                  <div>{moment(reverse_history[key].timestamp).fromNow()}</div>
                  <div className="itgg-history-item-lowerlimit">
                    {lowerlimit}
                  </div>
                  <div className="itgg-history-item-upperlimit">
                    {upperlimit}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      return "";
    }
  }

  score() {
    if (this.props.hitterhistory) {
      const correct = this.props.hitterhistory.filter(h =>
        this.props.correct(h)
      ).length;
      const total = this.props.hitterhistory.length;
      return {
        correct,
        total,
        percentage: total === 0 ? 0 : correct / total,
      };
    } else {
      return { correct: 0, total: 0, percentage: 0 };
    }
  }

  toggleShowTeam() {
    this.setState({ show_team: !this.state.show_team });
  }

  render() {
    console.log(this.props);
    return (
      <div>
        {this.displayHitter()}
        {this.displayTeam()}
        {this.displayGoodAndBadButtons()}
        {this.showHistory()}
      </div>
    );
  }
}

export default Hitters;
