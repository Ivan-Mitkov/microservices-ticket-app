import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { RequestValidationError } from "../errors/request-validation-error";
import { BadRequestError } from "../errors/bad-request-error";
const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //javascrip solution
      // const error = new Error("Invalid email or password");
      // error.reasons = errors.array();

      throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;
    //check if exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("User already exists");
    }
    //@TODO password hashing

    //create user
    const user = User.build({ email, password });
    await user.save();
    //generate jwt
    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
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
    res.status(201).send(user);
  }
);

export { router as signupRouter };
