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
        let newData = data;
        let metaObj = undefined;

        // Check if there are keys that belong in meta
        const metaKeys = ['page', 'pageSize', 'total', 'totalPages', 'itemCount', 'itemsPerPage', 'currentPage', 'totalItems', 'limit'];
        const extractedMeta: any = {};
        const otherRest: any = {};

        for (const [key, value] of Object.entries(rest)) {
          if (key === 'meta' && typeof value === 'object') {
            Object.assign(extractedMeta, value);
          } else if (metaKeys.includes(key)) {
            extractedMeta[key] = value;
          } else {
            otherRest[key] = value;
          }
        }

        if (Object.keys(extractedMeta).length > 0) {
          metaObj = extractedMeta;
        }

        // Identify the data array/object from otherRest if newData is undefined
        if (newData === undefined || newData === null) {
          // Dynamically find the array key (e.g. products, stores, items)
          const arrayKeys = Object.keys(otherRest).filter(key => Array.isArray(otherRest[key]));

          if (arrayKeys.length === 1 && Object.keys(otherRest).length === 1) {
            // Exactly one array found and no other properties, assume it is the paginated data
            newData = otherRest[arrayKeys[0]];
            delete otherRest[arrayKeys[0]];
          } else if (Object.keys(otherRest).length > 0) {
            // If it's just some other object properties, multiple arrays, or an array with other data
            newData = otherRest;
          } else {
            newData = [];
          }
        } else if (Array.isArray(newData)) {
          // Keep as array, we extracted meta to the top level
          // If there are other properties, standard PaginatedApiResponse expects array, but we shouldn't lose data.
          // In standard cases, PaginatedApiResponse expects just an array in data.
          // If there's other extra data (not meta), we shouldn't discard it, but we have to fit it.
          // If we attach it to the array, it's non-standard JSON but valid JS.
          // Let's wrap it in an object if there are other properties.
          if (Object.keys(otherRest).length > 0) {
             newData = { items: newData, ...otherRest };
          }
        } else if (typeof newData === 'object') {
          // If data is an object, add remaining properties
          newData = { ...newData, ...otherRest };
        }

        const standardResponse: any = {
          success,
          message: message || (success ? 'Success' : 'Error'),
          data: newData,
        };

        if (metaObj) {
          standardResponse.meta = metaObj;
        }

        // Call original with standardized structure
        return originalJson.call(this, standardResponse);
      }

      // If perfectly formatted, just pass through (or ensure message is set)
      if (!message) {
        body.message = success ? 'Success' : 'Error';
      }
      return originalJson.call(this, body);
    }

    // If it's a simple object/array without 'success' key, wrap it
    // Handle the case where controller returns { stores: [...], total, page } directly
    if (body && typeof body === 'object' && !Array.isArray(body) && !('success' in body)) {
      const metaKeys = ['page', 'pageSize', 'total', 'totalPages', 'itemCount', 'itemsPerPage', 'currentPage', 'totalItems', 'limit'];
      const extractedMeta: any = {};
      const otherData: any = {};

      let dataIsArray = false;
      let arrayData: any[] = [];

      // Separate meta keys from other properties
      for (const [key, value] of Object.entries(body)) {
        if (key === 'meta' && typeof value === 'object') {
          Object.assign(extractedMeta, value);
        } else if (metaKeys.includes(key)) {
          extractedMeta[key] = value;
        } else {
          otherData[key] = value;
        }
      }

      // Dynamically check if one of the remaining properties is an array
      const remainingKeys = Object.keys(otherData);
      const remainingArrayKeys = remainingKeys.filter(key => Array.isArray(otherData[key]));

      // Only promote array to `data` root if it is the ONLY property left.
      // If there are other non-meta properties, keep them in an object to avoid data loss.
      if (remainingArrayKeys.length === 1 && remainingKeys.length === 1) {
        dataIsArray = true;
        arrayData = otherData[remainingArrayKeys[0]];
      }

      const hasMeta = Object.keys(extractedMeta).length > 0;

      if (hasMeta || dataIsArray) {
        const standardResponse: any = {
          success: true,
          message: 'Success',
          data: dataIsArray ? arrayData : otherData,
        };

        if (hasMeta) {
          standardResponse.meta = extractedMeta;
        }

        return originalJson.call(this, standardResponse);
      }
    }

    // Default wrapping
    return originalJson.call(this, {
      success: true,
      message: 'Success',
      data: body,
    });
  };

  next();
};
