import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import profileImage from "../../media/images/profileImage.PNG";

export default function About() {
  return (
    <Container fluid className="bigcontainer">
      <Container className="landing-intro">
        <Row noGutters>
          <Col className="landing-intro-content">
            <div className="landing-intro-desc">
              <h1 className="landing-intro-desc-header">
                The Maker of StudentBoard
              </h1>
              <p className="landing-intro-desc-content">
                {" "}
                StudentBoard was made by me (Loc Chuong) as a personal side
                project to further my exposure to web technologies such as
                React, Bootstrap, React Router-dom, and Firebase. I am a
                passionate web developer that is always looking for new
                opportunities to further my learning. No copyright infringement
                is intended, StudentBoard was made purely for educational
                purposes. If you'd like to learn more about me and what I do,
                feel free to take a look at my resume.
              </p>
              <div className="landing-intro-btn-grp">
                <Button variant="outline-info" className="landing-intro-btn">
                  My resume
                </Button>
              </div>
            </div>
          </Col>
          <Col className="landing-intro-image">
            <img
              src={profileImage}
              alt="profileImage"
              width="555"
              height="500"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
