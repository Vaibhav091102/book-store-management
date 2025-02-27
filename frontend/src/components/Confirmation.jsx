import { Link } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";

export default function Confirmation() {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card
        className="text-center shadow p-4"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <Card.Body>
          <h1 className="text-success fw-bold">🎉 Congratulations! 🎉</h1>
          <p className="fs-4 text-muted">Your purchase was successful.</p>
          <Button variant="primary" as={Link} to="/buyer">
            Go to Home
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
