import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../stylesheets/Landing.css";
import LandingIntro from "../../media/images/landing-intro.jpg";
import rightArrowIcon from "../../media/icons/rightArrowIcon.png";
import LandingOne from "../../media/images/elementarySchoolStudent.jpg";
import LandingTwo from "../../media/images/collegeStudent.jpg";
import LandingThree from "../../media/images/businessWoman.jpg";

export default function Landing() {
  return (
    <div>
      {/* Introduction */}
      <Container fluid className="bigcontainer">
        <Container className="landing-intro">
          <Row noGutters>
            <Col className="landing-intro-content">
              <div className="landing-intro-desc">
                <h1 className="landing-intro-desc-header">
                  Learning Management Platform
                </h1>
                <p className="landing-intro-desc-content">
                  {" "}
                  Due to unprecedent events, educators have been forced to
                  scramble to find alternatives to in-person teaching. For
                  Educators, StudentBoard provides an online learning platform
                  that is powerful, reliable, and simplistic so that educators
                  may continue shaping the world's youth.
                </p>
                <div className="landing-intro-btn-grp">
                  <Button variant="outline-info" className="landing-intro-btn">
                    <Link to={`/login`} className="text-decoration-none">
                      Try it out!
                      <img
                        src={rightArrowIcon}
                        alt="rightArrowIcon"
                        width="25"
                        height="25"
                        className="ml-2 landing-intro-btn-img"
                      />
                    </Link>
                  </Button>
                </div>
              </div>
            </Col>
            <Col className="landing-intro-image">
              <img
                src={LandingIntro}
                alt="LandingIntro"
                width="555"
                height="500"
              />
            </Col>
          </Row>
        </Container>
      </Container>
      {/* A Universal Solution */}
      <Container className="landing-block">
        <Row>
          <Col>
            <p className="text-center landing-block-preheader m-0 text-muted">
              FOR ALL LEARNERS
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <h1 className="text-center landing-block-header">
              A Universal Solution
            </h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <p className="text-center landing-block-desc">
              StudentBoard is built to make teaching and learning easier for all
              age groups. From K-12 to Higher Education to Businesses,
              StudentBoard provides a universal solution. Learn more about how
              StudentBoard works with your institution
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="landing-block-card">
              <img
                src={LandingOne}
                alt="LandingOne"
                width="300"
                height="300"
                className="rounded-circle mt-5"
              />
              <h3 className="my-4">K-12 Education</h3>
              <p>
                With its easy-to-use design, the StudentBoard platform helps
                educators create a custom learning experience suited for the
                littles ones.
              </p>
            </div>
          </Col>
          <Col>
            <div className="landing-block-card">
              <img
                src={LandingTwo}
                alt="LandingTwo"
                width="300"
                height="300"
                className="rounded-circle mt-5"
              />
              <h3 className="my-4">Higher Education</h3>
              <p>
                From discussion boards to assignment tracker, StudentBoard
                provides all the necessary tools so that Educators may continue
                shaping the world's youth.
              </p>
            </div>
          </Col>
          <Col>
            <div className="landing-block-card">
              <img
                src={LandingThree}
                alt="LandingThree"
                width="300"
                height="300"
                className="rounded-circle mt-5"
              />
              <h3 className="my-4">Business</h3>
              <p>
                Businesses seeking an alternative form of employee training see
                value in StudentBoard's simplistic, yet scalable design.
                StudentBoard's intuitive web technology allows for businesses to
                thrive without the hassle.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
      {/* Features and Advantanges */}
      <Container className="landing-block">
        <Row>
          <Col>
            <p className="text-center landing-block-preheader m-0 text-muted">
              FEATURES AND ADVANTAGES
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <h1 className="text-center landing-block-header">
              What makes StudentBoard the go-to online learning platform?
            </h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <p className="text-center landing-block-desc">
              The StudentBoard online learning platform provides many features
              and advantages for both educators and students. The following are
              several of such:
            </p>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <div className="landing-block-card">
              <h3 className="text-center font-weight-bold">Scalable</h3>
              <p>
                {" "}
                Built over Google's Firebase NoSQL database allows StudentBoard
                to horizontally scale. From classrooms to large enterprises,
                StudentBoard provides a unique solution for all sizes.
              </p>
            </div>
          </Col>
          <Col>
            <div className="landing-block-card">
              <h3 className="text-center font-weight-bold">Simplistic</h3>
              <p>
                {" "}
                StudentBoard's intuitive design allows for all age groups to get
                involved. From K-12 to Higher Education to Businesses,
                StudentBoard provides a custom experience to each of its users.
              </p>
            </div>
          </Col>
          <Col>
            <div className="landing-block-card">
              <h3 className="text-center font-weight-bold">Powerful</h3>
              <p>
                {" "}
                StudentBoard comes with many tools that allow educators to
                facilitate and create a classroom-like experience and students
                to suceed.
              </p>
            </div>
          </Col>
        </Row>
      </Container>

    </div>
  );
}
