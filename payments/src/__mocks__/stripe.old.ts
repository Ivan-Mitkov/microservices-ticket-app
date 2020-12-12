export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({}),
  },
};

// const stripe = require('stripe')('sk_test_51HajPfLKqKY72FXris5SPv1jwU0M3q3xL8PeFiJlBpn4yN2ANwDmij9esktNKTMpycArmbqheGNi5i9DkC39HjzL00ZOrlMvb3');

// // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
// const charge = await stripe.charges.create({
//   amount: 2000,
//   currency: 'bgn',
//   source: 'tok_visa',
//   description: 'My First Test Charge (created for API docs)',
// });
