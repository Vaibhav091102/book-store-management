import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";

export default function Profile() {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user from storage
    navigate("/login");
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/profile/${id}`
        );
        setProfileData(response.data.user);

        if (response.data.sellerInfo) {
          setSellerInfo(response.data.sellerInfo);
        }

        // Set initial form data
        setFormData({
          name: response.data.user.name || "",
          address: response.data.sellerInfo?.address || "",
          phone: response.data.sellerInfo?.phone || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfileData();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/profile/update/${id}`,
        formData
      );
      setProfileData(response.data.user);
      if (response.data.sellerInfo) {
        setSellerInfo(response.data.sellerInfo);
      }
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!profileData) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="container mt-5 text-center">
      {/* Profile Picture */}
      <img
        src={"/blank-profile-picture-973460_1280.webp"}
        alt="Profile"
        className="rounded-circle mb-3"
        width="150"
        height="150"
      />

      {/* Information Table */}
      <table className="table table-bordered mt-4">
        <tbody>
          <tr>
            <th>Name</th>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                formData.name
              )}
            </td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{profileData.email}</td>
          </tr>
          {profileData.role === "seller" && (
            <>
              <tr>
                <th>Bookstore Name</th>
                <td>{sellerInfo?.bookstore_name}</td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-control"
                    />
                  ) : (
                    sellerInfo?.phone
                  )}
                </td>
              </tr>
              <tr>
                <th>Address</th>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="form-control"
                    />
                  ) : (
                    sellerInfo?.address
                  )}
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>

      {/* Edit/Save Button */}
      {!isEditing ? (
        <button className="btn btn-primary m-3" onClick={handleEdit}>
          Edit Profile
        </button>
      ) : (
        <button className="btn btn-success m-3" onClick={handleSave}>
          Save Changes
        </button>
      )}
      <button className="btn btn-primary m-3 flex" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

Profile.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
};
