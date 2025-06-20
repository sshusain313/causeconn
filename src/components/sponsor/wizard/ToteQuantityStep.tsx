import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import NumberInputWithSlider from '@/components/ui/number-input-with-slider';

interface ToteQuantityStepProps {
  formData: {
    toteQuantity: number;
  };
  updateFormData: (data: Partial<{
    toteQuantity: number;
  }>) => void;
  validationError: string | null;
}

const ToteQuantityStep = ({ formData, updateFormData, validationError }: ToteQuantityStepProps) => {
  // Calculate unit price based on quantity tiers
  const getUnitPrice = (quantity: number): number => {
    if (quantity >= 7000) return 5; // ₹5 per tote for 7000+ totes
    if (quantity >= 5000) return 7; // ₹7 per tote for 5000-6999 totes
    if (quantity >= 1000) return 8; // ₹8 per tote for 1000-4999 totes
    if (quantity >= 500) return 9;  // ₹9 per tote for 500-999 totes
    return 10; // ₹10 per tote for 50-499 totes (default)
  };

  const unitPrice = getUnitPrice(formData.toteQuantity);
  const totalPrice = formData.toteQuantity * unitPrice;

  const impactStatistics = {
    trees: Math.round(formData.toteQuantity * 0.2),
    plastic: Math.round(formData.toteQuantity * 0.5),
    carbon: Math.round(formData.toteQuantity * 0.3)
  };

  const handleQuantityChange = (newQuantity: number) => {
    updateFormData({ toteQuantity: newQuantity });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Tote Quantity</h2>
      
      {validationError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
          {validationError}
        </div>
      )}
      
      <p className="text-gray-600 mb-6">
        Select the quantity of totes you'd like to sponsor. Use the slider for quick selection up to 10,000 totes, 
        or enter a custom value manually up to 100,000 totes. The unit price decreases as quantity increases.
      </p>
    
      <div className="space-y-6">
        {/* Number Input with Slider */}
        <NumberInputWithSlider
          value={formData.toteQuantity}
          onChange={handleQuantityChange}
          min={50}
          sliderMax={10000}
          inputMax={100000}
          step={50}
          label="Number of Totes"
          placeholder="Enter tote quantity"
        />

        {/* Price Display */}
        <Card className="bg-primary-50 border-primary-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Pricing Summary</h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-700">${totalPrice.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Amount</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Unit Price</div>
                <div className="text-xl font-semibold text-gray-900">${unitPrice}/tote</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Quantity</div>
                <div className="text-xl font-semibold text-gray-900">{formData.toteQuantity.toLocaleString()} totes</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <div className="font-medium mb-1">Price Tiers:</div>
              <div>50-499: $10, 500-999: $9, 1000-4999: $8, 5000-6999: $7, 7000+: $5</div>
            </div>
          </CardContent>
        </Card>
      
        {/* Impact Statistics */}
        <Card className="bg-primary-50 border-primary-100">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-3">Estimated Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-3xl font-bold text-primary-700">{impactStatistics.trees}</p>
                <p className="text-sm text-gray-600">Trees saved</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-3xl font-bold text-primary-700">{impactStatistics.plastic}kg</p>
                <p className="text-sm text-gray-600">Plastic reduced</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-3xl font-bold text-primary-700">{impactStatistics.carbon}kg</p>
                <p className="text-sm text-gray-600">CO2 emissions avoided</p>
              </div>
            </div>
          </CardContent>
        </Card>
      
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">Note:</span> The final price will be calculated based on the quantity and your selected cause.
            You'll review the full details in the confirmation step.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ToteQuantityStep;
