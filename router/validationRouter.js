const router = require ('express').Router()

const {home,createUser,verify,getAll,getOne, signOut,login, updateuser, }=require ('../controller/validationController')
const authenticate = require('../middleware/authourization')

router.get('/home',home)
router.post('/createuser',createUser)
router.post('/login',login)
router.put('/signout/:id',signOut)
router.get('/getone',getOne)
router.get('/getall',getAll)
router.put('/verify/:id',verify)
router.put('/updateuser/:id/:token',authenticate,updateuser)




module.exports = router