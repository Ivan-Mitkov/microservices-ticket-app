import express from 'express'
const router=express.Router();



router.post('/api/users/signup',(req,res)=>{
res.send('Hi from signup! To see response in chrome , click on browser and type thisisunsafe')
})

export {router as signupRouter}