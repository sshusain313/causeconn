
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Heart, Users, Target, Globe, Calendar, Tag, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import axios from 'axios';
import config from '@/config';

const CreateCause = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    targetAmount: '',
    location: '',
    category: '',
    tags: [] as string[],
    currentTag: ''
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Education',
    'Healthcare',
    'Environment',
    'Poverty Relief',
    'Disaster Relief',
    'Animal Welfare',
    'Community Development',
    'Human Rights',
    'Technology Access',
    'Arts & Culture'
  ];
  
  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.description || !formData.category || 
        !formData.targetAmount) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Check all possible token storage locations
      const token = localStorage.getItem('token') || 
                   localStorage.getItem('authToken') || 
                   localStorage.getItem('jwtToken') || 
                   sessionStorage.getItem('token');
      
      console.log('Found authentication token:', token ? 'Yes' : 'No');
      
      let response;
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('targetAmount', formData.targetAmount);
      formDataToSend.append('location', formData.location || '');
      formDataToSend.append('category', formData.category);
      
      // If we have an image file, append it to the form data
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      } else if (formData.imageUrl) {
        // If no file but URL provided, use the URL
        formDataToSend.append('imageUrl', formData.imageUrl);
      }
      
      console.log('Sending cause data with image');
      
      // Log the API URL being used
      console.log('Creating cause using API URL:', `${config.apiUrl}/causes`);
      console.log('Config details:', {
        apiUrl: config.apiUrl,
        isProduction: config.isProduction,
        hostname: window.location.hostname
      });
      
      try {
        // Use axios instead of fetch for better CORS handling
        console.log('Sending request to:', `${config.apiUrl}/causes`);
        console.log('With token:', token ? 'Bearer token present' : 'No token');
        
        // Create a detailed log of what we're about to send
        console.log('Request details:', {
          url: `${config.apiUrl}/causes`,
          method: 'POST',
          headers: {
            'Authorization': token ? 'Bearer token present' : 'No token',
            'Accept': 'application/json'
          },
          withCredentials: true
        });
        
        // Use axios instead of fetch
        const fetchResponse = await axios.post(`${config.apiUrl}/causes`, formDataToSend, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            // Note: Do not set Content-Type when sending FormData
            // Axios will set it automatically with the correct boundary
            'Accept': 'application/json'
          },
          withCredentials: true // This enables sending cookies with cross-origin requests
        });
        
        // Log the response details for debugging
        console.log('Response status:', fetchResponse.status);
        console.log('Response headers:', fetchResponse.headers);
        console.log('Response data:', fetchResponse.data);
        
        // With axios, the response is already parsed as JSON
        // and status codes are handled automatically
        
        // Convert to a format compatible with our existing code
        response = {
          status: fetchResponse.status,
          data: fetchResponse.data
        };
        
        console.log('API response:', response);
      } catch (error) {
        console.error('Error sending request:', error);
        toast({
          title: 'Connection Error',
          description: 'Could not connect to the server. Please try again later.',
          variant: 'destructive'
        });
        setIsSubmitting(false);
        return;
      }
      
      if (response && response.status === 201) {
        toast({
          title: 'Cause Created!',
          description: 'Your cause has been submitted for review. You will be notified once it\'s approved.'
        });
        
        // Navigate to the cause detail page or causes list
        navigate('/causes');
      }
    } catch (error: any) {
      console.error('Error creating cause:', error);
      
      // Log detailed error information for debugging
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: error.config
      });
      
      // Handle different types of errors
      if (error.message.includes('Network Error') || error.message.includes('CORS')) {
        toast({
          title: 'CORS Error',
          description: 'There was a cross-origin request issue. Please try again or contact support.',
          variant: 'destructive'
        });
      } else if (error.response?.status === 401) {
        toast({
          title: 'Authentication Error',
          description: 'You must be logged in to create a cause. Please log in and try again.',
          variant: 'destructive'
        });
        // Redirect to login page
        navigate('/login');
      } else if (error.response?.status === 400) {
        toast({
          title: 'Validation Error',
          description: error.response.data.message || 'Please check your form inputs and try again.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to create cause. Please try again.',
          variant: 'destructive'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const addTag = () => {
    if (formData.currentTag.trim() && !formData.tags.includes(formData.currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.currentTag.trim()],
        currentTag: ''
      }));
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <Layout>
      <main className="max-w-4xl mx-auto py-16 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Create a Cause</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have a cause that needs support? Share your story and connect with sponsors who want to make a difference.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold mb-2">Make an Impact</h3>
            <p className="text-sm text-gray-600">Turn your passion into positive change</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold mb-2">Find Sponsors</h3>
            <p className="text-sm text-gray-600">Connect with people who share your vision</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold mb-2">Reach Goals</h3>
            <p className="text-sm text-gray-600">Get the funding you need to succeed</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Globe className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold mb-2">Global Reach</h3>
            <p className="text-sm text-gray-600">Share your cause with a worldwide audience</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Tell Us About Your Cause</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Cause Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g. Clean Water for Rural Communities"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what your cause is about and why it matters..."
                  rows={5}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="targetAmount">Target Amount (₹) *</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    value={formData.targetAmount}
                    onChange={(e) => handleInputChange('targetAmount', e.target.value)}
                    placeholder="e.g. 5000"
                    min="1"
                    required
                  />
                </div>
                 <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                {/* <div className="flex items-center space-x-2"> */}
                  {/* <MapPin className="h-4 w-4 text-gray-500" /> */}
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g. Mumbai, India"
                  />
                {/* </div> */}
              </div>
              </div>
              
              {/* <div className="space-y-2">
                <Label htmlFor="imageUpload">Upload Image</Label>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mb-2"
                    />
                    <p className="text-xs text-gray-500">Or provide an image URL:</p>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="mt-1"
                    />
                  </div>
                </div>
                 {imagePreview && (
                    <div className="flex items-center justify-center border rounded-md p-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-40 max-w-full object-contain" 
                      />
                    </div>
                  )}
              </div> */}

                            <div className="space-y-2">
                <Label htmlFor="imageUpload">Upload Image</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                      placeholder="Or paste image URL here..."
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">Upload a file or provide an image URL</p>
                {imagePreview && (
                  <div className="flex items-center justify-center border rounded-md p-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-40 max-w-full object-contain" 
                    />
                  </div>
                )}
              </div>


              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Your cause will be reviewed by our team</li>
                  <li>• Once approved, it will be published on our platform</li>
                  <li>• Sponsors can then discover and support your cause</li>
                  <li>• You'll receive notifications about new sponsors and updates</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate('/causes')} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Cause'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </Layout>
  );
};

export default CreateCause;
