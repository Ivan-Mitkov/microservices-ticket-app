import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  reason = "Page not found";
  statusCode = 404;
  constructor() {
    super("Not found ");
    //only because we are extending a build in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}

//structure of errors in app{
//   errors:{message:string,field?:string}[]
// }
