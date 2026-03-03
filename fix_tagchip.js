const fs = require('fs');

const path = 'components/ui/TagChip.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /variant\?: "default" \| "success" \| "outline" \| "destructive";/,
  `variant?: "default" | "success" | "warning" | "outline" | "destructive";`
);

content = content.replace(
  /!active && variant === "outline" && "bg-transparent text-zinc-400 border border-white\/10",/,
  `!active && variant === "outline" && "bg-transparent text-zinc-400 border border-white/10",
        !active && variant === "warning" && "bg-amber-500/10 text-amber-400 border border-amber-500/20",`
);

fs.writeFileSync(path, content);
