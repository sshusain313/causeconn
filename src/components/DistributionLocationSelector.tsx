import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  VStack,
  HStack,
  Badge,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  CardFooter
} from '@chakra-ui/react';
import config from '../config';

// Types
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface DistributionLocation {
  _id: string;
  name: string;
  type: 'mall' | 'metro_station' | 'airport' | 'school' | 'other';
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  totesCount: number;
  isActive: boolean;
  openingHours?: string;
  distributionInstructions?: string;
  coordinates?: Coordinates;
  createdAt: string;
  updatedAt: string;
}

interface SelectedLocation {
  location: string; // location ID
  quantity: number;
  notes?: string;
}

interface DistributionLocationSelectorProps {
  onChange: (locations: SelectedLocation[]) => void;
  value?: SelectedLocation[];
  totalTotes: number;
}

const DistributionLocationSelector: React.FC<DistributionLocationSelectorProps> = ({
  onChange,
  value = [],
  totalTotes
}) => {
  const toast = useToast();
  const [selectedTab, setSelectedTab] = useState<string>('mall');
  const [selectedLocations, setSelectedLocations] = useState<SelectedLocation[]>(value);
  const [remainingTotes, setRemainingTotes] = useState<number>(totalTotes);

  // Fetch location types
  const { data: locationTypes } = useQuery('locationTypes', async () => {
    const response = await axios.get(`${config.apiUrl}/distribution-locations/types`);
    return response.data.data;
  });

  // Fetch distribution locations
  const { data: locations, isLoading, error } = useQuery(
    ['distributionLocations'],
    async () => {
      console.log('Fetching distribution locations...');
      const response = await axios.get(`${config.apiUrl}/distribution-locations`);
      console.log('Distribution locations response:', response.data);
      return response.data.data;
    }
  );

  // Calculate remaining totes whenever selected locations change
  useEffect(() => {
    const totalSelected = selectedLocations.reduce((sum, item) => sum + item.quantity, 0);
    setRemainingTotes(totalTotes - totalSelected);
  }, [selectedLocations, totalTotes]);

  // Update parent component when selections change
  useEffect(() => {
    onChange(selectedLocations);
  }, [selectedLocations, onChange]);

  // Group locations by type
  const locationsByType = locations?.reduce((acc: Record<string, DistributionLocation[]>, location: DistributionLocation) => {
    if (!acc[location.type]) {
      acc[location.type] = [];
    }
    acc[location.type].push(location);
    return acc;
  }, {});

  const handleLocationSelect = (location: DistributionLocation) => {
    // Check if location is already selected
    const existingIndex = selectedLocations.findIndex(item => item.location === location._id);
    
    if (existingIndex >= 0) {
      // Remove location if already selected
      const newSelectedLocations = [...selectedLocations];
      newSelectedLocations.splice(existingIndex, 1);
      setSelectedLocations(newSelectedLocations);
    } else {
      // Add location with default quantity of 1
      if (remainingTotes <= 0) {
        toast({
          title: 'No totes remaining',
          description: 'You have allocated all available totes. Remove some allocations to add more locations.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      
      setSelectedLocations([
        ...selectedLocations,
        {
          location: location._id,
          quantity: 1,
          notes: ''
        }
      ]);
    }
  };

  const handleQuantityChange = (locationId: string, quantity: number) => {
    const currentLocation = selectedLocations.find(item => item.location === locationId);
    const currentQuantity = currentLocation?.quantity || 0;
    
    // Calculate how many more totes this change would use
    const quantityDifference = quantity - currentQuantity;
    
    // Check if we have enough remaining totes
    if (remainingTotes < quantityDifference) {
      toast({
        title: 'Not enough totes',
        description: `You only have ${remainingTotes} totes remaining to allocate.`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    // Update the quantity
    setSelectedLocations(
      selectedLocations.map(item => 
        item.location === locationId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const handleNotesChange = (locationId: string, notes: string) => {
    setSelectedLocations(
      selectedLocations.map(item => 
        item.location === locationId 
          ? { ...item, notes } 
          : item
      )
    );
  };

  const isLocationSelected = (locationId: string) => {
    return selectedLocations.some(item => item.location === locationId);
  };

  const getLocationQuantity = (locationId: string) => {
    const location = selectedLocations.find(item => item.location === locationId);
    return location?.quantity || 0;
  };

  const getLocationNotes = (locationId: string) => {
    const location = selectedLocations.find(item => item.location === locationId);
    return location?.notes || '';
  };

  const getLocationById = (locationId: string) => {
    return locations?.find((loc: DistributionLocation) => loc._id === locationId);
  };

  if (isLoading) {
    return <Text>Loading distribution locations...</Text>;
  }

  if (error) {
    return <Text color="red.500">Error loading distribution locations</Text>;
  }

  return (
    <Box>
      <Heading size="md" mb={4}>Select Distribution Locations</Heading>
      
      <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
        <Box flex="2" borderWidth="1px" borderRadius="lg" p={4}>
          <Tabs onChange={(index) => setSelectedTab(locationTypes?.[index] || 'mall')}>
            <TabList>
              {locationTypes?.map((type: string) => (
                <Tab key={type}>
                  {type.replace('_', ' ').toUpperCase()} ({locationsByType?.[type]?.length || 0})
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {locationTypes?.map((type: string) => (
                <TabPanel key={type} p={4}>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {locationsByType?.[type]?.map((location: DistributionLocation) => (
                      <Card 
                        key={location._id}
                        borderWidth="1px"
                        borderColor={isLocationSelected(location._id) ? "teal.500" : "gray.200"}
                        boxShadow={isLocationSelected(location._id) ? "0 0 0 2px teal" : "md"}
                        cursor="pointer"
                        onClick={() => handleLocationSelect(location)}
                      >
                        <CardHeader pb={2}>
                          <Heading size="sm">{location.name}</Heading>
                          <Badge mt={1} colorScheme={location.type === 'mall' ? 'blue' : location.type === 'metro_station' ? 'purple' : location.type === 'airport' ? 'orange' : 'green'}>
                            {location.type.replace('_', ' ')}
                          </Badge>
                        </CardHeader>
                        <CardBody py={2}>
                          {location.address && (
                            <Text fontSize="sm" color="gray.600">{location.address}</Text>
                          )}
                          {location.city && (
                            <Text fontSize="sm" color="gray.600">{location.city}, {location.state}</Text>
                          )}
                          {location.openingHours && (
                            <Text fontSize="xs" mt={1}>Hours: {location.openingHours}</Text>
                          )}
                        </CardBody>
                        <CardFooter pt={2}>
                          <Checkbox 
                            isChecked={isLocationSelected(location._id)}
                            onChange={(e) => e.stopPropagation()}
                            colorScheme="teal"
                          >
                            {isLocationSelected(location._id) ? 'Selected' : 'Select'}
                          </Checkbox>
                        </CardFooter>
                      </Card>
                    ))}
                  </SimpleGrid>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>

        <Box flex="1" borderWidth="1px" borderRadius="lg" p={4}>
          <Heading size="sm" mb={4}>Selected Locations ({selectedLocations.length})</Heading>
          
          <Text fontWeight="bold" mb={2}>
            Totes Remaining: <Badge colorScheme={remainingTotes > 0 ? "green" : "red"} fontSize="md">{remainingTotes}</Badge> of {totalTotes}
          </Text>
          
          <Divider my={4} />
          
          {selectedLocations.length === 0 ? (
            <Text color="gray.500">No locations selected. Click on locations to select them.</Text>
          ) : (
            <VStack spacing={4} align="stretch">
              {selectedLocations.map(item => {
                const location = getLocationById(item.location);
                return location ? (
                  <Box key={item.location} p={3} borderWidth="1px" borderRadius="md">
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">{location.name}</Text>
                        <Badge size="sm">{location.type.replace('_', ' ')}</Badge>
                      </VStack>
                      <Button 
                        size="sm" 
                        colorScheme="red" 
                        variant="ghost"
                        onClick={() => handleLocationSelect(location)}
                      >
                        Remove
                      </Button>
                    </Flex>
                    
                    <FormControl mt={3}>
                      <FormLabel fontSize="sm">Quantity</FormLabel>
                      <NumberInput 
                        min={1} 
                        max={totalTotes} 
                        value={getLocationQuantity(item.location)}
                        onChange={(_, value) => handleQuantityChange(item.location, value)}
                        size="sm"
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    
                    <FormControl mt={2}>
                      <FormLabel fontSize="sm">Notes</FormLabel>
                      <Input 
                        size="sm"
                        value={getLocationNotes(item.location)}
                        onChange={(e) => handleNotesChange(item.location, e.target.value)}
                        placeholder="Special instructions for this location"
                      />
                    </FormControl>
                  </Box>
                ) : null;
              })}
            </VStack>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default DistributionLocationSelector;
