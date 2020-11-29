/**
 * Fake NATS wrapper
 *
 */
//the same name as the real file export
export const natsWrapper = {
  client: {
    publish: (subject: string, data: string, callback: () => void) => {
      callback();
    },
  },
};
//NEED TO BE THE SAME KIND OF EXPORT AS ORIGINAL
// export default natsWrapper;
