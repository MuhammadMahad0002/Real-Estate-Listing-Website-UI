import ScheduledVisit from '../models/ScheduledVisit.js';

// Get visits assigned to this agent
export const getMyVisits = async (req, res) => {
  try {
    const visits = await ScheduledVisit.find({ visitAgent: req.user.id })
      .populate('customer', 'fullName email phone')
      .populate('property', 'title location images')
      .sort('-preferredDate');

    res.json(visits);
  } catch (error) {
    console.error('Get my visits error:', error.message);
    res.status(500).json({ message: 'Server error fetching visits' });
  }
};

// Update visit status (completed/cancelled)
export const updateVisitStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Status must be "completed" or "cancelled"' });
    }

    const visit = await ScheduledVisit.findOne({
      _id: id,
      visitAgent: req.user.id,
    });

    if (!visit) {
      return res.status(404).json({ message: 'Visit not found or not assigned to you' });
    }

    if (visit.status !== 'assigned') {
      return res.status(400).json({ message: `Cannot update visit with status "${visit.status}"` });
    }

    visit.status = status;
    await visit.save();

    const updatedVisit = await ScheduledVisit.findById(visit._id)
      .populate('customer', 'fullName email phone')
      .populate('property', 'title location images');

    res.json(updatedVisit);
  } catch (error) {
    console.error('Update visit status error:', error.message);
    res.status(500).json({ message: 'Server error updating visit status' });
  }
};
