// src/components/ui/Navigation/SubMenu.tsx
import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { SubMenuItem } from '../../../config/navigation';

interface SubMenuProps {
  item: SubMenuItem;
  depth?: number;
  isActive?: boolean;
  isParentOfActive?: boolean;
  children: React.ReactNode;
}

const SubMenu: React.FC<SubMenuProps> = ({
  item,
  depth = 0,
  isActive = false,
  isParentOfActive = false,
  children,
}) => {
  // State for expanded/collapsed
  const [expanded, setExpanded] = useState<boolean>(
    item.forceExpand || item.expanded || isParentOfActive || false
  );

  // Effect to update expanded state when isParentOfActive changes
  useEffect(() => {
    if (isParentOfActive && !expanded) {
      setExpanded(true);
    }
  }, [isParentOfActive, expanded]);

  // Toggle expanded state
  const handleToggle = () => {
    if (item.collapsible !== false) {
      setExpanded(!expanded);
    }
  };

  // Base classes for the submenu header
  const baseClasses = "flex items-center w-full px-4 py-2 text-sm font-medium";
  
  // Active and hover states
  const activeClasses = isActive
    ? "text-primary-700 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/30"
    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800/50";
  
  // Disabled state
  const disabledClasses = item.disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";
  
  // Depth-based padding
  const depthPadding = `pl-${depth * 4 + 4}`;

  // Render icon if available
  const renderIcon = () => {
    if (!item.icon) return null;
    
    // Dynamically get the icon component from lucide-react
    const IconComponent = Icons[item.icon as keyof typeof Icons] as React.FC<{ size?: number, className?: string }>;
    
    if (!IconComponent) {
      console.warn(`Icon not found: ${item.icon}`);
      return null;
    }
    
    return <IconComponent size={18} className="mr-3 flex-shrink-0" />;
  };

  // Render badge if available
  const renderBadge = () => {
    if (!item.badge) return null;
    
    const { content, type = 'default', dot = false } = item.badge;
    
    const badgeClasses = {
      default: 'bg-gray-200 text-gray-800',
      info: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${badgeClasses[type]}`}>
        {dot ? <span className="w-2 h-2 rounded-full inline-block mr-1" /> : null}
        {content}
      </span>
    );
  };

  return (
    <div className="w-full">
      {/* Submenu header */}
      <button
        className={`${baseClasses} ${activeClasses} ${disabledClasses} ${depthPadding}`}
        onClick={handleToggle}
        disabled={item.disabled}
        aria-expanded={expanded}
        aria-controls={`submenu-${item.id}`}
        aria-label={item.ariaLabel}
        data-testid={item.testId}
        title={item.disabledReason || item.description}
      >
        {renderIcon()}
        <span>{item.label}</span>
        {renderBadge()}
        
        {/* Expansion indicator */}
        <div className="ml-auto">
          {expanded ? (
            <Icons.ChevronDown size={16} className="ml-2" />
          ) : (
            <Icons.ChevronRight size={16} className="ml-2" />
          )}
        </div>
      </button>
      
      {/* Submenu children */}
      <div 
        id={`submenu-${item.id}`}
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          expanded ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default SubMenu;