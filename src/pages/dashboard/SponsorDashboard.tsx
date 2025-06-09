
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Award, QrCode } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const SponsorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Mock data for sponsored causes
  const sponsoredCauses = [
    {
      id: '1',
      title: 'Clean Water Initiative',
      description: 'Providing clean drinking water to communities in need.',
      imageUrl: 'https://images.unsplash.com/photo-1541252260730-0412e8e2d5d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      amount: 5000,
      status: 'approved',
      date: '2025-03-15',
      toteQuantity: 250,
      claimedTotes: 78,
      qrCode: 'https://causeconnect.org/claim/1'
    },
    {
      id: '2',
      title: "Children's Education Fund",
      description: 'Supporting education for underprivileged children worldwide.',
      imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      amount: 3500,
      status: 'pending',
      date: '2025-04-02',
      toteQuantity: 150,
      claimedTotes: 0,
      qrCode: 'https://causeconnect.org/claim/2'
    }
  ];
  
  // Analytics data
  const claimAnalytics = [
    { date: '2025-03-20', claims: 12 },
    { date: '2025-03-21', claims: 8 },
    { date: '2025-03-22', claims: 15 },
    { date: '2025-03-23', claims: 7 },
    { date: '2025-03-24', claims: 10 },
    { date: '2025-03-25', claims: 14 },
    { date: '2025-03-26', claims: 12 },
  ];

  // Mock data for impact reports
  const impactReports = [
    {
      id: '1',
      title: 'Q1 2025 Impact Report - Clean Water Initiative',
      causeTitle: 'Clean Water Initiative',
      date: 'March 31, 2025',
      highlights: [
        '3 water filtration systems installed',
        '1,200 people now have access to clean water',
        '2 training sessions conducted with local technicians'
      ]
    }
  ];

  // Earned badges data
  const earnedBadges = [
    { id: '1', title: 'First Sponsorship', description: 'Completed your first cause sponsorship', icon: '🏆' },
    { id: '2', title: '50+ Totes Distributed', description: 'Your totes are making an impact', icon: '🌱' },
    { id: '3', title: 'Clean Water Champion', description: 'Sponsored a water-related cause', icon: '💧' },
  ];
  
  const handleDownloadCSV = (causeId: string) => {
    // In a real app, this would generate and download a CSV file
    toast({
      title: "CSV Downloaded",
      description: "Your claim data has been downloaded successfully."
    });
  };
  
  const handleViewQRCode = (causeId: string) => {
    // This would normally show a QR code modal
    toast({
      title: "QR Code Ready",
      description: "You can now view or download your custom QR code."
    });
  };

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
            <div className="text-3xl font-bold">$8,500</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Approved Sponsorships
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Claimed Totes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">78</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="sponsorships">
        <TabsList className="mb-6">
          <TabsTrigger value="sponsorships">My Sponsorships</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="impact">Impact Reports</TabsTrigger>
          <TabsTrigger value="badges">Earned Badges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sponsorships">
          <div className="space-y-6">
            {sponsoredCauses.map((cause) => (
              <Card key={cause.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4">
                      <img 
                        src={cause.imageUrl} 
                        alt={cause.title} 
                        className="w-full h-32 object-cover rounded-md" 
                      />
                    </div>
                    <div className="md:w-3/4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold">{cause.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          cause.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {cause.status === 'approved' ? 'approved' : 'Pending Approval'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{cause.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Contribution</p>
                          <p className="font-semibold">${cause.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Totes</p>
                          <p className="font-semibold">{cause.toteQuantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Claimed</p>
                          <p className="font-semibold">{cause.claimedTotes} ({Math.round((cause.claimedTotes / cause.toteQuantity) * 100)}%)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-semibold">{new Date(cause.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/cause/${cause.id}`)}
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
                                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://causeconnect.org/claim/example" 
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
                          onClick={() => handleDownloadCSV(cause.id)}
                        >
                          <Download className="h-4 w-4" />
                          <span>Download Claims CSV</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="text-center pt-6">
              <Button onClick={() => navigate('/causes')}>
                Browse More Causes
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
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
        </TabsContent>
        
        <TabsContent value="impact">
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
        </TabsContent>

        <TabsContent value="badges">
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
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default SponsorDashboard;
