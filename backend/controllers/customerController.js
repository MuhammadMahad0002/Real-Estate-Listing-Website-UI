import ScheduledVisit from '../models/ScheduledVisit.js';
import User from '../models/User.js';

// Schedule a new visit
export const scheduleVisit = async (req, res) => {
  try {
    const { propertyId, propertyTitle, propertyAddress, propertyImage, preferredDate, timeSlot, notes } = req.body;

    if (!propertyId || !preferredDate || !timeSlot) {
      return res.status(400).json({ message: 'Please provide propertyId, preferredDate, and timeSlot' });
    }

    if (!['Morning', 'Afternoon', 'Evening'].includes(timeSlot)) {
      return res.status(400).json({ message: 'timeSlot must be Morning, Afternoon, or Evening' });
    }

    // Get customer info from auth
    const customer = await User.findById(req.user.id);

    const visit = await ScheduledVisit.create({
      property: propertyId,
      propertyTitle: propertyTitle || '',
      propertyAddress: propertyAddress || '',
      propertyImage: propertyImage || '',
      customer: req.user.id,
      customerName: customer.fullName,
      customerPhone: customer.phone,
      preferredDate: new Date(preferredDate),
      timeSlot,
      notes: notes || '',
      status: 'pending',
    });

    console.log(`Visit scheduled by ${customer.email} for property ${propertyId}`);

    const populatedVisit = await ScheduledVisit.findById(visit._id)
      .populate('customer', 'fullName email phone');

    res.status(201).json(populatedVisit);
  } catch (error) {
    console.error('Schedule visit error:', error.message);
    res.status(500).json({ message: 'Server error scheduling visit' });
  }
};

// Get customer's own visits
export const getMyVisits = async (req, res) => {
  try {
    const visits = await ScheduledVisit.find({ customer: req.user.id })
      .populate('visitAgent', 'fullName email phone')
      .sort('-createdAt');
    res.json(visits);
  } catch (error) {
    console.error('Get my visits error:', error.message);
    res.status(500).json({ message: 'Server error fetching visits' });
  }
};
