import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Smartphone, Loader2 } from 'lucide-react';
import axios from 'axios';
import config from '@/config';

// MSG91 Widget Configuration
const MSG91_WIDGET_ID = "3567626b5a78363937313937";
const MSG91_AUTH_KEY = "383885T2HhO4JY468651dc9P1"; // Widget initialization auth key
const MSG91_VERIFY_AUTH_KEY = "383885AfgFYzqZxpF634ff2e2P1"; // Token verification auth key

// Standardize phone number format (same as backend)
const standardizePhoneNumber = (phone: string): string => {
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Remove leading + if present
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  
  // Remove leading 0 if present
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  
  // Remove leading 91 if present (to avoid double country code)
  if (cleaned.startsWith('91') && cleaned.length > 10) {
    cleaned = cleaned.substring(2);
  }
  
  // Ensure it's a 10-digit number
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  
  // If it's already 12 digits with country code, add +
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }
  
  // If it's already 13 digits with +91, return as is
  if (cleaned.length === 13 && cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }
  
  // Default: assume it's a 10-digit number and add +91
  return `+91${cleaned}`;
};

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromWaitlist = searchParams.get('source') === 'waitlist';
  
  const [formData, setFormData] = useState<any>(null);
  const [phone, setPhone] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWidgetLoaded, setIsWidgetLoaded] = useState<boolean>(false);
  const [manualOtp, setManualOtp] = useState<string>('');
  const widgetRef = useRef<any>(null);
  
  useEffect(() => {
    // Retrieve form data from session storage
    const storedData = sessionStorage.getItem('claimFormData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setFormData(parsedData);
    } else {
      // If no data is found, redirect back to the claim form
      navigate('/causes');
    }
    
    // For waitlist users, show appropriate message
    if (fromWaitlist) {
      toast({
        title: "Waitlist Member Detected",
        description: "Please verify your phone number to continue.",
      });
    }

    // Load MSG91 widget
    loadMSG91Widget();
  }, [navigate, fromWaitlist]);

  const loadMSG91Widget = () => {
    // Check if the script is already loaded
    if (document.querySelector('script[src*="otp-provider.js"]')) {
      console.log('MSG91 script already loaded');
      setIsWidgetLoaded(true);
      return;
    }

    // Load the MSG91 script
    const script = document.createElement('script');
    script.src = 'https://control.msg91.com/app/assets/otp-provider/otp-provider.js';
    script.async = true;
    script.onload = () => {
      console.log('MSG91 script loaded successfully');
      setIsWidgetLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load MSG91 script');
      setIsWidgetLoaded(false);
    };
    document.head.appendChild(script);
  };

  const testMSG91Configuration = async () => {
    console.log('=== TESTING MSG91 CONFIGURATION ===');
    console.log('Widget ID:', MSG91_WIDGET_ID);
    console.log('Widget Auth Key:', MSG91_AUTH_KEY);
    console.log('Verify Auth Key:', MSG91_VERIFY_AUTH_KEY);
    
    // Test the verification auth key
    console.log(`Testing verification auth key: ${MSG91_VERIFY_AUTH_KEY}`);
    
    try {
      const response = await fetch("https://control.msg91.com/api/v5/widget/verifyAccessToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "authkey": MSG91_VERIFY_AUTH_KEY,
          "access-token": "test-token"
        })
      });
      
      const result = await response.text();
      console.log(`Verification API result:`, result);
      
    } catch (error) {
      console.error(`Error testing verification auth key:`, error);
    }
    
    toast({
      title: "MSG91 Test Complete",
      description: "Check console for configuration test results.",
    });
  };

  const initializeMSG91Widget = () => {
    if (!phone) {
      toast({
        title: "Error",
        description: "Please enter your phone number first.",
        variant: "destructive",
      });
      return;
    }

    if (!isWidgetLoaded || typeof window.initSendOTP !== 'function') {
      console.error('MSG91 widget not ready');
      toast({
        title: "Error",
        description: "Verification widget is not ready. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Format phone number consistently
    const formattedPhone = standardizePhoneNumber(phone);
    console.log('Initializing MSG91 widget for phone:', formattedPhone);

    // MSG91 Widget Configuration with token-based verification
    const configuration = {
      widgetId: MSG91_WIDGET_ID,
      tokenAuth: MSG91_AUTH_KEY,
      exposeMethods: "false", // When true will expose the methods for OTP verification
      success: async (data: any) => {
        console.log('MSG91 Widget Success:', data);
        console.log('Success data structure:', JSON.stringify(data, null, 2));
        
        try {
          // Check if we have the required data
          if (!data || !data.message) {
            console.error('Missing token in success data:', data);
            toast({
              title: "Widget Error",
              description: "Verification token not received. Please use manual verification.",
              variant: "destructive",
            });
            return;
          }

          // Verify the access token with MSG91 using the correct auth key
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
          
          const raw = JSON.stringify({
            "authkey": MSG91_VERIFY_AUTH_KEY, // Use the verification auth key
            "access-token": data.message
          });
          
          const requestOptions: RequestInit = {
            method: "POST",
            headers: myHeaders,
            body: raw
          };

          console.log('=== MSG91 TOKEN VERIFICATION ===');
          console.log('Token received:', data.message);
          console.log('Widget Auth Key:', MSG91_AUTH_KEY);
          console.log('Verify Auth Key:', MSG91_VERIFY_AUTH_KEY);
          console.log('Request payload:', raw);
          
          const response = await fetch("https://control.msg91.com/api/v5/widget/verifyAccessToken", requestOptions);
          const result = await response.text();
          console.log('MSG91 API response status:', response.status);
          console.log('MSG91 API response:', result);

          // Parse the result
          let verificationData;
          try {
            verificationData = JSON.parse(result);
          } catch (parseError) {
            console.error('Failed to parse MSG91 response:', parseError);
            console.error('Raw response:', result);
            throw new Error('Invalid response from MSG91');
          }
          
          console.log('Parsed verification data:', verificationData);
          
          if (verificationData.type === 'success') {
            console.log('MSG91 token verification successful!');
            
            // Store verification status
            sessionStorage.setItem('verificationComplete', 'true');
            
            // Add fromWaitlist flag if applicable
            if (fromWaitlist) {
              const claimData = JSON.parse(sessionStorage.getItem('claimFormData') || '{}');
              sessionStorage.setItem('claimFormData', JSON.stringify({
                ...claimData,
                fromWaitlist: true
              }));
            }
            
            toast({
              title: "Phone Verified!",
              description: "Your phone number has been successfully verified via MSG91.",
            });
            
            // Navigate to confirmation page
            navigate('/claim/confirmed');
          } else {
            console.error('MSG91 token verification failed:', verificationData);
            
            // Handle specific MSG91 errors
            if (verificationData.code === '201') {
              console.error('MSG91 Authentication Failure - Possible causes:');
              console.error('1. Invalid Auth Key');
              console.error('2. Auth Key not authorized for this widget');
              console.error('3. Widget ID mismatch');
              console.error('4. Account suspended or inactive');
              
              toast({
                title: "Widget Verification Failed",
                description: "Authentication failed. Please use the manual OTP verification below.",
                variant: "destructive",
              });
            } else if (verificationData.code === '408') {
              console.error('MSG91 IP Blocked');
              toast({
                title: "IP Blocked",
                description: "Your IP is blocked by MSG91. Please use the manual OTP verification below.",
                variant: "destructive",
              });
            } else {
              console.error('Unknown MSG91 error:', verificationData);
              toast({
                title: "Widget Verification Failed",
                description: `Error: ${verificationData.message || 'Unknown error'}. Please use manual verification.`,
                variant: "destructive",
              });
            }
          }
          
        } catch (error: any) {
          console.error('Token verification error:', error);
          console.error('Error details:', error.message);
          
          // If MSG91 verification fails, suggest using manual fallback
          toast({
            title: "Widget Verification Failed",
            description: "Please use the manual OTP verification below.",
            variant: "destructive",
          });
        }
      },
      failure: (error: any) => {
        console.error('MSG91 Widget Failure:', error);
        
        let errorMessage = "Please use the manual OTP verification below.";
        let errorTitle = "Widget Failed";
        
        if (error?.code === '408') {
          errorTitle = "IP Blocked by MSG91";
          errorMessage = "Your IP is blocked by MSG91. Please use the manual OTP verification below.";
          console.error('MSG91 IP Blocked - This is common in development environments');
          console.error('Solutions:');
          console.error('1. Use the manual OTP system below');
          console.error('2. Deploy to production with whitelisted IP');
          console.error('3. Contact MSG91 support to whitelist your IP');
        } else if (error?.code === '401') {
          errorTitle = "Authentication Failed";
          errorMessage = "MSG91 authentication failed. Please use the manual OTP verification below.";
        } else if (error?.message) {
          errorMessage = `Widget error: ${error.message}. Please use manual verification.`;
        }
        
        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
        });
      }
      // Remove additional parameters that might be causing issues
      // var1: "CauseConnect",
      // var2: "Claim Verification",
      // autoFocus: "true",
      // retryCount: "3",
      // retryInterval: "60"
    };

    console.log('Initializing MSG91 widget with configuration:', {
      widgetId: configuration.widgetId,
      tokenAuth: configuration.tokenAuth ? 'Set' : 'Not Set',
      phone: formattedPhone
    });

    try {
      // Initialize the MSG91 widget
      if (typeof window.initSendOTP === 'function') {
        window.initSendOTP(configuration);
        console.log('MSG91 widget initialized with phone:', formattedPhone);
      } else {
        throw new Error('MSG91 widget function not available');
      }
    } catch (error) {
      console.error('Error initializing MSG91 widget:', error);
      toast({
        title: "Error",
        description: "Failed to initialize verification widget. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast({
        title: "Error",
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Small delay to ensure widget is ready
    setTimeout(() => {
      initializeMSG91Widget();
      setIsLoading(false);
    }, 500);
  };

  const fallbackOTPVerification = async () => {
    if (!phone) {
      toast({
        title: "Error",
        description: "Please enter your phone number first.",
        variant: "destructive",
      });
      return;
    }

    // If manual OTP is provided, verify it
    if (manualOtp && manualOtp.length === 6) {
      await verifyManualOTP();
      return;
    }

    // Otherwise, send OTP
    setIsLoading(true);
    
    try {
      // Use standardized phone number format
      const formattedPhone = standardizePhoneNumber(phone);
      console.log('=== SENDING OTP ===');
      console.log('Original phone:', phone);
      console.log('Standardized phone:', formattedPhone);
      
      // Use our existing backend OTP system as fallback
      const response = await axios.post(`${config.apiUrl}/otp/send`, {
        phone: formattedPhone,
        method: 'sms'
      });
      
      console.log('Fallback OTP sent:', response.data);
      
      toast({
        title: "OTP Sent",
        description: "Verification code sent via SMS. Please check your phone and enter it above.",
      });
      
    } catch (error: any) {
      console.error('Fallback OTP error:', error);
      console.error('Error response:', error.response?.data);
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyManualOTP = async () => {
    if (!manualOtp || manualOtp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Use standardized phone number format (same as when sending)
      const formattedPhone = standardizePhoneNumber(phone);
      console.log('=== VERIFYING OTP ===');
      console.log('Original phone:', phone);
      console.log('Standardized phone:', formattedPhone);
      console.log('OTP entered:', manualOtp);
      
      const requestData = {
        phone: formattedPhone,
        otp: manualOtp,
        method: 'sms'
      };
      
      console.log('Sending verification request:', requestData);
      
      const response = await axios.post(`${config.apiUrl}/otp/verify`, requestData);
      
      console.log('Manual OTP verification successful:', response.data);
      
      // Store verification status
      sessionStorage.setItem('verificationComplete', 'true');
      
      // Add fromWaitlist flag if applicable
      if (fromWaitlist) {
        const claimData = JSON.parse(sessionStorage.getItem('claimFormData') || '{}');
        sessionStorage.setItem('claimFormData', JSON.stringify({
          ...claimData,
          fromWaitlist: true
        }));
      }
      
      toast({
        title: "Phone Verified!",
        description: "Your phone number has been successfully verified.",
      });
      
      // Navigate to confirmation page
      navigate('/claim/confirmed');
      
    } catch (error: any) {
      console.error('Manual OTP verification error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = "Invalid or expired verification code.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const debugOTPRecords = async () => {
    if (!phone) {
      toast({
        title: "Error",
        description: "Please enter your phone number first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const formattedPhone = standardizePhoneNumber(phone);
      console.log('=== DEBUGGING OTP RECORDS ===');
      console.log('Original phone:', phone);
      console.log('Standardized phone:', formattedPhone);
      
      const response = await axios.get(`${config.apiUrl}/otp/debug?phone=${encodeURIComponent(formattedPhone)}`);
      console.log('Debug response:', response.data);
      
      toast({
        title: "Debug Info",
        description: `Found ${response.data.recordCount} OTP records. Check console for details.`,
      });
      
    } catch (error: any) {
      console.error('Debug error:', error);
      toast({
        title: "Debug Error",
        description: "Failed to fetch debug info.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Layout>
      <div className="bg-primary-50 py-10">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-4"
          >
            &larr; Back
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Verify Your Phone Number</h1>
          <p className="text-lg text-gray-700 mb-6">
            Enter your phone number to receive a verification code
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Phone Input Form */}
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number (e.g., 9876543210)"
                    disabled={isLoading}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Include country code if needed (e.g., +91 for India)
                  </p>
                </div>

                <Button 
                  type="submit"
                  disabled={!phone.trim() || isLoading || !isWidgetLoaded}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading Verification...
                    </>
                  ) : !isWidgetLoaded ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading Widget...
                    </>
                  ) : (
                    <>
                      <Smartphone className="h-4 w-4 mr-2" />
                      Verify Phone Number
                    </>
                  )}
                </Button>
              </form>

              {/* MSG91 Widget Container */}
              <div className="mt-6">
                <div className="text-center text-sm text-gray-500 mb-4">
                  Powered by MSG91
                </div>
                {/* The MSG91 widget will be injected here */}
                <div id="msg91-otp-widget" className="min-h-[300px] border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="text-center text-gray-500">
                    <p className="mb-2">MSG91 Widget Loading...</p>
                    <p className="text-xs">The verification widget will appear here once loaded</p>
                    <p className="text-xs mt-2">If widget doesn't appear, use the fallback option below</p>
                  </div>
                </div>
                
                {/* Manual OTP Input Fallback */}
                <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h3 className="font-medium text-blue-900 mb-2">Manual OTP Verification (Fallback)</h3>
                  <p className="text-sm text-blue-800 mb-3">
                    If the MSG91 widget doesn't work, you can manually enter the OTP received on your phone.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="manualOtp" className="text-sm">Enter OTP</Label>
                      <Input
                        id="manualOtp"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        className="mt-1"
                        value={manualOtp}
                        onChange={(e) => setManualOtp(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={fallbackOTPVerification}
                        disabled={isLoading}
                        className="flex-1"
                      >
                        {manualOtp && manualOtp.length === 6 ? 'Verify OTP' : 'Send OTP'}
                      </Button>
                      {manualOtp && manualOtp.length === 6 && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setManualOtp('')}
                          className="px-3"
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={debugOTPRecords}
                        className="flex-1 text-xs"
                      >
                        Debug OTP Records
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={testMSG91Configuration}
                        className="flex-1 text-xs"
                      >
                        Test MSG91 Config
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">How it works:</h3>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Enter your phone number above</li>
                  <li>2. Click "Verify Phone Number"</li>
                  <li>3. Complete the verification in the widget below</li>
                  <li>4. You'll be automatically redirected upon success</li>
                </ol>
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  <strong>Development Note:</strong> MSG91 may block localhost IPs. If the widget fails, use the manual OTP verification below - it works reliably in all environments.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

// Add MSG91 types to window object
declare global {
  interface Window {
    initSendOTP: (configuration: any) => void;
  }
}

export default OtpVerificationPage;
