import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Components/Routes";
import TopNav from "./Components/TopNav";
import moment from "moment";

export class App extends React.Component {
  state = {
    pitcherstat: "era",
    hitterstat: "avg",
    pitcherlowerlimit: 3.0,
    pitcherupperlimit: 4.2,
    hitterlowerlimit: 0.2,
    hitterupperlimit: 0.26,
    iplimit: 0,
    ablimit: 0,
    relievers: true,
    pitcherorder: "desc",
    hitterorder: "asc",
    pitchers: [],
    hitters: [],
    loading: true,
    availablepitcherstats: {
      era: { order: "desc", lowerlimit: 3, upperlimit: 4.2 },
      whip: { order: "desc", lowerlimit: 1.2, upperlimit: 1.5 },
      strikeoutsPer9: { order: "asc", lowerlimit: 8, upperlimit: 10 },
    },
    availablehitterstats: {
      avg: { order: "asc", lowerlimit: 0.2, upperlimit: 0.26 },
      obp: { order: "asc", lowerlimit: 0.29, upperlimit: 0.33 },
      ops: { order: "asc", lowerlimit: 0.6, upperlimit: 0.8 },
    },
    pitcherhistory: [],
    hitterhistory: [],
  };

  constructor(props) {
    super(props);
    this.loadPitchers = this.loadPitchers.bind(this);
    this.changeSettings = this.changeSettings.bind(this);
    this.filteredPitchers = this.filteredPitchers.bind(this);
    this.filteredHitters = this.filteredHitters.bind(this);
    this.correct = this.correct.bind(this);
    this.clearPitcherHistory = this.clearPitcherHistory.bind(this);
    this.clearHitterHistory = this.clearHitterHistory.bind(this);
    this.addToPitcherHistory = this.addToPitcherHistory.bind(this);
    this.addToHitterHistory = this.addToHitterHistory.bind(this);
  }

  componentDidMount() {
    this.loadPitchers();
    this.loadHitters();
    const settingsToLoad = [
      "stat",
      "pitcherlowerlimit",
      "pitcherupperlimit",
      "iplimit",
      "ablimit",
      "relievers",
      "order",
    ];
    for (var settingIdx = 0; settingIdx < settingsToLoad.length; settingIdx++) {
      if (localStorage.getItem(settingsToLoad[settingIdx])) {
        this.setState({
          [settingsToLoad[settingIdx]]: localStorage.getItem(
            settingsToLoad[settingIdx]
          ),
        });
      }
    }
    this.retrievePitcherHistory();
    setInterval(() => {
      this.retrievePitcherHistory();
    }, 60000);
  }

  clearPitcherHistory() {
    localStorage.setItem("pitcherHistory", "[]");
    this.setState({ pitcherhistory: [] });
    this.retrievePitcherHistory();
    process.nextTick(() => {
      this.selectPitcher();
    });
  }

  clearHitterHistory() {
    localStorage.setItem("hitterHistory", "[]");
    this.setState({ hitterhistory: [] });
    this.retrievePitcherHistory();
    process.nextTick(() => {
      this.selectPitcher();
    });
  }

  retrievePitcherHistory() {
    const history = localStorage.getItem("pitcherHistory") || "[]";
    this.setState({ pitcherhistory: JSON.parse(history) });
  }

  retrieveHitterHistory() {
    const history = localStorage.getItem("hitterHistory") || "[]";
    this.setState({ hitterhistory: JSON.parse(history) });
  }

  addToPitcherHistory(pitcher, good_bad) {
    let history = localStorage.getItem("pitcherHistory");
    let history_arr = [];
    if (history) {
      history_arr = JSON.parse(history);
    }
    history_arr.push({
      pitcher: {
        ...pitcher,
        player_id: pitcher.playerId,
        name_display_first_last: pitcher.playerFullName,
        team_name: pitcher.teamShortName,
      },
      good_bad,
      lowerlimit: this.state.pitcherlowerlimit,
      upperlimit: this.state.pitcherupperlimit,
      stat: this.state.pitcherstat,
      order: this.state.order,
      timestamp: moment().format(),
    });
    this.setState({ history: history_arr });
    history = JSON.stringify(history_arr);
    localStorage.setItem("pitcherHistory", history);
    this.retrievePitcherHistory();
  }

  addToHitterHistory(hitter, good_bad) {
    let history = localStorage.getItem("hitterHistory");
    let history_arr = [];
    if (history) {
      history_arr = JSON.parse(history);
    }
    const newItem = {
      hitter: {
        ...hitter,
        player_id: hitter.playerId,
        name_display_first_last: hitter.playerFullName,
        team_name: hitter.teamShortName,
      },
      good_bad,
      lowerlimit: this.state.hitterlowerlimit,
      upperlimit: this.state.hitterupperlimit,
      stat: this.state.hitterstat,
      order: this.state.order,
      timestamp: moment().format(),
    };
    history_arr.push(newItem);
    this.setState({ history: history_arr });
    history = JSON.stringify(history_arr);
    localStorage.setItem("hitterHistory", history);
    this.retrieveHitterHistory();
  }

  changeSettings(setting, value) {
    this.setState({ [setting]: value });
    localStorage.setItem(setting, value);
  }

  loadPitchers() {
    this.setState({ loading: true });
    fetch("/static/data/pitchers.2021.json")
      .then(response => response.json())
      .then(data => {
        this.setState({
          pitchers: data.stats,
          loading: false,
        });
      })
      .catch(err => {
        console.error(err);
        console.log("Couldn't find any data!");
      });
  }

  loadHitters() {
    this.setState({ loading: true });
    fetch("/static/data/hitters.2021.json")
      .then(response => response.json())
      .then(data => {
        this.setState({
          hitters: data.stats,
          loading: false,
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
          (parseFloat(p[this.state.pitcherstat]) >
            parseFloat(this.state.pitcherupperlimit) ||
            parseFloat(p[this.state.pitcherstat]) <
              parseFloat(this.state.pitcherlowerlimit)) &&
          self.state.pitcherhistory.filter(h => {
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

  filteredHitters() {
    let self = this;
    console.log(this.state.hitterupperlimit);

    if (this.state.hitters) {
      return this.state.hitters.filter(h => {
        return (
          parseFloat(h.atBats) > parseFloat(this.state.ablimit) &&
          (parseFloat(h[this.state.hitterstat]) >
            parseFloat(this.state.hitterupperlimit) ||
            parseFloat(h[this.state.hitterstat]) <
              parseFloat(this.state.hitterlowerlimit)) &&
          self.state.hitterhistory.filter(history => {
            return (
              history.hitter.player_id === h.playerId &&
              moment(history.timestamp).format() >
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
    const player = selection.pitcher || selection.hitter;
    if (order === "desc") {
      return (
        (parseFloat(player[stat]) < parseFloat(lowerlimit) &&
          selection.good_bad === "good") ||
        (parseFloat(player[stat]) > parseFloat(upperlimit) &&
          selection.good_bad === "bad")
      );
    }
    if (order === "asc") {
      return (
        (parseFloat(player[stat]) < parseFloat(lowerlimit) &&
          selection.good_bad === "bad") ||
        (parseFloat(player[stat]) > parseFloat(upperlimit) &&
          selection.good_bad === "good")
      );
    }
  }
  render() {
    let childProps = this.state;
    childProps.changeSettings = this.changeSettings;
    childProps.filteredPitchers = this.filteredPitchers;
    childProps.filteredHitters = this.filteredHitters;
    childProps.correct = this.correct;
    childProps.clearPitcherHistory = this.clearPitcherHistory;
    childProps.clearHitterHistory = this.clearHitterHistory;
    childProps.addToPitcherHistory = this.addToPitcherHistory;
    childProps.addToHitterHistory = this.addToHitterHistory;
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
