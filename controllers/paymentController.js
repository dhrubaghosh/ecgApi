require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { getConnection } = require("../config/dbConnection");


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      payment_capture: 1,
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};


const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    donorData,
  } = req.body;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid signature" });
  }

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("Name", donorData.name)
      .input("Email", donorData.email)
      .input("Phone", donorData.phone)
      .input("PAN", donorData.pan || null)
      .input("Cause", donorData.cause)
      .input("Amount", donorData.amount)
      .input("Currency", "INR")
      .input("RazorpayOrderId", razorpay_order_id)
      .input("RazorpayPaymentId", razorpay_payment_id)
      .input("RazorpaySignature", razorpay_signature).query(`
        INSERT INTO Donations
        (Name, Email, Phone, PAN, Cause, Amount, Currency, RazorpayOrderId, RazorpayPaymentId, RazorpaySignature)
        VALUES (@Name, @Email, @Phone, @PAN, @Cause, @Amount, @Currency, @RazorpayOrderId, @RazorpayPaymentId, @RazorpaySignature)
      `);

    res.json({ success: true, message: "Payment verified and saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database error" });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
