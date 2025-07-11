import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getImageUrl, handleImageError } from '@/utils/imageUtils';
import config from '@/config';
import axios, { AxiosResponse } from 'axios';



interface Cause {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  status: string;
  location: string;
  creator: any;
  createdAt: string;
  updatedAt: string;
  sponsorships?: Array<{
    _id: string;
    status: string;
  }>;
}

const CausesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [causes, setCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  
  // Helper functions - moved to the top
  const isTargetAchieved = (cause: Cause) => {
    return (cause.currentAmount || 0) >= cause.targetAmount;
  };

  const hasApprovedSponsorship = (cause: Cause) => {
    return cause.sponsorships?.some(s => s.status === 'approved') || false;
  };
  
  // Fetch causes from the API
  useEffect(() => {
    const fetchCauses = async () => {
      try {
        setLoading(true);
        // Fetch causes with their sponsorships
        console.log('Fetching causes using API client');
        const response: AxiosResponse<Cause[]> = await axios.get(`${config.apiUrl}/causes`, { 
          params: {
            status: 'approved',
            include: 'sponsorships',
            isOnline: true
          }
        });
        
        // Check if response.data is an array
        if (Array.isArray(response.data)) {
          console.log('Fetched causes:', response.data);
          setCauses(response.data);
          
          // Extract unique categories from the fetched causes
          const uniqueCategories = Array.from(new Set(response.data.map((cause: Cause) => cause.category)));
          setCategories(uniqueCategories as string[]);
        } else {
          console.error('Invalid response format:', response.data);
          setError('Invalid response format from server');
        }
      } catch (err: any) {
        console.error('Error fetching causes:', err);
        console.error('Response data:', err.response?.data);
        console.error('Response status:', err.response?.status);
        setError(err.response?.data?.message || 'Failed to load causes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCauses();
  }, []);

  // Filter causes based on search and filters
  const filteredCauses = causes.filter(cause => {
    // Hide causes that have achieved their target amount
    // if (isTargetAchieved(cause)) return false;

    const matchesSearch = cause.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         cause.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || cause.category === categoryFilter;
    
    // Status filter logic
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      const hasApprovedSponsorship = cause.sponsorships?.some(s => s.status === 'approved');
      const isFullyFunded = (cause.currentAmount || 0) >= cause.targetAmount;
      
      switch (statusFilter) {
        case 'open':
          matchesStatus = hasApprovedSponsorship && !isFullyFunded;
          break;
        case 'sponsored':
          matchesStatus = hasApprovedSponsorship && isFullyFunded;
          break;
        case 'waitlist':
          matchesStatus = !hasApprovedSponsorship;
          break;
      }
    }
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  // Handle claim button click
  const handleClaimAction = (cause: Cause) => {
    navigate(`/claim/${cause._id}`);
  };
  
  // Handle sponsor button click
  const handleSponsorAction = (cause: Cause) => {
    navigate(`/sponsor/new?causeId=${cause._id}`);
  };
  
  // Get the details/claim button based on sponsorship status
  const getDetailsOrClaimButton = (cause: Cause) => {
    if (hasApprovedSponsorship(cause)) {
      return (
        <Button 
          onClick={() => navigate(`/claim/${cause._id}`)} 
          className="w-full bg-black text-white"
        >
          Claim a Tote
        </Button>
      );
    }
    return null;
  };

  // Get the sponsor or waitlist button
  const getSponsorOrWaitlistButton = (cause: Cause) => {
    // Only show sponsor button if target not achieved
    if (!isTargetAchieved(cause)) {
      return (
        <Button 
          onClick={() => handleSponsorAction(cause)} 
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          Sponsor This Cause
        </Button>
      );
    }
    return null;
  };

  // Get waitlist button for unsponsored causes
  const getWaitlistButton = (cause: Cause) => {
    // Show waitlist button if cause doesn't have approved sponsorship
    if (!hasApprovedSponsorship(cause)) {
      return (
        <Button 
          onClick={() => navigate(`/waitlist/${cause._id}`)} 
          className="w-full"
          variant="outline"
        >
          Join Waitlist
        </Button>
      );
    }
    return null;
  };
  
  // Handle share button click
  const handleShareAction = (cause: Cause) => {
    // Create the share URL for the cause
    const shareUrl = `${window.location.origin}/cause/${cause._id}`;
    
    // Check if the Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: cause.title,
        text: cause.description,
        url: shareUrl,
      })
      .then(() => {
        toast({
          title: "Shared successfully",
          description: "Thanks for sharing this cause!",
          variant: "default"
        });
      })
      .catch((error) => {
        console.error('Error sharing:', error);
        toast({
          title: "Sharing failed",
          description: "Please try again or copy the link manually.",
          variant: "destructive"
        });
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast({
            title: "Link copied to clipboard!",
            description: "Share it with your friends and family.",
            variant: "default"
          });
        })
        .catch((error) => {
          console.error('Error copying to clipboard:', error);
          toast({
            title: "Copying failed",
            description: `Share this link manually: ${shareUrl}`,
            variant: "destructive"
          });
        });
    }
  };

  // --- MOCK PAGE ROUTES LOGIC ---
  // Define the mock page routes
  const mockPageRoutes = [
    "/mock/Page3",
    "/mock/Page5",
    "/mock/Page6",
    "/mock/Page4",
    "/mock/Page2",
    "/mock/Page3",
  ];

  // Sort causes by createdAt descending and get the 6 most recent
  const sortedCauses = [...filteredCauses].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const mostRecentCauses = sortedCauses.slice(0, mockPageRoutes.length);
  // Map cause _id to mock page route
  const causeIdToMockPage: Record<string, string> = {};
  mostRecentCauses.forEach((cause, idx) => {
    causeIdToMockPage[cause._id] = mockPageRoutes[idx];
  });

  return (
    <Layout>
      <div className="bg-primary-50 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Browse Causes</h1>
          <p className="text-lg text-gray-700 mb-6">
            Find and support causes aligned with your organization's values
          </p>
          
          {/* Filters section */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <Input
                  id="search"
                  placeholder="Search causes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open for Sponsorship</SelectItem>
                    <SelectItem value="sponsored">Fully Sponsored</SelectItem>
                    <SelectItem value="waitlist">Waitlist Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading causes...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Error</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : filteredCauses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCauses.map((cause) => (
              <Card key={cause._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div 
                  className="cursor-pointer" 
                  onClick={() => {
                    if (causeIdToMockPage[cause._id]) {
                      navigate(causeIdToMockPage[cause._id]);
                    } else {
                      navigate(`/cause/${cause._id}`);
                    }
                  }}
                  title={`View details for ${cause.title}`}
                >
                  <img 
                    src={getImageUrl(cause.imageUrl)} 
                    alt={cause.title} 
                    className="w-full h-48 object-cover hover:opacity-90 transition-opacity" 
                    onError={(e) => handleImageError(e)}
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">{cause.title}</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 h-auto" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareAction(cause);
                        }}
                        title="Share this cause"
                      >
                        <Share2 className="h-4 w-4 text-gray-500 hover:text-primary" />
                      </Button>
                    </div>
                    <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                      {cause.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {cause.description.length > 120 
                      ? `${cause.description.substring(0, 120)}...` 
                      : cause.description}
                  </p>
                  
                  {/* <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(((cause.currentAmount || 0) / cause.targetAmount) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-500">
                      ₹{(cause.currentAmount || 0).toLocaleString()} raised
                      </span>
                      <span className="text-sm text-gray-500">
                      ₹{cause.targetAmount.toLocaleString()} goal
                      </span>
                    </div>
                  </div> */}
                  
                  <div className="space-y-3">
                    {getDetailsOrClaimButton(cause)}
                    {getSponsorOrWaitlistButton(cause)}
                    {getWaitlistButton(cause)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No matching causes found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search term</p>
            <Button onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
            }}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CausesPage;
