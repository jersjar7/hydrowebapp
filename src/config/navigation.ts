// src/config/navigation.ts

/**
 * Permission level for menu items
 */
export type PermissionLevel = 'public' | 'user' | 'admin';

/**
 * Permission for feature-specific access
 */
export type FeaturePermission = 
  | 'view:projects' 
  | 'edit:projects'
  | 'view:hydraulics' 
  | 'run:calculations'
  | 'view:results'
  | 'export:results';

/**
 * Badge types for menu items
 */
export type BadgeType = 'default' | 'info' | 'success' | 'warning' | 'error';

/**
 * Interface for badge options
 */
export interface BadgeOptions {
  content: string | number;
  type?: BadgeType;
  dot?: boolean;
}

// Define a type containing all the icon names you use from lucide-react
export type IconName = 
  | 'Home' 
  | 'Folder'
  | 'Droplet'
  | 'CloudRain'
  | 'BarChart'
  | 'BookOpen'
  | 'Settings'
  | 'ExternalLink';

/**
 * Base interface for all menu items
 */
export interface BaseMenuItem {
  id: string;
  label: string;
  translationKey?: string; // For i18n
  description?: string;
  icon?: IconName; // Using Lucide icon names for type safety
  permission?: PermissionLevel;
  featurePermissions?: FeaturePermission[];
  disabled?: boolean;
  disabledReason?: string;
  badge?: BadgeOptions;
  shortcut?: string; // Keyboard shortcut
  analyticsId?: string; // For tracking
  showOnMobile?: boolean; // Mobile visibility
  ariaLabel?: string; // Accessibility
  testId?: string; // For testing
}

/**
 * Interface for a route menu item
 */
export interface RouteMenuItem extends BaseMenuItem {
  type: 'route';
  path: string;
  exact?: boolean;
  state?: Record<string, unknown>; // Router state
  isActiveWhen?: (path: string) => boolean; // Custom active state condition
}

/**
 * Interface for a link menu item (external)
 */
export interface LinkMenuItem extends BaseMenuItem {
  type: 'link';
  href: string;
  target?: '_blank' | '_self';
  rel?: string;
  downloadable?: boolean;
}

/**
 * Interface for a submenu item with children
 */
export interface SubMenuItem extends BaseMenuItem {
  type: 'submenu';
  children: MenuItem[];
  expanded?: boolean; // Default expansion state
  expandedOnMobile?: boolean; // Mobile-specific expansion
  collapsible?: boolean; // Whether submenu can be collapsed
  forceExpand?: boolean; // Force expanded state
}

/**
 * Interface for a divider
 */
export interface DividerMenuItem {
  type: 'divider';
  id: string;
  showOnMobile?: boolean;
}

/**
 * Interface for section header
 */
export interface SectionHeaderMenuItem extends BaseMenuItem {
  type: 'sectionHeader';
}

/**
 * Union type for all menu item types
 */
export type MenuItem = 
  | RouteMenuItem 
  | LinkMenuItem 
  | SubMenuItem 
  | DividerMenuItem
  | SectionHeaderMenuItem;

/**
 * Main navigation configuration
 */
const navigationConfig: MenuItem[] = [
  {
    id: 'home',
    type: 'route',
    label: 'Dashboard',
    translationKey: 'nav.dashboard',
    icon: 'Home',
    path: '/',
    exact: true,
    permission: 'public',
    showOnMobile: true,
    ariaLabel: 'Go to Dashboard',
    analyticsId: 'nav_dashboard'
  },
  {
    id: 'projects',
    type: 'route',
    label: 'Projects',
    translationKey: 'nav.projects',
    icon: 'Folder',
    path: '/projects',
    permission: 'user',
    featurePermissions: ['view:projects'],
    showOnMobile: true,
    badge: {
      content: 'New',
      type: 'info'
    },
    ariaLabel: 'Go to Projects',
    analyticsId: 'nav_projects'
  },
  {
    id: 'hydraulics',
    type: 'submenu',
    label: 'Hydraulic Analysis',
    translationKey: 'nav.hydraulics',
    icon: 'Droplet',
    permission: 'user',
    featurePermissions: ['view:hydraulics'],
    expanded: false,
    showOnMobile: true,
    collapsible: true,
    ariaLabel: 'Hydraulic Analysis menu',
    analyticsId: 'nav_hydraulics',
    children: [
      {
        id: 'open-channel',
        type: 'route',
        label: 'Open Channel Flow',
        translationKey: 'nav.hydraulics.openChannel',
        path: '/hydraulics/open-channel',
        permission: 'user',
        featurePermissions: ['view:hydraulics', 'run:calculations'],
        showOnMobile: true,
        ariaLabel: 'Go to Open Channel Flow calculator',
        analyticsId: 'nav_open_channel'
      },
      {
        id: 'culverts',
        type: 'route',
        label: 'Culvert Analysis',
        translationKey: 'nav.hydraulics.culverts',
        path: '/hydraulics/culverts',
        permission: 'user',
        featurePermissions: ['view:hydraulics', 'run:calculations'],
        showOnMobile: true,
        ariaLabel: 'Go to Culvert Analysis calculator',
        analyticsId: 'nav_culverts'
      },
      {
        id: 'bridges',
        type: 'route',
        label: 'Bridge Hydraulics',
        translationKey: 'nav.hydraulics.bridges',
        path: '/hydraulics/bridges',
        permission: 'user',
        featurePermissions: ['view:hydraulics', 'run:calculations'],
        showOnMobile: true,
        ariaLabel: 'Go to Bridge Hydraulics calculator',
        analyticsId: 'nav_bridges'
      },
      {
        id: 'stormwater',
        type: 'route',
        label: 'Stormwater Systems',
        translationKey: 'nav.hydraulics.stormwater',
        path: '/hydraulics/stormwater',
        permission: 'user',
        featurePermissions: ['view:hydraulics', 'run:calculations'],
        disabled: true,
        disabledReason: 'Coming in next release',
        showOnMobile: false,
        badge: {
          content: 'Beta',
          type: 'warning'
        },
        ariaLabel: 'Stormwater Systems calculator (coming soon)',
        analyticsId: 'nav_stormwater'
      },
      {
        id: 'dams',
        type: 'route',
        label: 'Dam & Spillway Analysis',
        translationKey: 'nav.hydraulics.dams',
        path: '/hydraulics/dams',
        permission: 'user',
        featurePermissions: ['view:hydraulics', 'run:calculations'],
        disabled: true,
        disabledReason: 'Coming in next release',
        showOnMobile: false,
        ariaLabel: 'Dam & Spillway Analysis calculator (coming soon)',
        analyticsId: 'nav_dams'
      }
    ]
  },
  {
    id: 'hydrology',
    type: 'submenu',
    label: 'Hydrologic Analysis',
    translationKey: 'nav.hydrology',
    icon: 'CloudRain',
    permission: 'user',
    featurePermissions: ['view:hydraulics'],
    expanded: false,
    showOnMobile: true,
    collapsible: true,
    ariaLabel: 'Hydrologic Analysis menu',
    analyticsId: 'nav_hydrology',
    children: [
      {
        id: 'rainfall-runoff',
        type: 'route',
        label: 'Rainfall-Runoff Modeling',
        translationKey: 'nav.hydrology.rainfallRunoff',
        path: '/hydrology/rainfall-runoff',
        permission: 'user',
        featurePermissions: ['view:hydraulics', 'run:calculations'],
        disabled: true,
        disabledReason: 'Coming in next release',
        showOnMobile: false,
        ariaLabel: 'Rainfall-Runoff Modeling calculator (coming soon)',
        analyticsId: 'nav_rainfall_runoff'
      },
      {
        id: 'hydrographs',
        type: 'route',
        label: 'Hydrograph Development',
        translationKey: 'nav.hydrology.hydrographs',
        path: '/hydrology/hydrographs',
        permission: 'user',
        featurePermissions: ['view:hydraulics', 'run:calculations'],
        disabled: true,
        disabledReason: 'Coming in next release',
        showOnMobile: false,
        ariaLabel: 'Hydrograph Development calculator (coming soon)',
        analyticsId: 'nav_hydrographs'
      },
      {
        id: 'flood-frequency',
        type: 'route',
        label: 'Flood Frequency Analysis',
        translationKey: 'nav.hydrology.floodFrequency',
        path: '/hydrology/flood-frequency',
        permission: 'user',
        featurePermissions: ['view:hydraulics', 'run:calculations'],
        disabled: true,
        disabledReason: 'Coming in next release',
        showOnMobile: false,
        ariaLabel: 'Flood Frequency Analysis calculator (coming soon)',
        analyticsId: 'nav_flood_frequency'
      },
      {
        id: 'watershed',
        type: 'route',
        label: 'Watershed Delineation',
        translationKey: 'nav.hydrology.watershed',
        path: '/hydrology/watershed',
        permission: 'user',
        featurePermissions: ['view:hydraulics', 'run:calculations'],
        disabled: true,
        disabledReason: 'Coming in next release',
        showOnMobile: false,
        ariaLabel: 'Watershed Delineation tool (coming soon)',
        analyticsId: 'nav_watershed'
      }
    ]
  },
  {
    id: 'divider-1',
    type: 'divider',
    showOnMobile: false
  },
  {
    id: 'results',
    type: 'route',
    label: 'Results',
    translationKey: 'nav.results',
    icon: 'BarChart',
    path: '/results',
    permission: 'user',
    featurePermissions: ['view:results'],
    showOnMobile: true,
    ariaLabel: 'View calculation results',
    analyticsId: 'nav_results',
    shortcut: 'Alt+R'
  },
  {
    id: 'documentation',
    type: 'submenu',
    label: 'Documentation',
    translationKey: 'nav.documentation',
    icon: 'BookOpen',
    permission: 'public',
    expanded: false,
    showOnMobile: true,
    collapsible: true,
    ariaLabel: 'Documentation menu',
    analyticsId: 'nav_documentation',
    children: [
      {
        id: 'user-guide',
        type: 'route',
        label: 'User Guide',
        translationKey: 'nav.documentation.userGuide',
        path: '/documentation/user-guide',
        permission: 'public',
        showOnMobile: true,
        ariaLabel: 'Go to User Guide',
        analyticsId: 'nav_user_guide'
      },
      {
        id: 'api-docs',
        type: 'route',
        label: 'API Reference',
        translationKey: 'nav.documentation.apiDocs',
        path: '/documentation/api',
        permission: 'user',
        showOnMobile: false,
        ariaLabel: 'Go to API Reference',
        analyticsId: 'nav_api_docs'
      },
      {
        id: 'technical-papers',
        type: 'submenu',
        label: 'Technical Papers',
        translationKey: 'nav.documentation.technicalPapers',
        permission: 'public',
        expanded: false,
        showOnMobile: false,
        collapsible: true,
        ariaLabel: 'Technical Papers menu',
        analyticsId: 'nav_technical_papers',
        children: [
          {
            id: 'hydraulics-papers',
            type: 'route',
            label: 'Hydraulics',
            translationKey: 'nav.documentation.technicalPapers.hydraulics',
            path: '/documentation/papers/hydraulics',
            permission: 'public',
            showOnMobile: false,
            ariaLabel: 'View Hydraulics technical papers',
            analyticsId: 'nav_hydraulics_papers'
          },
          {
            id: 'hydrology-papers',
            type: 'route',
            label: 'Hydrology',
            translationKey: 'nav.documentation.technicalPapers.hydrology',
            path: '/documentation/papers/hydrology',
            permission: 'public',
            showOnMobile: false,
            ariaLabel: 'View Hydrology technical papers',
            analyticsId: 'nav_hydrology_papers'
          }
        ]
      },
      {
        id: 'external-resources',
        type: 'link',
        label: 'External Resources',
        translationKey: 'nav.documentation.externalResources',
        href: 'https://hydrowebapp.com/resources',
        target: '_blank',
        rel: 'noopener noreferrer',
        permission: 'public',
        icon: 'ExternalLink',
        showOnMobile: false,
        ariaLabel: 'Visit external resources page (opens in new tab)',
        analyticsId: 'nav_external_resources'
      }
    ]
  },
  {
    id: 'divider-2',
    type: 'divider',
    showOnMobile: true
  },
  {
    id: 'settings',
    type: 'route',
    label: 'Settings',
    translationKey: 'nav.settings',
    icon: 'Settings',
    path: '/settings',
    permission: 'user',
    showOnMobile: true,
    ariaLabel: 'Go to Settings',
    analyticsId: 'nav_settings',
    shortcut: 'Alt+S'
  }
];

/**
 * Function to filter navigation items based on user permissions
 * 
 * @param items Navigation items to filter
 * @param userPermission User's permission level
 * @param userFeaturePermissions User's feature-specific permissions
 * @param isMobile Whether the view is on a mobile device
 * @returns Filtered navigation items
 */
export const filterNavigation = (
  items: MenuItem[],
  userPermission: PermissionLevel,
  userFeaturePermissions: FeaturePermission[] = [],
  isMobile: boolean = false
): MenuItem[] => {
  const permissionLevels: Record<PermissionLevel, number> = {
    'public': 0,
    'user': 1,
    'admin': 2
  };

  const userLevel = permissionLevels[userPermission];

  return items.filter(item => {
    // Filter dividers based on mobile view
    if (item.type === 'divider') {
      return isMobile ? !!item.showOnMobile : true;
    }

    // Check permission level for this item
    const itemPermission = item.permission || 'public';
    const itemLevel = permissionLevels[itemPermission];

    // Filter out items requiring higher permission
    if (itemLevel > userLevel) return false;

    // Check mobile visibility if needed
    if (isMobile && item.showOnMobile === false) return false;

    // Check feature permissions
    if (item.featurePermissions && item.featurePermissions.length > 0) {
      const hasRequiredPermissions = item.featurePermissions.some(permission => 
        userFeaturePermissions.includes(permission)
      );
      if (!hasRequiredPermissions) return false;
    }

    // For submenus, recursively filter children
    if (item.type === 'submenu') {
      const filteredChildren = filterNavigation(
        item.children, 
        userPermission,
        userFeaturePermissions,
        isMobile
      );
      
      // If submenu has no visible children, hide the submenu
      if (filteredChildren.length === 0) return false;
      
      // Return a new submenu with filtered children and mobile-specific expansion
      return {
        ...item,
        children: filteredChildren,
        expanded: isMobile ? (item.expandedOnMobile ?? item.expanded) : item.expanded
      };
    }

    // Include other items that passed permission check
    return true;
  });
};

/**
 * Find active menu item based on current path
 * 
 * @param items Navigation items to search
 * @param currentPath Current router path
 * @returns Object with active item and its parents
 */
export const findActiveMenuItem = (
  items: MenuItem[],
  currentPath: string
): { activeItem: MenuItem | null; parentChain: MenuItem[] } => {
  const result: { activeItem: MenuItem | null; parentChain: MenuItem[] } = {
    activeItem: null,
    parentChain: []
  };

  // Helper function for recursive search
  const findActive = (
    menuItems: MenuItem[],
    parents: MenuItem[] = []
  ): boolean => {
    for (const item of menuItems) {
      // Skip dividers and non-navigable items
      if (item.type === 'divider' || item.type === 'sectionHeader') {
        continue;
      }

      // Check for direct match
      if (item.type === 'route') {
        // Use custom matcher if available
        const isActive = item.isActiveWhen 
          ? item.isActiveWhen(currentPath)
          : item.exact 
            ? currentPath === item.path 
            : currentPath.startsWith(item.path);

        if (isActive) {
          result.activeItem = item;
          result.parentChain = [...parents];
          return true;
        }
      }

      // Check children if it's a submenu
      if (item.type === 'submenu') {
        const foundInChildren = findActive(
          item.children, 
          [...parents, item]
        );
        
        if (foundInChildren) {
          return true;
        }
      }
    }

    return false;
  };

  findActive(items);
  return result;
};

export default navigationConfig;