import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

export default function NavBar({ user, cartLength }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <NavLink className="navbar-brand d-flex align-items-center" to="/buyer">
        Quickcart
      </NavLink>
      <div className="ms-auto">
        {user && (
          <>
            {" "}
            <NavLink to="/search" className="btn btn-outline-light me-2">
              🔍
            </NavLink>
            <NavLink
              to="/buyer/cart"
              className="btn btn-outline-light m-2 me-3 position-relative"
            >
              Cart
              {cartLength > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.8rem" }}
                >
                  {cartLength}
                </span>
              )}
            </NavLink>
            <NavLink
              to={`/buyer/profile/${user._id}`}
              className="btn btn-outline-light"
            >
              Profile
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

NavBar.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }),
  cartLength: PropTypes.number.isRequired,
};
