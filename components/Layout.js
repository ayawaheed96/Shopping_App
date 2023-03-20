import { Store } from "@/utilities/store";
import { useContext, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ title, children }) {
  const { status, data: session } = useSession();
  const { state } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    {
      setCartItemsCount(
        cart.cartItems.reduce((acc, cur) => acc + cur.quantity, 0)
      );
    }
  }, [cart.cartItems]);

  return (
    <>
      <Head>
        <title>{title ? title + " - Amazoon" : "Amazoon"}</title>
        <meta name="description" content="Ecommerc" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer position="bottom-center" limit={1}></ToastContainer>
      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-12  items-center justify-between shadow-md px-4">
            <Link href="/" className="text-lg font-bold link">
              Amazoon
            </Link>
            <div>
              <Link href="/cart" className="p-4 link">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 inline"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              <Link href="/login" className="link text-lg">
                {status == "loading" ? (
                  "Loading"
                ) : session?.user ? (
                  session.user.name
                ) : (
                  <Link href="/login" className="p-4 link">
                    Login
                  </Link>
                )}
              </Link>
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex h-12 justify-center items-center shadow-inner">
          <p>Copyright &copy; 2023 Amazoon</p>
        </footer>
      </div>
    </>
  );
}
