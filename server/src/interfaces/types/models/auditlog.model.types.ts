export interface IAuditLogAttributes {
  id?: string;
  action?: string;
  entity?: string;
  entityId?: string;
  performedById?: string;
    snapshot?: string | null;
    createdAt?: Date;
  updatedAt?: Date;
}
