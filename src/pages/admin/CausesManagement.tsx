
import React, { useState, useEffect } from 'react';
import { getApiUrl, getFullUrl } from '@/utils/apiUtils';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, PlusCircle, Search, ArrowUpDown, Download, Image as ImageIcon } from 'lucide-react';
import config from '@/config';

// Interface for Cause data
interface Cause {
  _id: string;
  title: string;
  description: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  isOnline?: boolean;
  imageUrl?: string;
  adminImageUrl?: string;
  story?: string;
  location?: string;
  creator?: any;
  sponsors?: any[];
}

const CausesManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'status' | 'currentAmount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [causes, setCauses] = useState<Cause[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch causes from the database
  useEffect(() => {
    const fetchCauses = async () => {
      try {
        setLoading(true);
<<<<<<< Updated upstream
        const response = await fetch(`${config.apiUrl}/causes`, {
=======
        const response = await fetch(getApiUrl('/causes'), {
>>>>>>> Stashed changes
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch causes');
        }

        const data = await response.json();
        // Set isOnline property based on status for each cause
        const causesWithOnlineStatus = data.map((cause: Cause) => ({
          ...cause,
          isOnline: cause.status === 'approved' || cause.status === 'completed'
        }));
        setCauses(causesWithOnlineStatus);
      } catch (err) {
        console.error('Error fetching causes:', err);
        setError('Failed to load causes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCauses();
  }, []);

  const handleSetAdminImage = (causeId: string) => {
    navigate(`/admin/causes/${causeId}/upload-image`);
  };

  const handleToggleStatus = async (causeId: string) => {
    try {
      const cause = causes.find(c => c._id === causeId);
      if (!cause) return;
      
      const newOnlineStatus = !cause.isOnline;
      
      // Update in the UI optimistically
      setCauses(prev => prev.map(c => {
        if (c._id === causeId) {
          return { 
            ...c, 
            isOnline: newOnlineStatus,
            // If going online, also update status to approved if it's in draft
            status: newOnlineStatus && c.status === 'draft' ? 'approved' : c.status
          };
        }
        return c;
      }));
      
<<<<<<< Updated upstream
      // Send update to the server using the status endpoint
      const response = await fetch(`${config.apiUrl}/causes/${causeId}/status`, {
=======
      // Send update to the server using the new toggle-online endpoint
      const response = await fetch(getApiUrl(`/causes/${causeId}/toggle-online`), {
>>>>>>> Stashed changes
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add authentication token
        },
        body: JSON.stringify({
          status: newOnlineStatus ? 'approved' : 'pending'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update cause status');
      }
      
      // Get the updated cause from the server response
      const data = await response.json();
      console.log('Server response:', data);
      
      // Update the causes list with the server response to ensure sync
      setCauses(prev => prev.map(c => {
        if (c._id === causeId) {
          // Make sure isOnline property is correctly set based on the status
          return { 
            ...c, 
            ...data.cause,
            isOnline: data.cause.status === 'approved' || data.cause.status === 'completed'
          };
        }
        return c;
      }));
      
      toast({
        title: 'Campaign Status Updated',
        description: `${cause.title} is now ${newOnlineStatus ? 'online' : 'offline'}.`,
        duration: 3000
      });
    } catch (err) {
      console.error('Error updating cause status:', err);
      toast({
        title: 'Update Failed',
        description: 'Failed to update cause status. Please try again.',
        variant: 'destructive'
      });
      
      // Revert the optimistic update
<<<<<<< Updated upstream
      const response = await fetch(`${config.apiUrl}/causes`);
=======
      const response = await fetch(getApiUrl('/causes'));
>>>>>>> Stashed changes
      if (response.ok) {
        const data = await response.json();
        setCauses(data.map((cause: Cause) => ({
          ...cause,
          isOnline: cause.status !== 'draft' && cause.status !== 'rejected'
        })));
      }
    }
  };
  
  const handleForceCloseClaims = (causeId: string) => {
    toast({
      title: 'Claims Closed',
      description: `All claims for this cause have been closed as it reached the tote limit.`
    });
  };
  
  const handleSort = (column: 'date' | 'title' | 'status' | 'currentAmount') => {
    if (sortBy === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };
  
  const filteredAndSortedCauses = causes
    .filter(cause => 
      cause.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cause.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cause.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'title') {
        return sortDirection === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'status') {
        return sortDirection === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      } else if (sortBy === 'currentAmount') {
        return sortDirection === 'asc'
          ? a.currentAmount - b.currentAmount
          : b.currentAmount - a.currentAmount;
      }
      return 0;
    });

  // Display loading state
  if (loading) {
    return (
      <AdminLayout title="Causes Management" subtitle="Loading causes...">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Causes Management</h1>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Display error state
  if (error) {
    return (
      <AdminLayout title="Causes Management" subtitle="Error loading causes">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Causes Management</h1>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500 text-center">
              <p className="text-xl font-semibold mb-2">Error</p>
              <p>{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Causes Management" subtitle="Create, view, and manage all cause campaigns">
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search causes..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => handleSort('title')} variant="outline" className="hidden md:flex items-center gap-1">
            <span>Title</span>
            <ArrowUpDown className="h-3 w-3" />
          </Button>
          <Button onClick={() => handleSort('status')} variant="outline" className="hidden md:flex items-center gap-1">
            <span>Status</span>
            <ArrowUpDown className="h-3 w-3" />
          </Button>
          <Button onClick={() => handleSort('currentAmount')} variant="outline" className="hidden md:flex items-center gap-1">
            <span>Raised</span>
            <ArrowUpDown className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button className="flex items-center gap-1" onClick={() => navigate('/admin/causes/new')}>
            <PlusCircle className="h-4 w-4" />
            <span>New Cause</span>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAndSortedCauses.map((cause) => (
          <Card key={cause._id} className={!cause.isOnline ? 'opacity-70' : ''}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                {cause.imageUrl && (
                  <div className="lg:w-1/4 mb-4 lg:mb-0">
                    <img 
                      src={cause.imageUrl.startsWith('http') ? cause.imageUrl : `${config.apiUrl}/${cause.imageUrl}`} 
                      alt={cause.title} 
                      className="w-full h-48 object-cover rounded-md shadow-sm"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{cause.title}</h3>
                    <Badge 
                      variant="outline" 
                      className={
                        cause.status === 'open'
                          ? 'bg-green-100 text-green-800'
                          : cause.status === 'sponsored'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }
                    >
                      {cause.status.charAt(0).toUpperCase() + cause.status.slice(1)}
                    </Badge>
                    {!cause.isOnline && (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">
                        Offline
                      </Badge>
                    )}
                    {cause.adminImageUrl && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800">
                        Admin Image Set
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{cause.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium">{cause.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Goal</p>
                      <p className="font-medium">${cause.targetAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Raised</p>
                      <p className="font-medium">${cause.currentAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-medium">{new Date(cause.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row lg:flex-col gap-2">
                  <Button 
                    onClick={() => handleSetAdminImage(cause._id)}
                    variant="outline" 
                    className="flex-1 flex items-center gap-1"
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>Set Image</span>
                  </Button>
                  <Button 
                    onClick={() => navigate(`/admin/causes/${cause._id}`)}
                    className="flex-1 bg-black text-white"
                  >
                    Edit
                  </Button>
                  <Button 
                    onClick={() => handleToggleStatus(cause._id)}
                    variant="outline" 
                    className="flex-1 flex items-center gap-1"
                  >
                    {cause.isOnline ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        <span>Set Offline</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        <span>Set Online</span>
                      </>
                    )}
                  </Button>
                  {cause.status === 'open' && (
                    <Button 
                      onClick={() => handleForceCloseClaims(cause._id)}
                      variant="outline" 
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Close Claims
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredAndSortedCauses.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No causes found</h3>
            <p className="text-gray-500">Try changing your search criteria</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CausesManagement;
