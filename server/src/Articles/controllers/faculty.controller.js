import Faculty from '../models/faculty.model.js';
import logger from '../../utils/logger.js';

class FacultyController {
  getFaculties = async (req, res) => {
    try {
      const faculties = await Faculty.find();
      res.json(faculties);
    } catch (err) {
      logger.error(`Error retrieving faculties: ${err.message}`);
      res.status(500).send('Server Error');
    }
  };

  // Get faculty by code
  getFacultyByCode = async (req, res) => {
    try {
      const faculty = await Faculty.findOne({ code: req.params.code });

      if (!faculty) {
        logger.warn(`Faculty not found with code: ${req.params.code}`);
        return res.status(404).json({ msg: 'Faculty not found' });
      }

      res.json(faculty);
    } catch (err) {
      logger.error(`Error retrieving faculty by code: ${err.message}`);
      res.status(500).send('Server Error');
    }
  };
}

export default new FacultyController();
