/* eslint-disable @next/next/no-img-element */
import { Store } from "@/utilities/store";
import { useRouter } from "next/router";
import { useContext } from "react";
import Layout from "@/components/Layout";
const ProductDetails=({product})=>{
    const router=useRouter();
    const {state,dispatch}=useContext(Store);
    const {cart}=state
    console.log(state);
    const addToCartHandler=()=>{
        const existItem=cart.cartItems.find((item)=> item.id === product.id);
        const quantity=existItem ? existItem.quantity + 1 : 1;
        const countInStock= existItem ? (existItem.countInStock - quantity >0 ? existItem.countInStock - quantity : 0) : 20
        dispatch({type:'Add_To_Cart',payload:{...product ,quantity,countInStock}});
        router.push('/cart');
    }
    if(router.isFallback){
        return <h2>Loading</h2>
    }else{
    return(
        <Layout title='Product Details'>
           <div className="grid md:grid-cols-4 md:gap-3">
                <div className="md:col-span-2">
                    <img
                src={`https://${product.media.images[0].url}`}
                alt={product.name}
                className="rounded shadow"
                width={400}
                />
                </div>
                <div>
                    <ul>
                        <li><h2 className="text-lg">{product.name}</h2></li>
                        <li>Brand: {product.brand.name}</li>
                        <li>Type: {product.productType.name}</li>
                        <li>Gender: {product.gender}</li>
                        <li>Rating: {product.rating?product.rating.averageOverallRating:0} of {product.rating?product.rating.totalReviewCount:0} reviews</li>

                    </ul>
                </div>
                <div>
                    <div className="card p-5">
                        <div className="mb-2 flex justify-between">
                            <div>Price</div>
                            <div>{product.price.current.text}</div>
                        </div>
                        <div className="mb-2 flex justify-between">
                            <div>Status</div>
                            <div>{product.isInStock?'In stock':'Unavaliable'}</div>
                        </div>
                        <div>
                        <button className="primary-button w-full" onClick={()=>addToCartHandler()}>
                           Add to cart 
                        </button>
                        </div>
                    </div>

                </div>
           </div>
      
        </Layout>
    )}

}
export default ProductDetails;
export async function getStaticProps(context){
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'dd36e1be99msh4f940218e595cbbp1d2765jsn638ebf03a7e5',
            'X-RapidAPI-Host': 'asos2.p.rapidapi.com'
        }
    };
    const {params}=context;
    const response=await fetch(`https://asos2.p.rapidapi.com/products/v3/detail?id=${params.productId}&lang=en-US&store=US&sizeSchema=US&currency=USD`,  options);
    const data=await response.json();
    //console.log(data);
    return{
        props:{product:data}
    }
}
export async function getStaticPaths(){
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': "dd36e1be99msh4f940218e595cbbp1d2765jsn638ebf03a7e5",
            'X-RapidAPI-Host': 'asos2.p.rapidapi.com'
        }
    };
    const response =await fetch("https://asos2.p.rapidapi.com/products/v2/list?store=US&offset=0&categoryId=4209&limit=48&country=US&sort=freshness&currency=USD&sizeSchema=US&lang=en-US", options);
    const data=await response.json();
    const {products}=data;
    const productsList=products.slice(0,3);
    const paths=productsList.map(product =>{
        return {
            params:{productId:`${product.id}`}
        }
    });
    return{
        paths,
        fallback:true
    }
}