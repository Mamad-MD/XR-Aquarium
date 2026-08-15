const fs = require('fs');

function fixAdmin() {
  const p = 'D:/XR-Aqurium/src/components/dashboard/admin-dashboard.tsx';
  let c = fs.readFileSync(p, 'utf8');
  if (!c.includes('students?: any[];')) {
    // The previous regex didn't match. Let's find exactly where 'users' is in the interface DashboardData.
    c = c.replace(/users:\s*any\[\];/g, 'users: any[];\n  students?: any[];');
    fs.writeFileSync(p, c);
  }
}

function fixPageTsx() {
  const p = 'D:/XR-Aqurium/src/app/[locale]/dashboard/page.tsx';
  let c = fs.readFileSync(p, 'utf8');
  // Error TS18047 at 204: a.team is possibly null
  // Let's look for `a.team.id` in `teams: p.applications.filter((a) => a.team).map((a) => ({ id: a.team.id`
  c = c.replace(/id:\s*a\.team\.id/g, 'id: a.team!.id');
  c = c.replace(/name:\s*a\.team\.name,/g, 'name: a.team!.name,');
  c = c.replace(/nameFa:\s*a\.team\.nameFa/g, 'nameFa: a.team!.nameFa');
  c = c.replace(/members:\s*a\.team\.members/g, 'members: a.team!.members');
  c = c.replace(/equipment:\s*a\.team\.equipmentRequests/g, 'equipment: a.team!.equipmentRequests');
  fs.writeFileSync(p, c);
}

fixAdmin();
fixPageTsx();
