import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { Form, Card, Button, Alert, Container } from "react-bootstrap";
// Import stylesheets
import "../../stylesheets/Login.css";
// Import Icons
import facebookIcon from "../../media/icons/facebookIcon.svg";
import googleIcon from "../../media/icons/googleIcon.svg";

export default function Login() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const persistenceRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  const history = useHistory();

  // Handle form submisssion
  async function handleSubmit(e) {
    // Prevent page reload
    e.preventDefault();
    // Sign in through firebase and disable submit button
    try {
      setError("");
      setMessage("");
      setLoading(true);
      const { user } = await login(
        emailRef.current.value,
        passwordRef.current.value,
        persistenceRef.current.checked
      );
      if (!user.emailVerified) {
        setMessage("Check your inbox to verify your account");
      } else {
        history.push("/");
      }
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setError("The password you have entered is incorrect");
      } else if (error.code === "auth/user-not-found") {
        setError("The email you have entered is incorrect");
      } else {
        setError("Failed to log in");
      }
    }
    setLoading(false);
  }

  async function handleLoginWithGoogle() {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();
      setLoading(false);
      history.push("/");
    } catch (error) {
      if (error.code !== "auth/popup-closed-by-user") {
        setError("Failed to log in through Google");
      }
      setLoading(false);
    }
  }

  async function handleLoginWithFacebook() {
    try {
      setError("");
      setLoading(true);
      await loginWithFacebook();
      setLoading(false);
      history.push("/");
    } catch (error) {
      if (error.code !== "auth/popup-closed-by-user") {
        setError("Failed to log in through Facebook");
      }
      setLoading(false);
    }
  }

  return (
      <Container
        className="d-flex align-items-center justify-content-center w-100 h-100"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100 h-100" style={{ maxWidth: "400px" }}>
          <Card className="p-3">
            <Card.Body>
              <h2 className="text-center mb-4">Log In</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="warning">{message}</Alert>}
            </Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Button className="w-100" disabled={loading} type="submit">
                Log In
              </Button>
              <Form.Check
                className="mt-3 d-flex align-items-center"
                type="checkbox"
                ref={persistenceRef}
                label="Remember Me"
              />
              <div className="w-100 text-center mt-3">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>
              <div className="separator mt-3 mb-3">Or</div>
              <div className="loginOptions">
                <Button disabled={loading} onClick={handleLoginWithGoogle}>
                  <img
                    src={googleIcon}
                    className="d-inline-block align-top"
                    alt="googleIcon"
                    id="googleIcon"
                  />
                </Button>
                <Button
                  className="ml-3"
                  disabled={loading}
                  onClick={handleLoginWithFacebook}
                >
                  <img
                    src={facebookIcon}
                    className="d-inline-block align-top"
                    alt="facebookIcon"
                    id="facebookIcon"
                  />
                </Button>
              </div>
            </Form>
          </Card>
          <div className="w-100 text-center mt-2">
            Need an account? <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </Container>
  );
}
