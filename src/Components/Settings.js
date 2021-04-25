import React from "react";
import { Row, Col, Form } from "react-bootstrap";
import "./Settings.css";

export class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.changeSetting = this.changeSetting.bind(this);
  }

  changeSetting(e) {
    const value =
      e.currentTarget.value === "false" ? false : e.currentTarget.value;
    this.props.changeSettings(
      e.currentTarget.attributes["data-setting"].value,
      value
    );
    if (e.currentTarget.attributes["data-setting"].value === "pitcherstat") {
      this.props.changeSettings(
        "pitcherorder",
        this.props.availablepitcherstats[value].order
      );
      this.props.changeSettings(
        "pitcherlowerlimit",
        this.props.availablepitcherstats[value].lowerlimit
      );
      this.props.changeSettings(
        "pitcherupperlimit",
        this.props.availablepitcherstats[value].upperlimit
      );
    }
    if (e.currentTarget.attributes["data-setting"].value === "hitterstat") {
      this.props.changeSettings(
        "hitterorder",
        this.props.availablehitterstats[value].order
      );
      this.props.changeSettings(
        "hitterlowerlimit",
        this.props.availablehitterstats[value].lowerlimit
      );
      this.props.changeSettings(
        "hitterupperlimit",
        this.props.availablehitterstats[value].upperlimit
      );
    }
  }

  showPitcherStats() {
    const pitchers = this.props.pitchers.filter(p => {
      return (
        (!this.props.relievers ||
          parseInt(p.gamesPlayed) / 2 > parseInt(p.gamesStarted)) &&
        parseFloat(p.inningsPitched) > parseFloat(this.props.iplimit) &&
        (parseFloat(p[this.props.pitcherstat]) >
          parseFloat(this.props.pitcherupperlimit) ||
          parseFloat(p[this.props.pitcherstat]) <
            parseFloat(this.props.pitcherlowerlimit))
      );
    });
    const good = this.props.pitchers.filter(p => {
      return (
        (!this.props.relievers ||
          parseInt(p.gamesPlayed) / 2 > parseInt(p.gamesStarted)) &&
        parseFloat(p.inningsPitched) > parseFloat(this.props.iplimit) &&
        ((this.props.pitcherorder === "asc" &&
          parseFloat(p[this.props.pitcherstat]) >
            parseFloat(this.props.pitcherupperlimit)) ||
          (this.props.pitcherorder === "desc" &&
            parseFloat(p[this.props.pitcherstat]) <
              parseFloat(this.props.pitcherlowerlimit)))
      );
    });
    return (
      (pitchers.length === 0
        ? 0
        : Math.round((100 * good.length) / pitchers.length)) +
      "% of the " +
      pitchers.length +
      " pitchers would be good"
    );
  }

  showHitterStats() {
    const hitters = this.props.hitters.filter(h => {
      return (
        parseFloat(h.atBats) > parseFloat(this.props.ablimit) &&
        (parseFloat(h[this.props.hitterstat]) >
          parseFloat(this.props.hitterupperlimit) ||
          parseFloat(h[this.props.hitterstat]) <
            parseFloat(this.props.hitterlowerlimit))
      );
    });
    const good = this.props.hitters.filter(h => {
      return (
        parseFloat(h.atBats) > parseFloat(this.props.ablimit) &&
        ((this.props.hitterorder === "asc" &&
          parseFloat(h[this.props.hitterstat]) >
            parseFloat(this.props.hitterupperlimit)) ||
          (this.props.hitterorder === "desc" &&
            parseFloat(h[this.props.hitterstat]) <
              parseFloat(this.props.hitterlowerlimit)))
      );
    });
    return (
      (hitters.length === 0
        ? 0
        : Math.round((100 * good.length) / hitters.length)) +
      "% of the " +
      hitters.length +
      " hitters would be good"
    );
  }

  render() {
    return (
      <div className="container">
        <Form>
          <Row>
            <Col xs="4" className="pull-right mb-3">
              <h1>Pitcher Settings</h1>
            </Col>
          </Row>
          <Form.Group as={Row} controlId="pitcherstat">
            <Col xs="4" className="pull-right">
              <Form.Label>Stat</Form.Label>
            </Col>
            <Col xs="8">
              <Form.Control
                as="select"
                onChange={this.changeSetting}
                value={this.props.pitcherstat}
                data-setting="pitcherstat"
              >
                {Object.keys(this.props.availablepitcherstats).map(k => (
                  <option key={k}>{k}</option>
                ))}
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="pitcherlowerlimit">
            <Col xs="4" className="pull-right">
              <Form.Label>Lower Limit</Form.Label>
            </Col>
            <Col xs="8">
              <Form.Control
                onChange={this.changeSetting}
                value={this.props.pitcherlowerlimit}
                data-setting="pitcherlowerlimit"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="pitcherupperlimit">
            <Col xs="4" className="pull-right">
              <Form.Label>Upper Limit</Form.Label>
            </Col>
            <Col xs="8">
              <Form.Control
                onChange={this.changeSetting}
                value={this.props.pitcherupperlimit}
                data-setting="pitcherupperlimit"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="pitcherorder">
            <Col xs="4" className="pull-right">
              <Form.Label>Order</Form.Label>
            </Col>
            <Col xs="8">
              <Form.Control
                as="select"
                onChange={this.changeSetting}
                value={this.props.pitcherorder}
                data-setting="pitcherorder"
              >
                <option>desc</option>
                <option>asc</option>
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="iplimit">
            <Col xs="4" className="pull-right">
              <Form.Label>Minimum IPs</Form.Label>
            </Col>
            <Col xs="8">
              <Form.Control
                onChange={this.changeSetting}
                value={this.props.iplimit}
                data-setting="iplimit"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="relievers">
            <Col xs="4" className="pull-right">
              <Form.Label>Which pitchers</Form.Label>
            </Col>
            <Col xs="8">
              <Form.Control
                as="select"
                onChange={this.changeSetting}
                value={this.props.relievers}
                data-setting="relievers"
              >
                <option value={true}>Only relievers</option>
                <option value={false}>All of 'em</option>
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Col xs="4" />
            <Col xs="8">{this.showPitcherStats()}</Col>
          </Form.Group>
          <Row>
            <Col xs="4" className="pull-right mb-3">
              <h1>Hitter Settings</h1>
            </Col>
          </Row>
          <Form.Group as={Row} controlId="hitterstat">
            <Col xs="4" className="pull-right">
              <Form.Label>Stat</Form.Label>
            </Col>
            <Col xs="8">
              <Form.Control
                as="select"
                onChange={this.changeSetting}
                value={this.props.hitterstat}
                data-setting="hitterstat"
              >
                {Object.keys(this.props.availablehitterstats).map(k => (
                  <option key={k}>{k}</option>
                ))}
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="hitterlowerlimit">
            <Col xs="4" className="pull-right">
              <Form.Label>Lower Limit</Form.Label>
            </Col>
            <Col xs="8">
              <Form.Control
                onChange={this.changeSetting}
                value={this.props.hitterlowerlimit}
                data-setting="hitterlowerlimit"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="hitterupperlimit">
            <Col xs="4" className="pull-right">
              <Form.Label>Upper Limit</Form.Label>
            </Col>
            <Col xs="8">
              <Form.Control
                onChange={this.changeSetting}
                value={this.props.hitterupperlimit}
                data-setting="hitterupperlimit"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="order">
            <Col xs="4" className="pull-right">
              <Form.Label>Order</Form.Label>
            </Col>
            <Col xs="8">
              <Form.Control
                as="select"
                onChange={this.changeSetting}
                value={this.props.order}
                data-setting="order"
              >
                <option>desc</option>
                <option>asc</option>
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="ablimit">
            <Col xs="4" className="pull-right">
              <Form.Label>Minimum ABs</Form.Label>
            </Col>
            <Col xs="8">
              <Form.Control
                onChange={this.changeSetting}
                value={this.props.ablimit}
                data-setting="ablimit"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Col xs="4" />
            <Col xs="8">{this.showHitterStats()}</Col>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default Settings;
