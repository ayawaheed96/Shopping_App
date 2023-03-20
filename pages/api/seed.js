const { default: User } = require("@/Models/User");
const { default: data } = require("@/utilities/data");
const { default: db } = require("@/utilities/db");


const handler=async(req,res)=>{
    await db.connect();
    await User.deleteMany();
    await User.insertMany(data.users);
    await db.disconnect();
    res.send({ message:'Seeded successfully '})
}
export  default handler;