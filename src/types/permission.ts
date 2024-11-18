export interface Permission {
  key: string;
  name: string;
  description: string;
}

export interface PermissionGroup {
  key: string;
  name: string;
  permissions: Permission[];
}

export const defaultPermissions: PermissionGroup[] = [
  {
    key: 'dashboard',
    name: '首页',
    permissions: [
      {
        key: 'dashboard.view',
        name: '查看首页',
        description: '允许查看系统首页',
      },
    ],
  },
  {
    key: 'users',
    name: '用户管理',
    permissions: [
      {
        key: 'users.view',
        name: '查看用户',
        description: '允许查看用户列表',
      },
      {
        key: 'users.create',
        name: '创建用户',
        description: '允许创建新用户',
      },
      {
        key: 'users.edit',
        name: '编辑用户',
        description: '允许编辑用户信息',
      },
      {
        key: 'users.delete',
        name: '删除用户',
        description: '允许删除用户',
      },
    ],
  },
  {
    key: 'roles',
    name: '角色管理',
    permissions: [
      {
        key: 'roles.view',
        name: '查看角色',
        description: '允许查看角色列表',
      },
      {
        key: 'roles.manage',
        name: '管理角色',
        description: '允许创建、编辑和删除角色',
      },
    ],
  },
  {
    key: 'permissions',
    name: '权限管理',
    permissions: [
      {
        key: 'permissions.manage',
        name: '管理权限',
        description: '允许管理系统权限',
      },
    ],
  },
]; 