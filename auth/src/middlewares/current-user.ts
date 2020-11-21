import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}
//Augment type definition of Request from Express types make it global
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //other middleware reject so we return next
  if (!req.session?.jwt) {
    return next();
  }
  //if there is token
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.jwt!
    ) as UserPayload;
    //in plain js in TS must augment type definition of Request
    req.currentUser=payload
    // in TS
  } catch (error) {}
  next();
};
