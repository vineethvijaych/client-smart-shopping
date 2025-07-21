import React, { createContext, useContext, useState, useCallback } from "react";
import api from "../api/axios";
import { useNotification } from "./NotificationContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [currentCart, setCurrentCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const { addNotification } = useNotification();

  // const linkToCart = useCallback(
  //   async (cartId) => {
  //     try {
  //       const response = await api.post(`/carts/${cartId}/link`);
  //       setCurrentCart({ id: cartId });
  //       setCartItems([]);
  //       addNotification("Successfully linked to cart!", "success");
  //       return response.data;
  //     } catch (error) {
  //       const errorMessage =
  //         error.response?.data?.message || `Failed to link cart ${cartId}`;
  //       addNotification(errorMessage, "error");
  //       throw new Error(errorMessage);
  //     }
  //   },
  //   [addNotification]
  // );

  // CartContext.jsx
  const linkToCart = useCallback(
    async (cartId) => {
      try {
        const response = await api.post(`/carts/${cartId}/link`);
        setCurrentCart({ id: cartId });
        setCartItems([]);
        addNotification("Successfully linked to cart!", "success");
        return response.data;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || `Failed to link to cart ${cartId}`;

        if (error.response?.status === 404) {
          addNotification(
            `Cart "${cartId}" not found. Please check the cart ID.`,
            "error"
          );
        } else if (error.response?.status === 400) {
          addNotification(
            `Cart "${cartId}" is not available for use.`,
            "error"
          );
        } else {
          addNotification(errorMessage, "error");
        }

        throw new Error(errorMessage);
      }
    },
    [addNotification]
  );

  const addToCart = useCallback(
    (product, quantity = 1) => {
      setCartItems((prev) => {
        const existingItem = prev.find(
          (item) => item.productId === (product._id || product.id)
        );

        if (existingItem) {
          return prev.map((item) =>
            item.productId === (product._id || product.id)
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        return [
          ...prev,
          {
            productId: product._id || product.id,
            name: product.name,
            price: product.price,
            emoji: product.emoji,
            quantity,
          },
        ];
      });

      addNotification(`Added ${product.name} to cart`, "success");
    },
    [addNotification]
  );

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId, quantity) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }

      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    setCurrentCart(null);
  }, []);

  const checkout = useCallback(async () => {
    if (!currentCart || !currentCart.id) {
      throw new Error("No cart linked. Please link a cart first.");
    }

    if (cartItems.length === 0) {
      throw new Error("No items in cart");
    }

    // Validate all cart items have required fields
    const invalidItems = cartItems.filter(
      (item) => !item.productId || !item.quantity || !item.price
    );

    if (invalidItems.length > 0) {
      throw new Error(
        "Some cart items are invalid. Please refresh and try again."
      );
    }

    const orderData = {
      cartId: currentCart.id,
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: parseInt(item.quantity) || 1,
      })),
    };

    console.log("Checkout request:", orderData); // Debug logging

    const response = await api.post("/orders/checkout", orderData);

    // Clear cart after successful checkout
    clearCart();

    return response.data.order || response.data;
  }, [currentCart, cartItems, clearCart]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const value = React.useMemo(
    () => ({
      currentCart,
      cartItems,
      linkToCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      checkout,
      getTotalPrice,
      getTotalItems,
    }),
    [
      currentCart,
      cartItems,
      linkToCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      checkout,
      getTotalPrice,
      getTotalItems,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
