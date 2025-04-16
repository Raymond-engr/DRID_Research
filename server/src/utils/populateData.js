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
        line.startsWith('Faculties') ||
        line.startsWith('Code Title')
      ) {
        continue;
      }

      // Check for faculty line (pattern: CODE Faculty of Something (CODE))
      const facultyMatch = line.match(
        /^([A-Z]+)\s+(Faculty of .+|School of .+|Institute of .+|Centre .+|College of .+)\s*(\([A-Z]+\))?$/
      );
      if (facultyMatch) {
        const code = facultyMatch[1];
        const title = facultyMatch[2];
        currentFaculty = { code, title };
        faculties.set(code, title);
        continue;
      }

      // Alternative faculty match for non-standard formats
      const altFacultyMatch = line.match(/^([A-Z_]+)\s+([^(]+)$/);
      if (altFacultyMatch && !line.includes('Department of')) {
        const code = altFacultyMatch[1];
        const title = altFacultyMatch[2].trim();
        currentFaculty = { code, title };
        faculties.set(code, title);
        continue;
      }

      // Check for department line (pattern: CODE Department of Something (CODE))
      const deptMatch = line.match(/^([A-Z_]+)\s+(.+)\s+\(([A-Z_]+)\)$/);
      if (deptMatch && currentFaculty) {
        const deptCode = deptMatch[3];
        const deptTitle = deptMatch[2].trim();
        const facultyCode = currentFaculty.code;

        departments.push({
          code: deptCode,
          title: deptTitle,
          faculty: facultyCode,
        });
      }
    }

    // Clear existing data before inserting new data
    await Faculty.deleteMany({});
    await Department.deleteMany({});

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
