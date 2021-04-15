import React, { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Form, Card, Button, Alert, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { signup } = useAuth();

  // Handle form submission
  async function handleSubmit(e) {
    // Prevent page reload
    e.preventDefault();
    // Handle error: Passwords do not match
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }
    // Sign up through firebase and disabled submit button
    try {
      setError("");
      setMessage("");
      setLoading(true);
      let err = await signup(emailRef.current.value, passwordRef.current.value);
      if (err) {
        if (err.code === "auth/email-already-in-use") {
          setError("Email already in use");
        }
      } else {
        setMessage(
          `An email verification link has been sent to ${emailRef.current.value}`
        );
      }
    } catch (error) {
      setError("Failed to create an account");
    }
    setLoading(false);
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center w-100 h-100"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100 h-100" style={{ maxWidth: "400px" }}>
        <Card className="p-3">
          <Card.Body>
            <h2 className="text-center mb-4">Sign Up</h2>
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
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                className="password-input"
                type="password"
                ref={passwordConfirmRef}
                required
              />
            </Form.Group>
            <Button className="w-100" disabled={loading} type="sumbit">
              Sign Up
            </Button>
          </Form>
        </Card>
        <div className="w-100 text-center mt-2">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </Container>
  );
}
