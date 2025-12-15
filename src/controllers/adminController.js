
import Admin from '../models/Admin.js';

export const getAdmins = async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const Location = (await import('../models/Location.js')).default;
    const admins = await Admin.findAll({
      include: [
        { model: User, as: 'user', attributes: ['Username', 'Email', 'PhoneNumber', 'Address'] },
        { model: Location, as: 'location', attributes: ['state', 'district', 'mandal', 'village'] }
      ]
    });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { userid, username, email, locationkey, photo } = req.body;
    // TODO: Update adminController.js to match new schema if admin model is present.
    const newAdmin = await Admin.create({ userid, username, email, locationkey, photo });
    res.status(201).json(newAdmin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
