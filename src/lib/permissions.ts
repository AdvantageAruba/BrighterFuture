/**
 * Role-based permissions configuration
 * Defines default permissions for each role and available permission options
 */

import { supabase } from './supabase';

// Define CRUD operations
export const PERMISSION_OPERATIONS: PermissionOperation[] = [
  {
    id: 'view',
    name: 'View',
    description: 'Read and view data',
    icon: '👁️'
  },
  {
    id: 'create',
    name: 'Create',
    description: 'Create new records',
    icon: '➕'
  },
  {
    id: 'edit',
    name: 'Edit',
    description: 'Modify existing records',
    icon: '✏️'
  },
  {
    id: 'delete',
    name: 'Delete',
    description: 'Remove records',
    icon: '🗑️'
  },
  {
    id: 'manage',
    name: 'Manage',
    description: 'Full administrative control',
    icon: '⚙️'
  }
];

export interface PermissionOperation {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface GranularPermission {
  id: string;
  name: string;
  description: string;
  category: 'management' | 'access' | 'system' | 'communication';
  operations: PermissionOperation[];
  required?: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'management' | 'access' | 'system' | 'communication';
  required?: boolean; // Some permissions might be required for certain roles
}

export interface TabVisibility {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultVisible: boolean;
}

export interface RolePermissions {
  role: string;
  roleName: string;
  description: string;
  defaultPermissions: string[];
  defaultTabs: string[];
  canCustomize: boolean; // Whether this role can have custom permissions
}

// Available permissions
export const AVAILABLE_PERMISSIONS: Permission[] = [
  // Management Permissions
  {
    id: 'students',
    name: 'Student Management',
    description: 'Create, edit, delete, and view student records',
    category: 'management',
    required: false
  },
  {
    id: 'programs',
    name: 'Program Management',
    description: 'Create, edit, and manage educational programs',
    category: 'management',
    required: false
  },
  {
    id: 'classes',
    name: 'Class Management',
    description: 'Create, edit, and manage class groups',
    category: 'management',
    required: false
  },
  {
    id: 'users',
    name: 'User Management',
    description: 'Create, edit, and manage user accounts',
    category: 'management',
    required: false
  },
  {
    id: 'attendance',
    name: 'Attendance Tracking',
    description: 'Record and view student attendance',
    category: 'management',
    required: false
  },
  
  // Access Permissions
  {
    id: 'calendar',
    name: 'Calendar Access',
    description: 'View and manage calendar events',
    category: 'access',
    required: false
  },
  {
    id: 'forms',
    name: 'Forms & Assessments',
    description: 'Access to intake forms and assessments',
    category: 'access',
    required: false
  },
  {
    id: 'notes',
    name: 'Daily Notes',
    description: 'Create and view daily notes',
    category: 'access',
    required: false
  },
  {
    id: 'reports',
    name: 'Reports & Analytics',
    description: 'Generate and view reports',
    category: 'access',
    required: false
  },
  {
    id: 'waiting_list',
    name: 'Waiting List',
    description: 'View and manage waiting list',
    category: 'access',
    required: false
  },
  
  // System Permissions
  {
    id: 'settings',
    name: 'System Settings',
    description: 'Access to system configuration',
    category: 'system',
    required: false
  },
  {
    id: 'backup',
    name: 'Data Backup',
    description: 'Create and manage data backups',
    category: 'system',
    required: false
  },
  {
    id: 'logs',
    name: 'System Logs',
    description: 'View system activity logs',
    category: 'system',
    required: false
  },
  
  // Communication Permissions
  {
    id: 'announcements',
    name: 'Announcements',
    description: 'Create and manage announcements',
    category: 'communication',
    required: false
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Send notifications to users',
    category: 'communication',
    required: false
  }
];

// Granular permissions with CRUD operations
export const GRANULAR_PERMISSIONS: GranularPermission[] = [
  // Management Permissions
  {
    id: 'students',
    name: 'Student Management',
    description: 'Manage student records and information',
    category: 'management',
    operations: [
      { id: 'view', name: 'View', description: 'View student records', icon: '👁️' },
      { id: 'create', name: 'Create', description: 'Add new students', icon: '➕' },
      { id: 'edit', name: 'Edit', description: 'Modify student information', icon: '✏️' },
      { id: 'delete', name: 'Delete', description: 'Remove students', icon: '🗑️' }
    ],
    required: false
  },
  {
    id: 'programs',
    name: 'Program Management',
    description: 'Manage educational programs',
    category: 'management',
    operations: [
      { id: 'view', name: 'View', description: 'View programs', icon: '👁️' },
      { id: 'create', name: 'Create', description: 'Create new programs', icon: '➕' },
      { id: 'edit', name: 'Edit', description: 'Modify programs', icon: '✏️' },
      { id: 'delete', name: 'Delete', description: 'Delete programs', icon: '🗑️' }
    ],
    required: false
  },
  {
    id: 'classes',
    name: 'Class Management',
    description: 'Manage classes and schedules',
    category: 'management',
    operations: [
      { id: 'view', name: 'View', description: 'View classes', icon: '👁️' },
      { id: 'create', name: 'Create', description: 'Create new classes', icon: '➕' },
      { id: 'edit', name: 'Edit', description: 'Modify classes', icon: '✏️' },
      { id: 'delete', name: 'Delete', description: 'Delete classes', icon: '🗑️' }
    ],
    required: false
  },
  {
    id: 'users',
    name: 'User Management',
    description: 'Manage user accounts and roles',
    category: 'management',
    operations: [
      { id: 'view', name: 'View', description: 'View user accounts', icon: '👁️' },
      { id: 'create', name: 'Create', description: 'Create new users', icon: '➕' },
      { id: 'edit', name: 'Edit', description: 'Modify user accounts', icon: '✏️' },
      { id: 'delete', name: 'Delete', description: 'Delete user accounts', icon: '🗑️' }
    ],
    required: false
  },
  {
    id: 'attendance',
    name: 'Attendance Management',
    description: 'Manage student attendance records',
    category: 'management',
    operations: [
      { id: 'view', name: 'View', description: 'View attendance records', icon: '👁️' },
      { id: 'create', name: 'Create', description: 'Record attendance', icon: '➕' },
      { id: 'edit', name: 'Edit', description: 'Modify attendance', icon: '✏️' },
      { id: 'delete', name: 'Delete', description: 'Delete attendance records', icon: '🗑️' }
    ],
    required: false
  },
  {
    id: 'calendar',
    name: 'Calendar Management',
    description: 'Manage events and schedules',
    category: 'access',
    operations: [
      { id: 'view', name: 'View', description: 'View calendar events', icon: '👁️' },
      { id: 'create', name: 'Create', description: 'Create new events', icon: '➕' },
      { id: 'edit', name: 'Edit', description: 'Modify events', icon: '✏️' },
      { id: 'delete', name: 'Delete', description: 'Delete events', icon: '🗑️' }
    ],
    required: false
  },
  {
    id: 'forms',
    name: 'Forms Management',
    description: 'Manage intake forms and assessments',
    category: 'access',
    operations: [
      { id: 'view', name: 'View', description: 'View forms', icon: '👁️' },
      { id: 'create', name: 'Create', description: 'Create new forms', icon: '➕' },
      { id: 'edit', name: 'Edit', description: 'Modify forms', icon: '✏️' },
      { id: 'delete', name: 'Delete', description: 'Delete forms', icon: '🗑️' }
    ],
    required: false
  },
  {
    id: 'notes',
    name: 'Daily Notes Management',
    description: 'Manage daily notes and observations',
    category: 'access',
    operations: [
      { id: 'view', name: 'View', description: 'View daily notes', icon: '👁️' },
      { id: 'create', name: 'Create', description: 'Create new notes', icon: '➕' },
      { id: 'edit', name: 'Edit', description: 'Modify notes', icon: '✏️' },
      { id: 'delete', name: 'Delete', description: 'Delete notes', icon: '🗑️' }
    ],
    required: false
  },
  {
    id: 'reports',
    name: 'Reports Management',
    description: 'Generate and manage reports',
    category: 'access',
    operations: [
      { id: 'view', name: 'View', description: 'View reports', icon: '👁️' },
      { id: 'create', name: 'Create', description: 'Generate reports', icon: '➕' },
      { id: 'edit', name: 'Edit', description: 'Modify reports', icon: '✏️' },
      { id: 'delete', name: 'Delete', description: 'Delete reports', icon: '🗑️' }
    ],
    required: false
  },
  {
    id: 'waiting_list',
    name: 'Waiting List Management',
    description: 'Manage student waiting lists',
    category: 'access',
    operations: [
      { id: 'view', name: 'View', description: 'View waiting list', icon: '👁️' },
      { id: 'create', name: 'Create', description: 'Add to waiting list', icon: '➕' },
      { id: 'edit', name: 'Edit', description: 'Modify waiting list', icon: '✏️' },
      { id: 'delete', name: 'Delete', description: 'Remove from waiting list', icon: '🗑️' }
    ],
    required: false
  },
  // System Permissions
  {
    id: 'settings',
    name: 'System Settings',
    description: 'Manage system configuration',
    category: 'system',
    operations: [
      { id: 'view', name: 'View', description: 'View settings', icon: '👁️' },
      { id: 'edit', name: 'Edit', description: 'Modify settings', icon: '✏️' }
    ],
    required: false
  },
  {
    id: 'backup',
    name: 'Backup Management',
    description: 'Manage system backups',
    category: 'system',
    operations: [
      { id: 'view', name: 'View', description: 'View backups', icon: '👁️' },
      { id: 'create', name: 'Create', description: 'Create backups', icon: '➕' },
      { id: 'manage', name: 'Manage', description: 'Manage backup settings', icon: '⚙️' }
    ],
    required: false
  },
  {
    id: 'logs',
    name: 'System Logs',
    description: 'View and manage system logs',
    category: 'system',
    operations: [
      { id: 'view', name: 'View', description: 'View system logs', icon: '👁️' },
      { id: 'delete', name: 'Delete', description: 'Clear logs', icon: '🗑️' }
    ],
    required: false
  },
  // Communication Permissions
  {
    id: 'announcements',
    name: 'Announcements',
    description: 'Manage announcements and notifications',
    category: 'communication',
    operations: [
      { id: 'view', name: 'View', description: 'View announcements', icon: '👁️' },
      { id: 'create', name: 'Create', description: 'Create announcements', icon: '➕' },
      { id: 'edit', name: 'Edit', description: 'Modify announcements', icon: '✏️' },
      { id: 'delete', name: 'Delete', description: 'Delete announcements', icon: '🗑️' }
    ],
    required: false
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Manage notification settings',
    category: 'communication',
    operations: [
      { id: 'view', name: 'View', description: 'View notifications', icon: '👁️' },
      { id: 'edit', name: 'Edit', description: 'Modify notification settings', icon: '✏️' }
    ],
    required: false
  }
];

// Available tabs for navigation
export const AVAILABLE_TABS: TabVisibility[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Main dashboard with overview and statistics',
    icon: 'Home',
    defaultVisible: true
  },
  {
    id: 'students',
    name: 'Students',
    description: 'Student management and records',
    icon: 'Users',
    defaultVisible: true
  },
  {
    id: 'programs',
    name: 'Programs',
    description: 'Educational programs management',
    icon: 'BookOpen',
    defaultVisible: true
  },
  {
    id: 'classes',
    name: 'Classes',
    description: 'Class groups and assignments',
    icon: 'GraduationCap',
    defaultVisible: true
  },
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Events and scheduling',
    icon: 'Calendar',
    defaultVisible: true
  },
  {
    id: 'attendance',
    name: 'Attendance',
    description: 'Attendance tracking and reports',
    icon: 'CheckSquare',
    defaultVisible: true
  },
  {
    id: 'forms',
    name: 'Forms',
    description: 'Intake forms and assessments',
    icon: 'FileText',
    defaultVisible: true
  },
  {
    id: 'notes',
    name: 'Notes',
    description: 'Daily notes and observations',
    icon: 'StickyNote',
    defaultVisible: true
  },
  {
    id: 'reports',
    name: 'Reports',
    description: 'Analytics and reporting',
    icon: 'BarChart',
    defaultVisible: false
  },
  {
    id: 'announcements',
    name: 'Announcements',
    description: 'System announcements',
    icon: 'Megaphone',
    defaultVisible: true
  },
  {
    id: 'users',
    name: 'Users',
    description: 'User management',
    icon: 'UserCog',
    defaultVisible: false
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'System settings and configuration',
    icon: 'Settings',
    defaultVisible: false
  },
  {
    id: 'waiting_list',
    name: 'Waiting List',
    description: 'Student waiting list management',
    icon: 'Clock',
    defaultVisible: true
  }
];

// Role-based default permissions
export const ROLE_PERMISSIONS: RolePermissions[] = [
  {
    role: 'administrator',
    roleName: 'Administrator',
    description: 'Full system access with all permissions',
    defaultPermissions: [
      'students', 'programs', 'classes', 'users', 'attendance',
      'calendar', 'forms', 'notes', 'reports', 'waiting_list',
      'settings', 'backup', 'logs', 'announcements', 'notifications'
    ],
    defaultTabs: [
      'dashboard', 'students', 'programs', 'classes', 'calendar',
      'attendance', 'forms', 'notes', 'reports',
      'announcements', 'users', 'settings', 'waiting_list'
    ],
    canCustomize: true
  },
  {
    role: 'teacher',
    roleName: 'Teacher',
    description: 'Educational staff with student and class management access',
    defaultPermissions: [
      'students', 'classes', 'attendance', 'calendar', 'forms', 'notes',
      'announcements'
    ],
    defaultTabs: [
      'dashboard', 'students', 'classes', 'calendar', 'attendance',
      'forms', 'notes', 'announcements'
    ],
    canCustomize: true
  },
  {
    role: 'therapist',
    roleName: 'Therapist',
    description: 'Therapy staff with specialized access to student records',
    defaultPermissions: [
      'students', 'forms', 'notes', 'calendar', 'announcements'
    ],
    defaultTabs: [
      'dashboard', 'students', 'forms', 'notes', 'calendar',
      'announcements'
    ],
    canCustomize: true
  },
  {
    role: 'coordinator',
    roleName: 'Program Coordinator',
    description: 'Program management with oversight capabilities',
    defaultPermissions: [
      'students', 'programs', 'classes', 'attendance', 'calendar',
      'forms', 'notes', 'reports', 'announcements'
    ],
    defaultTabs: [
      'dashboard', 'students', 'programs', 'classes', 'calendar',
      'attendance', 'forms', 'notes', 'reports', 'announcements'
    ],
    canCustomize: true
  },
  {
    role: 'parent',
    roleName: 'Parent/Guardian',
    description: 'Limited access to their children\'s information only',
    defaultPermissions: [
      'students', 'calendar', 'forms', 'notes', 'announcements'
    ],
    defaultTabs: [
      'dashboard', 'students', 'calendar', 'forms', 'notes',
      'announcements'
    ],
    canCustomize: false // Parents have fixed permissions for security
  },
  {
    role: 'staff',
    roleName: 'Support Staff',
    description: 'General staff with basic access',
    defaultPermissions: [
      'students', 'calendar', 'forms', 'notes', 'announcements'
    ],
    defaultTabs: [
      'dashboard', 'students', 'calendar', 'forms', 'notes',
      'announcements'
    ],
    canCustomize: true
  }
];

/**
 * Get default permissions for a role (with dynamic override support)
 */
export const getDefaultPermissions = async (role: string): Promise<string[]> => {
  try {
    // First try to get dynamic configuration from database
    const { data: dynamicConfig } = await supabase
      .from('role_configurations')
      .select('default_permissions')
      .eq('role_id', role)
      .single();
    
    if (dynamicConfig?.default_permissions) {
      console.log(`📋 Using dynamic permissions for role ${role}:`, dynamicConfig.default_permissions);
      return dynamicConfig.default_permissions;
    }
  } catch (error) {
    console.log(`📋 No dynamic config for role ${role}, using static defaults`);
  }
  
  // Fallback to static configuration
  const roleConfig = ROLE_PERMISSIONS.find(r => r.role === role);
  return roleConfig ? roleConfig.defaultPermissions : [];
};

/**
 * Get default tabs for a role (with dynamic override support)
 */
export const getDefaultTabs = async (role: string): Promise<string[]> => {
  try {
    // First try to get dynamic configuration from database
    const { data: dynamicConfig } = await supabase
      .from('role_configurations')
      .select('default_tabs')
      .eq('role_id', role)
      .single();
    
    if (dynamicConfig?.default_tabs) {
      console.log(`📋 Using dynamic tabs for role ${role}:`, dynamicConfig.default_tabs);
      return dynamicConfig.default_tabs;
    }
  } catch (error) {
    console.log(`📋 No dynamic config for role ${role}, using static defaults`);
  }
  
  // Fallback to static configuration
  const roleConfig = ROLE_PERMISSIONS.find(r => r.role === role);
  return roleConfig ? roleConfig.defaultTabs : [];
};

/**
 * Get default tabs for a role (synchronous version for use in JSX)
 */
export const getDefaultTabsSync = (role: string): string[] => {
  const roleConfig = ROLE_PERMISSIONS.find(r => r.role === role);
  return roleConfig ? roleConfig.defaultTabs : [];
};

/**
 * Get default permissions for a role (synchronous version for use in JSX)
 */
export const getDefaultPermissionsSync = (role: string): string[] => {
  const roleConfig = ROLE_PERMISSIONS.find(r => r.role === role);
  return roleConfig ? roleConfig.defaultPermissions : [];
};

/**
 * Check if a role can have custom permissions
 */
export const canCustomizePermissions = (role: string): boolean => {
  const roleConfig = ROLE_PERMISSIONS.find(r => r.role === role);
  return roleConfig ? roleConfig.canCustomize : false;
};

/**
 * Get role configuration
 */
export const getRoleConfig = (role: string): RolePermissions | undefined => {
  return ROLE_PERMISSIONS.find(r => r.role === role);
};

/**
 * Get permissions by category
 */
export const getPermissionsByCategory = (category: string): Permission[] => {
  return AVAILABLE_PERMISSIONS.filter(p => p.category === category);
};

/**
 * Validate permissions for a role
 */
export const validatePermissions = (role: string, permissions: string[]): { valid: boolean; errors: string[] } => {
  const roleConfig = getRoleConfig(role);
  const errors: string[] = [];
  
  if (!roleConfig) {
    errors.push('Invalid role');
    return { valid: false, errors };
  }
  
  // Check if all permissions are valid
  const validPermissionIds = AVAILABLE_PERMISSIONS.map(p => p.id);
  const invalidPermissions = permissions.filter(p => !validPermissionIds.includes(p));
  
  if (invalidPermissions.length > 0) {
    errors.push(`Invalid permissions: ${invalidPermissions.join(', ')}`);
  }
  
  // Check required permissions for certain roles
  const requiredPermissions = AVAILABLE_PERMISSIONS.filter(p => p.required);
  const missingRequired = requiredPermissions.filter(p => !permissions.includes(p.id));
  
  if (missingRequired.length > 0) {
    errors.push(`Missing required permissions: ${missingRequired.map(p => p.name).join(', ')}`);
  }
  
  return { valid: errors.length === 0, errors };
};

/**
 * Get permission details by ID
 */
export const getPermissionById = (id: string): Permission | undefined => {
  return AVAILABLE_PERMISSIONS.find(p => p.id === id);
};

/**
 * Get tab details by ID
 */
export const getTabById = (id: string): TabVisibility | undefined => {
  return AVAILABLE_TABS.find(t => t.id === id);
};

// ===== GRANULAR PERMISSION UTILITIES =====

/**
 * Convert granular permissions to flat permission strings
 * Example: { students: ['view', 'create'] } -> ['students.view', 'students.create']
 */
export const flattenGranularPermissions = (granularPermissions: Record<string, string[]>): string[] => {
  const flattened: string[] = [];
  
  Object.entries(granularPermissions).forEach(([permissionId, operations]) => {
    operations.forEach(operation => {
      flattened.push(`${permissionId}.${operation}`);
    });
  });
  
  return flattened;
};

/**
 * Convert flat permission strings to granular permissions
 * Example: ['students.view', 'students.create'] -> { students: ['view', 'create'] }
 */
export const unflattenGranularPermissions = (flatPermissions: string[]): Record<string, string[]> => {
  const granular: Record<string, string[]> = {};
  
  flatPermissions.forEach(permission => {
    const [permissionId, operation] = permission.split('.');
    if (permissionId && operation) {
      if (!granular[permissionId]) {
        granular[permissionId] = [];
      }
      granular[permissionId].push(operation);
    }
  });
  
  return granular;
};

/**
 * Get granular permission details by ID
 */
export const getGranularPermissionById = (id: string): GranularPermission | undefined => {
  return GRANULAR_PERMISSIONS.find(p => p.id === id);
};

/**
 * Get operation details by ID
 */
export const getOperationById = (id: string): PermissionOperation | undefined => {
  return PERMISSION_OPERATIONS.find(op => op.id === id);
};

/**
 * Check if user has specific granular permission
 * Example: hasGranularPermission(userPermissions, 'students', 'create')
 */
export const hasGranularPermission = (
  userPermissions: string[], 
  permissionId: string, 
  operation: string
): boolean => {
  return userPermissions.includes(`${permissionId}.${operation}`);
};

/**
 * Get default granular permissions for a role
 */
export const getDefaultGranularPermissions = (role: string): Record<string, string[]> => {
  const roleConfig = ROLE_PERMISSIONS.find(r => r.role === role);
  if (!roleConfig) return {};
  
  // Convert flat permissions to granular format
  const granular: Record<string, string[]> = {};
  
  roleConfig.defaultPermissions.forEach(permissionId => {
    const granularPermission = getGranularPermissionById(permissionId);
    if (granularPermission) {
      // Default to all operations for backward compatibility
      granular[permissionId] = granularPermission.operations.map(op => op.id);
    }
  });
  
  return granular;
};

/**
 * Get permissions by category for granular permissions
 */
export const getGranularPermissionsByCategory = (): Record<string, GranularPermission[]> => {
  const categories: Record<string, GranularPermission[]> = {
    management: [],
    access: [],
    system: [],
    communication: []
  };
  
  GRANULAR_PERMISSIONS.forEach(permission => {
    categories[permission.category].push(permission);
  });
  
  return categories;
};
