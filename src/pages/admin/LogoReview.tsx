import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, XCircle, Download, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import config from '@/config';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Interface for sponsorship data
interface Sponsorship {
  _id: string;
  cause: {
    _id: string;
    title: string;
  };
  organizationName: string;
  logoUrl: string;
  logoPosition?: {
    x: number;
    y: number;
    scale: number;
    angle: number;
  };
  createdAt: string;
  status: string;
  totalAmount: number;
  toteQuantity: number;
}

const LogoReview = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const [previewCanvasSize] = useState({ width: 400, height: 400 });
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('Logo does not meet our guidelines');
  const [selectedSponsorshipId, setSelectedSponsorshipId] = useState<string | null>(null);

  // Create axios instance with auth headers
  const authAxios = axios.create({
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // Fetch pending sponsorships
  const { data: sponsorships, isLoading, error } = useQuery<Sponsorship[]>({
    queryKey: ['pendingSponsorships'],
    queryFn: async () => {
      const response = await authAxios.get('/api/sponsorships/pending');
      console.log('Sponsorships data:', response.data);
      
      // Ensure we always return an array, even if the API returns an object
      // or if the data is nested in a property like 'data' or 'sponsorships'
      if (!response.data) return [];
      
      // Check if response.data is an array
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      // If response.data is an object with a data property that's an array
      if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      // If response.data is an object with a sponsorships property that's an array
      if (response.data.sponsorships && Array.isArray(response.data.sponsorships)) {
        return response.data.sponsorships;
      }
      
      // If we can't find an array, return an empty array
      console.error('Expected an array of sponsorships but got:', response.data);
      return [];
    },
    enabled: !!token // Only run query if token exists
  });
  
  // Log logo URLs for debugging when data is available
  useEffect(() => {
    if (sponsorships) {
      console.log('Sponsorships data type:', typeof sponsorships, Array.isArray(sponsorships));
      if (Array.isArray(sponsorships) && sponsorships.length > 0) {
        console.log('First sponsorship logo URL:', sponsorships[0].logoUrl);
      } else if (!Array.isArray(sponsorships)) {
        console.error('Sponsorships is not an array:', sponsorships);
      }
    }
  }, [sponsorships]);

  // Mutation for approving a sponsorship
  const approveMutation = useMutation({
    mutationFn: async (sponsorshipId: string) => {
      return authAxios.patch(`/api/sponsorships/${sponsorshipId}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingSponsorships'] });
      toast({
        title: 'Logo Approved',
        description: 'The logo has been approved and is now live on the campaign.'
      });
    },
    onError: (error) => {
      console.error('Error approving logo:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve the logo. Please try again.',
        variant: 'destructive'
      });
    }
  });

  // Mutation for rejecting a sponsorship
  const rejectMutation = useMutation({
    mutationFn: async ({ sponsorshipId, reason }: { sponsorshipId: string, reason: string }) => {
      return authAxios.patch(`/api/sponsorships/${sponsorshipId}/reject`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingSponsorships'] });
      toast({
        title: 'Logo Rejected',
        description: 'The logo has been rejected. The submitter will be notified to provide a new one.',
        variant: 'destructive'
      });
    },
    onError: (error) => {
      console.error('Error rejecting logo:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject the logo. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const handleApprove = (sponsorshipId: string) => {
    approveMutation.mutate(sponsorshipId);
  };

  const handleReject = (sponsorshipId: string) => {
    // Open the rejection dialog to collect the reason
    setSelectedSponsorshipId(sponsorshipId);
    setRejectionReason('Logo does not meet our guidelines'); // Reset to default
    setRejectionDialogOpen(true);
  };
  
  const confirmReject = () => {
    if (selectedSponsorshipId) {
      rejectMutation.mutate({ 
        sponsorshipId: selectedSponsorshipId, 
        reason: rejectionReason 
      });
      setRejectionDialogOpen(false);
    }
  };

  // Function to draw logo preview on canvas
  const drawLogoPreview = (
    canvas: HTMLCanvasElement,
    logoUrl: string,
    position = { x: 200, y: 280, scale: 0.15, angle: 0 }
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = previewCanvasSize.width;
    canvas.height = previewCanvasSize.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Load and draw tote bag
    const toteBag = new Image();
    toteBag.src = '/totebag.png';

    toteBag.onload = () => {
      // Draw tote bag centered and scaled
      const toteBagScale = Math.min(canvas.width / toteBag.width, canvas.height / toteBag.height) * 0.9;
      const toteBagX = (canvas.width - toteBag.width * toteBagScale) / 2;
      const toteBagY = (canvas.height - toteBag.height * toteBagScale) / 2;
      ctx.drawImage(toteBag, toteBagX, toteBagY, toteBag.width * toteBagScale, toteBag.height * toteBagScale);

      // Load and draw logo
      const logo = new Image();
      logo.src = logoUrl.startsWith('http') 
        ? logoUrl 
        : `${config.uploadsUrl}${logoUrl.replace('/uploads', '')}`;

      logo.onload = () => {
        ctx.save();
        
        // Apply transformations
        ctx.translate(position.x, position.y);
        ctx.rotate(position.angle * Math.PI / 180);
        ctx.scale(position.scale, position.scale);

        // Draw logo centered at transform point
        ctx.drawImage(logo, -logo.width / 2, -logo.height / 2, logo.width, logo.height);

        ctx.restore();
      };

      logo.onerror = (error) => {
        console.error('Error loading logo for preview:', error);
      };
    };

    toteBag.onerror = (error) => {
      console.error('Error loading tote bag:', error);
    };
  };

  // Loading state
  if (isLoading) {
    return (
      <AdminLayout title="Logo Review" subtitle="Review and approve submitted campaign logos">
        <div className="flex justify-center items-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Loading sponsorships...</span>
        </div>
      </AdminLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AdminLayout title="Logo Review" subtitle="Review and approve submitted campaign logos">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
          <h3 className="text-lg font-medium">Error loading sponsorships</h3>
          <p>There was a problem fetching the data. Please try again later.</p>
        </div>
      </AdminLayout>
    );
  }

  // Update the card content to include both original logo and preview
  const renderSponsorshipCard = (sponsorship: Sponsorship) => (
    <Card key={sponsorship._id} className="overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-start mb-1">
          <CardTitle className="text-lg">{sponsorship.cause?.title || 'Unnamed Campaign'}</CardTitle>
          <Badge 
            variant="outline" 
            className="bg-yellow-100 text-yellow-800 w-fit"
          >
            Pending Review
          </Badge>
        </div>
        <p className="text-sm text-gray-600">by {sponsorship.organizationName}</p>
        {sponsorship.cause?.title && (
          <div className="mt-2 text-xs bg-primary-50 text-primary-800 px-2 py-1 rounded-md inline-block">
            Campaign: {sponsorship.cause.title}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Logo Preview Section */}
          <div className="grid grid-cols-2 gap-6">
            {/* Original Logo */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Original Logo</p>
              <div className="relative aspect-square bg-gray-50 rounded-lg border overflow-hidden">
                <img 
                  src={sponsorship.logoUrl.startsWith('http') 
                    ? sponsorship.logoUrl 
                    : `${config.uploadsUrl}${sponsorship.logoUrl.replace('/uploads', '')}`
                  } 
                  alt="Campaign Logo" 
                  className="w-full h-full object-contain p-4"
                  onError={(e) => {
                    console.error('Image failed to load:', sponsorship.logoUrl);
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            </div>

            {/* Tote Bag Preview */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Tote Bag Preview</p>
              <div className="relative aspect-square bg-gray-50 rounded-lg border overflow-hidden">
                <canvas
                  ref={canvas => {
                    if (canvas) {
                      drawLogoPreview(
                        canvas,
                        sponsorship.logoUrl,
                        sponsorship.logoPosition
                      );
                    }
                  }}
                  width={previewCanvasSize.width}
                  height={previewCanvasSize.height}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Sponsorship Details */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-medium">${sponsorship.totalAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tote Quantity</p>
              <p className="font-medium">{sponsorship.toteQuantity.toLocaleString()}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Submitted</p>
              <p className="font-medium">
                {new Date(sponsorship.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button 
                onClick={() => handleApprove(sponsorship._id)}
                className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700"
                size="default"
                disabled={approveMutation.isPending}
              >
                {approveMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Approve Logo
              </Button>
              <Button 
                onClick={() => handleReject(sponsorship._id)}
                variant="destructive"
                className="flex-1 flex items-center justify-center gap-1"
                size="default"
                disabled={rejectMutation.isPending}
              >
                {rejectMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Reject Logo
              </Button>
              <Button 
                variant="outline" 
                size="default"
                className="flex items-center justify-center gap-1 min-w-[120px]"
                onClick={() => window.open(sponsorship.logoUrl.startsWith('http') 
                  ? sponsorship.logoUrl 
                  : `${config.uploadsUrl}${sponsorship.logoUrl.replace('/uploads', '')}`, '_blank')}
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout title="Logo Review" subtitle="Review and approve submitted campaign logos">
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        {Array.isArray(sponsorships) && sponsorships.length > 0 ? (
          sponsorships.map(renderSponsorshipCard)
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
            <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">All Caught Up!</h3>
            <p className="text-gray-500 text-center">No pending logos to review at the moment.</p>
          </div>
        )}
      </div>

      {/* Rejection Reason Dialog */}
      <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Logo</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this logo. This will be included in the email sent to the sponsor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why the logo is being rejected..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmReject}
              disabled={!rejectionReason.trim() || rejectMutation.isPending}
            >
              {rejectMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                'Reject Logo'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default LogoReview;
