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
    if (e.currentTarget.attributes["data-setting"].value === "stat") {
      this.props.changeSettings(
        "order",
        this.props.availablestats[value].order
      );
      this.props.changeSettings(
        "lowerlimit",
        this.props.availablestats[value].lowerlimit
      );
      this.props.changeSettings(
        "upperlimit",
        this.props.availablestats[value].upperlimit
      );
    }
  }

  showStats() {
    const pitchers = this.props.pitchers.filter(p => {
      return (
        (!this.props.relievers ||
          parseInt(p.gamesPlayed) / 2 > parseInt(p.gamesStarted)) &&
        parseFloat(p.inningsPitched) > parseFloat(this.props.iplimit) &&
        (parseFloat(p[this.props.stat]) > parseFloat(this.props.upperlimit) ||
          parseFloat(p[this.props.stat]) < parseFloat(this.props.lowerlimit))
      );
    });
    const good = this.props.pitchers.filter(p => {
      return (
        (!this.props.relievers ||
          parseInt(p.gamesPlayed) / 2 > parseInt(p.gamesStarted)) &&
        parseFloat(p.inningsPitched) > parseFloat(this.props.iplimit) &&
        ((this.props.order === "asc" &&
          parseFloat(p[this.props.stat]) > parseFloat(this.props.upperlimit)) ||
          (this.props.order === "desc" &&
            parseFloat(p[this.props.stat]) < parseFloat(this.props.lowerlimit)))
      );
    });
    return (
      (pitchers.length === 0
        ? 0
        : Math.round(100 * good.length / pitchers.length)) +
      "% of the " +
      pitchers.length +
      " pitchers would be good"
    );
  }

  render() {
    return (
      <div className="container">
        <Form>
          <Row>
            <Col xs="4" className="pull-right mb-3">
              <h1>Settings</h1>
            </Col>
          </Row>
          <Form.Group as={Row} controlId="stat">
            <Col xs="4" className="pull-right">
              <Form.Label>Stat</Form.Label>
            </Col>
            <Col xs="8">
              <Form.Control
                as="select"
                onChange={this.changeSetting}
                value={this.props.stat}
                data-setting="stat"
              >
                {Object.keys(this.props.availablestats).map(k => (
                  <option key={k}>{k}</option>
                ))}
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="lowerlimit">
            <Col xs="4" className="pull-right">
              <Form.Label>Lower Limit</Form.Label>
            </Col>
            <Col xs="8">
              <Form.Control
                onChange={this.changeSetting}
                value={this.props.lowerlimit}
                data-setting="lowerlimit"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="upperlimit">
            <Col xs="4" className="pull-right">
              <Form.Label>Upper Limit</Form.Label>
            </Col>
            <Col xs="8">
              <Form.Control
                onChange={this.changeSetting}
                value={this.props.upperlimit}
                data-setting="upperlimit"
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
            <Col xs="8">{this.showStats()}</Col>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default Settings;
