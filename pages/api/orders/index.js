import Order from "@/Models/Order";
import db from "@/utilities/db";
//import { getSession } from "next-auth/client";

const handler = async (req, res) => {
  // const session = await getSession({req});
  // if(!session){
  //   console.log("No session");
  //   return res.status(401).json({message:'signin required'})
  // }
  // const {user}=session;
  // console.log("user", user);
  await db.connect();
  const newOrder = new Order({ ...req.body });
  const order = await newOrder.save();
  res.status(201).json(order);
};
export default handler;
