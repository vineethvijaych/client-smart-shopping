import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useNotification } from "../contexts/NotificationContext";
import QRCodeDisplay from "../components/QRCodeDisplay";

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const checkoutAttempted = useRef(false);
  const mounted = useRef(true);

  const { cartItems, getTotalPrice, checkout, currentCart } = useCart();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const totalPrice = getTotalPrice();
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + tax;

  const handleCheckout = useCallback(async () => {
    // Prevent multiple attempts
    if (checkoutAttempted.current || loading || !mounted.current) {
      console.log("Checkout blocked:", {
        attempted: checkoutAttempted.current,
        loading,
        mounted: mounted.current,
      });
      return;
    }

    // Validate prerequisites
    if (!currentCart?.id) {
      addNotification("No cart linked. Please link a cart first.", "error");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      addNotification("Your cart is empty", "error");
      return;
    }

    checkoutAttempted.current = true;
    setLoading(true);

    try {
      console.log("Starting checkout with cart:", currentCart.id);
      const orderData = await checkout();

      if (mounted.current) {
        setOrder(orderData);
        addNotification("Order placed successfully!", "success");
      }
    } catch (error) {
      console.error("Checkout error details:", error);

      if (mounted.current) {
        checkoutAttempted.current = false; // Allow retry

        let errorMessage = "Checkout failed. Please try again.";

        if (error.response?.status === 400) {
          const serverMessage = error.response.data?.message;
          if (serverMessage?.includes("Cart ID")) {
            errorMessage =
              "Invalid cart. Please link a new cart and try again.";
          } else if (serverMessage?.includes("ObjectId")) {
            errorMessage =
              "Cart reference error. Please refresh and link your cart again.";
          } else {
            errorMessage = serverMessage || errorMessage;
          }
        }

        addNotification(errorMessage, "error");
      }
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, [currentCart, cartItems, checkout, addNotification, loading]);

  // Redirect if no items
  useEffect(() => {
    if (!loading && !order && (!cartItems || cartItems.length === 0)) {
      const timer = setTimeout(() => {
        if (mounted.current) {
          navigate("/cart", { replace: true });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [cartItems, loading, order, navigate]);

  // Success screen
  if (order) {
    return (
      <div className="min-h-screen pt-20 pb-8 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="card p-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Order Placed!
            </h1>
            <p className="text-gray-600 mb-6">
              Order #{order.orderNumber} created successfully
            </p>

            {order.qrCode && (
              <div className="mb-6">
                <QRCodeDisplay
                  value={order.qrCode.dataURL}
                  size={200}
                  title="Order QR Code"
                />
              </div>
            )}

            <button
              onClick={() => {
                if (mounted.current) {
                  navigate("/", { replace: true });
                }
              }}
              className="w-full btn btn-primary"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Debug Information */}
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg text-sm">
          <p>
            <strong>Cart ID:</strong> {currentCart?.qrId || "Not set"}
          </p>
          <p>
            <strong>MongoDB ID:</strong> {currentCart?.id || "Not set"}
          </p>
          <p>
            <strong>Items:</strong> {cartItems?.length || 0}
          </p>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Review your order</p>
        </div>

        {/* Order Items */}
        <div className="card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between items-center"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{item.emoji}</span>
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-500 text-sm ml-2">
                      ×{item.quantity}
                    </span>
                  </div>
                </div>
                <span className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="card p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-emerald-600">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleCheckout}
            disabled={loading || checkoutAttempted.current || !currentCart?.id}
            className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              `Complete Purchase - $${finalTotal.toFixed(2)}`
            )}
          </button>
          <button
            onClick={() => navigate("/cart")}
            disabled={loading}
            className="w-full btn btn-secondary"
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
