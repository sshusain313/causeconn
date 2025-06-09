import React, { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import config from '@/config';
import { Loader2 } from 'lucide-react';

const claimFormSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  purpose: z.string().min(2, 'Please describe how you plan to use the tote'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code is required'),
});

type ClaimFormValues = z.infer<typeof claimFormSchema>;

interface Sponsor {
  name: string;
  organization: string;
}

interface Cause {
  _id: string;
  title: string;
  imageUrl: string;
  sponsor?: Sponsor;
  // Add these fields to match the API response format
  sponsors?: Sponsor[];
  sponsorships?: Array<{
    _id: string;
    status: string;
    amount?: number;
  }>;
  totalTotes: number;
  claimedTotes: number;
  availableTotes: number;
  status: string;
  description?: string;
  currentAmount: number;
}

const ClaimFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isFromWaitlist = searchParams.get('source') === 'waitlist';

  // Fetch cause data
  const { data: cause, isLoading, error } = useQuery<Cause>({
    queryKey: ['cause', id],
    queryFn: async () => {
      try {
        console.log(`Fetching cause data from ${config.apiUrl}/causes/${id}`);
        const response = await axios.get(`${config.apiUrl}/causes/${id}`);
        console.log('Cause data response:', response.data);
        return response.data;
      } catch (err) {
        console.error('Error fetching cause data:', err);
        throw err;
      }
    },
  });
  
  const form = useForm<ClaimFormValues>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      purpose: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });
  
  // Check if user has already claimed a tote for this cause when they enter their email
  const checkExistingClaim = async (email: string) => {
    if (!email || !id) return;
    
    try {
      const response = await fetch(`${config.apiUrl}/claims/check?email=${encodeURIComponent(email)}&causeId=${id}`);
      const data = await response.json();
      
      if (data.exists) {
        toast({
          title: "Already Claimed",
          description: "You have already claimed a tote for this cause. Each user can claim only one tote per cause.",
          variant: "default",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking existing claim:', error);
      return false;
    }
  };
  
  
  // Check for waitlist data on mount
  useEffect(() => {
    if (isFromWaitlist) {
      const waitlistData = sessionStorage.getItem('waitlistClaimData');
      if (waitlistData) {
        try {
          const data = JSON.parse(waitlistData);
          form.setValue('fullName', data.fullName || '');
          form.setValue('email', data.email || '');
          form.setValue('phone', data.phone || '');
          form.setValue('purpose', data.purpose || '');
          
          toast({
            title: "Welcome back!",
            description: "Your information has been pre-filled from your waitlist registration.",
          });
        } catch (error) {
          console.error('Error parsing waitlist data:', error);
        }
      }
    }
  }, [isFromWaitlist, form]);
  
  const onSubmit = async (data: ClaimFormValues) => {
    if (!cause) return;

    try {
      // Prepare the claim data
      const claimData = {
        ...data,
        causeId: id,
        causeTitle: cause.title,
        status: 'pending',
        emailVerified: false
      };
      
      // Store data in session storage for verification steps
      sessionStorage.setItem('claimFormData', JSON.stringify(claimData));
      
      // Send data to the server
      console.log(`Submitting claim to ${config.apiUrl}/claims`);
      const response = await fetch(`${config.apiUrl}/claims`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(claimData)
      });
      
      console.log('Claim submission response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Check if this is a duplicate claim error
        if (response.status === 400 && errorData.message && errorData.message.includes('already claimed')) {
          toast({
            title: "Already Claimed",
            description: errorData.message || "You have already claimed a tote for this cause.",
            variant: "destructive",
          });
        } else {
          throw new Error(errorData.message || 'Failed to submit claim');
        }
        return;
      }
      
      // Navigate to verification page
      navigate('/claim/verify');
    } catch (error: any) {
      console.error('Error submitting claim:', error);
      toast({
        title: "Error",
        description: error.message || "There was a problem submitting your claim. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Helper function to safely get sponsor info
  const getSponsorInfo = (cause: Cause) => {
    if (!cause.sponsor) return 'Anonymous Sponsor';
    return cause.sponsor.organization || cause.sponsor.name || 'Anonymous Sponsor';
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !cause) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Cause</h1>
          <p className="text-gray-600 mb-4">Unable to load the cause information. Please try again later.</p>
          <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </Layout>
    );
  }

  // Debug cause data
  console.log('Cause data in ClaimForm:', cause);
  
  // Check if cause is available for claims
  const hasSponsorship = cause.sponsor || 
                       (cause.sponsors && cause.sponsors.length > 0) || 
                       (cause.sponsorships && cause.sponsorships.length > 0);
  
  const isAvailable = (cause.status === 'approved' || cause.status === 'open') && hasSponsorship;
  
  if (!isAvailable) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-yellow-600 mb-4">Cause Not Available</h1>
          <p className="text-gray-600 mb-4">This cause is not currently available for claims.</p>
          <p className="text-sm text-gray-500 mb-4">Status: {cause.status}, Has sponsorship: {hasSponsorship ? 'Yes' : 'No'}</p>
          <Button variant="outline" onClick={() => navigate('/causes')}>View Other Causes</Button>
        </div>
      </Layout>
    );
  }

  // Get available totes from the cause data
  const availableTotes = cause.availableTotes || 0;
  if (availableTotes <= 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-yellow-600 mb-4">No Totes Available</h1>
          <p className="text-gray-600 mb-4">All totes for this cause have been claimed.</p>
          <Button variant="outline" onClick={() => navigate(`/waitlist/${id}`)}>Join Waitlist</Button>
        </div>
      </Layout>
    );
  }
  
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
          
          <h1 className="text-3xl font-bold mb-2">Claim Your Totes</h1>
          {/* <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <h2 className="text-xl font-semibold text-green-800 mb-2">Tote Availability</h2>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white rounded-md p-3 shadow-sm">
                <p className="text-sm text-gray-600">Total Totes</p>
                <p className="text-2xl font-bold">{cause.totalTotes || 0}</p>
              </div>
              <div className="bg-white rounded-md p-3 shadow-sm">
                <p className="text-sm text-gray-600">Claimed</p>
                <p className="text-2xl font-bold">{cause.claimedTotes || 0}</p>
              </div>
              <div className="bg-white rounded-md p-3 shadow-sm border-2 border-green-500">
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">{availableTotes}</p>
              </div>
            </div>
          </div> */}
          <p className="text-lg text-gray-700 mb-6">
            Complete the form below to claim totes for {cause.title}
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Personal & Shipping Information</h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="jane.doe@example.com" 
                                {...field} 
                                onBlur={async (e) => {
                                  field.onBlur();
                                  if (e.target.value) {
                                    await checkExistingClaim(e.target.value);
                                  }
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              You can only claim one tote per cause with the same email address.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="(555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="purpose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Purpose</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="How will you use this tote?" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Briefly describe how you plan to use the tote
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Shipping Address</h3>
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Anytown" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input placeholder="CA" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl>
                                <Input placeholder="12345" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" size="lg">
                        Continue to Verification
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Cause Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden">
                      <img 
                        src={cause.imageUrl.startsWith('http') ? cause.imageUrl : `${config.uploadsUrl}${cause.imageUrl.replace('/uploads', '')}`} 
                        alt={cause.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{cause.title}</h3>
                      <p className="text-sm text-gray-600">
                        Sponsored by {getSponsorInfo(cause)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Total Totes:</span>
                          <span className="font-medium">{cause.totalTotes}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700 font-medium">Available Totes:</span>
                          <span className="font-bold text-green-600">{availableTotes}</span>
                        </div>
                      </div>
                      
                      {/* Tote availability progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${Math.max(0, Math.min(100, (availableTotes / cause.totalTotes) * 100))}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {availableTotes === 0 
                          ? "All totes have been claimed. Join the waitlist!"
                          : availableTotes === 1
                          ? "Only 1 tote left! Claim it now."
                          : availableTotes < 10
                          ? `Only ${availableTotes} totes left! Claim yours soon.`
                          : `${availableTotes} totes available for this cause.`
                        }
                      </p>
                    </div>
                    
                    <div className="flex justify-between font-medium mt-4">
                      <span>Shipping:</span>
                      <span>Free</span>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-100 rounded p-4 text-sm text-yellow-800">
                    <p>
                      <span className="font-semibold">Note:</span> After submission, you'll need to verify your email and phone to complete your claim.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-100 rounded p-4 mt-4 text-sm text-blue-800">
                    <p>
                      <span className="font-semibold">Claim Process:</span> Your claim will be reviewed by an admin. The available totes count will only update after your claim is approved.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClaimFormPage;
