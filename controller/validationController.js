const userModel = require ('../model/validationModel')
const{myValidate}=require('../helpers/validation')
const bcrypt = require ('bcrypt')
const sendEmail = require('../helpers/email.js')
const dotenv = require ('dotenv').config()
const jwt=require("jsonwebtoken")
const generateDynamicEmail =require('../index.js')

exports.createUser = async(req,res)=>{
    try{
const data = {
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    email: req.body.email.toLowerCase(),
    phoneNumber:req.body.phoneNumber,
    password: req.body.password
} 
await myValidate.validateAsync(data,(err,data)=>{
    if(err){
        res.json(err.message)
    }else{
        res.json(data)
    }
})



    const saltedPassWord=bcrypt.genSaltSync(10)
    
    const hashPassWord=bcrypt.hashSync(data.password,saltedPassWord)
    const user = await new userModel(data)
    const {lastName,firstName,email}=user
    const userToken= await jwt.sign({lastName,firstName,email},process.env.jwtSecret,{expiresIn:"300s"})
    user.password=hashPassWord
    user.token =userToken
    await user.save()
    const subject = 'kindly verify your acct'
    const link = `${req.protocol}://${req.get('host')}/updateuser/${user._id}/${user.token}`
    // const text = `Hello ${user.firstName.toUpperCase()}.${user.lastName.slice(0,1).toUpperCase()} welcome onboard. Kindly use the below link ${link} to verify your account`
    const html = generateDynamicEmail(link, user.firstName.toUpperCase(),user.lastName.toUpperCase().slice(0,1))
     
    sendEmail({
        email:user.email,
        subject,
        html
    })
res.status(201).json({
    message:`user with email ${user.email} has  been successfully created`,
    data:user
})

    }catch(err){
        res.status(500).json({
            message: 'unable to create',
            error: err.message
        })
    }
}



exports.login = async(req,res)=>{
    try {
       const {email, password} = req.body
    //    check if the user existing in the database
       const userExist = await userModel.findOne({email: email.toLowerCase()})
       if(!userExist){
         return res.status(404).json({
            message:`user does not exist`
        })
       }
    //    check password
       const checkPassword = bcrypt.compareSync(password, userExist.password)
       if(checkPassword===false){
        return res.status(400).json({
            message:`Invalid password`
        })
       }

    //    check if the user is verified


    //    generate a token foe the user
    const token = jwt.sign({
         userId : userExist._id,
        userEmail :userExist.email
    },
    process.env.jwtSecret,
    {expiresIn:'1d'});
     userExist.token = token;
    
    const user = await userExist.save();

        res.status(200).json({
            message:`Login successfully`,
            token
        })
       
    
    }catch (err) {
        res.status(500).json({
           message: `unable to login`,
           error: `err.message`
        })
    }
}


exports.verify = async(req,res)=>{
    try{
const id = req.params.id
const userToken = req.params.userToken

jwt.verify(userToken,process.env.jwtsecret)

const verify = await userModel.findByIdAndUpdate(id,{isVerify:true},{new:true})


res.status(200).json({
    message:`user with email:${updatedUser.email} is updated successfully`,
    data:updatedUser
})
}catch(err){
res.status(500).json({
    error: err.message
})
}

}
exports.home = (req ,res)=>{
res.json("welcome api")
}
    
exports.getOne = async(req,res)=>{
    try{
        const id = req.params.id
    const oneUser = await userModel.find(id)

    res.status(200).json({
        messsage: `user with email ${email} has been found`

    })
}catch(err){
res.status(404).json(err.message)
}
}

exports.getAll = async(req,res)=>{
    try{
    const user = await userModel.find()
    const allUser = user.lenonstgth 
    if(allUser===0){

    res.status(200).json({
        messsage: `There are ${allUser}users in the Database`,
        allUser

    })
}
}catch(err){
res.status(404).json(err.message)
}
}

exports.updateuser = async (req,res)=>{
    try{
const id = req.params.id
const data ={
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    email: req.body.email,
    phoneNumber:req.body.phoneNumber,
}
const user = await userModel.findByIdAndUpdate(id,data,{new:true})
if(!user){
    return res.status(404).json({
        message:`user does not exist`
    })
}
else{
    res.status(200).json({
        message:`updated successfully`
})
    }
}catch(err){
res.status(500).json({
    message: err.message
})
    }
}


exports.signOut =async(req,res)=>{
    try{
const id = req.params.id
const user = await userModel.findById(id)

user.token = null

res.status(200).json({
    message: `signed out successfully `
})
    }catch(err){
res.status(500).json(err.message)
    
}
}