import db from '../models'; // Import Sequelize models
import { IAuditLogAttributes } from '../interfaces/types/models/auditlog.model.types';
import customError from '../utils/customError';
import auditLogErrors from '../utils/errors/auditLog.errors';

/**
 * Creates an audit log entry for a specific action.
 *
 * @param action - The type of action performed (e.g., "CREATE", "UPDATE", "DELETE").
 * @param entity - The entity being acted upon (e.g., "Product", "User", "Order").
 * @param entityId - The ID of the entity being acted upon.
 * @param performedById - The ID of the user who performed the action.
 * @param snapshot - A JSON representation of the entity's state before/after the action.
 * @returns The created AuditLog entry.
 */
export const createAuditLog = async (
  action: string,
  entity: string,
  entityId: string,
  performedById: string,
  snapshot?: object,
): Promise<IAuditLogAttributes> => {
  try {
    if (!action || !entity || !entityId || !performedById) {
      throw customError(auditLogErrors.MissingRequiredFields);
    }

    const auditLogData: IAuditLogAttributes = {
      action,
      entity,
      entityId,
      performedById,
      snapshot: snapshot ? JSON.stringify(snapshot) : null,
    };

    const auditLogEntry = await db.AuditLog.create(auditLogData);
    return auditLogEntry;
  } catch (error) {
    throw customError(auditLogErrors.AuditLogCreationFailure);
  }
};

export default {
  createAuditLog,
};
