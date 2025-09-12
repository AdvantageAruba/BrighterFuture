/**
 * Role-based permissions configuration
 * Defines default permissions for each role and available permission options
 */

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
    id: 'messages',
    name: 'Messages',
    description: 'Send and receive internal messages',
    category: 'communication',
    required: false
  },
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
    id: 'messages',
    name: 'Messages',
    description: 'Internal messaging system',
    icon: 'MessageSquare',
    defaultVisible: true
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
      'settings', 'backup', 'logs', 'messages', 'announcements', 'notifications'
    ],
    defaultTabs: [
      'dashboard', 'students', 'programs', 'classes', 'calendar',
      'attendance', 'forms', 'notes', 'reports', 'messages',
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
      'messages', 'announcements'
    ],
    defaultTabs: [
      'dashboard', 'students', 'classes', 'calendar', 'attendance',
      'forms', 'notes', 'messages', 'announcements'
    ],
    canCustomize: true
  },
  {
    role: 'therapist',
    roleName: 'Therapist',
    description: 'Therapy staff with specialized access to student records',
    defaultPermissions: [
      'students', 'forms', 'notes', 'calendar', 'messages', 'announcements'
    ],
    defaultTabs: [
      'dashboard', 'students', 'forms', 'notes', 'calendar',
      'messages', 'announcements'
    ],
    canCustomize: true
  },
  {
    role: 'coordinator',
    roleName: 'Program Coordinator',
    description: 'Program management with oversight capabilities',
    defaultPermissions: [
      'students', 'programs', 'classes', 'attendance', 'calendar',
      'forms', 'notes', 'reports', 'messages', 'announcements'
    ],
    defaultTabs: [
      'dashboard', 'students', 'programs', 'classes', 'calendar',
      'attendance', 'forms', 'notes', 'reports', 'messages', 'announcements'
    ],
    canCustomize: true
  },
  {
    role: 'parent',
    roleName: 'Parent/Guardian',
    description: 'Limited access to their children\'s information only',
    defaultPermissions: [
      'students', 'calendar', 'forms', 'notes', 'messages', 'announcements'
    ],
    defaultTabs: [
      'dashboard', 'students', 'calendar', 'forms', 'notes',
      'messages', 'announcements'
    ],
    canCustomize: false // Parents have fixed permissions for security
  },
  {
    role: 'staff',
    roleName: 'Support Staff',
    description: 'General staff with basic access',
    defaultPermissions: [
      'students', 'calendar', 'forms', 'notes', 'messages', 'announcements'
    ],
    defaultTabs: [
      'dashboard', 'students', 'calendar', 'forms', 'notes',
      'messages', 'announcements'
    ],
    canCustomize: true
  }
];

/**
 * Get default permissions for a role
 */
export const getDefaultPermissions = (role: string): string[] => {
  const roleConfig = ROLE_PERMISSIONS.find(r => r.role === role);
  return roleConfig ? roleConfig.defaultPermissions : [];
};

/**
 * Get default tabs for a role
 */
export const getDefaultTabs = (role: string): string[] => {
  const roleConfig = ROLE_PERMISSIONS.find(r => r.role === role);
  return roleConfig ? roleConfig.defaultTabs : [];
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
