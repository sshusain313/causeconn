import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, ChevronDown, ChevronRight, Download, Check, X, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import authAxios from '@/utils/authAxios';
import { AxiosResponse } from 'axios';

interface Cause {
  _id: string;
  title: string;
  description: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  imageUrl: string;
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

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface Organization {
  _id?: string;
  name?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  logoUrl?: string;
}

// StatusBadge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'under-review':
      case 'under review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pending Review';
      case 'under-review':
      case 'under review':
        return 'Under Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(status)}`}
    >
      {getStatusText(status)}
    </span>
  );
};

// ExpandableSection component
interface ExpandableSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const ExpandableSection = ({ title, isExpanded, onToggle, children }: ExpandableSectionProps) => {
  return (
    <div className="border border-gray-200 rounded-md">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-900">{title}</span>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isExpanded && (
        <div className="px-3 pb-3 border-t border-gray-100">
          <div className="pt-3">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const CampaignCard = ({ sponsorship, onApprove, onReject }: { 
  sponsorship: Sponsorship;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [rejectionReason, setRejectionReason] = useState('');

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{sponsorship.cause.title}</h3>
          <p className="text-sm text-gray-600">
            Submitted by: <span className="font-medium">{sponsorship.organizationName || 'Unknown Organization'}</span>
          </p>
          <p className="text-sm text-gray-500">
            Submitted: {new Date(sponsorship.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={sponsorship.status} />
          {sponsorship.logoStatus && (
            <StatusBadge status={sponsorship.logoStatus} />
          )}
        </div>
      </div>

      {/* Description & Basic Info */}
      <div className="mb-4">
        <p className="text-gray-700 mb-3">{sponsorship.cause.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">Category: </span>
            <span className="text-sm font-medium text-gray-900">{sponsorship.cause.category}</span>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500">Goal Amount: </span>
            {/* <span className="text-sm font-medium text-gray-900">{sponsorship.cause.targetAmount}</span> */}
            <span className="text-lg font-bold text-gray-900">{sponsorship.cause.targetAmount}
            </span>
          </div>
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="space-y-3 mb-6">
        <ExpandableSection
          title="Organization Information"
          isExpanded={expandedSections.includes('org')}
          onToggle={() => toggleSection('org')}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-700">Organization: </span>
                <span className="text-sm text-gray-600">{sponsorship.organizationName || 'Unknown'}</span>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                {sponsorship.logoUrl ? (
                  <img 
                    src={sponsorship.logoUrl} 
                    alt="Organization Logo" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-gray-500">No Logo</span>
                )}
              </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Contact Name: </span>
                <span className="text-sm text-gray-600">{sponsorship.contactName || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Email: </span>
                <span className="text-sm text-gray-600">{sponsorship.contactName || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Phone: </span>
                <span className="text-sm text-gray-600">{sponsorship.contactName || 'Unknown'}</span>
            </div>
          </div>
        </ExpandableSection>
        <ExpandableSection
          title="Tote Details"
          isExpanded={expandedSections.includes('tote')}
          onToggle={() => toggleSection('tote')}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">Quantity: </span>
              <span className="text-sm text-gray-600">{sponsorship.toteQuantity ?? 'N/A'}</span>
            </div>
            {/* <div>
              <span className="text-sm font-medium text-gray-700">Number of Totes: </span>
              <span className="text-sm text-gray-600">{sponsorship.toteDetails?.numberOfTotes ?? 'N/A'}</span>
            </div> */}
            <div>
              <span className="text-sm font-medium text-gray-700">Unit Price: </span>
              <span className="text-sm text-gray-600">{sponsorship.unitPrice ?? 'N/A'}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Total: </span>
              <span className="text-sm font-semibold text-gray-900">{sponsorship.totalAmount ?? 'N/A'}</span>
            </div>
          </div>
        </ExpandableSection>
        <ExpandableSection
          title="Distribution Details"
          isExpanded={expandedSections.includes('distribution')}
          onToggle={() => toggleSection('distribution')}
        >
          {sponsorship.distributionType=='physical' ? ( 
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-700">Duration: </span>
                <span className="text-sm text-gray-600">
                  {sponsorship.distributionStartDate && sponsorship.distributionEndDate
                    ? `${new Date(sponsorship.distributionStartDate).toLocaleDateString()} — ${new Date(sponsorship.distributionEndDate).toLocaleDateString()}`
                    : 'N/A'}
                </span>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Cities: </span>
              <span className="text-sm text-gray-600">
                {Array.isArray(sponsorship.selectedCities)
                  ? sponsorship.selectedCities.join(', ')
                  : 'N/A'}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Distribution Locations:</h4>
              <div className="space-y-3">
                {Array.isArray(sponsorship.distributionLocations)
                  ? sponsorship.distributionLocations.map((location, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <div className="grid md:grid-cols-2 gap-2">
                      <div>
                            <div className="font-medium text-sm text-gray-900">{location.name.name}</div>
                            <div className="text-sm text-gray-600">{location.name.address}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">
                              Contact: {location.name.contactPerson}
                        </div>
                            <div className="text-sm text-gray-600">Phone: {location.name.phone}</div>
                        <div className="text-sm font-medium text-gray-900">
                              Totes: {location.name.totesCount}
                        </div>
                      </div>
                    </div>
                  </div>
                    ))
                  : <span className="text-xs text-gray-500">No Locations</span>}
              </div>
            </div>
          </div>
          ):(
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-700">Duration: </span>
                <span className="text-sm text-gray-600">
                  {sponsorship.distributionStartDate && sponsorship.distributionEndDate
                    ? `${new Date(sponsorship.distributionStartDate).toLocaleDateString()} — ${new Date(sponsorship.distributionEndDate).toLocaleDateString()}`
                    : 'N/A'}
                </span>
              </div>
            </div>
            </div>
            )}
        

        </ExpandableSection>
      </div>
      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={() => onApprove(sponsorship._id)}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
        >
          <Check className="w-4 h-4 mr-1" />
          Approve
        </button>
        <button
          onClick={() => onReject(sponsorship._id, rejectionReason)}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
        >
          <X className="w-4 h-4 mr-1" />
          Reject
        </button>
        <input
          type="text"
          placeholder="Rejection reason..."
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

const CampaignApprovals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSponsorships();
  }, []);

  const fetchSponsorships = async () => {
    try {
      setLoading(true);
      const response = await authAxios.get<Sponsorship[]>('/api/sponsorships/pending');
      setSponsorships(response.data);
    } catch (error) {
      console.error('Error fetching sponsorships:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pending sponsorships",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await authAxios.post(`/api/sponsorships/${id}/approve`);
      toast({
        title: "Success",
        description: "Sponsorship approved successfully"
      });
      fetchSponsorships(); // Refresh the list
    } catch (error) {
      console.error('Error approving sponsorship:', error);
      toast({
        title: "Error",
        description: "Failed to approve sponsorship",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (id: string, reason: string) => {
    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive"
      });
      return;
    }

    try {
      await authAxios.post(`/api/sponsorships/${id}/reject`, { reason });
      toast({
        title: "Success",
        description: "Sponsorship rejected successfully"
      });
      fetchSponsorships(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting sponsorship:', error);
      toast({
        title: "Error",
        description: "Failed to reject sponsorship",
        variant: "destructive"
      });
    }
  };

  const filteredSponsorships = sponsorships.filter(sponsorship =>
    sponsorship.cause.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sponsorship.organizationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminLayout title="Campaign Approvals" subtitle="Manage and monitor all causes">
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-semibold text-gray-800">Campaign Approvals</h1>
            <span className="text-sm text-gray-500">Admin (Admin)</span>
          </div>
          <p className="text-gray-600 mb-4">Review and approve new campaign submissions</p>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredSponsorships.length > 0 ? (
        <div className="space-y-6">
              {filteredSponsorships.map((sponsorship) => (
                <CampaignCard
                  key={sponsorship._id}
                  sponsorship={sponsorship}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No pending campaigns</h3>
              <p className="text-gray-500">All campaigns have been reviewed</p>
            </div>
          )}
      </div>
      </AdminLayout>
    </div>
  );
};

export default CampaignApprovals;