import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink } from 'lucide-react';

interface Claim {
  _id: string;
  causeTitle: string;
  fullName: string;
  email: string;
  status: string;
  createdAt: string;
}

interface ClaimsResponse {
  claims: Claim[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'verified':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface RecentClaimsProps {
  claims?: Claim[];
  isLoading?: boolean;
  error?: any;
}

const RecentClaims = ({ claims, isLoading, error }: RecentClaimsProps) => {
  const navigate = useNavigate();

  // const handleViewDetails = (claimId: string) => {
  //   navigate(`/admin/claims/${claimId}`);
  // };

  // const handleViewAllClaims = () => {
  //   navigate('/admin/claims');
  // };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        Error loading recent claims
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Claims</h2>
        {/* <Button variant="outline" size="sm" onClick={handleViewAllClaims}>
          View All Claims
        </Button> */}
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Cause</TableHead>
              <TableHead>Claimer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              {/* <TableHead className="text-right">Action</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {claims?.map((claim) => (
              <TableRow key={claim._id}>
                <TableCell>
                  {format(new Date(claim.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{claim.causeTitle}</TableCell>
                <TableCell>{claim.fullName}</TableCell>
                <TableCell>{claim.email}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(claim.status)}>
                    {claim.status}
                  </Badge>
                </TableCell>
                {/* <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewDetails(claim._id)}
                    className="flex items-center gap-1"
                  >
                    View Details
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecentClaims;
