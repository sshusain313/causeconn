
// import React, { useState } from 'react';
// import AdminLayout from '@/components/admin/AdminLayout';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { useToast } from '@/components/ui/use-toast';
// import { Search, CheckCircle, XCircle, Clock } from 'lucide-react';

// // Mock pending campaigns data
// const mockPendingCampaigns = [
//   {
//     _id: '1',
//     title: 'Tech for Good Initiative',
//     description: 'Providing technology solutions for non-profit organizations.',
//     category: 'Technology',
//     targetAmount: 10000,
//     submittedBy: 'TechCorp Inc.',
//     submittedAt: new Date('2025-03-20'),
//     status: 'pending',
//     documents: ['business-plan.pdf', 'financial-overview.xlsx']
//   },
//   {
//     _id: '2',
//     title: 'Green Energy Project',
//     description: 'Installing solar panels in rural communities.',
//     category: 'Environment',
//     targetAmount: 15000,
//     submittedBy: 'GreenFuture Ltd.',
//     submittedAt: new Date('2025-03-18'),
//     status: 'under_review',
//     documents: ['project-proposal.pdf', 'environmental-impact.pdf']
//   }
// ];

// const CampaignApprovals = () => {
//   const { toast } = useToast();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [campaigns, setCampaigns] = useState(mockPendingCampaigns);

//   const handleApprove = (campaignId: string) => {
//     setCampaigns(prev => prev.filter(c => c._id !== campaignId));
//     toast({
//       title: 'Campaign Approved',
//       description: 'The campaign has been approved and is now live.'
//     });
//   };

//   const handleReject = (campaignId: string) => {
//     setCampaigns(prev => prev.filter(c => c._id !== campaignId));
//     toast({
//       title: 'Campaign Rejected',
//       description: 'The campaign has been rejected and the submitter will be notified.',
//       variant: 'destructive'
//     });
//   };

//   const filteredCampaigns = campaigns.filter(campaign =>
//     campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     campaign.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <AdminLayout title="Campaign Approvals" subtitle="Review and approve new campaign submissions">
//       <div className="mb-6">
//         <div className="relative w-full md:w-80">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
//           <Input
//             placeholder="Search campaigns..."
//             className="pl-9"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="space-y-4">
//         {filteredCampaigns.map((campaign) => (
//           <Card key={campaign._id}>
//             <CardHeader>
//               <div className="flex justify-between items-start">
//                 <div>
//                   <CardTitle className="text-xl">{campaign.title}</CardTitle>
//                   <p className="text-gray-600 mt-1">Submitted by {campaign.submittedBy}</p>
//                 </div>
//                 <Badge 
//                   variant="outline" 
//                   className={
//                     campaign.status === 'pending'
//                       ? 'bg-yellow-100 text-yellow-800'
//                       : 'bg-blue-100 text-blue-800'
//                   }
//                 >
//                   <Clock className="w-3 h-3 mr-1" />
//                   {campaign.status === 'pending' ? 'Pending Review' : 'Under Review'}
//                 </Badge>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-700 mb-4">{campaign.description}</p>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                 <div>
//                   <p className="text-sm text-gray-500">Category</p>
//                   <p className="font-medium">{campaign.category}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Goal Amount</p>
//                   <p className="font-medium">${campaign.targetAmount.toLocaleString()}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Submitted</p>
//                   <p className="font-medium">{campaign.submittedAt.toLocaleDateString()}</p>
//                 </div>
//               </div>
//               <div className="mb-4">
//                 <p className="text-sm text-gray-500 mb-2">Documents</p>
//                 <div className="flex flex-wrap gap-2">
//                   {campaign.documents.map((doc, index) => (
//                     <Badge key={index} variant="secondary">{doc}</Badge>
//                   ))}
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <Button 
//                   onClick={() => handleApprove(campaign._id)}
//                   className="flex items-center gap-1"
//                 >
//                   <CheckCircle className="w-4 h-4" />
//                   Approve
//                 </Button>
//                 <Button 
//                   onClick={() => handleReject(campaign._id)}
//                   variant="outline"
//                   className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
//                 >
//                   <XCircle className="w-4 h-4" />
//                   Reject
//                 </Button>
//                 <Button variant="outline">Review Details</Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}

//         {filteredCampaigns.length === 0 && (
//           <div className="text-center py-12">
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">No pending campaigns</h3>
//             <p className="text-gray-500">All campaigns have been reviewed</p>
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// };

// export default CampaignApprovals;


import { useState } from 'react';
// import { AdminSidebar } from '@/components/AdminSidebar';
import AdminLayout from '@/components/admin/AdminLayout';
import { Search, ChevronDown, ChevronRight, Download, Check, X, Eye } from 'lucide-react';

// StatusBadge component inline
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

// ExpandableSection component inline
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

// Campaign interface and CampaignCard component inline
interface Campaign {
  id: number;
  title: string;
  status: string;
  submittedBy: string;
  submittedDate: string;
  description: string;
  category: string;
  goalAmount: number;
  organizationInfo: {
    name: string;
    contactName: string;
    email: string;
    phone: string;
    logo: string;
  };
  toteDetails: {
    quantity: number;
    numberOfTotes: number;
    unitPrice: number;
    totalAmount: number;
  };
  distributionDetails: {
    type: string;
    cities: string[];
    startDate: string;
    endDate: string;
    locations: Array<{
      name: string;
      address: string;
      contactPerson: string;
      phone: string;
      totesCount: number;
    }>;
  };
  documents: Array<{
    name: string;
    type: string;
  }>;
}

const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleApprove = () => {
    console.log('Approving campaign:', campaign.id);
  };

  const handleReject = () => {
    console.log('Rejecting campaign:', campaign.id);
  };

  const handleReviewDetails = () => {
    console.log('Reviewing details for campaign:', campaign.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{campaign.title}</h3>
          <p className="text-sm text-gray-600">
            Submitted by: <span className="font-medium">{campaign.submittedBy}</span>
          </p>
          <p className="text-sm text-gray-500">Submitted: {campaign.submittedDate}</p>
        </div>
        <StatusBadge status={campaign.status} />
      </div>

      {/* Description & Basic Info */}
      <div className="mb-4">
        <p className="text-gray-700 mb-3">{campaign.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">Category: </span>
            <span className="text-sm font-medium text-gray-900">{campaign.category}</span>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500">Goal Amount: </span>
            <span className="text-lg font-bold text-gray-900">${campaign.goalAmount.toLocaleString()}</span>
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
                <span className="text-sm text-gray-600">{campaign.organizationInfo.name}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Contact: </span>
                <span className="text-sm text-gray-600">{campaign.organizationInfo.contactName}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Email: </span>
                <span className="text-sm text-gray-600">{campaign.organizationInfo.email}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Phone: </span>
                <span className="text-sm text-gray-600">{campaign.organizationInfo.phone}</span>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-500">Logo</span>
              </div>
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
              <span className="text-sm text-gray-600">{campaign.toteDetails.quantity}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Number of Totes: </span>
              <span className="text-sm text-gray-600">{campaign.toteDetails.numberOfTotes}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Unit Price: </span>
              <span className="text-sm text-gray-600">${campaign.toteDetails.unitPrice}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Total: </span>
              <span className="text-sm font-semibold text-gray-900">${campaign.toteDetails.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </ExpandableSection>

        <ExpandableSection
          title="Distribution Details"
          isExpanded={expandedSections.includes('distribution')}
          onToggle={() => toggleSection('distribution')}
        >
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-700">Type: </span>
                <span className="text-sm text-gray-600">{campaign.distributionDetails.type}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Duration: </span>
                <span className="text-sm text-gray-600">
                  {campaign.distributionDetails.startDate} — {campaign.distributionDetails.endDate}
                </span>
              </div>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-700">Cities: </span>
              <span className="text-sm text-gray-600">
                {campaign.distributionDetails.cities.join(', ')}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Distribution Locations:</h4>
              <div className="space-y-3">
                {campaign.distributionDetails.locations.map((location, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <div className="grid md:grid-cols-2 gap-2">
                      <div>
                        <div className="font-medium text-sm text-gray-900">{location.name}</div>
                        <div className="text-sm text-gray-600">{location.address}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">
                          Contact: {location.contactPerson}
                        </div>
                        <div className="text-sm text-gray-600">Phone: {location.phone}</div>
                        <div className="text-sm font-medium text-gray-900">
                          Totes: {location.totesCount}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ExpandableSection>
      </div>

      {/* Documents */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Documents:</h4>
        <div className="flex flex-wrap gap-2">
          {campaign.documents.map((doc, index) => (
            <button
              key={index}
              className="inline-flex items-center px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Download className="w-3 h-3 mr-1" />
              {doc.name}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={handleApprove}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
        >
          <Check className="w-4 h-4 mr-1" />
          Approve
        </button>
        <button
          onClick={handleReject}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
        >
          <X className="w-4 h-4 mr-1" />
          Reject
        </button>
        <button
          onClick={handleReviewDetails}
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
        >
          <Eye className="w-4 h-4 mr-1" />
          Review Details
        </button>
      </div>
    </div>
  );
};

// Sample campaign data
const campaigns = [
  {
    id: 1,
    title: "Tech for Good Initiative",
    status: "pending",
    submittedBy: "TechCorp Inc.",
    submittedDate: "3/20/2025",
    description: "Providing technology solutions for non-profit organizations.",
    category: "Technology",
    goalAmount: 10000,
    organizationInfo: {
      name: "TechCorp Inc.",
      contactName: "John Smith",
      email: "john@techcorp.com",
      phone: "+1 (555) 123-4567",
      logo: "/placeholder-logo.png"
    },
    toteDetails: {
      quantity: 500,
      numberOfTotes: 500,
      unitPrice: 20,
      totalAmount: 10000
    },
    distributionDetails: {
      type: "Physical",
      cities: ["New York", "Los Angeles", "Chicago"],
      startDate: "4/1/2025",
      endDate: "6/30/2025",
      locations: [
        {
          name: "NYC Community Center",
          address: "123 Main St, New York, NY 10001",
          contactPerson: "Sarah Johnson",
          phone: "+1 (555) 987-6543",
          totesCount: 200
        },
        {
          name: "LA Distribution Hub",
          address: "456 Oak Ave, Los Angeles, CA 90210",
          contactPerson: "Mike Davis",
          phone: "+1 (555) 456-7890",
          totesCount: 300
        }
      ]
    },
    documents: [
      { name: "business-plan.pdf", type: "pdf" },
      { name: "financial-overview.xlsx", type: "xlsx" }
    ]
  },
  {
    id: 2,
    title: "Green Energy Project",
    status: "under-review",
    submittedBy: "GreenFuture Ltd.",
    submittedDate: "3/18/2025",
    description: "Installing solar panels in rural communities.",
    category: "Environment",
    goalAmount: 15000,
    organizationInfo: {
      name: "GreenFuture Ltd.",
      contactName: "Emma Wilson",
      email: "emma@greenfuture.org",
      phone: "+1 (555) 234-5678",
      logo: "/placeholder-logo.png"
    },
    toteDetails: {
      quantity: 750,
      numberOfTotes: 750,
      unitPrice: 20,
      totalAmount: 15000
    },
    distributionDetails: {
      type: "Physical",
      cities: ["Austin", "Denver", "Portland"],
      startDate: "4/15/2025",
      endDate: "7/15/2025",
      locations: [
        {
          name: "Austin Green Center",
          address: "789 Pine St, Austin, TX 78701",
          contactPerson: "David Brown",
          phone: "+1 (555) 345-6789",
          totesCount: 300
        },
        {
          name: "Denver Eco Hub",
          address: "321 Elm St, Denver, CO 80202",
          contactPerson: "Lisa Garcia",
          phone: "+1 (555) 678-9012",
          totesCount: 450
        }
      ]
    },
    documents: [
      { name: "project-proposal.pdf", type: "pdf" },
      { name: "environmental-impact.pdf", type: "pdf" }
    ]
  }
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminLayout title="Causes Management" subtitle="Manage and monitor all causes">
      
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

        <div className="space-y-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>
      </AdminLayout>
    </div>
  );
};

export default Index;