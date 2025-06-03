
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface ToteQuantityStepProps {
  formData: {
    toteQuantity: number;
  };
  updateFormData: (data: Partial<{
    toteQuantity: number;
  }>) => void;
}

const ToteQuantityStep = ({ formData, updateFormData }: ToteQuantityStepProps) => {
  const handleSliderChange = (value: number[]) => {
    updateFormData({ toteQuantity: value[0] });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 50;
    // Ensure value is between 50 and 10000
    const clampedValue = Math.min(10000, Math.max(50, value));
    updateFormData({ toteQuantity: clampedValue });
  };

  // Calculate unit price based on quantity tiers
  const getUnitPrice = (quantity: number): number => {
    if (quantity >= 7000) return 5; // $5 per tote for 7000+ totes
    if (quantity >= 5000) return 7; // $7 per tote for 5000-6999 totes
    if (quantity >= 1000) return 8; // $8 per tote for 1000-4999 totes
    if (quantity >= 500) return 9;  // $9 per tote for 500-999 totes
    return 10; // $10 per tote for 50-499 totes (default)
  };
  
  const unitPrice = getUnitPrice(formData.toteQuantity);
  const totalPrice = formData.toteQuantity * unitPrice;

  const impactStatistics = {
    trees: Math.round(formData.toteQuantity * 0.2),
    plastic: Math.round(formData.toteQuantity * 0.5),
    carbon: Math.round(formData.toteQuantity * 0.3)
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Tote Quantity</h2>
      <p className="text-gray-600 mb-6">
        Select the quantity of totes you'd like to sponsor. The minimum quantity is 50 totes and the maximum is 10,000 totes. The unit price decreases as quantity increases.
      </p>
      
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <Label htmlFor="toteQuantity">Number of Totes</Label>
              <div className="text-right">
                <span className="font-semibold text-primary-700">${totalPrice.toLocaleString()}</span>
                <span className="text-sm text-gray-500 ml-1">Total</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex-1 relative">
                <Slider 
                  id="toteSlider"
                  value={[formData.toteQuantity]} 
                  min={50} 
                  max={10000} 
                  step={50}
                  onValueChange={handleSliderChange}
                />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>{formData.toteQuantity} totes</span>
                  <span>${unitPrice}/tote</span>
                </div>
                {/* <div className="text-xs text-gray-500 mt-1">
                  <span>Price tiers: </span>
                  <span>50-499: $10, </span>
                  <span>500-999: $9, </span>
                  <span>1000-4999: $8, </span>
                  <span>5000-6999: $7, </span>
                  <span>7000+: $5</span>
                </div> */}
              </div>
              {/* <div className="w-24">
                <Input
                  id="toteQuantity"
                  type="number"
                  min={50}
                  max={10000}
                  value={formData.toteQuantity}
                  onChange={handleInputChange}
                />
              </div> */}
            </div>
          </div>
        </div>
        
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
