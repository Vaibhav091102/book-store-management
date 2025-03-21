import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";

export default function Cart({ user, setCartLength }) {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate(); // ✅ Initialize navigation

  const handleCheckout = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/clearall/${user._id}`);
      setCartItems([]);
      setCartLength(0);
      navigate("/confirmation"); // ✅ Redirect to confirmation page
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  // Fetch cart items from backend
  useEffect(() => {
    if (user?._id) {
      axios
        .get(`http://localhost:5000/api/cart/${user._id}`)
        .then((res) => {
          const formattedItems = Array.isArray(res.data.cart)
            ? res.data.cart
            : [];
          setCartItems(formattedItems);
          setCartLength(formattedItems.length);
        })
        .catch((err) => console.error("Error fetching cart:", err));
    }
  }, [user?._id, setCartLength]);

  //Quality change
  const handleQuantityChange = async (bookId, delta, availableCopies) => {
    const updatedCartItems = cartItems.map((item) =>
      item.bookId === bookId
        ? {
            ...item,
            quantity: Math.min(
              availableCopies,
              Math.max(1, item.quantity + delta)
            ),
          }
        : item
    );

    setCartItems(updatedCartItems);

    try {
      await axios.put(
        `http://localhost:5000/api/cart/update/${user._id}/${bookId}`,
        {
          quantity: updatedCartItems.find((item) => item.bookId === bookId)
            ?.quantity,
        }
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert(error.response?.data?.message || "Error updating quantity");
    }
  };

  // Remove item from cart
  const handleRemove = async (bookId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/cart/clear/${user._id}/${bookId}`
      );
      setCartItems((prevItems) => {
        const updatedCart = prevItems.filter(
          (item) => item.book?._id !== bookId
        );
        setCartLength(updatedCart.length); // ✅ Update cart length
        return updatedCart;
      });
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item?.book?.price || 0) * (item?.quantity || 0),
      0
    );
  };

  if (!user) {
    return (
      <h3 className="text-center mt-5">Please log in to view your cart.</h3>
    );
  }

  return (
    <>
      <BackButton />
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
                {/* <th>Quality</th> */}
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    Your cart is empty
                  </td>
                </tr>
              ) : (
                cartItems
                  .filter((item) => item.bookId) // ✅ Ensure `bookId` exists
                  .map((item) => (
                    <tr key={item.book?._id || Math.random()}>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => handleRemove(item.book._id)}
                        >
                          Remove
                        </Button>
                      </td>
                      <td>
                        {item.book?.image ? (
                          <img
                            src={`http://localhost:5000/${item.book.image.replace(
                              /\\/g,
                              "/"
                            )}`}
                            alt={item.book?.name || "Unknown Book"}
                            width="80"
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td>{item.book?.name || "Unknown Book"}</td>
                      <td>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() =>
                            handleQuantityChange(
                              item.book._id,
                              -1,
                              item.book.availableCopies
                            )
                          }
                          disabled={item.quantity === 1}
                        >
                          -
                        </Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() =>
                            handleQuantityChange(
                              item.book._id,
                              1,
                              item.book.availableCopies
                            )
                          }
                          disabled={item.quantity >= item.book.availableCopies}
                        >
                          +
                        </Button>
                      </td>
                      <td>₹{item.book?.price || 0}</td>
                      {/* <td>{item.book?.quality || "N/A"}</td> */}
                      <td>₹{(item.book?.price || 0) * item.quantity}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </Table>

          <div className="text-end">
            <h4>Total: ₹{calculateTotal()}</h4>
            {cartItems.length > 0 && (
              <Button
                variant="success"
                className="mt-3"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

Cart.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  setCartLength: PropTypes.func.isRequired,
};
