window.KODEPAY_APPLICATION_ID = "8b34e240-c369-11ee-899a-a2470496a586"; // application_id
window.KODEPAY_CLIENT_ID = "429e48ee-768a-11ef-9cf3-928f62f479bc"; //client_id
window.KODEPAY_ENV = "development"; //env，development 和  production


// // 下面是API的一些简单使用示例，请确保JS加载完成后再使用Kodepay对象
// window.onload = function () {
//     if (window.KodePay) {
//         const origial_data = { user_id: 3242422, order_id: 123123 }; // 支付时可以额外透传的一些信息，我们会在支付回调中将这些信息传递给你的服务器，建议通过这些信息(例如自己的订单号)你可以唯一标识你系统的用户
//         const price_id = "prod_685a565c9b454ff8"; // price_id
//         const currency = "usd"; // 目前支持usd, cny

//         //下面这两个方法，由开发者二选一。
//         //这个是直接打开支付页面，没有支付方式选择的过程。
//         window.KodePay.open_payment_page(price_id, origial_data);
//         // //这一个会先打开对应币种的支付方式选择页面。
//         // window.KodePay.open_payment_choose_page(price_id, currency);

//         // 前端支付成功的回调，通过这个函数，你可以在前端获取到支付的回调信息,但是更好的方式是前端收到这个回调信息后再次刷新页面获取用户最新的信息来确保用户已经支付，因为前端不可信
//         window.KodePay.on_pay_completed.addListener(paySuccessCallBack);
//     }
// };
// function paySuccessCallBack(user_info, status) {
//     if (status === "succeed") {
//         // user_info 可以参考接入文档中的get_user_info 接口返回的内容，实际对你有用的是付费信息
//         console.log("支付成功,用户信息", user_info);
//     } else {
//         console.log("支付失败");
//     }
// }
