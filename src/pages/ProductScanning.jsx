import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useNotification } from "../contexts/NotificationContext";
import QRScanner from "../components/QRScanner";
import ProductCard from "../components/ProductCard";

export default function ProductScanning() {
  const [showScanner, setShowScanner] = useState(false);
  const [recentlyScanned, setRecentlyScanned] = useState([]);

  const { currentCart, addToCart } = useCart();
  const { addNotification } = useNotification();

  // FIX: Add proper dependency array and prevent infinite loops
  useEffect(() => {
    if (!currentCart) {
      addNotification("Please link a cart first", "error");
    }
  }, [currentCart]); // Only depend on currentCart, not addNotification

  const handleQRScan = async (qrData) => {
    setShowScanner(false);

    if (qrData.type === "product") {
      addToCart(qrData, 1);

      setRecentlyScanned((prev) => {
        const filtered = prev.filter((item) => item.id !== qrData.id);
        return [qrData, ...filtered].slice(0, 5);
      });
    } else {
      addNotification("Invalid product QR code", "error");
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  if (!currentCart) {
    return (
      <div className="min-h-screen pt-20 pb-8 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="card p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              No Cart Linked
            </h1>
            <p className="text-gray-600 mb-6">
              You need to link a shopping cart before scanning products.
            </p>
            <Link to="/cart-linking" className="btn btn-primary">
              Link Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Scan Products
          </h1>
          <p className="text-gray-600">
            Scan product QR codes to add items to your cart
          </p>
        </div>

        {/* Scanner Button */}
        <div className="card p-6 mb-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Scan Product</h3>
            <p className="text-gray-600 mb-4">
              Point your camera at a product QR code
            </p>
            <button
              onClick={() => setShowScanner(true)}
              className="btn btn-primary w-full"
            >
              Start Scanning
            </button>
          </div>
        </div>

        {/* Recently Scanned Products */}
        {recentlyScanned.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Recently Scanned</h2>
            <div className="space-y-3">
              {recentlyScanned.map((product, index) => (
                <ProductCard
                  key={`${product.id}-${index}`}
                  product={product}
                  onAdd={handleAddToCart}
                  showAddButton={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-3">How to Scan</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <span className="text-emerald-500">1.</span>
              <span>Tap "Start Scanning" to open the camera</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-emerald-500">2.</span>
              <span>Point your camera at the product QR code</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-emerald-500">3.</span>
              <span>Wait for the automatic detection</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-emerald-500">4.</span>
              <span>Product will be added to your cart automatically</span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Scanner Overlay */}
      <QRScanner
        isActive={showScanner}
        onScan={handleQRScan}
        onClose={() => setShowScanner(false)}
      />
    </div>
  );
}
