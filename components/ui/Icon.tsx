import React from 'react';
import { icons } from 'lucide-react';

// Define the props for the Icon component
interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: keyof typeof icons;
}

// The Icon component
const Icon = ({ name, ...props }: IconProps) => {
  // Look up the icon component by name
  const LucideIcon = icons[name];

  // If the icon doesn't exist, return null or a fallback
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  // Render the found icon component with the given props
  return <LucideIcon {...props} />;
};

export default Icon;
