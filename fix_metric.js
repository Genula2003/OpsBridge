const fs = require('fs');

const path = 'components/ui/MetricPill.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /import { motion, useMotionValue, useTransform, animate } from "framer-motion";/,
  `import { motion, useMotionValue, useTransform, animate, useMotionTemplate } from "framer-motion";`
);

content = content.replace(
  /const rounded = useTransform\(count, \(latest\) => Math.round\(latest\)\);/,
  `const rounded = useTransform(count, (latest) => Math.round(latest));
  const display = useMotionTemplate\`\${rounded}\${suffix}\`;`
);

content = content.replace(
  /\{rounded\}\{suffix\}/,
  `{display}`
);

fs.writeFileSync(path, content);
