import mongoose from 'mongoose';

const scheduledVisitSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  propertyTitle: { type: String },
  propertyAddress: { type: String },
  propertyImage: { type: String },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customerName: { type: String },
  customerPhone: { type: String },
  visitAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  preferredDate: {
    type: Date,
    required: [true, 'Preferred date is required'],
  },
  timeSlot: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Evening'],
    required: [true, 'Time slot is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'completed', 'cancelled'],
    default: 'pending',
  },
  notes: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: false,
  toJSON: {
    transform(doc, ret) {
      delete ret.__v;
      return ret;
    },
  },
});

const ScheduledVisit = mongoose.model('ScheduledVisit', scheduledVisitSchema);
export default ScheduledVisit;
