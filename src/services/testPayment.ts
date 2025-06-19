import axios from 'axios';
import config from '@/config';

/**
 * Test function to create a Razorpay order
 */
export const testCreateOrder = async () => {
  try {
    console.log('Testing payment order creation...');
    console.log('API URL:', config.apiUrl);
    
    // First, test the connection with a simple GET request
    try {
      const testResponse = await axios.get(`${config.apiUrl}/api/payments/test`);
      console.log('Test endpoint response:', testResponse.data);
    } catch (error) {
      console.error('Error connecting to test endpoint:', error);
    }
    
    // Now try to create an order
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${config.apiUrl}/api/payments/create-order`,
      {
        amount: 100, // 100 rupees
        currency: 'INR',
        email: 'test@example.com',
        organizationName: 'Test Organization',
        causeTitle: 'Test Cause'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      }
    );
    
    console.log('Order created successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error in test payment:', error);
    console.error('Error response:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to test payment order');
  }
};

export default testCreateOrder;