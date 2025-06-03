import React, { useState, useRef } from 'react';
import { format } from "date-fns";
import { CalendarIcon, Plus, Minus, MapPin, Building, Trees, Train, GraduationCap, Search, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DistributionInfoStepProps {
  formData: {
    distributionType?: 'online' | 'physical';
    campaignStartDate?: Date;
    campaignEndDate?: Date;
    selectedCities?: string[];
    toteQuantity: number; // Add toteQuantity to sync with distribution points
    distributionPoints?: {
      [city: string]: {
        malls: { name: string; totes: number; selected: boolean }[];
        parks: { name: string; totes: number; selected: boolean }[];
        theatres: { name: string; totes: number; selected: boolean }[];
        metroStations: { name: string; totes: number; selected: boolean }[];
        schools: { name: string; totes: number; selected: boolean }[];
      };
    };
  };
  updateFormData: (data: Partial<any>) => void;
}

// Indian cities with quick picks
const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
  'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
  'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
  'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar',
  'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad',
  'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur',
  'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubli-Dharwad'
];

const quickPickCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];

const distributionCategories = {
  malls: {
    name: 'Malls',
    defaultTotes: 400,
    icon: Building,
    color: 'text-blue-600',
    options: [
      'Phoenix MarketCity', 'Select CityWalk', 'DLF Mall', 'Inorbit Mall', 'Forum Mall',
      'Express Avenue', 'Palladium Mall', 'Ambience Mall', 'Nexus Mall', 'VR Mall'
    ]
  },
  parks: {
    name: 'Parks',
    defaultTotes: 600,
    icon: Trees,
    color: 'text-green-600',
    options: [
      'Central Park', 'Lodi Gardens', 'Cubbon Park', 'Sanjay Gandhi National Park', 'Hussain Sagar',
      'Marina Beach Park', 'Victoria Memorial Park', 'Law Garden', 'Rock Garden', 'Buddha Jayanti Park'
    ]
  },
  theatres: {
    name: 'Theatres',
    defaultTotes: 400,
    icon: MapPin,
    color: 'text-purple-600',
    options: [
      'PVR Cinemas', 'INOX', 'Cinepolis', 'Carnival Cinemas', 'Big Cinemas',
      'Fun Republic', 'MovieTime', 'Miraj Cinemas', 'Mukta A2', 'Wave Cinemas'
    ]
  },
  metroStations: {
    name: 'Metro Stations',
    defaultTotes: 800,
    icon: Train,
    color: 'text-orange-600',
    options: [
      'Rajiv Chowk Metro Station', 'Connaught Place Metro', 'MG Road Metro', 'Andheri Metro',
      'Bandra-Kurla Complex Metro', 'Mysore Road Metro', 'High Court Metro', 'Airport Metro',
      'City Centre Metro', 'Electronic City Metro'
    ]
  },
  schools: {
    name: 'Schools',
    defaultTotes: 400,
    icon: GraduationCap,
    color: 'text-red-600',
    options: [
      'Delhi Public School', 'Kendriya Vidyalaya', 'DAV School', 'Ryan International',
      'Bharatiya Vidya Bhavan', 'St. Xavier\'s School', 'Modern School', 'Sardar Patel Vidyalaya',
      'La Martiniere School', 'Bishop Cotton School'
    ]
  }
};

const DistributionInfoStep: React.FC<DistributionInfoStepProps> = ({
  formData,
  updateFormData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openCity, setOpenCity] = useState<string | null>(null);
  const [openCategory, setOpenCategory] = useState<{ city: string; category: string } | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredCities = indianCities.filter(city => 
    city.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !(formData.selectedCities || []).includes(city)
  );

  const handleDistributionTypeChange = (type: 'online' | 'physical') => {
    updateFormData({
      distributionType: type,
      campaignStartDate: undefined,
      campaignEndDate: undefined,
      selectedCities: [],
      distributionPoints: {}
    });
  };

  const handleCityAdd = (city: string) => {
    const currentCities = formData.selectedCities || [];
    const updatedCities = [...currentCities, city];
    updateFormData({ selectedCities: updatedCities });
    
    const updatedDistributionPoints = {
      ...formData.distributionPoints,
      [city]: {
        malls: distributionCategories.malls.options.map(name => ({ name, totes: distributionCategories.malls.defaultTotes, selected: false })),
        parks: distributionCategories.parks.options.map(name => ({ name, totes: distributionCategories.parks.defaultTotes, selected: false })),
        theatres: distributionCategories.theatres.options.map(name => ({ name, totes: distributionCategories.theatres.defaultTotes, selected: false })),
        metroStations: distributionCategories.metroStations.options.map(name => ({ name, totes: distributionCategories.metroStations.defaultTotes, selected: false })),
        schools: distributionCategories.schools.options.map(name => ({ name, totes: distributionCategories.schools.defaultTotes, selected: false }))
      }
    };
    updateFormData({ distributionPoints: updatedDistributionPoints });
    setSearchTerm('');
  };

  const handleCityRemove = (cityToRemove: string) => {
    const updatedCities = (formData.selectedCities || []).filter(city => city !== cityToRemove);
    updateFormData({ selectedCities: updatedCities });
    
    const updatedDistributionPoints = { ...formData.distributionPoints };
    delete updatedDistributionPoints[cityToRemove];
    updateFormData({ distributionPoints: updatedDistributionPoints });
    
    if (openCity === cityToRemove) {
      setOpenCity(null);
      setOpenCategory(null);
    }
  };

  const handleLocationToggle = (city: string, category: string, locationIndex: number) => {
    const currentPoints = formData.distributionPoints || {};
    const cityPoints = currentPoints[city];
    if (!cityPoints) return;

    const updatedCategoryPoints = [...cityPoints[category as keyof typeof cityPoints]];
    updatedCategoryPoints[locationIndex] = {
      ...updatedCategoryPoints[locationIndex],
      selected: !updatedCategoryPoints[locationIndex].selected
    };

    updateFormData({
      distributionPoints: {
        ...currentPoints,
        [city]: {
          ...cityPoints,
          [category]: updatedCategoryPoints
        }
      }
    });
  };

  const handleToteChange = (city: string, category: string, locationIndex: number, newTotes: number) => {
    const currentPoints = formData.distributionPoints || {};
    const cityPoints = currentPoints[city];
    if (!cityPoints) return;

    const minTotes = distributionCategories[category as keyof typeof distributionCategories].defaultTotes;
    const finalTotes = Math.max(newTotes, minTotes);

    const updatedCategoryPoints = [...cityPoints[category as keyof typeof cityPoints]];
    updatedCategoryPoints[locationIndex] = {
      ...updatedCategoryPoints[locationIndex],
      totes: finalTotes
    };

    updateFormData({
      distributionPoints: {
        ...currentPoints,
        [city]: {
          ...cityPoints,
          [category]: updatedCategoryPoints
        }
      }
    });
  };

  const getTotalSelectedLocations = (city: string) => {
    const cityPoints = formData.distributionPoints?.[city];
    if (!cityPoints) return 0;
    
    return Object.values(cityPoints).reduce((total, locations) => {
      return total + locations.filter(loc => loc.selected).length;
    }, 0);
  };

  const getTotalTotes = (city: string) => {
    let total = 0;
    if (formData.distributionPoints?.[city]) {
      Object.values(formData.distributionPoints[city]).forEach(points => {
        points.forEach(point => {
          if (point.selected) total += point.totes;
        });
      });
    }
    return total;
  };

  const getOverallTotals = () => {
    let totalTotes = 0;
    let totalLocations = 0;
    let totalCities = 0;
    
    if (formData.distributionPoints) {
      totalCities = Object.keys(formData.distributionPoints).length;
      
      Object.entries(formData.distributionPoints).forEach(([city, categories]) => {
        Object.values(categories).forEach(points => {
          points.forEach(point => {
            if (point.selected) {
              totalTotes += point.totes;
              totalLocations++;
            }
          });
        });
      });
    }
    
    return { totalTotes, totalLocations, totalCities };
  };

  React.useEffect(() => {
    const { totalTotes } = getOverallTotals();
    
    // Only update if there's a significant difference to avoid infinite loops
    if (totalTotes > 0 && Math.abs(totalTotes - formData.toteQuantity) > 5) {
      updateFormData({ toteQuantity: totalTotes });
    }
  }, [formData.distributionPoints]);

  const { totalTotes, totalLocations, totalCities } = getOverallTotals();

  const handleCityAccordionToggle = (city: string) => {
    setOpenCity(openCity === city ? null : city);
    setOpenCategory(null);
  };

  const handleCategoryAccordionToggle = (city: string, category: string) => {
    const newCategoryKey = `${city}-${category}`;
    const currentKey = openCategory ? `${openCategory.city}-${openCategory.category}` : null;
    
    setOpenCategory(
      currentKey === newCategoryKey ? null : { city, category }
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Distribution Information</h2>
        <p className="text-gray-600 mb-6">
          Choose how you want to distribute your totes to reach your target audience
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Distribution Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution Type</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={formData.distributionType || ''}
              onValueChange={handleDistributionTypeChange}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online" className="cursor-pointer font-medium">
                  Online Campaign
                  <p className="text-sm text-gray-500 font-normal">Digital distribution with date range</p>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="physical" id="physical" />
                <Label htmlFor="physical" className="cursor-pointer font-medium">
                  Physical Distribution
                  <p className="text-sm text-gray-500 font-normal">Real-world locations in Indian cities</p>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Online Distribution Fields */}
        {formData.distributionType === 'online' && (
          <Card>
            <CardHeader>
              <CardTitle>Campaign Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Campaign Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left",
                          !formData.campaignStartDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.campaignStartDate ? (
                          format(formData.campaignStartDate, "PPP")
                        ) : (
                          <span>Pick start date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.campaignStartDate}
                        onSelect={(date) => updateFormData({ campaignStartDate: date })}
                        initialFocus
                        className="p-3"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Campaign End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left",
                          !formData.campaignEndDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.campaignEndDate ? (
                          format(formData.campaignEndDate, "PPP")
                        ) : (
                          <span>Pick end date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.campaignEndDate}
                        onSelect={(date) => updateFormData({ campaignEndDate: date })}
                        initialFocus
                        className="p-3"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Physical Distribution Fields */}
        {formData.distributionType === 'physical' && (
          <div className="space-y-6">
            {/* City Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Cities</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose the cities where you want to distribute totes
                </p>
              </CardHeader>
              <CardContent>
                {/* Quick Pick Cities */}
                <div className="mb-4">
                  <Label className="text-sm font-medium mb-2 block">Quick Pick Cities</Label>
                  <div className="flex flex-wrap gap-2">
                    {quickPickCities.map((city) => (
                      <Button
                        key={city}
                        variant="outline"
                        size="sm"
                        onClick={() => handleCityAdd(city)}
                        disabled={(formData.selectedCities || []).includes(city)}
                        className="text-xs"
                      >
                        + {city}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Search Input */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Search Cities</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search for cities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    {searchTerm && filteredCities.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {filteredCities.slice(0, 8).map((city) => (
                          <button
                            key={city}
                            onClick={() => handleCityAdd(city)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Cities as Chips */}
                {formData.selectedCities && formData.selectedCities.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium mb-2 block">Selected Cities</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.selectedCities.map((city) => (
                        <Badge key={city} variant="secondary" className="px-2 py-1">
                          {city}
                          <button
                            onClick={() => handleCityRemove(city)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Distribution Points for Selected Cities - Full Width */}
            {formData.selectedCities && formData.selectedCities.length > 0 && (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Distribution Points & Tote Allocation</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Select specific locations and customize tote quantities for each city
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {formData.selectedCities.map((city) => (
                      <div key={city} className="border rounded-lg">
                        {/* City Header */}
                        <button
                          onClick={() => handleCityAccordionToggle(city)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
                          aria-expanded={openCity === city}
                          aria-controls={`city-${city}-content`}
                        >
                          <div className="flex items-center space-x-3">
                            <ChevronDown 
                              className={cn(
                                "h-4 w-4 transition-transform",
                                openCity === city && "rotate-180"
                              )}
                            />
                            <span className="font-medium">{city}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {getTotalSelectedLocations(city)} locations • {getTotalTotes(city)} totes
                          </Badge>
                        </button>

                        {/* City Content */}
                        {openCity === city && (
                          <div id={`city-${city}-content`} className="px-4 pb-4 space-y-2">
                            {Object.entries(distributionCategories).map(([categoryKey, category]) => {
                              const Icon = category.icon;
                              const cityPoints = formData.distributionPoints?.[city];
                              const categoryPoints = cityPoints?.[categoryKey as keyof typeof cityPoints] || [];
                              const selectedCount = categoryPoints.filter(point => point.selected).length;
                              const isOpen = openCategory?.city === city && openCategory?.category === categoryKey;
                              
                              return (
                                <div key={categoryKey} className="border rounded-lg">
                                  {/* Category Header */}
                                  <button
                                    onClick={() => handleCategoryAccordionToggle(city, categoryKey)}
                                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                                    aria-expanded={isOpen}
                                    aria-controls={`category-${city}-${categoryKey}-content`}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <ChevronDown 
                                        className={cn(
                                          "h-3 w-3 transition-transform",
                                          isOpen && "rotate-180"
                                        )}
                                      />
                                      <Icon className={`h-4 w-4 ${category.color}`} />
                                      <span className="text-sm font-medium">{category.name}</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      {selectedCount} selected
                                    </Badge>
                                  </button>

                                  {/* Category Content */}
                                  {isOpen && (
                                    <div id={`category-${city}-${categoryKey}-content`} className="px-3 pb-3 space-y-2">
                                      {categoryPoints.map((point, index) => (
                                        <div key={index} className={cn(
                                          "flex items-center justify-between p-2 border rounded",
                                          point.selected ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                                        )}>
                                          <div className="flex items-center space-x-2">
                                            <Checkbox 
                                              id={`${city}-${categoryKey}-${index}`}
                                              checked={point.selected}
                                              onCheckedChange={() => handleLocationToggle(city, categoryKey, index)}
                                            />
                                            <Label
                                              htmlFor={`${city}-${categoryKey}-${index}`}
                                              className="text-xs cursor-pointer"
                                            >
                                              {point.name}
                                            </Label>
                                          </div>
                                          {point.selected && (
                                            <div className="flex items-center space-x-1">
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToteChange(city, categoryKey, index, point.totes - 50)}
                                                disabled={point.totes <= category.defaultTotes}
                                                className="h-6 w-6 p-0"
                                              >
                                                <Minus className="h-2 w-2" />
                                              </Button>
                                              <Input
                                                type="number"
                                                value={point.totes}
                                                onChange={(e) => handleToteChange(city, categoryKey, index, parseInt(e.target.value) || category.defaultTotes)}
                                                className="w-16 h-6 text-xs text-center p-1"
                                                min={category.defaultTotes}
                                              />
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToteChange(city, categoryKey, index, point.totes + 50)}
                                                className="h-6 w-6 p-0"
                                              >
                                                <Plus className="h-2 w-2" />
                                              </Button>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Summary Card - Full Width on Mobile */}
            {totalCities > 0 && (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-lg">Distribution Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{totalTotes.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Totes</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{totalCities}</div>
                      <div className="text-sm text-gray-600">Cities</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{totalLocations}</div>
                      <div className="text-sm text-gray-600">Locations</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Selected Cities</Label>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {formData.selectedCities?.map((city) => (
                        <div key={city} className="flex justify-between text-xs p-2 bg-gray-50 rounded">
                          <span>{city}</span>
                          <span className="text-gray-500">{getTotalTotes(city)} totes</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DistributionInfoStep;
