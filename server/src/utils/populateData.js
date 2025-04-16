// utils/populateData.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import logger from './logger.js';
import Faculty from '../Articles/models/faculty.model.js';
import Department from '../Articles/models/department.model.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function populateFacultiesAndDepartments() {
  try {
    const filePath = path.join(
      __dirname,
      '../Articles/list_of_faculties_and_dept_in_uniben.md'
    );
    const data = fs.readFileSync(filePath, 'utf8');

    // Parse the markdown file
    const lines = data.split('\n');

    let currentFaculty = null;
    const faculties = new Map();
    const departments = [];

    for (const line of lines) {
      // Skip empty lines and headers
      if (
        !line.trim() ||
        line.startsWith('Academic Section') ||
        line.startsWith('Faculties')
      ) {
        continue;
      }

      // Check for faculty line
      const facultyMatch = line.match(/^([A-Z]+)\s+(.+)$/);
      if (facultyMatch) {
        const code = facultyMatch[1];
        const title = facultyMatch[2];
        currentFaculty = { code, title };
        faculties.set(code, title);
        continue;
      }

      // Check for department line
      const deptMatch = line.match(/^([A-Z]+)\s+(.+)\s+\(([A-Z]+)\)$/);
      if (deptMatch && currentFaculty) {
        const deptCode = deptMatch[3];
        const deptTitle = deptMatch[2];
        const facultyCode = currentFaculty.code;

        departments.push({
          code: deptCode,
          title: deptTitle,
          faculty: facultyCode,
        });
      }
    }

    // Save faculties to database
    for (const [code, title] of faculties.entries()) {
      await Faculty.findOneAndUpdate(
        { code },
        { code, title },
        { upsert: true, new: true }
      );
    }

    // Save departments to database
    for (const dept of departments) {
      await Department.findOneAndUpdate({ code: dept.code }, dept, {
        upsert: true,
        new: true,
      });
    }

    logger.info(
      `Database populated with ${faculties.size} faculties and ${departments.length} departments`
    );
    return {
      facultiesCount: faculties.size,
      departmentsCount: departments.length,
    };
  } catch (error) {
    logger.error(`Error populating database: ${error.message}`);
    throw error;
  }
}

export default populateFacultiesAndDepartments;
