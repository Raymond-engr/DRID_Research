import Faculty from '../models/faculty.model.js';
exports.getFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.json(faculties);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get faculty by code
exports.getFacultyByCode = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ code: req.params.code });

    if (!faculty) {
      return res.status(404).json({ msg: 'Faculty not found' });
    }

    res.json(faculty);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
