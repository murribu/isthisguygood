import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Components/Routes";
import TopNav from "./Components/TopNav";
import moment from "moment";

export class App extends React.Component {
  state = {
    stat: "era",
    lowerlimit: 3.0,
    upperlimit: 4.2,
    iplimit: 0,
    relievers: true,
    order: "desc",
    pitchers: [],
    loading: true,
    availablestats: {
      era: { order: "desc", lowerlimit: 3, upperlimit: 4.2 },
      whip: { order: "desc", lowerlimit: 1.2, upperlimit: 1.5 },
      strikeoutsPer9: { order: "asc", lowerlimit: 8, upperlimit: 10 }
    },
    history: []
  };

  constructor(props) {
    super(props);
    this.loadPitchers = this.loadPitchers.bind(this);
    this.changeSettings = this.changeSettings.bind(this);
    this.filteredPitchers = this.filteredPitchers.bind(this);
    this.correct = this.correct.bind(this);
    this.clearHistory = this.clearHistory.bind(this);
    this.addToHistory = this.addToHistory.bind(this);
  }

  componentDidMount() {
    this.loadPitchers();
    const settingsToLoad = [
      "stat",
      "lowerlimit",
      "upperlimit",
      "iplimit",
      "relievers",
      "order"
    ];
    for (var settingIdx = 0; settingIdx < settingsToLoad.length; settingIdx++) {
      if (localStorage.getItem(settingsToLoad[settingIdx])) {
        this.setState({
          [settingsToLoad[settingIdx]]: localStorage.getItem(
            settingsToLoad[settingIdx]
          )
        });
      }
    }
    this.retrieveHistory();
    setInterval(() => {
      this.retrieveHistory();
    }, 60000);
  }

  clearHistory() {
    localStorage.setItem("history", "[]");
    this.setState({ history: [] });
    this.retrieveHistory();
    process.nextTick(() => {
      this.selectPitcher();
    });
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
    history_arr.push({
      pitcher: { ...pitcher, player_id: pitcher.playerId },
      good_bad,
      lowerlimit: this.state.lowerlimit,
      upperlimit: this.state.upperlimit,
      stat: this.state.stat,
      order: this.state.order,
      timestamp: moment().format()
    });
    this.setState({ history: history_arr });
    history = JSON.stringify(history_arr);
    localStorage.setItem("history", history);
    this.retrieveHistory();
  }

  changeSettings(setting, value) {
    this.setState({ [setting]: value });
    localStorage.setItem(setting, value);
  }

  loadPitchers() {
    this.setState({ loading: true });
    fetch("/static/data/pitchers.json")
      .then(response => response.json())
      .then(data => {
        this.setState({
          pitchers: data.stats,
          loading: false
        });
      })
      .catch(err => {
        console.error(err);
        console.log("Couldn't find any data!");
      });
  }

  filteredPitchers() {
    let self = this;
    if (this.state.pitchers) {
      return this.state.pitchers.filter(p => {
        return (
          (!this.state.relievers ||
            parseInt(p.gamesPlayed) / 2 > parseInt(p.gamesStarted)) &&
          parseFloat(p.inningsPitched) > parseFloat(this.state.iplimit) &&
          (parseFloat(p[this.state.stat]) > parseFloat(this.state.upperlimit) ||
            parseFloat(p[this.state.stat]) <
              parseFloat(this.state.lowerlimit)) &&
          self.state.history.filter(h => {
            return (
              h.pitcher.player_id === p.playerId &&
              moment(h.timestamp).format() >
                moment().subtract({ hours: 18 }).format()
            );
          }).length === 0
        );
      });
    } else {
      return [];
    }
  }

  correct(selection) {
    const lowerlimit = selection.lowerlimit || 3;
    const upperlimit = selection.upperlimit || 4.2;
    const order = selection.order || "desc";
    const stat = selection.stat || "era";
    if (order === "desc") {
      return (
        (parseFloat(selection.pitcher[stat]) < parseFloat(lowerlimit) &&
          selection.good_bad === "good") ||
        (parseFloat(selection.pitcher[stat]) > parseFloat(upperlimit) &&
          selection.good_bad === "bad")
      );
    }
    if (order === "asc") {
      return (
        (parseFloat(selection.pitcher[stat]) < parseFloat(lowerlimit) &&
          selection.good_bad === "bad") ||
        (parseFloat(selection.pitcher[stat]) > parseFloat(upperlimit) &&
          selection.good_bad === "good")
      );
    }
  }

  render() {
    let childProps = this.state;
    childProps.changeSettings = this.changeSettings;
    childProps.filteredPitchers = this.filteredPitchers;
    childProps.correct = this.correct;
    childProps.clearHistory = this.clearHistory;
    childProps.addToHistory = this.addToHistory;
    return (
      <div className="App">
        <TopNav />
        <Routes childProps={childProps} />
      </div>
    );
  }
}

const AppWithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default () => <AppWithRouter />;
