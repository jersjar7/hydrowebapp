// src/components/ui/Navigation/MenuItem.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { BadgeOptions, RouteMenuItem, LinkMenuItem, DividerMenuItem, SectionHeaderMenuItem } from '../../../config/navigation';

// Props for the Badge component
interface BadgeProps {
  options: BadgeOptions;
}

// Badge component for menu items
const Badge: React.FC<BadgeProps> = ({ options }) => {
  const { content, type = 'default', dot = false } = options;
  
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

// Props for the MenuItem component
interface MenuItemProps {
  item: RouteMenuItem | LinkMenuItem | DividerMenuItem | SectionHeaderMenuItem;
  onClick?: () => void;
  depth?: number;
  isActive?: boolean;
}

// Main MenuItem component
const MenuItem: React.FC<MenuItemProps> = ({
  item,
  onClick,
  depth = 0,
  isActive = false
}) => {
  // Return divider
  if (item.type === 'divider') {
    return <div className="my-2 border-t border-gray-200 dark:border-gray-700" />;
  }

  // Return section header
  if (item.type === 'sectionHeader') {
    return (
      <div 
        className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
        data-testid={item.testId}
      >
        {item.label}
      </div>
    );
  }

  // Base styles for menu items
  const baseClasses = "flex items-center w-full px-4 py-2 text-sm font-medium";
  
  // Active state styles
  const activeClasses = isActive
    ? "text-primary-700 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/30"
    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800/50";
  
  // Disabled state styles
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
    return <Badge options={item.badge} />;
  };

  // Route link (internal navigation)
  if (item.type === 'route') {
    return (
      <Link
        to={item.path}
        state={item.state}
        className={`${baseClasses} ${activeClasses} ${disabledClasses} ${depthPadding}`}
        aria-label={item.ariaLabel}
        data-testid={item.testId}
        onClick={item.disabled ? undefined : onClick}
        title={item.disabledReason || item.description}
      >
        {renderIcon()}
        <span>{item.label}</span>
        {renderBadge()}
        {item.shortcut && (
          <span className="ml-auto opacity-70 text-xs">{item.shortcut}</span>
        )}
      </Link>
    );
  }

  // External link
  if (item.type === 'link') {
    return (
      <a
        href={item.href}
        target={item.target || '_blank'}
        rel={item.rel || 'noopener noreferrer'}
        className={`${baseClasses} ${activeClasses} ${disabledClasses} ${depthPadding}`}
        aria-label={item.ariaLabel}
        data-testid={item.testId}
        onClick={item.disabled ? undefined : onClick}
        title={item.disabledReason || item.description}
        download={item.downloadable}
      >
        {renderIcon()}
        <span>{item.label}</span>
        {renderBadge()}
        {item.shortcut && (
          <span className="ml-auto opacity-70 text-xs">{item.shortcut}</span>
        )}
      </a>
    );
  }

  // Fallback for unexpected item types
  return null;
};

export default MenuItem;