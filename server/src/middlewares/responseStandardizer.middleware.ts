import { Request, Response, NextFunction } from 'express';

export const responseStandardizer = (req: Request, res: Response, next: NextFunction) => {
  // Skip standardizer for Swagger docs or other static/special paths
  if (req.path.startsWith('/api-docs')) {
    return next();
  }

  const originalJson = res.json;

  res.json = function (body: any): Response {
    // If the body is already in the expected format (has success, message, and data)
    // We just need to check if there are any extra fields that should be moved into data
    if (body && typeof body === 'object' && 'success' in body) {
      const { success, message, data, ...rest } = body;

      // If there are extra fields (like pagination, meta, or custom fields like sessions)
      if (Object.keys(rest).length > 0) {
        // We need to merge them into data
        let newData = data;

        // Handle 'meta' special case: if rest contains meta, we might want to flatten it
        // into the data object if possible, or just keep it as is.
        // User prefers flat structure for pagination.
        let mergedRest = { ...rest };
        if (mergedRest.meta && typeof mergedRest.meta === 'object') {
             const meta = mergedRest.meta;
             delete mergedRest.meta;
             mergedRest = { ...mergedRest, ...meta };
        }

        // If data is missing, create it as an object to hold the rest
        if (newData === undefined || newData === null) {
            newData = mergedRest;
        } else if (Array.isArray(newData)) {
            // If data is an array, we can't merge properties into it easily without changing structure
             newData = {
                items: newData, // STANDARDIZED: Using 'items' consistently
                ...mergedRest
             };
        } else if (typeof newData === 'object') {
            // If data is already an object, merge the rest into it
            newData = {
                ...newData,
                ...mergedRest
            };
        } else {
             // specific edge case: data is a primitive?
             newData = {
                 value: newData,
                 ...mergedRest
             }
        }

        // Call original with standardized structure
        return originalJson.call(this, {
            success,
            message: message || (success ? 'Success' : 'Error'),
            data: newData
        });
      }

      // If perfectly formatted, just pass through (or ensure message is set)
      if (!message) {
         body.message = success ? 'Success' : 'Error';
      }
      return originalJson.call(this, body);
    }

    // If it's a simple object/array without 'success' key, wrap it
    // Assume success = true for simple responses (unless it looks like an error?)
    // But usually error handlers use the formatter.
    // If we are here, it's likely a successful response from a controller returning raw data.

    return originalJson.call(this, {
      success: true,
      message: 'Success',
      data: body
    });
  };

  next();
};
