export class PaymentStrategy {
  constructor(credentials) {
    this._credentials = credentials;
  }

  pay(data) {
    console.log("the payment strategy");
  }
}
