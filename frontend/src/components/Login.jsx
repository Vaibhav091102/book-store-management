import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Login = ({ setUser, setSeller }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const HandleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      const userData = res.data.user;
      const token = res.data.token;
      const sellerDetails = res.data.sellerDetails;
      setSeller(sellerDetails);
      setUser(userData);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", token);
      localStorage.setItem("seller", sellerDetails);
      setMessage({ text: "Login successful!", type: "success" });

      setTimeout(() => {
        if (userData.role === "buyer") {
          navigate("/buyer");
        } else {
          navigate("/seller");
        }
      }, 0);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Login failed",
        type: "danger",
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h2 className="text-center mb-4">Login</h2>

            {message && (
              <div className={`alert alert-${message.type}`} role="alert">
                {message.text}
              </div>
            )}

            <form onSubmit={HandleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={HandleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={HandleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>

            <div className="d-flex justify-content-between mt-3 text-sm">
              <p>
                Do not have an account?{" "}
                <a href="/signup" className="text-primary">
                  Sign up
                </a>
              </p>
              <a href="/forget-password" className="text-primary">
                Forgot Password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
Login.propTypes = {
  setUser: PropTypes.func.isRequired, // Define that setUser is a required function prop
  setSeller: PropTypes.func.isRequired,
};

export default Login;
