'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const [loadingCartProducts, setLoadingCartProducts] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch user profile
  const fetchUserProfile = async (email) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/users/profile?email=${encodeURIComponent(email)}`
      );
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        await fetchUserProfile(parsedUser.email);
      }
    };
    loadUser();
  }, []);

  // Load cartItems from localStorage and clean invalid entries
  useEffect(() => {
  const storedCart = localStorage.getItem('cartItems');
  if (storedCart) {
    try {
      const parsed = JSON.parse(storedCart);
      // Only keep items with a valid productId (non-empty string)
      const validCart = Array.isArray(parsed)
        ? parsed.filter(
            (item) =>
              item &&
              typeof item.productId === 'string' &&
              item.productId.trim() !== '' &&
              item.productId !== 'undefined' &&
              item.productId !== 'null'
          )
        : [];
      setCartItems(validCart);
    } catch (error) {
      console.error('Failed to parse cartItems from localStorage:', error);
      setCartItems([]);
    }
  }
}, []);


  // Save cartItems to localStorage on change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch cart products from backend by product IDs
  const fetchCartProducts = async () => {
  try {
    const validIds = cartItems
      .map((item) => item.productId)
      .filter((id) => id && id !== 'undefined' && id !== 'null' && id.trim() !== '');

    if (validIds.length === 0) {
      console.error('No valid product IDs found in cartItems');
      setCartProducts([]);
      return;
    }

    const ids = validIds.join(',');

    setLoadingCartProducts(true);
    const response = await fetch(`http://localhost:3001/products/by-ids?ids=${ids}`);

    if (!response.ok) {
      const errData = await response.json();
      console.error('Error response fetching cart products:', errData);
      setCartProducts([]);
      return;
    }

    const data = await response.json();

    if (Array.isArray(data.products)) {
      setCartProducts(data.products);
    } else {
      console.error('Invalid response format:', data);
      setCartProducts([]);
    }
  } catch (error) {
    console.error('Error fetching cart products:', error);
    setCartProducts([]);
  } finally {
    setLoadingCartProducts(false);
  }
};


  useEffect(() => {
    if (cartItems.length > 0) {
      fetchCartProducts();
    } else {
      setCartProducts([]);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
  if (!product || !product._id || product._id === 'undefined' || product._id === 'null') {
    toast.error('Invalid product data');
    return;
  }

  const exists = cartItems.some(
    (item) => String(item.productId) === String(product._id)
  );

  if (exists) {
    toast.error(`${product.name} is already in the cart!`);
    return;
  }

  setCartItems((prevItems) => [
    ...prevItems,
    { productId: String(product._id), quantity },
  ]);
  toast.success(`${product.name} added to cart!`);
};


  const updateCartQuantity = (productId, quantity) => {
    if (!productId) return;
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          String(item.productId) === String(productId) ? { ...item, quantity } : item
        )
        .filter((item) => item.quantity > 0) // Remove items with 0 quantity
    );
  };

  const removeFromCart = (productId) => {
    if (!productId) return;
    setCartItems((prevItems) =>
      prevItems.filter((item) => String(item.productId) !== String(productId))
    );
    toast.success('Product removed from cart!');
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared!');
  };

  const getCartAmount = () => {
    return cartItems.reduce((total, item) => {
      const product = cartProducts.find(
        (p) => String(p._id) === String(item.productId)
      );
      return product ? total + product.price * item.quantity : total;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        cartItems,
        cartProducts,
        loadingCartProducts,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        getCartAmount,
        getCartCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
