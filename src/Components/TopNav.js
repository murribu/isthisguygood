import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

class TopNav extends React.Component {
  render() {
    return (
      <Navbar bg="light" expand="lg">
        <LinkContainer to="/">
          <Navbar className="Brand nav-link">Is This Guy Good?</Navbar>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <NavLink className="nav-link" to="/play">
              Pitchers
            </NavLink>
            <NavLink className="nav-link" to="/hitters">
              Hitters
            </NavLink>
            <NavLink className="nav-link" to="/settings">
              Settings
            </NavLink>
            <NavLink className="nav-link" to="/about">
              About
            </NavLink>
          </Nav>
          <Nav className="justify-content-end mr-3" style={{ width: "100%" }}>
            2021
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default TopNav;
