import React from "react";
import { Button } from "react-bootstrap";
import moment from "moment";
import "./Play.css";

export class Play extends React.Component {
  state = {
    pitcher: null,
    show_team: false,
    history: [],
    pitchers: null,
    loading: true
  };

  constructor(props) {
    super(props);
    this.toggleShowTeam = this.toggleShowTeam.bind(this);
    this.selectPitcher = this.selectPitcher.bind(this);
    this.good = this.good.bind(this);
    this.bad = this.bad.bind(this);
    this.clearHistory = this.clearHistory.bind(this);
  }

  componentDidMount() {
    this.retrieveHistory();
    this.loadPitchers();
    setInterval(() => {
      this.retrieveHistory();
    }, 60000);
  }

  loadPitchers() {
    this.setState({ loading: true });
    fetch("/static/data/pitchers.json")
      .then(response => response.json())
      .then(data => {
        this.setState({ pitchers: data, loading: false });
        this.selectPitcher();
      })
      .catch(() => {
        console.log("Couldn't find any data!");
      });
  }

  filteredPitchers() {
    let self = this;
    if (this.state.pitchers) {
      return this.state.pitchers.stats_sortable_player.queryResults.row.filter(
        p => {
          return (
            parseInt(p.g) / 2 > parseInt(p.gs) &&
            (parseFloat(p.era) > 4.2 || parseFloat(p.era) < 3) &&
            self.state.history.filter(h => {
              return (
                h.pitcher.player_id === p.player_id &&
                moment(h.timestamp).format() >
                  moment()
                    .subtract({ hours: 24 })
                    .format()
              );
            }).length === 0
          );
        }
      );
    } else {
      return [];
    }
  }

  selectPitcher() {
    const filteredPitchers = this.filteredPitchers();
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
        <div className="text-center">
          {this.state.pitcher.name_display_first_last}
        </div>
      );
    } else {
      if (this.state.loading) {
        return "loading...";
      } else {
        return "You've guessed all of 'em. Either clear your history or wait until tomorrow to try again.";
      }
    }
  }

  displayTeam() {
    if (this.state.pitcher) {
      if (this.state.show_team) {
        return (
          <h2 className="m-4 p-4 text-center">
            {this.state.pitcher.team_name}
          </h2>
        );
      } else {
        return (
          <div className="text-center">
            <Button
              className="m-4 p-4 itgg-button"
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
    this.addToHistory(this.state.pitcher, "good");
  }

  bad() {
    this.addToHistory(this.state.pitcher, "bad");
  }

  retrieveHistory() {
    const history = localStorage.getItem("history") || "[]";
    this.setState({ history: JSON.parse(history) });
  }

  addToHistory(pitcher, good_bad) {
    let history = localStorage.getItem("history");
    let history_arr = [];
    if (history) {
      history_arr = JSON.parse(history);
    }
    history_arr.push({ pitcher, good_bad, timestamp: moment().format() });
    this.setState({ history: history_arr });
    history = JSON.stringify(history_arr);
    localStorage.setItem("history", history);
    this.retrieveHistory();
    process.nextTick(() => {
      this.selectPitcher();
    });
  }

  showHistory() {
    if (this.state.history) {
      const reverse_history = this.state.history.sort((a, b) => {
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
            {this.state.history.length > 0 ? (
              <Button onClick={this.clearHistory} className="ml-2 mb-2">
                Clear
              </Button>
            ) : (
              ""
            )}
          </div>
          <div className="itgg-history-item-container">
            {Object.keys(reverse_history).map(key => (
              <div
                className={
                  "itgg-history-item text-center p-2 " +
                  (this.correct(
                    reverse_history[key].pitcher.era,
                    reverse_history[key].good_bad
                  )
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
                  {reverse_history[key].pitcher.era}
                </div>
                <div>You said {reverse_history[key].good_bad}</div>
                <div>{moment(reverse_history[key].timestamp).fromNow()}</div>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return "";
    }
  }

  clearHistory() {
    localStorage.setItem("history", "[]");
    this.setState({ history: [] });
    this.retrieveHistory();
    process.nextTick(() => {
      this.selectPitcher();
    });
  }

  score() {
    if (this.state.history) {
      const correct = this.state.history.filter(h =>
        this.correct(h.pitcher.era, h.good_bad)
      ).length;
      const total = this.state.history.length;
      return {
        correct,
        total,
        percentage: total === 0 ? 0 : correct / total
      };
    } else {
      return { correct: 0, total: 0, percentage: 0 };
    }
  }

  correct(era, good_bad) {
    return (
      (parseFloat(era) < 3.0 && good_bad === "good") ||
      (parseFloat(era) > 4.2 && good_bad === "bad")
    );
  }

  toggleShowTeam() {
    this.setState({ show_team: !this.state.show_team });
  }

  render() {
    return (
      <div>
        <h1 className="mt-5 text-center">{this.displayPitcher()}</h1>
        {this.filteredPitchers().length}
        {this.displayTeam()}
        {this.displayGoodAndBadButtons()}
        {this.showHistory()}
      </div>
    );
  }
}

export default Play;
