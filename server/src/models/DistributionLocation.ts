import mongoose, { Document, Schema } from 'mongoose';

export enum LocationType {
  MALL = 'mall',
  METRO_STATION = 'metro_station',
  AIRPORT = 'airport',
  SCHOOL = 'school',
  OTHER = 'other'
}

export interface IDistributionLocation extends Document {
  name: string;
  type: LocationType;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  totesCount: number;
  isActive: boolean;
  openingHours?: string;
  distributionInstructions?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const distributionLocationSchema = new Schema<IDistributionLocation>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: Object.values(LocationType),
      required: true
    },
    address: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    contactPerson: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    totesCount: {
      type: Number,
      default: 0,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    openingHours: {
      type: String,
      trim: true
    },
    distributionInstructions: {
      type: String,
      trim: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  {
    timestamps: true
  }
);

// Create indexes for better query performance
distributionLocationSchema.index({ name: 1 });
distributionLocationSchema.index({ type: 1 });
distributionLocationSchema.index({ isActive: 1 });
distributionLocationSchema.index({ city: 1 });

const DistributionLocation = mongoose.models.DistributionLocation || 
  mongoose.model<IDistributionLocation>('DistributionLocation', distributionLocationSchema);

export default DistributionLocation;
