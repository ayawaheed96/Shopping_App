/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
//import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./addToCart";

const ProductItem = ({ product }) => {
  return (
    <>
      <div className="card">
        <Link href={`/products/${product.id}`}>
          <img
            src={`https://${product.imageUrl}`}
            alt={product.name}
            className="rounded shadow"
          />
        </Link>
        <div className="flex flex-col justify-center items-center p-5 ">
          <Link href={`/products/${product.id}`}>
            <h2 className="text-lg">{product.name}</h2>
          </Link>
          <p className="mb-2">{product.brandName}</p>
          <p>{product.price.current.text}</p>
          <AddToCartButton product={{ ...product }} />
        </div>
      </div>
    </>
  );
};
export default ProductItem;
