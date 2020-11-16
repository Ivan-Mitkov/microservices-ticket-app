import express from 'express'
const router=express.Router();



router.post('/api/users/signin',(req,res)=>{
res.send('Hi from curent signin! To see response in chrome , click on browser and type thisisunsafe')
})

export {router as signinRouter}