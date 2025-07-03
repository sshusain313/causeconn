import axios from 'axios';

// MSG91 Configuration
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_SENDER_ID = process.env.MSG91_SENDER_ID;
const MSG91_OTP_TEMPLATE_ID = process.env.MSG91_OTP_TEMPLATE_ID;

/**
 * Sends an SMS with OTP using MSG91
 * @param phone Phone number to send to (should include country code)
 * @param otp OTP code to send
 * @returns MSG91 response object
 */
export const sendVerificationSMS = async (phone: string, otp: string) => {
  try {
    // Check if MSG91 is properly configured
    if (!MSG91_AUTH_KEY || !MSG91_SENDER_ID || !MSG91_OTP_TEMPLATE_ID) {
      console.warn('MSG91 configuration is missing. Using fallback mode - OTP will be logged instead of sent.');
      console.log('=== FALLBACK SMS MODE ===');
      console.log(`OTP for ${phone}: ${otp}`);
      console.log('Please check the server console for the OTP code.');
      console.log('=== END FALLBACK MODE ===');
      
      // Return success to allow OTP storage to continue
      return {
        success: true,
        messageId: 'fallback-' + Date.now(),
        status: 'logged'
      };
    }

    // Ensure phone number has country code
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    
    const url = 'https://control.msg91.com/api/v5/flow/';
    const payload = {
      flow_id: MSG91_OTP_TEMPLATE_ID,
      sender: MSG91_SENDER_ID,
      mobiles: formattedPhone,
      VAR1: otp // OTP variable in template
    };

    console.log('Sending SMS via MSG91:', {
      phone: formattedPhone,
      template_id: MSG91_OTP_TEMPLATE_ID,
      sender_id: MSG91_SENDER_ID
    });

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authkey': MSG91_AUTH_KEY
      }
    });

    console.log('MSG91 SMS response:', response.data);

    if (response.data.type === 'success') {
      return {
        success: true,
        messageId: response.data.request_id,
        status: 'sent'
      };
    } else {
      throw new Error(`MSG91 Error: ${response.data.message || 'Unknown error'}`);
    }
  } catch (error: any) {
    console.error('Error sending SMS via MSG91:', error);
    
    if (error.response) {
      console.error('MSG91 Error Response:', error.response.data);
      throw new Error(`SMS sending failed: ${error.response.data.message || 'Unknown error'}`);
    }
    
    throw new Error(`SMS sending failed: ${error.message}`);
  }
};

/**
 * Legacy function for backward compatibility
 */
export const sendSMS = async (phone: string, otp: string) => {
  return sendVerificationSMS(phone, otp);
};

/**
 * Verifies OTP (this is handled by the OTP controller, not the SMS service)
 * @param phone Phone number to verify
 * @param otp OTP code to verify
 * @returns Boolean indicating success
 */
export const verifyOTP = async (phone: string, otp: string): Promise<boolean> => {
  // This function is kept for backward compatibility
  // Actual verification is handled in the OTP controller
  console.log(`[SMS] OTP verification request for ${phone}: ${otp}`);
  return true;
};
