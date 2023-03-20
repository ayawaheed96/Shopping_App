/* eslint-disable @next/next/no-img-element */
import { getError } from "@/utilities/errors";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer, useState } from "react";
import Layout from "@/components/Layout";
function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQ": {
      return {
        ...state,
        loading: true,
        error: "",
      };
    }
    case "FETCH_SUCCESS": {
      console.log("order in State", action.payload);
      return {
        ...state,
        loading: false,
        error: "",
        order: { ...action.payload },
      };
    }
    case "FETCH_FAIL": {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}

const OrderDetails = () => {
  const router = useRouter();
  const { query } = router;
  const orderId = query.id;
  const initial_state = {
    loading: false,
    order: {},
    error: "",
  };
  const [{ loading, error, order }, dispatch] = useReducer(
    reducer,
    initial_state
  );
  const [loadingOrder, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQ" });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        setLoading(false);
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (!order?._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order, orderId]);
  console.log("after Effect", order);
  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    isDelivered,
  } = order;
  return (
    <Layout title="Order Details">
      <h1 className="mb-4 text-xl">Order Details</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : loadingOrder ? (
        <div>Loading...</div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="autoflex-x-auto md:col-span-3">
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Shipping Address</h2>
              <div>
                {shippingAddress.fullName} ,{shippingAddress.address},{" "}
                {shippingAddress.city},{shippingAddress.postalCode},{" "}
                {shippingAddress.country}
              </div>
              {isDelivered ? (
                <div className="alert-sucess">Delivered at ...</div>
              ) : (
                <div className="alert-error">Not delivered</div>
              )}
            </div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Shipping Address</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className="alert-sucess">Paid at ...</div>
              ) : (
                <div className="alert-error">Not paid</div>
              )}
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
                  {orderItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Link href={`/products/${item.id}`} className="link">
                          <div className="flex items-center">
                            <img
                              src={`https://${item.image}`}
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
                      <td className="p-5 text-right">${item.price}</td>
                      <td className="p-5 text-right">
                        ${item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  <button className="primary-button w-full text-white">
                    PayPal
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
OrderDetails.auth = true;
export default OrderDetails;
