import React from "react";
import { Button } from "react-bootstrap";
import moment from "moment";
import "./Play.css";

export class Play extends React.Component {
  state = {
    pitcher: null,
    show_team: false
  };

  constructor(props) {
    super(props);
    this.toggleShowTeam = this.toggleShowTeam.bind(this);
    this.selectPitcher = this.selectPitcher.bind(this);
    this.good = this.good.bind(this);
    this.bad = this.bad.bind(this);
  }

  componentDidMount() {
    this.selectPitcher();
  }

  componentDidUpdate(oldProps) {
    if (oldProps.pitchers.length !== this.props.pitchers.length) {
      this.selectPitcher();
    }
  }

  selectPitcher() {
    const filteredPitchers = this.props.filteredPitchers();
    if (filteredPitchers.length > 0) {
      const pitcher =
        filteredPitchers[Math.floor(Math.random() * filteredPitchers.length)];
      this.setState({ show_team: false, pitcher });
    } else {
      this.setState({ pitcher: null });
    }
  }

  displayPitcher() {
    if (this.state.pitcher) {
      return (
        <div>
          <h1 className="mt-5 text-center">
            {this.state.pitcher.playerFullName}
          </h1>
          <h2 className="mt-2 text-center">Stat: {this.props.stat}</h2>
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
    if (this.state.pitcher) {
      if (this.state.show_team) {
        return (
          <h2 className="m-4 p-4 text-center">
            {this.state.pitcher.teamShortName}
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
    if (this.state.pitcher) {
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
            onClick={this.selectPitcher}
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
    this.props.addToHistory(this.state.pitcher, "good");
    process.nextTick(() => {
      this.selectPitcher();
    });
  }

  bad() {
    this.props.addToHistory(this.state.pitcher, "bad");
    process.nextTick(() => {
      this.selectPitcher();
    });
  }

  showHistory() {
    if (this.props.history) {
      const reverse_history = this.props.history.sort((a, b) => {
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
            {this.props.history.length > 0 ? (
              <Button onClick={this.props.clearHistory} className="ml-2 mb-2">
                Clear
              </Button>
            ) : (
              ""
            )}
          </div>
          <div className="itgg-history-item-container">
            {Object.keys(reverse_history).map(key => {
              const stat = reverse_history[key].stat || "era";
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
                        reverse_history[key].pitcher.player_id
                      }
                      target="_new"
                    >
                      {reverse_history[key].pitcher.name_display_first_last}
                    </a>
                  </div>
                  <div className="itgg-history-item-name">
                    {reverse_history[key].pitcher.team_name}
                  </div>
                  <div className="itgg-history-item-stat">
                    {reverse_history[key].pitcher[stat]} {stat}
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
    if (this.props.history) {
      const correct = this.props.history.filter(h => this.props.correct(h))
        .length;
      const total = this.props.history.length;
      return {
        correct,
        total,
        percentage: total === 0 ? 0 : correct / total
      };
    } else {
      return { correct: 0, total: 0, percentage: 0 };
    }
  }

  toggleShowTeam() {
    this.setState({ show_team: !this.state.show_team });
  }

  render() {
    return (
      <div>
        {this.displayPitcher()}
        {this.displayTeam()}
        {this.displayGoodAndBadButtons()}
        {this.showHistory()}
      </div>
    );
  }
}

export default Play;
