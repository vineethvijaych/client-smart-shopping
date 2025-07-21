import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useNotification } from "../contexts/NotificationContext";
import QRScanner from "../components/QRScanner";

export default function CartLinking() {
  const [cartId, setCartId] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false); // ← declared here
  const callInFlight = useRef(false); // prevents double-submits

  const { linkToCart } = useCart();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  /* ────────────────────────────── helpers ────────────────────────────── */

  const linkCart = async (id) => {
    if (callInFlight.current) return; // ignore second tap
    callInFlight.current = true;
    setLoading(true);

    try {
      await linkToCart(id.trim());
      navigate("/scan", { replace: true });
    } catch (err) {
      addNotification(err.message, "error");
    } finally {
      callInFlight.current = false;
      setLoading(false);
    }
  };

  /* ────────────────────────────── handlers ───────────────────────────── */

  const handleManualLink = (e) => {
    e.preventDefault();
    if (!cartId.trim()) {
      addNotification("Please enter a cart ID", "error");
      return;
    }
    linkCart(cartId);
  };

  const handleQRScan = (qrData) => {
    setShowScanner(false);

    if (qrData?.type === "cart" && qrData.id) {
      linkCart(qrData.id);
    } else {
      addNotification("Invalid cart QR code", "error");
    }
  };

  /* ────────────────────────────── UI ────────────────────────────── */

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Link Your Cart
          </h1>
          <p className="text-gray-600">
            Scan the QR code on your shopping cart or enter the cart&nbsp;ID
            manually
          </p>
        </div>

        {/* QR scanner option */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {/* QR Icon */}
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
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01
                             M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0
                             00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0
                             00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Scan&nbsp;QR&nbsp;Code
              </h3>
              <p className="text-gray-600 mb-4">
                Use your camera to scan the cart&nbsp;QR
              </p>
              <button
                onClick={() => setShowScanner(true)}
                className="btn btn-primary w-full"
              >
                Open Scanner
              </button>
            </div>
          </div>

          {/* Manual entry option */}
          <div className="card p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {/* Pencil Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0
                           002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0
                           112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Manual&nbsp;Entry</h3>
              <p className="text-gray-600 mb-4">
                Enter the cart&nbsp;ID on the handle
              </p>
            </div>

            <form onSubmit={handleManualLink} className="space-y-4">
              <input
                type="text"
                value={cartId}
                onChange={(e) => setCartId(e.target.value)}
                className="input"
                placeholder="Enter Cart ID (e.g., C001)"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !cartId.trim()}
                className="w-full btn btn-secondary disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-2"></div>
                    Linking…
                  </div>
                ) : (
                  "Link Cart"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Help text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Can’t find it? Ask store staff for assistance.
          </p>
        </div>
      </div>

      {/* QR-scanner overlay */}
      <QRScanner
        isActive={showScanner}
        onScan={handleQRScan}
        onClose={() => setShowScanner(false)}
      />
    </div>
  );
}
