import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { generateAndSendInvoice } from '../services/invoiceService';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

interface CreateOrderRequest {
  amount: number;
  currency: string;
  email: string;
  organizationName: string;
  causeTitle: string;
  sponsorshipId?: string;
}

interface ConfirmPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/**
 * Test endpoint to verify payment service is working
 */
export const testPaymentService = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Payment service test endpoint called');
    
    // Check if Razorpay credentials are configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      res.status(500).json({ 
        message: 'Razorpay credentials not configured',
        error: 'Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET environment variables'
      });
      return;
    }

    res.json({
      message: 'Payment service is working',
      razorpayConfigured: true,
      keyId: process.env.RAZORPAY_KEY_ID.substring(0, 10) + '...',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Payment service test error:', error);
    res.status(500).json({ 
      message: 'Payment service test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Create a Razorpay order
 */
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Creating Razorpay order with data:', req.body);
    console.log('Request headers:', req.headers);
    
    const { amount, currency, email, organizationName, causeTitle, sponsorshipId }: CreateOrderRequest = req.body;

    // Validate required fields
    if (!amount || !currency || !email || !organizationName || !causeTitle) {
      console.log('Validation failed - missing fields:', {
        amount: !!amount,
        currency: !!currency,
        email: !!email,
        organizationName: !!organizationName,
        causeTitle: !!causeTitle
      });
      res.status(400).json({
        message: 'Missing required fields',
        required: ['amount', 'currency', 'email', 'organizationName', 'causeTitle']
      });
      return;
    }

    // Validate amount (should be in paise for INR)
    if (currency === 'INR' && amount < 100) {
      res.status(400).json({
        message: 'Minimum amount for INR is 100 paise (₹1)'
      });
      return;
    }

    // Create order options
    const orderOptions = {
      amount: amount, // Amount is already in paise from frontend
      currency: currency.toUpperCase(),
      receipt: `receipt_${Date.now()}`,
      notes: {
        email,
        organizationName,
        causeTitle,
        sponsorshipId: sponsorshipId || 'N/A'
      },
      partial_payment: false
    };

    console.log('Creating Razorpay order with options:', orderOptions);

    // Create order with Razorpay
    const order = await razorpay.orders.create(orderOptions);

    console.log('Razorpay order created successfully:', {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status
    });

    // Return order details with Razorpay key for frontend
    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        receipt: order.receipt,
        key: process.env.RAZORPAY_KEY_ID,
        email,
        organizationName,
        causeTitle,
        sponsorshipId
      }
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    
    if (error instanceof Error) {
      res.status(500).json({
        message: 'Failed to create payment order',
        error: error.message
      });
    } else {
      res.status(500).json({
        message: 'Failed to create payment order',
        error: 'Unknown error occurred'
      });
    }
  }
};

/**
 * Confirm payment after successful Razorpay payment
 */
export const confirmPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Confirming payment with data:', req.body);
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature }: ConfirmPaymentRequest = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({
        message: 'Missing required payment verification fields',
        required: ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature']
      });
      return;
    }

    // Verify payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    if (signature !== razorpay_signature) {
      console.error('Payment signature verification failed');
      res.status(400).json({
        message: 'Payment verification failed',
        error: 'Invalid payment signature'
      });
      return;
    }

    console.log('Payment signature verified successfully');

    // Get payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    console.log('Payment details retrieved:', {
      id: payment.id,
      order_id: payment.order_id,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency
    });

    // Fetch order details to get sponsor info from notes
    let order;
    try {
      order = await razorpay.orders.fetch(payment.order_id);
    } catch (err) {
      order = null;
    }
    const notes = order?.notes || {};

    // Only send invoice if payment is captured
    if (payment.status === 'captured') {
      try {
        await generateAndSendInvoice(
          notes.email || payment.email || '',
          {
            paymentId: payment.id,
            orderId: payment.order_id,
            amount: Number(payment.amount),
            currency: payment.currency,
            organizationName: notes.organizationName || '',
            contactName: notes.contactName || '',
            phone: notes.phone || '',
            causeTitle: notes.causeTitle || '',
            toteQuantity: Number(notes.toteQuantity) || 0,
            unitPrice: Number(notes.unitPrice) || 0,
          }
        );
        console.log('Invoice generated and sent to sponsor.');
      } catch (err) {
        console.error('Failed to generate/send invoice:', err);
      }
    }

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      payment: {
        id: payment.id,
        order_id: payment.order_id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method
      }
    });

  } catch (error) {
    console.error('Error confirming payment:', error);
    
    if (error instanceof Error) {
      res.status(500).json({
        message: 'Failed to confirm payment',
        error: error.message
      });
    } else {
      res.status(500).json({
        message: 'Failed to confirm payment',
        error: 'Unknown error occurred'
      });
    }
  }
};

/**
 * Get payment status for an order
 */
export const getPaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    
    console.log('Getting payment status for order:', orderId);

    if (!orderId) {
      res.status(400).json({
        message: 'Order ID is required'
      });
      return;
    }

    // Get order details from Razorpay
    const order = await razorpay.orders.fetch(orderId);
    
    console.log('Order details retrieved:', {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      receipt: order.receipt
    });

    // Get payments for this order
    const payments = await razorpay.orders.fetchPayments(orderId);

    console.log('Payments for order:', payments.items.length);

    // Find the most recent successful payment
    const successfulPayment = payments.items.find(payment => payment.status === 'captured');

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        receipt: order.receipt
      },
      payment: successfulPayment ? {
        id: successfulPayment.id,
        status: successfulPayment.status,
        amount: successfulPayment.amount,
        currency: successfulPayment.currency,
        method: successfulPayment.method
      } : null,
      totalPayments: payments.items.length
    });

  } catch (error) {
    console.error('Error getting payment status:', error);
    
    if (error instanceof Error) {
      res.status(500).json({
        message: 'Failed to get payment status',
        error: error.message
      });
    } else {
      res.status(500).json({
        message: 'Failed to get payment status',
        error: 'Unknown error occurred'
      });
    }
  }
}; 