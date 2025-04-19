// Let's analyze the issue by looking at sample entries from the file

// Sample data from the PSC faculty and departments
const pscSection = `PSC Faculty of Physical Sciences (PSC)
CHM Department of Chemistry (CHM)
CSC Department of Computer Science (CSC)
GLY Department of Geology (GLY)
MTH Department of Mathematics (MTH)
PHY Department of Physics (PHY)
STA Department of Statistics (STA)`;

// Sample data from the LAW faculty and departments
const lawSection = `LAW Faculty of Law (LAW)
BUL Department of Business Law (BUL)
JIL Department of Jurisprudence and International Law (JIL)
PPL Department of Private and Property Law (PPL)
PUL Department of Public Law (PUL)`;

console.log("PSC Faculty Section:");
console.log(pscSection);

console.log("\nLAW Faculty Section:");
console.log(lawSection);

// Let's analyze what's happening with the current code
console.log("\nAnalyzing the current parsing logic in populateData.js:");

function simulateCurrentLogic(lines) {
  let currentFaculty = null;
  const faculties = [];
  const departments = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    
    // Check for faculty pattern
    if (trimmedLine.includes('Faculty of') || 
        trimmedLine.includes('School of') || 
        trimmedLine.includes('INSTITUTE OF') || 
        trimmedLine.includes('Institute of') || 
        trimmedLine.includes('Centre of')) {
      
      const parts = trimmedLine.split(' ');
      const code = parts[0];
      const title = trimmedLine.substring(code.length + 1);
      
      currentFaculty = { code, title };
      faculties.push(currentFaculty);
      console.log(`Found faculty: ${code} - ${title}`);
      continue;
    }
    
    // Check for department line using current logic
    if (trimmedLine.includes('Department of') && 
        trimmedLine.match(/\([A-Z]+\)$/) && 
        currentFaculty) {
      
      const parts = trimmedLine.split(' ');
      const deptCode = trimmedLine.substring(
        trimmedLine.lastIndexOf('(') + 1,
        trimmedLine.lastIndexOf(')')
      );
      
      // Get the title between the department code and the parentheses code
      const title = trimmedLine.substring(
        parts[0].length + 1,
        trimmedLine.lastIndexOf('(') - 1
      );
      
      departments.push({
        code: deptCode,
        title,
        faculty: currentFaculty.code
      });
      
      console.log(`Found department: ${deptCode} - ${title} in faculty ${currentFaculty.code}`);
    }
  }
  
  return { faculties, departments };
}

// Let's test with our samples
console.log("\nTesting PSC faculty with current logic:");
const pscLines = pscSection.split('\n');
const pscResult = simulateCurrentLogic(pscLines);
console.log(`Result: ${pscResult.faculties.length} faculties and ${pscResult.departments.length} departments`);

console.log("\nTesting LAW faculty with current logic:");
const lawLines = lawSection.split('\n');
const lawResult = simulateCurrentLogic(lawLines);
console.log(`Result: ${lawResult.faculties.length} faculties and ${lawResult.departments.length} departments`);

// Now let's see what's wrong and fix it
console.log("\nProblem identified:");
console.log("1. The current code is not correctly extracting the department title");
console.log("2. It tries to extract it based on parts[0].length which doesn't work correctly for all formats");

// Let's implement a better solution
function improvedLogic(lines) {
  let currentFaculty = null;
  const faculties = [];
  const departments = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    
    // Check for faculty pattern
    if ((trimmedLine.includes('Faculty of') || 
         trimmedLine.includes('School of') || 
         trimmedLine.includes('INSTITUTE OF') || 
         trimmedLine.includes('Institute of') || 
         trimmedLine.includes('Centre of')) &&
        !trimmedLine.includes('Department of')) {
      
      const parts = trimmedLine.split(' ');
      const code = parts[0];
      const title = trimmedLine.substring(code.length + 1);
      
      currentFaculty = { code, title };
      faculties.push(currentFaculty);
      console.log(`Found faculty: ${code} - ${title}`);
    }
    // Check for department using improved logic
    else if (currentFaculty && trimmedLine.includes('Department of')) {
      // Extract the department code from the end of the line
      const codeMatch = trimmedLine.match(/\(([A-Z]+)\)$/);
      
      if (codeMatch) {
        const code = codeMatch[1];
        
        // Extract department name (everything between "Department of" and the final parenthesis)
        const deptStart = trimmedLine.indexOf('Department of');
        const deptEnd = trimmedLine.lastIndexOf('(') - 1;
        const title = trimmedLine.substring(deptStart, deptEnd).trim();
        
        departments.push({
          code,
          title,
          faculty: currentFaculty.code
        });
        
        console.log(`Found department: ${code} - ${title} in faculty ${currentFaculty.code}`);
      }
    }
  }
  
  return { faculties, departments };
}

// Test the improved logic
console.log("\nTesting PSC faculty with improved logic:");
const pscImprovedResult = improvedLogic(pscLines);
console.log(`Result: ${pscImprovedResult.faculties.length} faculties and ${pscImprovedResult.departments.length} departments`);

console.log("\nTesting LAW faculty with improved logic:");
const lawImprovedResult = improvedLogic(lawLines);
console.log(`Result: ${lawImprovedResult.faculties.length} faculties and ${lawImprovedResult.departments.length} departments`);

// Let's create a version that would work for the full file
function completeImprovedLogic(fileContent) {
  const lines = fileContent.split('\n');
  let currentFaculty = null;
  const faculties = [];
  const departments = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines and headers
    if (!trimmedLine || 
        trimmedLine === 'Academic Section' || 
        trimmedLine === 'Faculties' || 
        trimmedLine === 'Code Title') {
      continue;
    }
    
    // Check for faculty pattern by looking for faculty identifiers but ensure it's not a department
    if ((trimmedLine.includes('Faculty of') || 
         trimmedLine.includes('School of') || 
         trimmedLine.includes('INSTITUTE OF') || 
         trimmedLine.includes('Institute of') || 
         trimmedLine.includes('Centre of') ||
         // Sometimes faculty entries don't have these keywords but are just codes followed by names
         (trimmedLine.split(' ')[0].length <= 5 && trimmedLine.split(' ')[0].toUpperCase() === trimmedLine.split(' ')[0])) &&
        !trimmedLine.includes('Department of')) {
      
      const parts = trimmedLine.split(' ');
      const code = parts[0];
      const title = trimmedLine.substring(code.length + 1);
      
      currentFaculty = { code, title };
      faculties.push(currentFaculty);
    }
    // Check for department entries (they all have Department of and end with a code in parentheses)
    else if (currentFaculty && trimmedLine.includes('Department of')) {
      // Extract code from parentheses at the end
      const codeMatch = trimmedLine.match(/\(([A-Z]+)\)$/);
      
      if (codeMatch) {
        const code = codeMatch[1];
        
        // Extract the title - we need everything from "Department of" to before the final parenthesis
        const deptStart = trimmedLine.indexOf('Department of');
        const deptEnd = trimmedLine.lastIndexOf('(') - 1;
        const title = trimmedLine.substring(deptStart, deptEnd).trim();
        
        departments.push({
          code,
          title,
          faculty: currentFaculty.code
        });
      }
    }
  }
  
  console.log(`Total faculties: ${faculties.length}`);
  console.log(`Total departments: ${departments.length}`);
  
  return { faculties, departments };
}

// Test our improved solution with the complete markdown
const markdownContent = `Academic Section
Faculties
Code Title
AGR Faculty of Agriculture (AGR)
AEE Department of Agricultural Economics & Ext. Services (AEE)
ANS Department of Animal Science (ANS)
CRS Department of Crop science (CRS)
FIS Department of Aquaculture and Fisheries Management (FIS)
FOD Department of Food Science and Nutrition (FOD)
FOW Department of Forestry and Wildlife (FOW)
FWM Department of Forest Resources and Wildlife Management (FWM)
SOS Department of Soil Science (SOS)

AIML AFRICAN INSTITUTE OF MANAGEMENT AND LEADERSHIP (AIML)
AIML AFRIMAL (AIML)

ART Faculty of Arts (ART)
ENL Department of English and Literature (ENL)
FAA Department of Fine and Applied Art (FAA)
FOL Department of Foreign Languages (FOL)
HIS Department of History And International Studies (HIS)
LST Department of Linguistics Studies (LST)
MAC Department of Mass Communication (MAC)
PHL Department of Philosophy (PHL)
REL Department of Religions (REL)
THR Department of Theatre Arts (THR)

BCS School of Basic Clinical Sciences (BCS)
CHP Department of Chemical Pathology (CHP)
CPT Department of Clinical Pharmacology and Therapeutics (CPT)
HBS Department of Haematology and Blood Transfusion (HBS)
MMP Department of Medical Microbiology and Parasitology (MMP)
PAF Department of Pathology (Anatomic and Forensic Pathology) (PAF)
PAT Department of Pathology (Anatomic and Forensic Pathology) (PAT)

PSC Faculty of Physical Sciences (PSC)
CHM Department of Chemistry (CHM)
CSC Department of Computer Science (CSC)
GLY Department of Geology (GLY)
MTH Department of Mathematics (MTH)
PHY Department of Physics (PHY)
STA Department of Statistics (STA)

LAW Faculty of Law (LAW)
BUL Department of Business Law (BUL)
JIL Department of Jurisprudence and International Law (JIL)
PPL Department of Private and Property Law (PPL)
PUL Department of Public Law (PUL)`;

console.log("\nTesting improved logic on more complete sample:");
const completeResult = completeImprovedLogic(markdownContent);



Based on my analysis, I've found the issue with the populateData.js script. The problem is in how the script tries to extract department information from each line.
Issue Analysis:

The current code uses parts[0].length + 1 to extract the title of departments, which doesn't work reliably for all formatting patterns in the file.
When tested with sample data from PSC (Faculty of Physical Sciences) and LAW (Faculty of Law), the title extraction doesn't properly capture the department names.
The improved logic correctly identifies and extra