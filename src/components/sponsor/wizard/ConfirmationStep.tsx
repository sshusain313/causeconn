
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import config from '@/config';

interface ConfirmationStepProps {
  formData: {
    organizationName: string;
    contactName: string;
    email: string;
    phone: string;
    selectedCause: string;
    toteQuantity: number;
    unitPrice: number;
    totalAmount: number;
    logoUrl: string;
    message: string;
    distributionType?: 'online' | 'physical';
    distributionPoints?: string[];
    distributionDate?: Date;
    distributionStartDate?: Date;
    distributionEndDate?: Date;
    demographics?: {
      ageGroups: string[];
      income: string;
      education: string;
      other: string;
    };
    availableTotes?: number;
    claimedTotes?: number;
  };
}

const ConfirmationStep = ({ formData }: ConfirmationStepProps) => {
  // Mock causes data
  const causes = [
    { id: '1', title: 'Clean Water Initiative' },
    { id: '2', title: "Children's Education Fund" },
    { id: '3', title: 'Women Entrepreneurs' },
    { id: '4', title: 'Wildlife Conservation' },
  ];

  const selectedCause = causes.find(cause => cause.id === formData.selectedCause)?.title || '';
  
  // Use the pricing information from the form data
  const unitPrice = formData.unitPrice || 10; // Default to $10 per tote if not provided
  const totalCost = formData.totalAmount || (formData.toteQuantity * unitPrice);
  
  // Mock QR code value
  const qrValue = `https://changebag.org/claim/${formData.selectedCause}?sponsor=${encodeURIComponent(formData.organizationName)}`;

  // Format demographic information
  const formatDemographics = () => {
    const demo = formData.demographics;
    if (!demo) return 'Not specified';
    
    const parts = [];
    if (demo.ageGroups && demo.ageGroups.length > 0) parts.push(`Ages: ${demo.ageGroups.join(', ')}`);
    if (demo.income) parts.push(`Income: ${demo.income.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}`);
    if (demo.education) parts.push(`Education: ${demo.education.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}`);
    
    return parts.length > 0 ? parts.join(' • ') : 'Not specified';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-2">Review Your Sponsorship</h2>
      <p className="text-gray-600 mb-6">
        Please review your sponsorship details before finalizing.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Organization Details</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Organization:</span>
                  <span className="font-medium">{formData.organizationName}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Contact:</span>
                  <span className="font-medium">{formData.contactName}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{formData.email}</span>
                </li>
                {formData.phone && (
                  <li className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{formData.phone}</span>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Sponsorship Details</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Cause:</span>
                  <span className="font-medium">{selectedCause}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{formData.toteQuantity} totes</span>
                </li>
                {formData.claimedTotes !== undefined && (
                  <li className="flex justify-between">
                    <span className="text-gray-600">Already Claimed:</span>
                    <span className="font-medium">{formData.claimedTotes} totes</span>
                  </li>
                )}
                {formData.availableTotes !== undefined && (
                  <li className="flex justify-between">
                    <span className="text-gray-600">Available After Sponsorship:</span>
                    <span className="font-medium text-green-600">{formData.availableTotes} totes</span>
                  </li>
                )}
                <li className="flex justify-between">
                  <span className="text-gray-600">Price per tote:</span>
                  <span className="font-medium">${unitPrice.toFixed(2)}</span>
                </li>
                <Separator className="my-2" />
                <li className="flex justify-between text-lg">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold">${totalCost.toLocaleString()}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          {/* Distribution Information Card */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Distribution Information</h3>
              <ul className="space-y-3">
                {/* Distribution Date */}
                {/* Show different date fields based on distribution type */}
                {formData.distributionType === 'physical' ? (
                  <>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">
                        {formData.distributionStartDate 
                          ? format(new Date(formData.distributionStartDate), "MMMM d, yyyy") 
                          : "Not specified"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium">
                        {formData.distributionEndDate 
                          ? format(new Date(formData.distributionEndDate), "MMMM d, yyyy") 
                          : "Not specified"}
                      </span>
                    </li>
                  </>
                ) : (
                  <li className="flex justify-between">
                    <span className="text-gray-600">Distribution Date:</span>
                    <span className="font-medium">
                      {formData.distributionDate 
                        ? format(new Date(formData.distributionDate), "MMMM d, yyyy") 
                        : "Not specified"}
                    </span>
                  </li>
                )}
                
                {/* Distribution Points */}
                <li>
                  <span className="text-gray-600 block">Distribution Points:</span>
                  {formData.distributionPoints && formData.distributionPoints.length > 0 ? (
                    <ul className="list-disc pl-5 mt-1">
                      {formData.distributionPoints.map((point, i) => (
                        <li key={i} className="font-medium text-sm">{point}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="font-medium">None specified</span>
                  )}
                </li>
                
                {/* Demographics */}
                <li>
                  <span className="text-gray-600 block">Target Demographics:</span>
                  <span className="font-medium">{formatDemographics()}</span>
                  
                  {formData.demographics?.other && (
                    <div className="mt-1 text-sm italic">
                      "{formData.demographics.other}"
                    </div>
                  )}
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-1 rounded-full mt-1">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800">Ready to Complete!</h4>
                <p className="text-sm text-green-700">
                  Your sponsorship details are ready for submission. Click "Complete Sponsorship" to finalize.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Your QR Code</h3>
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
                  <QRCodeSVG value={qrValue} size={180} />
                </div>
                <p className="text-sm text-gray-600 text-center">
                  This QR code will be printed on your sponsored totes.
                  <br />Users can scan it to learn more about your cause.
                </p>
              </div>
            </CardContent>
          </Card>
          
          {formData.logoUrl && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Your Logo</h3>
                <div className="bg-gray-50 p-4 rounded-lg flex justify-center">
                  <img 
                    src={formData.logoUrl.startsWith('/uploads/') 
                      ? `${config.uploadsUrl}${formData.logoUrl.replace('/uploads', '')}` 
                      : formData.logoUrl} 
                    alt="Organization Logo" 
                    className="max-h-32 max-w-full object-contain" 
                    onError={(e) => {
                      console.error('Error loading logo image:', formData.logoUrl);
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 text-center mt-2">
                  This logo will appear on your sponsored totes.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;
