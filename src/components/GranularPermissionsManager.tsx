import React, { useState, useEffect } from 'react';
import { Shield, Eye, Plus, Edit, Trash2, Settings, ChevronDown, ChevronRight } from 'lucide-react';
import { 
  GRANULAR_PERMISSIONS, 
  PERMISSION_OPERATIONS,
  getGranularPermissionsByCategory,
  getDefaultGranularPermissions,
  flattenGranularPermissions,
  unflattenGranularPermissions,
  GranularPermission,
  PermissionOperation
} from '../lib/permissions';

interface GranularPermissionsManagerProps {
  permissions: string[];
  granularPermissions?: Record<string, string[]>; // Add granular permissions prop
  onPermissionsChange: (permissions: string[]) => void;
  role: string;
  disabled?: boolean;
}

const GranularPermissionsManager: React.FC<GranularPermissionsManagerProps> = ({
  permissions,
  granularPermissions: propGranularPermissions,
  onPermissionsChange,
  role,
  disabled = false
}) => {
  const [granularPermissions, setGranularPermissions] = useState<Record<string, string[]>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    management: true,
    access: true,
    system: false,
    communication: false
  });

  // Convert flat permissions to granular format
  useEffect(() => {
    if (propGranularPermissions) {
      // Use granular permissions from props if available
      setGranularPermissions(propGranularPermissions);
    } else {
      // Fall back to converting flat permissions
      const granular = unflattenGranularPermissions(permissions);
      setGranularPermissions(granular);
    }
  }, [permissions, propGranularPermissions]);

  // Load default permissions when role changes (only if no permissions exist)
  useEffect(() => {
    if (role && Object.keys(granularPermissions).length === 0) {
      const defaults = getDefaultGranularPermissions(role);
      setGranularPermissions(defaults);
      onPermissionsChange(flattenGranularPermissions(defaults));
    }
  }, [role]);

  const handleOperationChange = (permissionId: string, operation: string, checked: boolean) => {
    const newGranular = { ...granularPermissions };
    
    if (!newGranular[permissionId]) {
      newGranular[permissionId] = [];
    }
    
    if (checked) {
      if (!newGranular[permissionId].includes(operation)) {
        newGranular[permissionId].push(operation);
      }
    } else {
      newGranular[permissionId] = newGranular[permissionId].filter(op => op !== operation);
    }
    
    // Remove permission if no operations are selected
    if (newGranular[permissionId].length === 0) {
      delete newGranular[permissionId];
    }
    
    setGranularPermissions(newGranular);
    onPermissionsChange(flattenGranularPermissions(newGranular));
  };

  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    const permission = GRANULAR_PERMISSIONS.find(p => p.id === permissionId);
    if (!permission) return;
    
    const newGranular = { ...granularPermissions };
    
    if (checked) {
      // Select all operations for this permission
      newGranular[permissionId] = permission.operations.map(op => op.id);
    } else {
      // Remove all operations for this permission
      delete newGranular[permissionId];
    }
    
    setGranularPermissions(newGranular);
    onPermissionsChange(flattenGranularPermissions(newGranular));
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getOperationIcon = (operationId: string) => {
    const operation = PERMISSION_OPERATIONS.find(op => op.id === operationId);
    return operation?.icon || '❓';
  };

  const getOperationName = (operationId: string) => {
    const operation = PERMISSION_OPERATIONS.find(op => op.id === operationId);
    return operation?.name || operationId;
  };

  const categories = getGranularPermissionsByCategory();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Shield className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Granular Permissions</h3>
        <span className="text-sm text-gray-500">({Object.keys(granularPermissions).length} permissions selected)</span>
      </div>

      {Object.entries(categories).map(([categoryName, permissions]) => (
        <div key={categoryName} className="border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleCategory(categoryName);
            }}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            disabled={disabled}
          >
            <div className="flex items-center space-x-2">
              {expandedCategories[categoryName] ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
              <span className="font-medium text-gray-900 capitalize">{categoryName}</span>
              <span className="text-sm text-gray-500">({permissions.length} permissions)</span>
            </div>
          </button>

          {expandedCategories[categoryName] && (
            <div className="p-4 space-y-3">
              {permissions.map((permission) => {
                const isPermissionSelected = granularPermissions[permission.id]?.length > 0;
                const selectedOperations = granularPermissions[permission.id] || [];

                return (
                  <div key={permission.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3 mb-3">
                      <input
                        type="checkbox"
                        id={`perm-${permission.id}`}
                        checked={isPermissionSelected}
                        onChange={(e) => handlePermissionToggle(permission.id, e.target.checked)}
                        disabled={disabled}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor={`perm-${permission.id}`} className="text-sm font-medium text-gray-900 cursor-pointer">
                          {permission.name}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">{permission.description}</p>
                      </div>
                    </div>

                    {isPermissionSelected && (
                      <div className="ml-7 space-y-2">
                        <div className="text-xs font-medium text-gray-600 mb-2">Operations:</div>
                        <div className="grid grid-cols-2 gap-2">
                          {permission.operations.map((operation) => (
                            <label
                              key={operation.id}
                              className="flex items-center space-x-2 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedOperations.includes(operation.id)}
                                onChange={(e) => handleOperationChange(permission.id, operation.id, e.target.checked)}
                                disabled={disabled}
                                className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm">{getOperationIcon(operation.id)}</span>
                              <span className="text-xs text-gray-700">{getOperationName(operation.id)}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {Object.keys(granularPermissions).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Shield className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No permissions selected</p>
          <p className="text-sm">Select permissions above to grant access</p>
        </div>
      )}
    </div>
  );
};

export default GranularPermissionsManager;

