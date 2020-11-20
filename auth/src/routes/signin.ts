import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { BadRequestError } from "../errors/bad-request-error";
import { validateRequest } from "../middlewares/validate-request";
import { Password } from "../services/password";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    //check if exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }
    //check password
    const isPasswordMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!isPasswordMatch) {
      throw new BadRequestError("Invalid credentials");
    }
    //generate jwt
    const userJwt = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      //chek in index.ts
      process.env.jwt!
    );
    //store on session object
    //jwt is possibly null so redefine the object <TS>
    // req.session.jwt=userJwt
    req.session = {
      jwt: userJwt,
    };
    //send back user document
    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
