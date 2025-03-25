// src/components/ui/Navigation/NestedList.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { MenuItem as MenuItemType, SubMenuItem, findActiveMenuItem } from '../../../config/navigation';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';

interface NestedListProps {
  items: MenuItemType[];
  depth?: number;
  onItemClick?: () => void;
}

const NestedList: React.FC<NestedListProps> = ({ 
  items, 
  depth = 0,
  onItemClick
}) => {
  const location = useLocation();
  
  // Find active menu item based on current path
  const { activeItem, parentChain } = findActiveMenuItem(items, location.pathname);
  
  // Render menu items recursively
  return (
    <div className="w-full">
      {items.map((item) => {
        // Check if current item is active
        const isActive = activeItem ? activeItem.id === item.id : false;
        
        // Check if current item is a parent of the active item
        const isParentOfActive = parentChain.some((parent) => parent.id === item.id);
        
        // For submenu items, recursively render children
        if (item.type === 'submenu') {
          const subMenuItem = item as SubMenuItem;
          
          return (
            <SubMenu
              key={item.id}
              item={subMenuItem}
              depth={depth}
              isActive={isActive}
              isParentOfActive={isParentOfActive}
            >
              <NestedList
                items={subMenuItem.children}
                depth={depth + 1}
                onItemClick={onItemClick}
              />
            </SubMenu>
          );
        }
        
        // For other item types, render the MenuItem component
        return (
          <MenuItem
            key={item.id}
            item={item}
            depth={depth}
            isActive={isActive}
            onClick={onItemClick}
          />
        );
      })}
    </div>
  );
};

export default NestedList;