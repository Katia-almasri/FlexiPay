export class PaymentStrategy {
  constructor() {}

  pay(data) {
    console.log("pay in the payment strategy");
  }

  refund(data) {
    console.log("refund in the payment strategy");
  }
}
