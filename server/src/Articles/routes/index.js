import { Router } from 'express';
import articleRoutes from './articles.routes.js';
import facultyRoutes from './faculty.routes.js';
import departmentRoutes from './department.routes.js';

const router = Router();

router.use('/articles', articleRoutes);
router.use('/faculty', facultyRoutes);
router.use('/department', departmentRoutes);

export default router;
