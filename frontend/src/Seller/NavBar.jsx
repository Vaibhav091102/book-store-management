import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const NavBar = ({ user }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <NavLink className="navbar-brand d-flex align-items-center" to="/seller">
        QuickKart
      </NavLink>

      <div className="ms-auto">
        <NavLink to="/search" className="btn btn-outline-light me-2">
          🔍
        </NavLink>
        <NavLink to="mybook" className="btn btn-outline-light me-2">
          My Book
        </NavLink>
        <NavLink to={`profile/${user._id}`} className="btn btn-outline-light">
          Profile
        </NavLink>
      </div>
    </nav>
  );
};
NavBar.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
};
export default NavBar;
