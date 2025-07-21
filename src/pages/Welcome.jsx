import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Welcome() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 pt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Smart Shopping Made
            <span className="text-emerald-600"> Simple</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Shop smarter, faster, and skip the checkout line! Link your cart to
            start adding items as you shop.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Link Your Cart</h3>
              <p className="text-gray-600">
                Scan the QR code on your shopping cart to get started
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Scan Products</h3>
              <p className="text-gray-600">
                Use your phone to scan product QR codes as you shop
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Checkout</h3>
              <p className="text-gray-600">
                Complete your purchase with a single QR code scan
              </p>
            </div>
          </div>

          <div className="text-center">
            {user ? (
              <div className="space-y-4">
                <p className="text-lg text-gray-700">
                  Welcome back, {user.name}!
                </p>
                <div className="space-x-4">
                  <Link to="/cart-linking" className="btn btn-primary">
                    Link Cart
                  </Link>
                  <Link to="/scan" className="btn btn-secondary">
                    Scan Products
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Demo Product Cards */}
        <div className="max-w-2xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Sample Products
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card p-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🥛</span>
                <div className="flex-1">
                  <h3 className="font-semibold">Organic Milk</h3>
                  <p className="text-sm text-gray-500">1 gallon</p>
                </div>
                <p className="text-lg font-bold text-emerald-600">$3.99</p>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🍞</span>
                <div className="flex-1">
                  <h3 className="font-semibold">Whole Wheat Bread</h3>
                  <p className="text-sm text-gray-500">Whole wheat</p>
                </div>
                <p className="text-lg font-bold text-emerald-600">$2.49</p>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🥬</span>
                <div className="flex-1">
                  <h3 className="font-semibold">Fresh Lettuce</h3>
                  <p className="text-sm text-gray-500">Bunch</p>
                </div>
                <p className="text-lg font-bold text-emerald-600">$1.99</p>
              </div>
            </div>
            <div className="card p-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🍌</span>
                <div className="flex-1">
                  <h3 className="font-semibold">Organic Bananas</h3>
                  <p className="text-sm text-gray-500">Organic</p>
                </div>
                <p className="text-lg font-bold text-emerald-600">$0.99</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
