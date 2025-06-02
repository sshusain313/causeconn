import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  Badge,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Checkbox,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import config from '../../config';

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

type LocationFormData = Omit<DistributionLocation, '_id' | 'createdAt' | 'updatedAt'>;

const initialFormData: LocationFormData = {
  name: '',
  type: 'mall',
  address: '',
  city: 'Hyderabad',
  state: 'Telangana',
  zipCode: '',
  contactPerson: '',
  phone: '',
  email: '',
  totesCount: 0,
  isActive: true,
  openingHours: '',
  distributionInstructions: '',
  coordinates: {
    latitude: 0,
    longitude: 0,
  },
};

const DistributionLocations: React.FC = () => {
  const { token } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedLocationType, setSelectedLocationType] = useState<string>('all');
  const [formData, setFormData] = useState<LocationFormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch location types
  const { data: locationTypes } = useQuery('locationTypes', async () => {
    const response = await axios.get(`${config.apiUrl}/distribution-locations/types`);
    return response.data.data;
  });

  // Fetch distribution locations
  const { data: locations, isLoading, error } = useQuery(
    ['distributionLocations', selectedLocationType],
    async () => {
      console.log('Fetching distribution locations...');
      const url = selectedLocationType === 'all'
        ? `${config.apiUrl}/distribution-locations`
        : `${config.apiUrl}/distribution-locations/type/${selectedLocationType}`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('Distribution locations response:', response.data);
      return response.data.data;
    }
  );

  // Create location mutation
  const createLocation = useMutation(
    async (data: LocationFormData) => {
      console.log('Creating location with data:', data);
      const response = await axios.post(
        `${config.apiUrl}/distribution-locations`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('distributionLocations');
        toast({
          title: 'Location created',
          description: 'The distribution location has been created successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        resetForm();
        onClose();
      },
      onError: (error: any) => {
        console.error('Error creating location:', error);
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to create location',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      },
    }
  );

  // Update location mutation
  const updateLocation = useMutation(
    async ({ id, data }: { id: string; data: LocationFormData }) => {
      console.log('Updating location with data:', data);
      const response = await axios.put(
        `${config.apiUrl}/distribution-locations/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('distributionLocations');
        toast({
          title: 'Location updated',
          description: 'The distribution location has been updated successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        resetForm();
        onClose();
      },
      onError: (error: any) => {
        console.error('Error updating location:', error);
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to update location',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      },
    }
  );

  // Delete location mutation
  const deleteLocation = useMutation(
    async (id: string) => {
      console.log('Deleting location with id:', id);
      const response = await axios.delete(
        `${config.apiUrl}/distribution-locations/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('distributionLocations');
        toast({
          title: 'Location deleted',
          description: 'The distribution location has been deleted successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      },
      onError: (error: any) => {
        console.error('Error deleting location:', error);
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to delete location',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      },
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name.startsWith('coordinates.')) {
      const coordField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [coordField]: parseFloat(value) || 0,
        },
      }));
    } else if (name === 'totesCount') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      updateLocation.mutate({ id: editingId, data: formData });
    } else {
      createLocation.mutate(formData);
    }
  };

  const handleEdit = (location: DistributionLocation) => {
    setEditingId(location._id);
    setFormData({
      name: location.name,
      type: location.type,
      address: location.address || '',
      city: location.city || '',
      state: location.state || '',
      zipCode: location.zipCode || '',
      contactPerson: location.contactPerson || '',
      phone: location.phone || '',
      email: location.email || '',
      totesCount: location.totesCount,
      isActive: location.isActive,
      openingHours: location.openingHours || '',
      distributionInstructions: location.distributionInstructions || '',
      coordinates: location.coordinates || { latitude: 0, longitude: 0 },
    });
    onOpen();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      deleteLocation.mutate(id);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
  };

  const handleAddNew = () => {
    resetForm();
    onOpen();
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
  };

  // Group locations by type
  const locationsByType = locations?.reduce((acc: Record<string, DistributionLocation[]>, location: DistributionLocation) => {
    if (!acc[location.type]) {
      acc[location.type] = [];
    }
    acc[location.type].push(location);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={5}>
        <Heading as="h1" mb={5}>Distribution Locations</Heading>
        <Text>Loading...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={5}>
        <Heading as="h1" mb={5}>Distribution Locations</Heading>
        <Text color="red.500">Error loading distribution locations</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={5}>
      <Heading as="h1" mb={5}>Distribution Locations</Heading>
      
      <Stack direction="row" spacing={4} mb={5} align="center">
        <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={handleAddNew}>
          Add New Location
        </Button>
        
        <FormControl w="200px">
          <Select
            value={selectedLocationType}
            onChange={(e) => setSelectedLocationType(e.target.value)}
          >
            <option value="all">All Locations</option>
            {locationTypes?.map((type: string) => (
              <option key={type} value={type}>
                {type.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Tabs>
        <TabList>
          <Tab>All ({locations?.length || 0})</Tab>
          {locationTypes?.map((type: string) => (
            <Tab key={type}>
              {type.replace('_', ' ').toUpperCase()} ({locationsByType?.[type]?.length || 0})
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Type</Th>
                    <Th>City</Th>
                    <Th>Totes Count</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {locations?.map((location: DistributionLocation) => (
                    <Tr key={location._id}>
                      <Td>{location.name}</Td>
                      <Td>{location.type.replace('_', ' ').toUpperCase()}</Td>
                      <Td>{location.city}</Td>
                      <Td>{location.totesCount}</Td>
                      <Td>
                        <Badge colorScheme={location.isActive ? 'green' : 'red'}>
                          {location.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </Td>
                      <Td>
                        <IconButton
                          aria-label="Edit"
                          icon={<FaEdit />}
                          size="sm"
                          mr={2}
                          onClick={() => handleEdit(location)}
                        />
                        <IconButton
                          aria-label="Delete"
                          icon={<FaTrash />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(location._id)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>

          {locationTypes?.map((type: string) => (
            <TabPanel key={type}>
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>City</Th>
                      <Th>Totes Count</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {locationsByType?.[type]?.map((location: DistributionLocation) => (
                      <Tr key={location._id}>
                        <Td>{location.name}</Td>
                        <Td>{location.city}</Td>
                        <Td>{location.totesCount}</Td>
                        <Td>
                          <Badge colorScheme={location.isActive ? 'green' : 'red'}>
                            {location.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </Td>
                        <Td>
                          <IconButton
                            aria-label="Edit"
                            icon={<FaEdit />}
                            size="sm"
                            mr={2}
                            onClick={() => handleEdit(location)}
                          />
                          <IconButton
                            aria-label="Delete"
                            icon={<FaTrash />}
                            size="sm"
                            colorScheme="red"
                            onClick={() => handleDelete(location._id)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      {/* Add/Edit Location Modal */}
      <Modal isOpen={isOpen} onClose={handleModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingId ? 'Edit Distribution Location' : 'Add New Distribution Location'}
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Location name"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Type</FormLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    {locationTypes?.map((type: string) => (
                      <option key={type} value={type}>
                        {type.replace('_', ' ').toUpperCase()}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Address</FormLabel>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>City</FormLabel>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>State</FormLabel>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Zip Code</FormLabel>
                  <Input
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="Zip Code"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Contact Person</FormLabel>
                  <Input
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    placeholder="Contact Person"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    type="email"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Totes Count</FormLabel>
                  <Input
                    name="totesCount"
                    value={formData.totesCount}
                    onChange={handleInputChange}
                    placeholder="Totes Count"
                    type="number"
                    min="0"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Opening Hours</FormLabel>
                  <Input
                    name="openingHours"
                    value={formData.openingHours}
                    onChange={handleInputChange}
                    placeholder="Opening Hours"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Checkbox
                    name="isActive"
                    isChecked={formData.isActive}
                    onChange={handleInputChange}
                  >
                    Active
                  </Checkbox>
                </FormControl>
              </Grid>

              <FormControl mt={4}>
                <FormLabel>Distribution Instructions</FormLabel>
                <Input
                  name="distributionInstructions"
                  value={formData.distributionInstructions}
                  onChange={handleInputChange}
                  placeholder="Distribution Instructions"
                />
              </FormControl>

              <Divider my={4} />

              <Heading as="h4" size="md" mb={2}>
                Coordinates
              </Heading>

              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                <FormControl>
                  <FormLabel>Latitude</FormLabel>
                  <Input
                    name="coordinates.latitude"
                    value={formData.coordinates?.latitude || 0}
                    onChange={handleInputChange}
                    placeholder="Latitude"
                    type="number"
                    step="0.000001"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Longitude</FormLabel>
                  <Input
                    name="coordinates.longitude"
                    value={formData.coordinates?.longitude || 0}
                    onChange={handleInputChange}
                    placeholder="Longitude"
                    type="number"
                    step="0.000001"
                  />
                </FormControl>
              </Grid>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleModalClose}>
                Cancel
              </Button>
              <Button
                colorScheme="teal"
                type="submit"
                isLoading={createLocation.isLoading || updateLocation.isLoading}
              >
                {editingId ? 'Update' : 'Create'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default DistributionLocations;
