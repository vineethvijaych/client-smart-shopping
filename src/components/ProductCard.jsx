import React from "react";

export default function ProductCard({ product, onAdd, showAddButton = true }) {
  return (
    <div className="product-card">
      <div className="flex items-center space-x-3 mb-3">
        <span className="text-3xl">{product.emoji}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.category}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-emerald-600">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>

      {product.description && (
        <p className="text-sm text-gray-600 mb-3">{product.description}</p>
      )}

      {showAddButton && (
        <button
          onClick={() => onAdd(product)}
          className="w-full btn btn-primary"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}
