import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  phone: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['customer', 'visitAgent', 'admin'],
    default: 'customer',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: false,
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  },
});

const User = mongoose.model('User', userSchema);
export default User;
