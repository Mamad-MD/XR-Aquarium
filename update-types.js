const fs = require('fs');

const adminPath = 'D:/XR-Aqurium/src/components/dashboard/admin-dashboard.tsx';
let adminCode = fs.readFileSync(adminPath, 'utf8');

// The `data` prop in AdminDashboard has an inline type, not an interface.
// We need to add `students?: any[],` to it.
if (!adminCode.includes('students?: any[]')) {
  adminCode = adminCode.replace(
    'users?: AdminUser[],',
    'users?: AdminUser[],\n    students?: any[],' // just in case
  );
  // Let's just find `projects?: any[],` and put it before that
  adminCode = adminCode.replace(
    'projects?: any[],',
    'students?: any[],\n    projects?: any[],'
  );
  fs.writeFileSync(adminPath, adminCode);
}

const pagePath = 'D:/XR-Aqurium/src/app/[locale]/dashboard/page.tsx';
let pageCode = fs.readFileSync(pagePath, 'utf8');
pageCode = pageCode.replace('// students,', 'students,');
fs.writeFileSync(pagePath, pageCode);
