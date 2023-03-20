import Order from "@/Models/Order";
import db from "@/utilities/db";

const handler = async (req, res) => {
  const { orderId } = req.query;
  await db.connect();
  const order = await Order.findById(orderId);
  await db.disconnect();
  res.status(200).json(order);
};
export default handler;
