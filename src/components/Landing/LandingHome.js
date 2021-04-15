import React from "react";
import { Button, Dropdown, Container, Row, Col } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import "../../stylesheets/LandingHome.css";
import Landing from "./Landing";
import Faq from "./Faq";
import About from "./About";
import whiteboardIcon from "../../media/icons/whiteboardIcon.svg";
import hamburgerIcon from "../../media/icons/hamburgerMenuIcon.svg";

export default function LandingHome() {
  const { url, path } = useRouteMatch();
  const history = useHistory();

  return (
    <Router>
      {/* Navbar */}
      <div className="landingHome-navbar-wrapper">
        <div className="landingHome-navbar">
          <div className="landingHome-logo">
            <img
              src={whiteboardIcon}
              alt="whiteboardIcon"
              width="50"
              height="50"
              className="mr-2 landingHome-logo-icon"
            />
            <Link
              to={`/landing`}
              className="text-decoration-none text-dark"
              onClick={() => (document.documentElement.scrollTop = 0)}
            >
              <h2 className="m-0 landingHome-logo-title">StudentBoard</h2>
            </Link>
          </div>
          <div className="landingHome-navbar-links">
            <Link to={`${url}/faq`} className="text-decoration-none mx-4">
              <Button
                className="text-muted p-0"
                variant="link"
                onClick={() => (document.documentElement.scrollTop = 0)}
              >
                FAQ
              </Button>
            </Link>

            <Button
              onClick={() =>
                (document.documentElement.scrollTop =
                  document.documentElement.scrollHeight)
              }
              className="mb-0 mx-4 text-muted p-0"
              variant="link"
            >
              Support
            </Button>
            <Link to={`${url}/about`} className="text-decoration-none mx-4">
              <Button
                className="text-muted p-0"
                variant="link"
                onClick={() => (document.documentElement.scrollTop = 0)}
              >
                About Me
              </Button>
            </Link>
          </div>
          <Button
            className="rounded-pill landingHome-login"
            variant="info"
            onClick={() => history.push("/login")}
          >
            Login
          </Button>
          <Dropdown className="landingHome-navbar-dropdown">
            <Dropdown.Toggle variant="outline-dark" className="p-1">
              <img
                src={hamburgerIcon}
                alt="hamburgerIcon"
                width="20"
                height="20"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                as={Link}
                to={`${url}/faq`}
                className="landingHome-navbar-dropdown-link"
              >
                FAQ
              </Dropdown.Item>
              <Dropdown.Item
                as={Link}
                to={`${url}/about`}
                className="landingHome-navbar-dropdown-link"
              >
                About Me
              </Dropdown.Item>
              <Dropdown.Item
                className="landingHome-navbar-dropdown-link"
                onClick={() =>
                  (document.documentElement.scrollTop =
                    document.documentElement.scrollHeight)
                }
              >
                Support
              </Dropdown.Item>
              <Dropdown.Item onClick={() => history.push("/login")}>
                Login
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      {/* Switch Content */}
      <Switch>
        <Route path={`${path}`} exact component={Landing} />
        <Route path={`${path}/faq`} exact component={Faq} />
        <Route path={`${path}/about`} exact component={About} />
      </Switch>
      {/* Getting Started */}
      <Container className="landing-banner d-flex" fluid>
        <Row className="flex-grow-1">
          <Col className="landing-banner-content">
            <p className="landing-banner-preheader">
              {" "}
              TAKE STUDENTBOARD FOR A SPIN
            </p>
            <h2 className="landing-banner-header text-center">
              {" "}
              Ready to try out StudentBoard?
            </h2>
            <Button
              variant="light"
              className="rounded-pill mt-4"
              onClick={() => history.push("/login")}
            >
              LET'S GET STARTED
            </Button>
          </Col>
        </Row>
      </Container>
      {/* Contact and Support */}
      <Container className="landingHome-footer d-flex" id="support">
        <Row className="flex-grow-1">
          <Col className="landingHome-footer-content">
            <strong className="text-left">Head Quarters</strong>
            <p>1234 Example Street West Suite 999, City, State 12345, USA</p>
            <strong>Contact us</strong>
            <p className="m-0">999-999-9999</p>
            <p>loremIpsum@loremIpsum.com</p>
          </Col>
        </Row>
      </Container>
      {/* Footer */}
      <div className="landingHome-footer-bottom">
        <p className="m-0 text-muted">
          Copyright © 2021 Lorem Ipsum, Inc. All rights reserved. Various
          trademarks held by their respective owners.
        </p>
      </div>
    </Router>
  );
}
