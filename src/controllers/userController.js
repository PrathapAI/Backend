import User from '../models/User.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { Username, Email, Password, FirstName, LastName, PhoneNumber, IsActive } = req.body;
    const newUser = await User.create({
      Username,
      Email,
      Password,
      FirstName,
      LastName,
      PhoneNumber,
      IsActive
    });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { password, ...otherFields } = req.body;
    let updateData = otherFields;
    
    // If password is being updated, hash it first
    if (password) {
      const bcrypt = (await import('bcryptjs')).default;
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.Password = hashedPassword;
    }
    
    const [updated] = await User.update(updateData, { 
      where: { UserID: req.params.id }
    });
    
    if (updated) {
      const updatedUser = await User.findByPk(req.params.id);
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { UserID: req.params.id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
