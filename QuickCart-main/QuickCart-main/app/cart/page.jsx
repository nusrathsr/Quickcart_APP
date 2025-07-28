'use client';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import Link from 'next/link';
import { BsTrashFill } from 'react-icons/bs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const {
    cartItems,
    cartProducts,
    updateCartQuantity,
    getCartAmount,
    loadingCartProducts,
  } = useAppContext();
  const router = useRouter();

  // Debug logs (optional, can remove)
  useEffect(() => {
    console.log('Cart Items:', cartItems);
    console.log('Cart Products:', cartProducts);
  }, [cartItems, cartProducts]);

  if (loadingCartProducts) {
    return (
      <div className="p-8 text-center text-gray-600">
        <h2 className="text-2xl mb-4">Loading cart products...</h2>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="p-8 text-center text-gray-600">
        <h2 className="text-2xl mb-4">Your cart is empty 🛒</h2>
        <Link href="/all-products" className="text-orange-500 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 lg:px-32 pt-10 pb-20 space-y-8">
      <h1 className="text-3xl font-semibold">Shopping Cart</h1>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-2 border border-gray-300 text-left">Product</th>
            <th className="py-3 px-2 border border-gray-300">Quantity</th>
            <th className="py-3 px-2 border border-gray-300">Price</th>
            <th className="py-3 px-2 border border-gray-300">Total</th>
            <th className="py-3 px-2 border border-gray-300">Remove</th>
          </tr>
        </thead>

        <tbody>
          {cartProducts.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No products found in cart.
              </td>
            </tr>
          )}

          {cartProducts.map((product) => {
            const cartItem = cartItems.find(
              (item) => String(item.productId) === String(product._id)
            );
            const quantity = cartItem ? cartItem.quantity : 0;
            if (quantity <= 0) return null;

            return (
              <tr key={product._id} className="text-center">
                <td className="py-4 px-2 border border-gray-300 flex items-center gap-4 justify-start">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="object-cover rounded"
                  />
                  <span className="text-left">{product.name}</span>
                </td>

                <td className="py-4 px-2 border border-gray-300">
                  <div className="inline-flex items-center border border-gray-300 rounded overflow-hidden">
                    <button
                      onClick={() =>
                        updateCartQuantity(product._id, quantity - 1)
                      }
                      disabled={quantity <= 1}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      min="1"
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val > 0)
                          updateCartQuantity(product._id, val);
                      }}
                      className="w-12 text-center border-l border-r border-gray-300"
                    />
                    <button
                      onClick={() =>
                        updateCartQuantity(product._id, quantity + 1)
                      }
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </td>

                <td className="py-4 px-2 border border-gray-300">
                  ₹{product.price.toLocaleString()}
                </td>

                <td className="py-4 px-2 border border-gray-300">
                  ₹{(product.price * quantity).toFixed(2)}
                </td>

                <td className="py-4 px-2 border border-gray-300">
                  <button
                    onClick={() => updateCartQuantity(product._id, 0)}
                    className="text-red-600 hover:text-red-800"
                    aria-label={`Remove ${product.name} from cart`}
                  >
                    <BsTrashFill size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-10">
        <Link
          href="/all-products"
          className="text-orange-500 hover:underline font-semibold"
        >
          ← Continue Shopping
        </Link>

        <h2 className="text-xl font-semibold">
          Total: ₹{getCartAmount().toFixed(2)}
        </h2>
      </div>

      {/* Proceed to Checkout Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => router.push('/checkout')}
          disabled={cartItems.length === 0}
          className={`px-4 py-2 text-sm font-semibold rounded ${
            cartItems.length === 0
              ? 'bg-gray-300 cursor-not-allowed text-gray-600'
              : 'bg-green-500 hover:bg-green-600 text-white'
          } transition`}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
