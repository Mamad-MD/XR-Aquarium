const fs = require('fs');
const file = 'src/components/layout/navbar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '>\n                  Dashboard\n                </Link>',
  '>\n                  {t(\'dashboard\')}\n                </Link>'
);
content = content.replace(
  '>\n                  Login\n                </Link>',
  '>\n                  {t(\'login\')}\n                </Link>'
);
content = content.replace(
  '>\n                  Register\n                </Link>',
  '>\n                  {t(\'register\')}\n                </Link>'
);

fs.writeFileSync(file, content);
