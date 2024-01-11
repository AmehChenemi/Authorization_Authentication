const jwt = require("jsonwebtoken");
const userModel = require("../model/validationModel");
require('dotenv').config()


// const authenticate =async (req, res, next)=>{
// try{
//     const token = req.params.token;
//     const decodedToken = jwt.verify(token,process.env.jwtSecret)

//     const user = await userModel.findById(decodedToken.userId)
//     if(!user){
//         res.status(404).json({
//             message:`Authorization Failed: User not find`

//         })
//   if(user.token===null){
//     return res.status(401).json({
//         message:`user not found`
//     })
//   }
// }
// next()
const authenticate =async (req, res, next)=>{
try{
// get the id of the user
const id = req.params.id
// find the user with the id
const user = await userModel.findById(id)
// check if the user is still existing in the DB
if(!user){
    res.status(401).json({
        message:`user does not exist`
    })
}
const token = user.token
if(!token){
    res.json({
        message:`Unauthorized`
    })
}
jwt.verify(token,process.env.jwtSecret,(err,payload=>{
    if(err){
        res.status(400).json({
            message:`Session Expired`

        })
    }else{
        res.json(payload)
        next()
    }
})) 

}catch(err)                                                   {
    res.status(500).json({
        message: err.message
    })
}
}


module.exports = authenticate