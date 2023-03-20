/* eslint-disable @next/next/no-img-element */
import { Store } from "@/utilities/store";
import Link from "next/link";
import { useContext } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
const Cart = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  console.log(cart);
  const removeItem = (item) => {
    dispatch({ type: "REMOVE_ITEM_FROM_CART", payload: item });
  };
  const handleUpdatedQuantity = (item, qty) => {
    const quantity = Number(qty);
    dispatch({ type: "Add_To_Cart", payload: { ...item, quantity } });
  };
  return (
    <Layout title='Cart'>
      <h1 className="mb-4 text-xl">Shopping Cart</h1>
      {cart.cartItems.length == 0 ? (
        <div>
          The cart is empty &nbsp; <span className="primary-button"><Link href="/">Go To Shopping</Link></span>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-5 text-left">Item</th>
                  <th className="p-5 text-right">Quantity</th>
                  <th className="p-5 text-right">Price</th>
                  <th className="p-5 ">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.cartItems.map((item) => {
                  return (
                    <tr key={item.id} className="border-b">
                      <td>
                        <Link href={`/products/${item.id}`}>
                          <div className="flex items-center">
                            <img
                              src={ (item.media) ? `https://${item.media.images[0].url}` : `https://${item.imageUrl}`}
                              alt={item.name}
                              className="rounded shadow"
                              width={50}
                              height={50}
                            />
                            &nbsp;
                            {`${item.name}`.slice(0, 15)}
                          </div>
                        </Link>
                      </td>
                      <td className="p-5 text-right">
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdatedQuantity(item, e.target.value)
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((count) => (
                            <option key={count + 1} value={count + 1}>
                              {count + 1}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-5 text-right">
                        {item.price.current.text}
                      </td>
                      <td className="p-5 text-center">
                        <button onClick={() => removeItem(item)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-5">
          <div className="card p-5">
            <ul>
              <li>
                <div className="pb-5 text-xl">
                  Subtotal ({cart.cartItems.reduce((a, c) => a + c.quantity, 0)}) :$
                  {cart.cartItems.reduce(
                    (a, c) => a + c.quantity * c.price.current.value,
                    0
                  )}
                </div>
              </li>
              <li>
                <button
                  className="primary-button w-full"
                  onClick={() => router.push("login?redirect=/shipping")}
                >
                  Check Out
                </button>
              </li>
            </ul>
          </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
export default dynamic(()=>Promise.resolve(Cart),{ssr:false});
