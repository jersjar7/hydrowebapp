// src/components/ui/Navigation/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { MenuItem, PermissionLevel, FeaturePermission, filterNavigation } from '../../../config/navigation';
import NestedList from './NestedList';
import navigationConfig from '../../../config/navigation';

interface SidebarProps {
  userPermission: PermissionLevel;
  userFeaturePermissions?: FeaturePermission[];
  isOpen?: boolean;
  isMobile?: boolean;
  onClose?: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  userPermission = 'public',
  userFeaturePermissions = [],
  isOpen = true,
  isMobile = false,
  onClose,
  className = '',
}) => {
  // Get filtered navigation items based on user permissions
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  
  // Effect to filter navigation items when dependencies change
  useEffect(() => {
    const items = filterNavigation(
      navigationConfig,
      userPermission,
      userFeaturePermissions,
      isMobile
    );
    setFilteredItems(items);
  }, [userPermission, userFeaturePermissions, isMobile]);

  // Base classes for sidebar
  const sidebarClasses = `
    h-full overflow-y-auto bg-white dark:bg-gray-900 shadow-md
    transition-all duration-300 ease-in-out
    ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0 md:w-16 md:translate-x-0'}
    ${className}
  `;
  
  // Handle click on mobile
  const handleItemClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside className={sidebarClasses}>
      <div className="py-4">
        {/* Logo/Title area */}
        <div className="px-4 py-2 mb-4">
          {isOpen ? (
            <h1 className="text-lg font-bold text-primary-700 dark:text-primary-400">
              HydroWebApp
            </h1>
          ) : (
            <div className="flex justify-center">
              <span className="text-2xl font-bold text-primary-700 dark:text-primary-400">H</span>
            </div>
          )}
        </div>
        
        {/* Navigation list */}
        <NestedList 
          items={filteredItems} 
          onItemClick={handleItemClick}
        />
      </div>
    </aside>
  );
};

export default Sidebar;