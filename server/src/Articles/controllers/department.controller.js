import Department from '../models/department.model.js';

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get department by code
exports.getDepartmentByCode = async (req, res) => {
  try {
    const department = await Department.findOne({ code: req.params.code });

    if (!department) {
      return res.status(404).json({ msg: 'Department not found' });
    }

    res.json(department);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
