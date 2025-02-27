import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function Cart({ user }) {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate(); // ✅ Initialize navigation

  const handleCheckout = async () => {
    // Simulate purchase (you can later integrate payment)
    setCartItems([]);
    await axios.delete(`http://localhost:5000/api/cart/clear/${user._id}`);
    navigate("/confirmation"); // ✅ Redirect to confirmation page
  };

  // Fetch cart items from backend
  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/api/cart/${user._id}`)
        .then((res) => {
          setCartItems(res.data.items || []);
        })
        .catch((err) => console.error("Error fetching cart:", err));
    }
  }, [user]);

  // Handle quantity changes
  const handleQuantityChange = async (bookId, delta) => {
    const updatedCartItems = cartItems.map((item) =>
      item.bookId._id === bookId
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );

    setCartItems(updatedCartItems); // Update UI first

    try {
      await axios.put(
        `http://localhost:5000/api/cart/update/${user._id}/${bookId}`,
        {
          quantity: updatedCartItems.find((item) => item.bookId._id === bookId)
            .quantity,
        }
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Remove item from cart
  const handleRemove = (bookId) => {
    axios
      .delete(`http://localhost:5000/api/cart/clear/${user._id}/${bookId}`)
      .then(() => {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.bookId._id !== bookId)
        );
      })
      .catch((err) => console.error("Error removing item:", err));
  };

  // Calculate total
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.bookId.price * item.quantity,
      0
    );
  };

  if (!user) {
    return (
      <h3 className="text-center mt-5">Please log in to view your cart.</h3>
    );
  }

  return (
    <div
      className="cart-page-bg d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f2f2f2, #c9d6ff)",
        padding: "20px",
      }}
    >
      <div className="cart-container bg-white p-4 rounded shadow-lg w-75">
        <h2 className="text-center mb-4">Your Cart</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Remove</th>
              <th>Image</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Quality</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cartItems
              .filter((item) => item.bookId) // ✅ Ensure `bookId` exists
              .map((item) => (
                <tr key={item.bookId?._id || Math.random()}>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleRemove(item.bookId._id)}
                    >
                      Remove
                    </Button>
                  </td>
                  <td>
                    {item.bookId?.image ? (
                      <img
                        src={`http://localhost:5000/${item.bookId.image.replace(
                          /\\/g,
                          "/"
                        )}`}
                        alt={item.bookId?.name || "Unknown Book"}
                        width="80"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>{item.bookId?.name || "Unknown Book"}</td>
                  <td>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(item.bookId._id, -1)}
                      disabled={item.quantity === 1}
                    >
                      -
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(item.bookId._id, 1)}
                    >
                      +
                    </Button>
                  </td>
                  <td>₹{item.bookId?.price || 0}</td>
                  <td>{item.bookId?.quality || "N/A"}</td>
                  <td>₹{(item.bookId?.price || 0) * item.quantity}</td>
                </tr>
              ))}
          </tbody>
        </Table>

        <div className="text-end">
          <h4>Total: ₹{calculateTotal()}</h4>
          <Button variant="success" className="mt-3" onClick={handleCheckout}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}
Cart.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
};
