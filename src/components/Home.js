import React, { useState, useRef, useEffect } from "react";
import { Card, Button, Modal, Form, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

import { CourseProvider } from "../contexts/CourseContext";

import {
  BrowserRouter as Router,
  Switch,
  NavLink,
  useHistory,
  useLocation,
  Redirect,
} from "react-router-dom";

import Course from "./Course/Course";
import PrivateRoute from "./Auth/PrivateRoute";
import Courses from "./Courses";
import Dashboard from "./Dashboard";

import whiteboardIcon from "../media/icons/whiteboardIcon.svg";
import dashboardIcon from "../media/icons/dashboardIcon.png";
import accountIcon from "../media/icons/accountIcon.png";
import coursesIcon from "../media/icons/coursesIcon.png";
import hamburgerMenuIcon from "../media/icons/hamburgerMenuIcon.svg";

import "../stylesheets/Home.css";

export default function Home() {
  const { mobileHeader } = useTheme();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(true);
  const [showAccount, setShowAccount] = useState("");
  const handleClose = () => setShowModal(false);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const isInstructorRef = useRef(null);
  const accountMenuRef = useRef(null);
  const accountBtnRef = useRef(null);
  useOutsideAlerter(accountMenuRef, accountBtnRef);

  const { pathname } = useLocation();

  const {
    isNewUser,
    logout,
    updateProfile,
    userObject,
    findInitials,
  } = useAuth();
  const history = useHistory();
  // Handle Logout functionality
  async function handleLogout() {
    setError("");
    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }
  // Handle Update Profile functionality (New Users)
  async function handleUpdateProfile(e) {
    e.preventDefault();
    try {
      await updateProfile(
        firstNameRef.current.value,
        lastNameRef.current.value,
        isInstructorRef.current.checked
      );
      handleClose();
    } catch (error) {
      console.log(error);
    }
  }

  function useOutsideAlerter(wrapperRef, buttonRef) {
    useEffect(() => {
      /**
       * Toggles account menu for click outside of wrapper and button
       */
      function handleClickOutside(event) {
        setShowAccount((prevState) => {
          if (
            // Account menu is closed and click is on button
            (prevState === "" || prevState === "account-slider-close") &&
            buttonRef.current &&
            buttonRef.current.contains(event.target)
          ) {
            return "account-slider-show";
          } else if (
            // Account menu is open and click is not on button and wrapper
            prevState === "account-slider-show" &&
            wrapperRef.current &&
            !wrapperRef.current.contains(event.target) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target)
          ) {
            return "account-slider-close";
          } else if (
            // Account menu is open and click is on button
            prevState === "account-slider-show" &&
            buttonRef.current &&
            buttonRef.current.contains(event.target)
          ) {
            return "account-slider-close";
          }
          return prevState;
        });
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [wrapperRef, buttonRef]);
  }

  return (
    <div className="wrapper">
      <Router>
        <div className="navbar">
          <Button
            className="mobile-dropdown-btn"
            variant="link"
            onClick={() => setShowMobileMenu((prevState) => !prevState)}
          >
            <img
              src={hamburgerMenuIcon}
              alt="hamburgerMenuIcon"
              width="30"
              height="30"
              style={{ filter: "invert(1)" }}
            />
          </Button>
          <p className="mobile-header m-0">{mobileHeader}</p>
          <img
            src={whiteboardIcon}
            alt="whiteboardIcon"
            width="50"
            height="50"
            className="whiteboardIcon m-3"
            style={{ filter: "invert(1)" }}
          />
          <Button
            block
            className="navbar-btn m-0 pl-0 pr-0 py-2 rounded-0"
            ref={accountBtnRef}
          >
            <img
              src={accountIcon}
              alt="accountIcon"
              width="25"
              height="25"
              style={{ filter: "invert(1)" }}
            />
            Account
          </Button>
          <NavLink
            to="/"
            exact
            className="home-link py-2"
            activeClassName="home-active-link"
          >
            <img
              src={dashboardIcon}
              alt="dashboardIcon"
              width="25"
              height="25"
              className="navlink-icon"
            />
            Dashboard
          </NavLink>
          <NavLink
            to="/courses"
            className="home-link py-2"
            activeClassName="home-active-link"
          >
            <img
              src={coursesIcon}
              alt="coursesIcon"
              width="25"
              height="25"
              className="navlink-icon"
            />
            Courses
          </NavLink>
          <div ref={accountMenuRef} className={`account-slider ${showAccount}`}>
            <div className="account-slider-content">
              <div className="account-slider-user mb-2">
                {userObject && findInitials(userObject.name)}
              </div>
              <h5>{userObject && userObject.name}</h5>
              <br></br>
              <Button variant="outline-dark" size="sm" onClick={handleLogout}>
                Log Out
              </Button>
              <hr></hr>
            </div>
          </div>
        </div>
        {showMobileMenu && (
          <div className="mobile-menu">
            <NavLink to="/" exact className="text-body ml-2 my-2">
              <img
                src={dashboardIcon}
                alt="dashboardIcon"
                width="25"
                height="25"
                className="mr-2"
              />
              Dashboard
            </NavLink>
            <NavLink to="/courses" className="text-body ml-2 my-2">
              <img
                src={coursesIcon}
                alt="coursesIcon"
                width="25"
                height="25"
                className="mr-2"
              />
              Courses
            </NavLink>
          </div>
        )}
        <div className="content px-5 pt-2 pb-0 px-xs-0">
          {error && <Alert variant="danger">{error}</Alert>}
          <Switch>
            <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
            <PrivateRoute exact path="/" component={Dashboard} />
            <CourseProvider>
              <PrivateRoute exact path="/courses" component={Courses} />
              <PrivateRoute path={"/courses/:courseId"} component={Course} />
            </CourseProvider>
          </Switch>
        </div>
      </Router>
      {/* Request New Users for more information*/}
      <Modal
        show={showModal && isNewUser}
        onHide={handleClose}
        backdrop="static"
        centered
        animations="false"
      >
        <Card className="p-3">
          <Card.Body>
            <h2 className="text-center mb-3"> Update Profile</h2>
          </Card.Body>
          <Form onSubmit={handleUpdateProfile}>
            <Form.Group id="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                ref={firstNameRef}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group id="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                ref={lastNameRef}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Check
              className="mt-3 d-flex align-items-center"
              type="radio"
              name="isInstructor"
              label="I am an Instructor"
              ref={isInstructorRef}
              required
            />
            <Form.Check
              className="mt-0 d-flex align-items-center"
              type="radio"
              name="isInstructor"
              label="I am a Student"
              required
            />
            <p className="my-2" style={{ color: "darkred" }}>
              To test the full capabilities of this web app, select the
              Instructor option
            </p>
            <Button className="w-100 mt-3" type="submit">
              Update Profile
            </Button>
          </Form>
        </Card>
      </Modal>
    </div>
  );
}
