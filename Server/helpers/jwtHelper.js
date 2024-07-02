const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();

exports.generateToken=(res,user,userRole)=>{
    const payload={user:{id:user.id}};
    console.log("payload:",payload)
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
    console.log("accessToken:",accessToken)
    const cookieName = userRole === 'deliveryPartner' ? 'deliveryPartnerAccessToken' : 'userAccessToken';
    
    
    res.cookie(cookieName,accessToken,{
        secure:process.env.NODE_ENV !=='development',
        sameSite:'strict',
        maxAge: 5 * 60 * 60* 1000  //1 hour
    });

   
    // console.log("response:",res);

};


