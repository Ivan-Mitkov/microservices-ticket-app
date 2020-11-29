/**
 * Fake NATS wrapper
 *
 */
//the same name as the real file export
// export const natsWrapper = {
//   client: {
//     publish: (subject: string, data: string, callback: () => void) => {
//       callback();
//     },
//   },
// };
//NEED TO BE THE SAME KIND OF EXPORT AS ORIGINAL
// export default natsWrapper;
/**
 * Mock NATS wrapper
 *
 */
//This function is set only once
//clear results in test/setup
export const natsWrapper = {
  client: {
    //create mock function
    //function in mockImplementation will run when publish is called
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};
