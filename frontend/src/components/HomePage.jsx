import { Link } from "react-router-dom";
import Footer from "./footer";
import NavBar from "./NavBar";
import { Button } from "react-bootstrap";

const HomePage = () => {
  // const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <NavBar />

      {/* Main Content */}
      <div className="container text-center flex-grow-1 mt-5">
        <h1>Welcome to Our Platform!</h1>
        <p className="lead">A great place for buyers and sellers.</p>
        <Button as={Link} to="/login" variant="primary">
          Login
        </Button>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
