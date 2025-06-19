import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Award, QrCode, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { getImageUrl, handleImageError } from '@/utils/imageUtils';
import config from '@/config';
import axios from 'axios';

const SponsorDashboard = () => {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [sponsorCauses, setSponsorCauses] = useState<SponsorCause[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch user sponsorships and sponsor causes on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication required');
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`
        };

        // Fetch both sponsorships and sponsor causes in parallel
        const [sponsorshipsResponse, sponsorCausesResponse] = await Promise.all([
          axios.get(`${config.apiUrl}/sponsorships/user`, { headers }),
          axios.get(`${config.apiUrl}/causes/sponsor-causes-with-claims`, { headers })
        ]);

        console.log('Fetched sponsorships:', sponsorshipsResponse.data);
        console.log('Fetched sponsor causes:', sponsorCausesResponse.data);
        
        setSponsorships(sponsorshipsResponse.data);
        setSponsorCauses(sponsorCausesResponse.data);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate dashboard metrics from real data
  const totalContributed = sponsorships.reduce((sum, sponsorship) => sum + (sponsorship.totalAmount || 0), 0);
  const approvedSponsorships = sponsorships.filter(s => s.status === 'approved').length;
  const totalTotes = sponsorships.reduce((sum, sponsorship) => sum + (sponsorship.toteQuantity || 0), 0);
  
  // Analytics data - you can enhance this with real claim data later
  // const claimAnalytics = [
  //   { date: '2025-03-20', claims: 12 },
  //   { date: '2025-03-21', claims: 8 },
  //   { date: '2025-03-22', claims: 15 },
  //   { date: '2025-03-23', claims: 7 },
  //   { date: '2025-03-24', claims: 10 },
  //   { date: '2025-03-25', claims: 14 },
  //   { date: '2025-03-26', claims: 12 },
  // ];

  // Mock data for impact reports
  // const impactReports = [
  //   {
  //     id: '1',
  //     title: 'Q1 2025 Impact Report - Clean Water Initiative',
  //     causeTitle: 'Clean Water Initiative',
  //     date: 'March 31, 2025',
  //     highlights: [
  //       '3 water filtration systems installed',
  //       '1,200 people now have access to clean water',
  //       '2 training sessions conducted with local technicians'
  //     ]
  //   }
  // ];

// Real data fetch from cause database
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
  sponsorships?: Sponsorship[];
}

interface SponsorCause {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  status: string;
  location: string;
  isOnline: boolean;
  createdAt: string;
  updatedAt: string;
  distributionStartDate?: string;
  distributionEndDate?: string;
  totalTotes: number;
  claimedTotes: number;
  shippedClaims: number;
  claimDetails: Array<{
    _id: string;
    status: string;
    fullName: string;
    city: string;
    state: string;
    createdAt: string;
    shippingDate?: string;
    deliveryDate?: string;
  }>;
}

interface Sponsorship {
  _id: string;
  status: string;
  logoStatus?: string;
  cause: Cause;
  organizationName: string;
  contactName: string;
  email: string;
  phone: string;
  toteQuantity: number;
  unitPrice: number;
  totalAmount: number;
  logoUrl: string;
  toteDetails?: {
    totalAmount?: number;
  };
  selectedCities?: string[];
  distributionType: 'physical' | 'online';
  distributionLocations?: Array<{
    name: {
      name: string;
      address: string;
      contactPerson: string;
      phone: string;
      location: string;
      totesCount: number;
    };
    type: string;
    totesCount: number;
  }>;
  distributionStartDate?: string;
  distributionEndDate?: string;
  documents: Array<{
    name: string;
    type: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

  // Earned badges data
  // const earnedBadges = [
  //   { id: '1', title: 'First Sponsorship', description: 'Completed your first cause sponsorship', icon: '🏆' },
  //   { id: '2', title: '50+ Totes Distributed', description: 'Your totes are making an impact', icon: '🌱' },
  //   { id: '3', title: 'Clean Water Champion', description: 'Sponsored a water-related cause', icon: '💧' },
  // ];
  
  const handleDownloadCSV = (sponsorshipId: string) => {
    // In a real app, this would generate and download a CSV file
    toast({
      title: "CSV Downloaded",
      description: "Your claim data has been downloaded successfully."
    });
  };
  
  const handleViewQRCode = (sponsorshipId: string) => {
    // This would normally show a QR code modal
    toast({
      title: "QR Code Ready",
      description: "You can now view or download your custom QR code."
    });
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout 
        title="Sponsor Dashboard" 
        subtitle={`Welcome back, ${user?.name}`}
      >
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading your sponsorships...</span>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout 
        title="Sponsor Dashboard" 
        subtitle={`Welcome back, ${user?.name}`}
      >
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Error</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Sponsor Dashboard" 
      subtitle={`Welcome back, ${user?.name}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Contributed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalContributed.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Approved Sponsorships
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{approvedSponsorships}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Totes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalTotes}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="sponsorships">
        <TabsList className="mb-6">
          <TabsTrigger value="sponsorships">My Sponsorships</TabsTrigger>
          <TabsTrigger value="my-causes">My Causes</TabsTrigger>
          <TabsTrigger value="totes-claimed">Totes Claimed</TabsTrigger>
          {/* <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="impact">Impact Reports</TabsTrigger>
          <TabsTrigger value="badges">Earned Badges</TabsTrigger> */}
        </TabsList>
        
        <TabsContent value="sponsorships">
          <div className="space-y-6">
            {sponsorships.length > 0 ? (
              sponsorships.map((sponsorship) => (
                <Card key={sponsorship._id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/4">
                        <img 
                          src={getImageUrl(sponsorship.cause?.imageUrl)} 
                          alt={sponsorship.cause?.title || 'Cause image'} 
                          className="w-full h-32 object-cover rounded-md"
                          onError={(e) => handleImageError(e)}
                        />
                      </div>
                      <div className="md:w-3/4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold">{sponsorship.cause?.title || 'Unknown Cause'}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            sponsorship.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            sponsorship.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {sponsorship.status === 'approved' ? 'Approved' : 
                             sponsorship.status === 'pending' ? 'Pending Approval' :
                             'Rejected'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{sponsorship.cause?.description || 'No description available'}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Contribution</p>
                            <p className="font-semibold">${sponsorship.totalAmount?.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Totes</p>
                            <p className="font-semibold">{sponsorship.toteQuantity}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Organization</p>
                            <p className="font-semibold">{sponsorship.organizationName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-semibold">{new Date(sponsorship.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => sponsorship.cause?._id ? navigate(`/cause/${sponsorship.cause._id}`) : null}
                            disabled={!sponsorship.cause?._id}
                          >
                            View Cause
                          </Button>
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="gap-1"
                              >
                                <QrCode className="h-4 w-4" />
                                <span>QR Code</span>
                              </Button>
                            </SheetTrigger>
                            <SheetContent>
                              <SheetHeader>
                                <SheetTitle>Your QR Code</SheetTitle>
                                <SheetDescription>
                                  This QR code is printed on your totes and links to your cause.
                                </SheetDescription>
                              </SheetHeader>
                              <div className="flex flex-col items-center justify-center py-8">
                                <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                                  <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/claim/${sponsorship.cause?._id || 'unknown'}`)}`}
                                    alt="QR Code"
                                    className="w-48 h-48"
                                  />
                                </div>
                                <p className="text-center text-sm text-gray-600 mb-4">
                                  When scanned, this QR code will direct users to your sponsored cause page.
                                </p>
                                <Button variant="outline" size="sm" className="gap-1">
                                  <Download className="h-4 w-4" />
                                  <span>Download QR Code</span>
                                </Button>
                              </div>
                            </SheetContent>
                          </Sheet>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-1"
                            onClick={() => handleDownloadCSV(sponsorship._id)}
                          >
                            <Download className="h-4 w-4" />
                            <span>Download Claims CSV</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No sponsorships yet</h3>
                <p className="text-gray-500 mb-6">Start making an impact by sponsoring your first cause.</p>
                <Button onClick={() => navigate('/causes')}>
                  Browse Causes
                </Button>
              </div>
            )}
            
            {sponsorships.length > 0 && (
              <div className="text-center pt-6">
                <Button onClick={() => navigate('/causes')}>
                  Browse More Causes
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="my-causes">
          <div className="space-y-6">
            {sponsorCauses.length > 0 ? (
              sponsorCauses.map((cause) => (
                <Card key={cause._id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/4">
                        <img 
                          src={getImageUrl(cause.imageUrl)} 
                          alt={cause.title} 
                          className="w-full h-32 object-cover rounded-md"
                          onError={(e) => handleImageError(e)}
                        />
                      </div>
                      <div className="md:w-3/4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold">{cause.title}</h3>
                          <div className="flex gap-2">
                            <Badge variant="outline" className={
                              cause.status === 'approved' && cause.isOnline ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                              cause.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                              'bg-red-100 text-red-800 hover:bg-red-100'
                            }>
                              {cause.status === 'approved' && cause.isOnline ? 'Active' : 
                               cause.status === 'pending' ? 'Pending Approval' :
                               cause.status === 'rejected' ? 'Rejected' : 'Inactive'}
                            </Badge>
                            {cause.claimedTotes === cause.totalTotes && cause.totalTotes > 0 && (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                All Totes Claimed
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">{cause.description}</p>
                        
                        <div className="mb-4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-primary-600 h-2.5 rounded-full" 
                              style={{ width: `${Math.min(((cause.currentAmount || 0) / cause.targetAmount) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className="text-sm text-gray-500">
                              ${(cause.currentAmount || 0).toLocaleString()} raised
                            </span>
                            <span className="text-sm text-gray-500">
                              ${cause.targetAmount.toLocaleString()} goal
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Total Totes</p>
                            <p className="font-semibold">{cause.totalTotes}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Claimed Totes</p>
                            <p className="font-semibold">{cause.claimedTotes}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Shipped/Delivered</p>
                            <p className="font-semibold">{cause.shippedClaims}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Category</p>
                            <p className="font-semibold">{cause.category}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/cause/${cause._id}`)}
                          >
                            View Cause
                          </Button>
                          {cause.distributionStartDate && cause.distributionEndDate && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/admin/distribution/${cause._id}`)}
                            >
                              Manage Distribution
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No causes created yet</h3>
                <p className="text-gray-500 mb-6">Start making an impact by creating your first cause.</p>
                <Button onClick={() => navigate('/create-cause')}>
                  Create New Cause
                </Button>
              </div>
            )}
            
            {sponsorCauses.length > 0 && (
              <div className="text-center pt-6">
                <Button onClick={() => navigate('/create-cause')}>
                  Create New Cause
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="totes-claimed">
          <div className="space-y-6">
            {sponsorCauses.length > 0 ? (
              sponsorCauses.map((cause) => (
                <Card key={cause._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{cause.title}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">{cause.category}</p>
                      </div>
                      <div className="flex gap-2">
                        {cause.claimedTotes === cause.totalTotes && cause.totalTotes > 0 && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            All Totes Claimed
                          </Badge>
                        )}
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          {cause.claimedTotes} / {cause.totalTotes} Claimed
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-primary-600 h-3 rounded-full transition-all duration-300" 
                          style={{ width: `${cause.totalTotes > 0 ? (cause.claimedTotes / cause.totalTotes) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{cause.claimedTotes}</p>
                        <p className="text-sm text-gray-500">People Claimed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{cause.shippedClaims}</p>
                        <p className="text-sm text-gray-500">Totes Shipped</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{cause.totalTotes - cause.claimedTotes}</p>
                        <p className="text-sm text-gray-500">Still Available</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <span className="text-green-800 font-medium">
                        { cause.claimedTotes > 0 ? (
                        <p className="text-green-800 font-medium">
                        <span role="img" aria-label="celebration">🎉 {cause.claimedTotes} people have claimed your totes!</span>
                        </p>
                        ):(
                        <p className="text-red-400">
                        <span>No totes claimed yet. Share your cause to get more claims!</span>
                        </p>
                        )
                      }
                      </span>
                      {cause.shippedClaims > 0 && (
                        <p className="text-green-700 text-sm mt-1">
                          {cause.shippedClaims} totes have been shipped and are making an impact.
                        </p>
                      )}
                    </div>
                    
                    {cause.claimDetails.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Recent Claims:</h4>
                        <div className="space-y-2">
                          {cause.claimDetails.slice(0, 3).map((claim) => (
                            <div key={claim._id} className="flex justify-between items-center text-sm">
                              <span>{claim.fullName} - {claim.city}, {claim.state}</span>
                              <Badge variant="outline" className={
                                claim.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'
                              }>
                                {claim.status === 'delivered' ? 'Delivered' : 'Shipped'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate(`/cause/${cause._id}`)}
                    >
                      View Full Cause Details
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No causes with claims yet</h3>
                <p className="text-gray-500 mb-6">Once you create causes and people start claiming totes, you'll see the impact here.</p>
                <Button onClick={() => navigate('/create-cause')}>
                  Create Your First Cause
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Tote Claims Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={claimAnalytics}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="claims" fill="#4ade80" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-gray-500">Total Claims</p>
                    <p className="text-3xl font-bold">78</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-gray-500">Average / Day</p>
                    <p className="text-3xl font-bold">11.1</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-gray-500">Claim Rate</p>
                    <p className="text-3xl font-bold">31%</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
        
        {/* <TabsContent value="impact">
          {impactReports.length > 0 ? (
            <div className="space-y-6">
              {impactReports.map((report) => (
                <Card key={report.id}>
                  <CardHeader>
                    <CardTitle>{report.title}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {report.causeTitle} - {report.date}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-medium mb-2">Highlights:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {report.highlights.map((highlight, i) => (
                        <li key={i} className="text-gray-600">{highlight}</li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Download Full Report
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No reports yet</h3>
              <p className="text-gray-500 mb-6">Impact reports will be available once your sponsored causes begin implementation.</p>
            </div>
          )}
        </TabsContent> */}

        {/* <TabsContent value="badges">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {earnedBadges.map((badge) => (
              <Card key={badge.id} className="overflow-hidden">
                <div className="bg-primary-50 p-6 flex justify-center">
                  <div className="text-4xl">{badge.icon}</div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-1 flex items-center">
                    {badge.title}
                    <Badge className="ml-2 bg-primary-100 text-primary-800 hover:bg-primary-100" variant="outline">
                      <Award className="h-3 w-3 mr-1" />
                      <span>Earned</span>
                    </Badge>
                  </h3>
                  <p className="text-gray-600 text-sm">{badge.description}</p>
                </CardContent>
              </Card>
            ))}
            
            <Card className="overflow-hidden border-dashed opacity-50">
              <div className="bg-gray-50 p-6 flex justify-center">
                <div className="text-4xl">🌍</div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-1">Global Impact</h3>
                <p className="text-gray-600 text-sm">Sponsor causes across 3 continents</p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-dashed opacity-50">
              <div className="bg-gray-50 p-6 flex justify-center">
                <div className="text-4xl">💯</div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-1">Century Club</h3>
                <p className="text-gray-600 text-sm">Reach 100+ tote claims</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent> */}
      </Tabs>
    </DashboardLayout>
  );
};

export default SponsorDashboard;
