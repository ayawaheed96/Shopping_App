import { Store } from "@/utilities/store";
import { useContext } from "react";
import { toast } from "react-toastify";

const AddToCartButton = ({ product }) => {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = () => {
    const productData = {
      id: product.id,
      name: product.name,
      price: {
        current: {
          text: product.price.current.text,
          value: product.price.current.value,
        },
      },
      media: {
        images: [{ url: product.imageUrl }],
      },
    };
    const existItem = cart.cartItems.find((item) => item.id === productData.id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const countInStock = existItem
      ? existItem.countInStock - quantity > 0
        ? existItem.countInStock - quantity
        : 0
      : 20;
    if (existItem && existItem.countInStock === 0) {
      toast.error("Sorry! Out of stock");
    } else {
      toast.success("Sucessfully added to cart");
      dispatch({
        type: "Add_To_Cart",
        payload: { ...productData, quantity, countInStock },
      });
      console.log(existItem);
    }
  };
  return (
    <>
      <button
        className="primary-button w-full"
        onClick={() => addToCartHandler()}
      >
        Add to cart
      </button>
    </>
  );
};

export default AddToCartButton;
