import { UserType, ScopeType } from '@senoom/shared';

/**
 * Campus Management Platform - Backend Service Entrypoint
 */
export function initializeServer(): void {
  console.info('Starting Campus Management Platform Backend...');
  console.info(`Initialized with scopes: ${Object.values(ScopeType).join(', ')}`);
  console.info(`Default user types: ${Object.values(UserType).join(', ')}`);
}

if (process.env.NODE_ENV !== 'test') {
  initializeServer();
}
