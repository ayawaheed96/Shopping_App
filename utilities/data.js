import bcrypt from 'bcryptjs';
const data={
    users:[
        {
            name:'aya',
            email:'admin@gmail.com',
            password:bcrypt.hashSync('123456'),
            isAdmin:true
        },
        {
            name:'John',
            email:'user@gmail.com',
            password:bcrypt.hashSync('123456'),
            isAdmin:false
        }
    ],

}
export default data;