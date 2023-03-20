/* eslint-disable @next/next/no-img-element */
import CheckoutWizard from "@/components/CheckoutWizard";
import { getError } from "@/utilities/errors";
import { Store } from "@/utilities/store";
// import axios from "axios";
import Cookies from "js-cookie";
//import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getSession } from "next-auth/react";
import axios from "axios";
import Layout from "@/components/Layout";
const PlaceOrder = () => {
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useContext(Store);
  const session = getSession();
  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;
  const router = useRouter();
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = cartItems.reduce(
    (a, c) => a + c.quantity * c.price.current.value,
    0
  );
  const taxPrice = round2(itemsPrice * 0.15);
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;
  const orderItems = cartItems.map((item) => {
    return {
      name: item.name,
      quantity: item.quantity,
      image: item.media.images[0].url,
      price: item.price.current.value,
    };
  });
  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/orders", {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });
      console.log(data);
      setLoading(false);
      dispatch({ type: "Clear_Cart_Items" });
      Cookies.set("cart", JSON.stringify({ ...cart, cartItems: [] }));
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };
  useEffect(() => {
    if (session) {
      console.log("Session is ", session);
    }
    if (!paymentMethod) {
      router.push("/payment");
    }
  }, [paymentMethod, router, session]);
  return (
    <Layout title='Place order'>
      <CheckoutWizard activeStep={3}></CheckoutWizard>
      <h1 className="mb-4 text-xl">Place Order</h1>
      {cartItems.length === 0 ? (
        <div>
          The cart is empty &nbsp;{" "}
          <span className="primary-button">
            <Link href="/">Go To Shopping</Link>
          </span>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3 ">
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Shipping Address</h2>
              <div>
                {shippingAddress.fullName} ,{shippingAddress.address},{" "}
                {shippingAddress.city},{shippingAddress.postalCode},{" "}
                {shippingAddress.country}
              </div>
              <div>
                <Link href="/shipping" className="link">
                  Edit
                </Link>
              </div>
            </div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Payment Method</h2>
              <div>{paymentMethod}</div>
              <div>
                <Link href="/payment" className="link">
                  Edit
                </Link>
              </div>
            </div>
            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">Order Items</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Item</th>
                    <th className="p-5 text-right">Quantity</th>
                    <th className="p-5 text-right">price</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Link href={`/products/${item.id}`} className="link">
                          <div className="flex items-center">
                            <img
                              src={`https://${item.media.images[0].url}`}
                              alt={item.name}
                              className="rounded shadow "
                              width={50}
                              height={50}
                            />{" "}
                            &nbsp;{`${item.name}`.slice(0, 10)}
                          </div>
                        </Link>
                      </td>
                      <td className="p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">
                        ${item.price.current.value}
                      </td>
                      <td className="p-5 text-right">
                        ${item.quantity * item.price.current.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <Link href="/cart" className="link">
                  Edit
                </Link>
              </div>
            </div>
          </div>
          <div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>${taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>${shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>${totalPrice}</div>
                  </div>
                </li>
                <li>
                  <button
                    className="primary-button w-full"
                    disabled={loading}
                    onClick={placeOrderHandler}
                  >
                    {loading ? "Loading..." : "Place Order"}
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
export default PlaceOrder;
PlaceOrder.auth = true;
