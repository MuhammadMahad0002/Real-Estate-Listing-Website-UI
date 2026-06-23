import User from '../models/User.js';
import ScheduledVisit from '../models/ScheduledVisit.js';

// Get all visit agents
export const getVisitAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: 'visitAgent' })
      .select('fullName email phone role isActive createdAt')
      .sort('-createdAt');
    res.json(agents);
  } catch (error) {
    console.error('Get visit agents error:', error.message);
    res.status(500).json({ message: 'Server error fetching visit agents' });
  }
};

// Update visit agent
export const updateVisitAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone } = req.body;

    const agent = await User.findById(id);
    if (!agent || agent.role !== 'visitAgent') {
      return res.status(404).json({ message: 'Visit agent not found' });
    }

    if (fullName) agent.fullName = fullName;
    if (email) agent.email = email;
    if (phone !== undefined) agent.phone = phone;

    await agent.save();

    res.json({
      id: agent._id,
      fullName: agent.fullName,
      email: agent.email,
      phone: agent.phone,
      role: agent.role,
      isActive: agent.isActive,
    });
  } catch (error) {
    console.error('Update visit agent error:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    res.status(500).json({ message: 'Server error updating visit agent' });
  }
};

// Deactivate visit agent
export const deactivateVisitAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await User.findById(id);

    if (!agent || agent.role !== 'visitAgent') {
      return res.status(404).json({ message: 'Visit agent not found' });
    }

    agent.isActive = !agent.isActive;
    await agent.save();

    res.json({
      message: `Visit agent ${agent.isActive ? 'activated' : 'deactivated'} successfully`,
      id: agent._id,
      isActive: agent.isActive,
    });
  } catch (error) {
    console.error('Deactivate visit agent error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('fullName email phone isActive createdAt')
      .sort('-createdAt');
    res.json(customers);
  } catch (error) {
    console.error('Get customers error:', error.message);
    res.status(500).json({ message: 'Server error fetching customers' });
  }
};

// Get all scheduled visits
export const getVisits = async (req, res) => {
  try {
    const visits = await ScheduledVisit.find()
      .populate('customer', 'fullName email phone')
      .populate('visitAgent', 'fullName email phone')
      .sort('-createdAt');
    res.json(visits);
  } catch (error) {
    console.error('Get visits error:', error.message);
    res.status(500).json({ message: 'Server error fetching visits' });
  }
};

// Assign visit agent to a visit
export const assignVisitAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { visitAgentId } = req.body;

    const visit = await ScheduledVisit.findById(id);
    if (!visit) {
      return res.status(404).json({ message: 'Visit not found' });
    }

    if (visitAgentId) {
      const agent = await User.findOne({ _id: visitAgentId, role: 'visitAgent' });
      if (!agent) {
        return res.status(404).json({ message: 'Visit agent not found' });
      }
      visit.visitAgent = agent._id;
      visit.status = 'assigned';
    } else {
      visit.visitAgent = undefined;
      visit.status = 'pending';
    }

    await visit.save();

    const populatedVisit = await ScheduledVisit.findById(visit._id)
      .populate('customer', 'fullName email phone')
      .populate('visitAgent', 'fullName email phone');

    res.json(populatedVisit);
  } catch (error) {
    console.error('Assign visit agent error:', error.message);
    res.status(500).json({ message: 'Server error assigning visit agent' });
  }
};

// Dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalProperties = 0; // Will be updated when Property model is in use
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalVisitAgents = await User.countDocuments({ role: 'visitAgent' });

    const visits = await ScheduledVisit.find();
    const pendingVisits = visits.filter(v => v.status === 'pending' || v.status === 'assigned').length;
    const completedVisits = visits.filter(v => v.status === 'completed').length;
    const cancelledVisits = visits.filter(v => v.status === 'cancelled').length;

    res.json({
      totalProperties,
      totalCustomers,
      totalVisitAgents,
      totalVisits: visits.length,
      pendingVisits,
      completedVisits,
      cancelledVisits,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error.message);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
};
