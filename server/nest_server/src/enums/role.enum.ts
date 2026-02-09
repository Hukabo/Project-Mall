export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export function matchRoles(requiredRoles: Role[], userRoles: string[]) {
  if (!requiredRoles?.length) return true; // 요구되는 역할이 없다면 pass
  if (!userRoles?.length) return false; // 가진 역할이 없다면 block

  return requiredRoles.some((role) => userRoles.includes(role));
}
