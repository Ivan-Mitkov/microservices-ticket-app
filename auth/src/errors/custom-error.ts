export abstract class CustomError extends Error {
  abstract statusCode: number;
  constructor(message: string) {
    super(message);
    //only because we are extending a build in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }
  //structure of errors in app{
  //   errors:{message:string,field?:string}[]
  // }
  abstract serializeErrors(): { message: string; field?: string }[];
}
