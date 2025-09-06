import React from "react";

interface SurfaceProps {
  level?: 1 | 2;
  className?: string;
  children: React.ReactNode;
}

const Surface: React.FC<SurfaceProps> = ({
  level = 1,
  className = "",
  children,
}) => {
  const glassClass = level === 2 ? "glass level-2" : "glass";
  const combinedClassName = `${glassClass} ${className}`.trim();

  return <div className={combinedClassName}>{children}</div>;
};

export default Surface;
