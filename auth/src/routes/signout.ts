import express from 'express'
const router=express.Router();



router.post('/api/users/signout',(req,res)=>{
res.send('Hi from signout! To see response in chrome , click on browser and type thisisunsafe')
})

export {router as signoutRouter}