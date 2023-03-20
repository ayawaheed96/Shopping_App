import User from "@/Models/User";
import db from "@/utilities/db";
import bcryptjs from "bcryptjs";
const handler = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }
  const { name, email, password } = req.body;
  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 5
  ) {
    res.status(422).json({ message: "Validation error" });
  }

  await db.connect();
  const existUser = await User.findOne({ email: email });
  if (existUser) {
    res.status(422).json({ message: "User already exists" });
    await db.disconnect();
    return;
  }
  const newUser = new User({
    name,
    email,
    password: bcryptjs.hashSync(password),
    isAdmin: false,
  });
  const user = await newUser.save();
  await db.disconnect();
  res
    .status(201)
    .send({
      message: "Created user successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
};
export default handler;
