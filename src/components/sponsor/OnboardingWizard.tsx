
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import CauseSelectionStep from './wizard/CauseSelectionStep';
import ToteQuantityStep from './wizard/ToteQuantityStep';
import LogoUploadStep from './wizard/LogoUploadStep';
import DistributionInfoStep from './wizard/DistributionInfoStep';
import ConfirmationStep from './wizard/ConfirmationStep';
import axios from 'axios';

interface OnboardingWizardProps {
  initialCauseId?: string | null;
  onComplete: (formData: any) => void;
  isSubmitting: boolean;
}

const OnboardingWizard = ({ 
  initialCauseId, 
  onComplete,
  isSubmitting
}: OnboardingWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [causeData, setCauseData] = useState<any>(null);
  const [claimedTotes, setClaimedTotes] = useState(0);
  const [formData, setFormData] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    selectedCause: initialCauseId || '',
    toteQuantity: 50,
    distributionType: 'online' as 'online' | 'physical', // Default to online distribution
    numberOfTotes: 50,
    logoUrl: '',
    message: '',
    distributionPoints: {} as {
      [city: string]: {
        malls: { name: string; totes: number; selected: boolean }[];
        parks: { name: string; totes: number; selected: boolean }[];
        theatres: { name: string; totes: number; selected: boolean }[];
        metroStations: { name: string; totes: number; selected: boolean }[];
        schools: { name: string; totes: number; selected: boolean }[];
      };
    },
    selectedCities: [] as string[],
    distributionStartDate: new Date(),
    distributionEndDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Default to 30 days from now
    distributionDate: undefined,
    // Add fields for physical distribution
    distributionPointName: '',
    distributionPointAddress: '',
    distributionPointContact: '',
    distributionPointPhone: '',
    distributionPointLocation: '',
    // Add fields for physical distribution locations
    selectedMalls: [] as string[],
    selectedMetroStations: [] as string[],
    selectedAirports: [] as string[],
    selectedSchools: [] as string[],
    shippingAddress: '',
    shippingContactName: '',
    shippingPhone: '',
    shippingInstructions: '',
    demographics: {
      ageGroups: [],
      income: '',
      education: '',
      other: '',
    },
  });

  const handleFormUpdate = (data: Partial<any>) => {
    // Handle special case for toteQuantity to sync with distribution points
    if (data.toteQuantity !== undefined && 
        formData.distributionType === 'physical' && 
        formData.distributionPoints && 
        Object.keys(formData.distributionPoints).length > 0) {
      
      // Calculate current total totes in distribution points
      const currentTotalTotes = calculateTotalTotes();
      
      // Only adjust if there's a difference to avoid infinite loops
      if (currentTotalTotes !== data.toteQuantity) {
        // Calculate scale factor to adjust all distribution points
        const scaleFactor = data.toteQuantity / (currentTotalTotes || 1);
        
        // Create a deep copy of the distribution points
        const updatedDistributionPoints = JSON.parse(JSON.stringify(formData.distributionPoints));
        
        // Scale all tote values proportionally
        Object.entries(updatedDistributionPoints).forEach(([city, categories]: [string, any]) => {
          Object.entries(categories).forEach(([category, points]: [string, any]) => {
            points.forEach((point: any, index: number) => {
              if (point.selected) {
                // Scale the totes, ensuring at least 10 totes per location
                updatedDistributionPoints[city][category][index].totes = 
                  Math.max(10, Math.round(point.totes * scaleFactor));
              }
            });
          });
        });
        
        // Update form data with both the new quantity and scaled distribution points
        setFormData(prev => ({
          ...prev,
          ...data,
          distributionPoints: updatedDistributionPoints
        }));
        return;
      }
    }
    
    // Handle special case for distributionPoints to sync with toteQuantity
    if (data.distributionPoints && formData.distributionType === 'physical') {
      // Calculate the new total based on the updated distribution points
      const newTotal = calculateTotalTotesFromData(data.distributionPoints);
      
      // Update both distributionPoints and toteQuantity
      setFormData(prev => ({
        ...prev,
        ...data,
        toteQuantity: newTotal || prev.toteQuantity
      }));
      return;
    }
    
    // Default case: just update the data
    setFormData(prev => ({ ...prev, ...data }));
  };

  // Helper function to calculate total totes from distribution points data
  const calculateTotalTotesFromData = (distributionPoints: any) => {
    if (!distributionPoints || typeof distributionPoints !== 'object') {
      return 0;
    }
    
    let calculatedTotal = 0;
    Object.entries(distributionPoints).forEach(([city, categories]: [string, any]) => {
      Object.entries(categories).forEach(([category, points]: [string, any]) => {
        points.forEach((point: any) => {
          if (point.selected) {
            calculatedTotal += point.totes;
          }
        });
      });
    });
    
    return calculatedTotal || 50;
  };

  const updateFormData = (data: Partial<typeof formData>) => {
    handleFormUpdate(data);
    
    // If the cause selection changes, fetch the new cause data
    if (data.selectedCause && data.selectedCause !== formData.selectedCause) {
      fetchCauseData(data.selectedCause);
    }
  };
  
  // Fetch cause data to get claimed totes information
  const fetchCauseData = async (causeId: string) => {
    if (!causeId) return;
    
    try {
      const response = await axios.get(`/api/causes/${causeId}`);
      setCauseData(response.data);
      setClaimedTotes(response.data.claimedTotes || 0);
    } catch (error) {
      console.error('Error fetching cause data:', error);
    }
  };
  
  // Fetch initial cause data if initialCauseId is provided
  useEffect(() => {
    if (initialCauseId) {
      fetchCauseData(initialCauseId);
    }
  }, [initialCauseId]);
  
  /**
   * Calculate total totes based on distribution type and settings
   * 
   * For online distribution: Uses the numberOfTotes field or defaults to 50
   * For physical distribution: Calculates based on selected distribution points
   *   - Schools: 400 totes per location
   *   - Malls: 800 totes per location
   *   - Metro Stations: 800 totes per location
   *   - Airports: 1000 totes per location
   *   - Custom locations: 10 totes per location
   * 
   * @returns {number} The calculated total number of totes
   */
  const calculateTotalTotes = () => {
    // For online distribution, use the toteQuantity directly
    if (formData.distributionType === 'online') {
      return formData.toteQuantity || 50;
    } 
    // For physical distribution, calculate based on selected distribution points
    else if (formData.distributionType === 'physical') {
      // Calculate total totes by summing up the count for each selected distribution point
      let calculatedTotal = 0;
      
      // Iterate through each city in the distributionPoints object
      if (formData.distributionPoints && typeof formData.distributionPoints === 'object') {
        Object.entries(formData.distributionPoints).forEach(([city, categories]: [string, any]) => {
          Object.entries(categories).forEach(([category, points]: [string, any]) => {
            points.forEach((point: any) => {
              if (point.selected) {
                calculatedTotal += point.totes;
              }
            });
          });
        });
      }
      
      // If no distribution points are selected, default to toteQuantity from form
      return calculatedTotal || formData.toteQuantity || 50;
    }
    
    // Default fallback value if no distribution type is selected
    return 50;
  };

  const totalSteps = 5; // Increased from 4 to 5
  const progressPercentage = (currentStep / totalSteps) * 100;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // Calculate the unit price and total amount
  const calculatePricing = () => {
    const unitPrice = 10; // $10 per tote
    const toteQuantity = calculateTotalTotes();
    const totalAmount = unitPrice * toteQuantity;
    
    return {
      unitPrice,
      totalAmount,
      toteQuantity
    };
  };

  const handleSubmit = () => {
    // Calculate pricing information
    const { unitPrice, totalAmount, toteQuantity } = calculatePricing();
    
    // Transform distributionPoints from array to the expected format for the API
    let transformedDistributionPoints = [];
    
    // If using physical distribution, transform the distribution points data structure
    if (formData.distributionType === 'physical' && formData.distributionPoints) {
      // Convert the complex city-based structure to a flat array of distribution points
      // as expected by the Sponsorship model
      if (Array.isArray(formData.distributionPoints)) {
        // If it's already an array, use it directly
        transformedDistributionPoints = formData.distributionPoints;
      } else {
        // If it's the city-based object structure from DistributionInfoStep
        // Extract distribution locations and convert to the format expected by the API
        Object.entries(formData.distributionPoints).forEach(([city, locations]) => {
          Object.entries(locations).forEach(([locationType, points]) => {
            points.forEach(point => {
              if (point.selected) {
                transformedDistributionPoints.push({
                  name: point.name,
                  address: `${city}, India`,
                  contactPerson: formData.contactName,
                  phone: formData.phone,
                  location: city,
                  totesCount: point.totes
                });
              }
            });
          });
        });
      }
    }
    
    // Use the calculated values in the form submission
    onComplete({
      ...formData,
      toteQuantity,
      unitPrice,
      totalAmount,
      distributionPoints: transformedDistributionPoints
    });
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium mb-2">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>


      {currentStep === 1 && (
        <CauseSelectionStep 
          formData={formData} 
          updateFormData={updateFormData} 
          causeData={causeData}
        />
      )}
      
      {currentStep === 2 && (
        <ToteQuantityStep
          formData={{
            ...formData,
            // Ensure toteQuantity is synced with distribution points for physical distribution
            toteQuantity: formData.distributionType === 'physical' ? 
              calculateTotalTotes() : formData.toteQuantity
          }}
          updateFormData={handleFormUpdate}
        />
      )}

      {currentStep === 3 && (
        <LogoUploadStep
          formData={formData}
          updateFormData={updateFormData}
        />
      )}

      {currentStep === 4 && (
        <DistributionInfoStep
          formData={formData}
          updateFormData={updateFormData}
        />
      )}

      {currentStep === 5 && (
        <ConfirmationStep
          formData={{
            ...formData,
            ...calculatePricing(),
            availableTotes: Math.max(0, calculateTotalTotes() - claimedTotes),
            claimedTotes: claimedTotes,
            // Ensure distribution type is passed
            distributionType: formData.distributionType,
            // Pass appropriate dates based on distribution type
            distributionStartDate: formData.distributionType === 'physical' ? formData.distributionStartDate : undefined,
            distributionEndDate: formData.distributionType === 'physical' ? formData.distributionEndDate : undefined,
            distributionDate: formData.distributionType === 'online' ? formData.distributionDate : undefined,
            // Transform distributionPoints to string array for ConfirmationStep
            distributionPoints: (() => {
              if (!formData.distributionPoints || typeof formData.distributionPoints !== 'object') {
                return [];
              }
              
              const points: string[] = [];
              
              // Convert the complex structure to a simple string array
              Object.entries(formData.distributionPoints).forEach(([city, categories]) => {
                Object.entries(categories).forEach(([categoryName, locationsList]) => {
                  locationsList.forEach(location => {
                    if (location.selected) {
                      points.push(`${location.name} (${city}) - ${location.totes} totes`);
                    }
                  });
                });
              });
              
              return points;
            })()
          }}
        />
      )}

      <div className="flex justify-between mt-8 pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStep === 1 || isSubmitting}
        >
          Back
        </Button>

        {currentStep < totalSteps ? (
          <Button onClick={nextStep}>
            Continue
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Complete Sponsorship'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizard;
