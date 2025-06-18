export type UserRole = "sponsor" | "claimer" | "admin" | "user";

export interface User {
  _id?: string;
  email: string;
  phone?: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sponsorship {
  _id: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'failed';
  organizationName: string;
  toteQuantity: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cause {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  status: string;
  location: string;
  creator: {
    _id: string;
    name: string;
    email: string;
  };
  hasApprovedSponsorship: boolean;
  sponsorships: Sponsorship[];
  createdAt: string;
  updatedAt: string;
}

export interface Sponsor {
  _id?: string;
  userId: string;
  name: string;
  logo?: string;
  amount: number;
  createdAt: Date;
}

export interface ToteClaim {
  _id?: string;
  causeId: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: "pending" | "verified" | "processing" | "shipped" | "delivered";
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  fromWaitlist?: boolean;
}

export interface Waitlist {
  _id?: string;
  causeId: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  message?: string;
  notifyEmail: boolean;
  notifySms: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  status: "waiting" | "notified" | "claimed" | "expired";
  magicLinkToken?: string;
  magicLinkSentAt?: Date;
  magicLinkExpires?: Date;
}

export interface ClaimStatus {
  id: string;
  label: string;
  date: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface MagicLinkPayload {
  token: string;
  userId: string;
  waitlistId: string;
  causeId: string;
  email: string;
  expires: Date;
}
