import { NextFunction, Request, Response } from "express";
import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
   //structure of errors in app{
    //   errors:{message:string,field?:string}[]
    // }
  if (err instanceof RequestValidationError) {
   
    const formatedErrors = err.errors.map((e) => {
      return {
        message: e.msg,
        field: e.param,
      };
    });
    return res.status(400).send({ errors: formatedErrors });
  }
  if (err instanceof DatabaseConnectionError) {
    return res.status(500).send({ errors: [{ message: err.reason }] });
  }
  res.status(400).send({ errors: [{ message: err.message }] });
};
