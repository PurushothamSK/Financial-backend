const User = require('../models/User');

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email role createdAt'); 
    res.status(200).json({data: users, message: 'Users fetched successfully.'});
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
};

module.exports = { getAllUsers };
