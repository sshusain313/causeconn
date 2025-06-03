import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { ICause } from './Cause';

export enum SponsorshipStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum DistributionType {
  ONLINE = 'online',
  PHYSICAL = 'physical'
}

export interface IDistributionPoint {
  name: string;
  address: string;
  contactPerson: string;
  phone: string;
  location?: string;
  totesCount?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string;
  distributionInstructions?: string;
  accessibilityInfo?: string;
  photoUrl?: string;
}

export interface IDemographics {
  ageGroups: string[];
  income: string;
  education: string;
  other: string;
}

export enum DistributionLocationType {
  MALL = 'mall',
  METRO_STATION = 'metro_station',
  AIRPORT = 'airport',
  SCHOOL = 'school',
  OTHER = 'other'
}

export interface IDistributionLocation {
  name: string;
  type: string; // Use string instead of enum for better compatibility
  address?: string;
  totesCount?: number;
  contactPerson?: string;
  phone?: string;
  openingHours?: string;
  distributionInstructions?: string;
}

export interface IPhysicalDistributionDetails {
  shippingAddress?: string;
  shippingContactName?: string;
  shippingPhone?: string;
  shippingInstructions?: string;
  trackingNumber?: string;
  shippingProvider?: string;
  estimatedDeliveryDate?: Date;
  deliveryConfirmation?: boolean;
  deliverySignature?: string;
  deliveryDate?: Date;
  distributionLocations?: IDistributionLocation[];
}

export interface ISponsorship extends Document {
  cause: mongoose.Types.ObjectId | ICause;
  organizationName: string;
  contactName: string;
  email: string;
  phone: string;
  toteQuantity: number;
  unitPrice: number;
  totalAmount: number;
  logoUrl: string;
  mockupUrl?: string;
  message: string;
  distributionType: DistributionType;
  distributionPoints: IDistributionPoint[];
  distributionStartDate: Date;
  distributionEndDate: Date;
  distributionDate?: Date; // Keeping for backward compatibility
  physicalDistributionDetails?: IPhysicalDistributionDetails;
  demographics: IDemographics;
  status: SponsorshipStatus;
  approvedBy?: mongoose.Types.ObjectId | IUser;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const sponsorshipSchema = new Schema<ISponsorship>(
  {
    cause: {
      type: Schema.Types.ObjectId,
      ref: 'Cause',
      required: true
    },
    organizationName: {
      type: String,
      required: true
    },
    contactName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    toteQuantity: {
      type: Number,
      required: true,
      min: 1,
      default: 50
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 10
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    logoUrl: {
      type: String,
      required: true
    },
    mockupUrl: {
      type: String,
      required: false
    },
    message: {
      type: String,
      default: ''
    },
    distributionType: {
      type: String,
      enum: Object.values(DistributionType),
      default: DistributionType.ONLINE
    },
    distributionPoints: [{
      name: String,
      address: String,
      contactPerson: String,
      phone: String,
      location: String,
      totesCount: Number,
      coordinates: {
        latitude: Number,
        longitude: Number
      },
      openingHours: String,
      distributionInstructions: String,
      accessibilityInfo: String,
      photoUrl: String
    }],
    physicalDistributionDetails: {
      shippingAddress: String,
      shippingContactName: String,
      shippingPhone: String,
      shippingInstructions: String,
      trackingNumber: String,
      shippingProvider: String,
      estimatedDeliveryDate: Date,
      deliveryConfirmation: Boolean,
      deliverySignature: String,
      deliveryDate: Date,
      distributionLocations: [{
        name: String,
        type: String, // Simplified to just String type
        address: String,
        totesCount: Number,
        contactPerson: String,
        phone: String,
        openingHours: String,
        distributionInstructions: String
      }]
    },
    distributionStartDate: {
      type: Date,
      required: true
    },
    distributionEndDate: {
      type: Date,
      required: true
    },
    distributionDate: {
      type: Date,
      required: false
    },
    demographics: {
      ageGroups: [String],
      income: String,
      education: String,
      other: String
    },
    status: {
      type: String,
      enum: Object.values(SponsorshipStatus),
      default: SponsorshipStatus.PENDING
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    rejectionReason: String
  },
  {
    timestamps: true
  }
);

// Create indexes for better query performance
sponsorshipSchema.index({ cause: 1 });
sponsorshipSchema.index({ status: 1 });
sponsorshipSchema.index({ organizationName: 1 });
sponsorshipSchema.index({ email: 1 });
sponsorshipSchema.index({ createdAt: 1 });

// Calculate totalAmount before saving
sponsorshipSchema.pre('save', function(next) {
  // Calculate total amount if not already set
  if (!this.totalAmount && this.toteQuantity && this.unitPrice) {
    this.totalAmount = this.toteQuantity * this.unitPrice;
  }
  next();
});

// Update cause's currentAmount after sponsorship is saved
sponsorshipSchema.post('save', async function() {
  try {
    // Import Cause model
    const Cause = mongoose.model('Cause');
    
    // Update the cause's current amount
    if (this.cause) {
      await Cause.updateCauseAmount(this.cause);
    }
  } catch (error) {
    console.error('Error updating cause amount:', error);
  }
});

// Update cause's currentAmount after sponsorship is updated
sponsorshipSchema.post('findOneAndUpdate', async function(doc) {
  try {
    if (doc && doc.cause) {
      const Cause = mongoose.model('Cause');
      await Cause.updateCauseAmount(doc.cause);
    }
  } catch (error) {
    console.error('Error updating cause amount after update:', error);
  }
});

// Update cause's currentAmount after sponsorship is removed
// Using findOneAndDelete instead of 'remove' which is deprecated
sponsorshipSchema.post('findOneAndDelete', async function(doc) {
  try {
    if (doc && doc.cause) {
      const Cause = mongoose.model('Cause');
      await Cause.updateCauseAmount(doc.cause);
    }
  } catch (error) {
    console.error('Error updating cause amount after removal:', error);
  }
});

const Sponsorship = mongoose.models.Sponsorship || mongoose.model<ISponsorship>('Sponsorship', sponsorshipSchema);

export default Sponsorship;
