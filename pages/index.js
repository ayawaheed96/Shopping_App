import ProductItem from "@/components/ProductItem";
import Layout from "@/components/Layout";

export default function Home({ products }) {
  return (
    <Layout title='Home'>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => {
          return <ProductItem product={product} key={product.id}></ProductItem>;
        })}
      </div>
    </Layout>
  );
}
export async function getStaticProps() {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "dd36e1be99msh4f940218e595cbbp1d2765jsn638ebf03a7e5",
      "X-RapidAPI-Host": "asos2.p.rapidapi.com",
    },
  };
  const response = await fetch(
    "https://asos2.p.rapidapi.com/products/v2/list?store=US&offset=0&categoryId=4209&limit=48&country=US&sort=freshness&currency=USD&sizeSchema=US&lang=en-US",
    options
  );
  const data = await response.json();
  //console.log(data.products)
  return {
    props: {
      products: data.products,
    },
  };
}
