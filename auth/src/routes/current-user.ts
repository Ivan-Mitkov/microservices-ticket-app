import express from 'express'
const router=express.Router();



router.get('/api/users/currentuser',(req,res)=>{
res.send('Hi from curent user! To see response in chrome , click on browser and type thisisunsafe')
})

export {router as currentUserRouter}