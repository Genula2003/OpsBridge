const fs = require('fs');

const path = 'components/ui/ThreeDButton.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('size?:')) {
  content = content.replace(
    /variant\?: "primary" \| "secondary" \| "danger";/,
    `variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";`
  );

  content = content.replace(
    /variant = "primary",/,
    `variant = "primary",
  size = "md",`
  );

  content = content.replace(
    /const baseStyles = "([^"]+)";/,
    `const baseStyles = "$1";

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };`
  );

  content = content.replace(
    /danger: "([^"]+)"/,
    `danger: "$1",
    ghost: "bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white shadow-none hover:shadow-none border border-transparent hover:border-white/10"`
  );

  content = content.replace(
    /variants\[variant\],/,
    `variants[variant],
        sizes[size],`
  );

  fs.writeFileSync(path, content);
}
