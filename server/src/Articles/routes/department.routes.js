import express from 'express';
import departmentController from '../controllers/faculty.controller.js';

const router = express.Router();

router.get('/', departmentController.getDepartments);
router.get('/:code', departmentController.getDepartmentByCode);

export default router;
