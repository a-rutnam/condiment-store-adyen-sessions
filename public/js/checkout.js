// const api = require('./lib/merchant_api');
const MERCHANT_API_PAYMENT_METHODS_URL = '/api/payment_methods';
const MERCHANT_API_CREATE_PAYMENT_URL = '/api/create_payment';
const MERCHANT_API_CREATE_SESSION = '/api/create_session';

// clearing cookies to clear unwanted state
document.cookie = 'order_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
document.cookie = 'paymentData=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

console.log('hi!', AdyenCheckout);

document.addEventListener("DOMContentLoaded", () => {

  const submitButton = document.querySelector("#submitPaymentDetails");

  submitButton.addEventListener("click", async () => {

    const sessionsRequestBody = {
      merchantAccount: "Arutnam2020",
      amount: {
        value: 1000,
        currency: "EUR"
      },
      returnUrl: "https://your-company.com/checkout?shopperOrder=12xy..",
      reference: "YOUR_PAYMENT_REFERENCE",
      countryCode: "NL"
    }


    try {
      const sessionsResponse = await axios.post(MERCHANT_API_CREATE_SESSION, { sessionsRequestBody });
      // debugger
      console.log("try:", sessionsResponse);

      const configuration = {
        environment: 'test', // Change to 'live' for the live environment.
        clientKey: CLIENT_KEY, // Public key used for client-side authentication: https://docs.adyen.com/development-resources/client-side-authentication
        session: {
          id: sessionsResponse.data.id, // Unique identifier for the payment session.
          sessionData: sessionsResponse.data.sessionData // The payment session data.
        },
        onPaymentCompleted: (result, component) => {
            console.info(result, component);
        },
        onError: (error, component) => {
            console.error(error.name, error.message, error.stack, component);
        },
        // Any payment method specific configuration. Find the configuration specific to each payment method:  https://docs.adyen.com/payment-methods
        // For example, this is 3D Secure configuration for cards:
        paymentMethodsConfiguration: {
          card: {
            hasHolderName: true,
            holderNameRequired: true,
            billingAddressRequired: true
          }
        }
      };//configuration

      console.log("config objecy:", configuration);
// debugger
      // Create an instance of AdyenCheckout using the configuration object.
      const checkout = await AdyenCheckout(configuration);

      // const checkout = new AdyenCheckout(configuration);

debugger
      // Create an instance of Drop-in and mount it to the container you created.
      const dropinComponent = checkout.create('dropin').mount('#dropin-container');



    } catch (e) {
            console.log("error:", e);

    } finally {
      console.log("finally:");

    }




//     const amount = document.querySelector("#amount").value;
//     const currency = document.querySelector("#currency").value;
//
//
//     const fakeUserData = {
//       amount: {
//         currency: currency,
//         // to convert input, human readable amount to minor units. This is brittle and needs to be reconfigured for non-minor unit currencies
//         value: parseFloat(amount) * 100
//       },
//       channel: "Web"
//     };
// // debugger
//     // Make request to merchant server which forwards request to Adyen gateway
//     try {
// // debugger
//       const response = await axios.post(MERCHANT_API_PAYMENT_METHODS_URL, { fakeUserData });
// // debugger
//       const configuration = createConfig(response.data, CLIENT_KEY, fakeUserData);
//       const checkout = new AdyenCheckout(configuration);
//       debugger
//       const dropin = checkout.create('dropin').mount('#dropin-container');
//
//     } catch(err) {
//       console.log("error:", err);
//     }
//
  });  //submit button click handler
//
//
//   // Automatically submit amount form in debug mode ('/checkout?debug')
//   // for faster testing
//   const urlParams = new URLSearchParams(window.location.search);
//   const debugMode = urlParams.get('debug') !== null;
//   if( debugMode ){
//     submitButton.click();
//   }


}); // DOM ready handler

// Convenience function to create config object,
// passing in the required fields
// const createConfig = (paymentMethods, clientKey, fakeUserData) => {
//   return {
//     paymentMethodsResponse: paymentMethods,
//     clientKey: clientKey,
//     locale: "en-US",
//     environment: "test",
//     onSubmit: async (state, dropin) => {
//       try {
//
//         const paymentResponse = await axios.post(MERCHANT_API_CREATE_PAYMENT_URL, {
//           paymentMethod: state.data.paymentMethod,
//           browserInfo: state.data.browserInfo,
//           // reuse fakeUserData from payment_methods call
//           ...fakeUserData
//         });
//
//         // TODO: this needs to start over if the redirect returns an action again
//         if (paymentResponse.data.action) {
//           dropin.handleAction(paymentResponse.data.action);
//         } else {
//           // TODO: this is duped in redirect backend code, try to refactor
//           document.cookie = 'order_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
//
//           // Report status to UI
//           dropin.setStatus(paymentResponse.data.status, paymentResponse.data.message);
//         }
//
//       } catch(err) {
//         console.log('GATEWAY ERROR');
//         console.dir(err);
//         dropin.setStatus('error', { message: 'Something went wrong.'});
//
//       }
//
    // } //onSubmit handler
//   }; //return
//
// }; // createConfig()
