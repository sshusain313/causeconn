import React, { useState } from 'react';
import { testCreateOrder, testGetPaymentStatus } from '../services/testPayment';

const PaymentTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestCreateOrder = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await testCreateOrder();
      setResult(response);
      console.log('Payment test successful:', response);
    } catch (err: any) {
      setError(err.message);
      console.error('Payment test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestPaymentStatus = async () => {
    if (!result?.order?.id) {
      setError('No order ID available. Create an order first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const statusResponse = await testGetPaymentStatus(result.order.id);
      setResult({ ...result, status: statusResponse });
      console.log('Payment status test successful:', statusResponse);
    } catch (err: any) {
      setError(err.message);
      console.error('Payment status test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Razorpay Integration Test</h1>
      
      <div className="space-y-4">
        <button
          onClick={handleTestCreateOrder}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Create Order'}
        </button>

        {result?.order?.id && (
          <button
            onClick={handleTestPaymentStatus}
            disabled={loading}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 ml-2"
          >
            {loading ? 'Testing...' : 'Test Payment Status'}
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <h3 className="font-semibold mb-2">What this test does:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Tests the connection to the payment service</li>
          <li>Creates a Razorpay order for ₹100</li>
          <li>Retrieves the order details with Razorpay key</li>
          <li>Tests payment status retrieval</li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentTest; 