export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({}),
  },
};

// // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
// const charge = await stripe.charges.create({
//   amount: 2000,
//   currency: 'bgn',
//   source: 'tok_visa',
//   description: 'My First Test Charge (created for API docs)',
// });
