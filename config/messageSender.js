const axios = require("axios");

const messageSender = async ({countryCode, phoneNumber, otp}) =>{
    console.log("CountryCode: ",countryCode,"phoneNumber: ", phoneNumber,"otp: ", otp)
    try {
    // const response = await axios.post(
    //   "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/",
    //   {
    //     integrated_number: process.env.MSG91_INTEGRATED_NUMBER,
    //     content_type: "template",
    //     payload: {
    //       messaging_product: "whatsapp",
    //       type: "template",
    //       template: {
    //         name: "auth_otp",
    //         language: {
    //           code: "en_US",
    //           policy: "deterministic",
    //         },
    //         namespace: process.env.MSG91_NAMESPACE, 
    //         to_and_components: [
    //           {
    //             to: [phoneNumber],
    //             components: {
    //               body_1: {
    //                 type: "text",
    //                 value: otp, 
    //               },
    //               button_1: {
    //                 subtype: "url",
    //                 type: "text",
    //                 value: otp,
    //               },
    //             },
    //           },
    //         ],
    //       },
    //     },
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       authkey: process.env.MSG91_AUTH_KEY,
    //     },
    //   }
    // );

    // console.log("WhatsApp OTP Sent:", response.data);
    return true;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error.response?.data || error.message);
    return false;
  }
};

module.exports = messageSender;