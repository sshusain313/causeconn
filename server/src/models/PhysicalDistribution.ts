import mongoose, { Document, Schema } from 'mongoose';
import { IDistributionLocation } from './DistributionLocation';
import { ISponsorship } from './Sponsorship';

export enum DistributionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface IPhysicalDistribution extends Document {
  sponsorship: mongoose.Types.ObjectId | ISponsorship;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingContactName: string;
  shippingPhone: string;
  shippingEmail?: string;
  shippingInstructions?: string;
  trackingNumber?: string;
  shippingProvider?: string;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  deliveryConfirmation: boolean;
  deliverySignature?: string;
  distributionLocations: Array<{
    location: mongoose.Types.ObjectId | IDistributionLocation;
    quantity: number;
    status: DistributionStatus;
    notes?: string;
    distributedDate?: Date;
  }>;
  status: DistributionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const physicalDistributionSchema = new Schema<IPhysicalDistribution>(
  {
    sponsorship: {
      type: Schema.Types.ObjectId,
      ref: 'Sponsorship',
      required: true
    },
    shippingAddress: {
      type: String,
      required: true,
      trim: true
    },
    shippingCity: {
      type: String,
      required: true,
      trim: true
    },
    shippingState: {
      type: String,
      required: true,
      trim: true
    },
    shippingZipCode: {
      type: String,
      required: true,
      trim: true
    },
    shippingContactName: {
      type: String,
      required: true,
      trim: true
    },
    shippingPhone: {
      type: String,
      required: true,
      trim: true
    },
    shippingEmail: {
      type: String,
      trim: true,
      lowercase: true
    },
    shippingInstructions: {
      type: String,
      trim: true
    },
    trackingNumber: {
      type: String,
      trim: true
    },
    shippingProvider: {
      type: String,
      trim: true
    },
    estimatedDeliveryDate: Date,
    actualDeliveryDate: Date,
    deliveryConfirmation: {
      type: Boolean,
      default: false
    },
    deliverySignature: String,
    distributionLocations: [{
      location: {
        type: Schema.Types.ObjectId,
        ref: 'DistributionLocation',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      status: {
        type: String,
        enum: Object.values(DistributionStatus),
        default: DistributionStatus.PENDING
      },
      notes: String,
      distributedDate: Date
    }],
    status: {
      type: String,
      enum: Object.values(DistributionStatus),
      default: DistributionStatus.PENDING
    }
  },
  {
    timestamps: true
  }
);

// Create indexes for better query performance
physicalDistributionSchema.index({ sponsorship: 1 });
physicalDistributionSchema.index({ status: 1 });
physicalDistributionSchema.index({ 'distributionLocations.location': 1 });
physicalDistributionSchema.index({ 'distributionLocations.status': 1 });

const PhysicalDistribution = mongoose.models.PhysicalDistribution || 
  mongoose.model<IPhysicalDistribution>('PhysicalDistribution', physicalDistributionSchema);

export default PhysicalDistribution;
