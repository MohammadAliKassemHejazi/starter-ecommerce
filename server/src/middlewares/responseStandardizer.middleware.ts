import { Request, Response, NextFunction } from 'express';

export const responseStandardizer = (req: Request, res: Response, next: NextFunction) => {
  // Skip standardizer for Swagger docs or other static/special paths
  if (req.path.startsWith('/api-docs')) {
    return next();
  }

  const originalJson = res.json;

  res.json = function (body: any): Response {
    // If the body is already in the expected format (has success, message, and data)
    // We just need to check if there are any extra fields that should be moved into data or meta
    if (body && typeof body === 'object' && 'success' in body) {
      const { success, message, data, ...rest } = body;

      // If there are extra fields
      if (Object.keys(rest).length > 0) {
        let metaFields: any = {};
        let mergedRest = { ...rest };

        // Identify pagination or meta fields
        const commonMetaKeys = ['page', 'pageSize', 'total', 'totalPages', 'limit', 'offset'];
        for (const key of commonMetaKeys) {
          if (key in mergedRest) {
            metaFields[key] = mergedRest[key];
            delete mergedRest[key];
          }
        }

        // If there is an existing meta object, merge it
        if (mergedRest.meta && typeof mergedRest.meta === 'object') {
          metaFields = { ...metaFields, ...mergedRest.meta };
          delete mergedRest.meta;
        }

        let newData = data;

        // If data is an array, we leave it as an array to match the frontend contract (e.g., PaginatedApiResponse)
        // We only merge remaining non-meta fields into data if data is an object and not an array
        if (Object.keys(mergedRest).length > 0) {
           if (newData === undefined || newData === null) {
              newData = mergedRest;
           } else if (Array.isArray(newData)) {
              // If data is an array but there are other properties besides meta to merge,
              // we can't easily merge them without breaking the array structure.
              // In this case, we'll wrap the array in a data object. This shouldn't normally happen
              // if controllers just send { data: [], total: x, page: y }
              // But if they send { data: [], otherKey: 'val', page: y }, we must wrap it.
              // Ideally, controllers only return arrays when it's a list, and other metadata goes to 'meta'.
              newData = { items: newData, ...mergedRest };
           } else if (typeof newData === 'object') {
              newData = { ...newData, ...mergedRest };
           } else {
              newData = { value: newData, ...mergedRest };
           }
        }

        const responsePayload: any = {
          success,
          message: message || (success ? 'Success' : 'Error'),
          data: newData,
        };

        if (Object.keys(metaFields).length > 0) {
          responsePayload.meta = metaFields;
        }

        return originalJson.call(this, responsePayload);
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

    // Check if the body itself contains pagination fields
    if (body && typeof body === 'object') {
       let metaFields: any = {};
       let { data: innerData, items, ...restBody } = body;
       let hasMeta = false;

       // Sometimes controllers return { stores: [], total: x }
       // We should try to extract the array and meta
       const commonMetaKeys = ['page', 'pageSize', 'total', 'totalPages', 'limit', 'offset'];
       for (const key of commonMetaKeys) {
          if (key in restBody) {
             metaFields[key] = restBody[key];
             delete restBody[key];
             hasMeta = true;
          }
       }

       if (restBody.meta && typeof restBody.meta === 'object') {
          metaFields = { ...metaFields, ...restBody.meta };
          delete restBody.meta;
          hasMeta = true;
       }

       if (hasMeta) {
          // If the data is an explicit property
          let theData = innerData || items;

          if (!theData) {
             // If there's only one array property, we can assume it's the main data
             const arrayKeys = Object.keys(restBody).filter(k => Array.isArray(restBody[k]));

             if (arrayKeys.length === 1) {
                theData = restBody[arrayKeys[0]];
                delete restBody[arrayKeys[0]];

                // If there are other properties left in restBody, we shouldn't drop them
                if (Object.keys(restBody).length > 0) {
                   theData = { items: theData, ...restBody };
                }
             } else {
                // If there are multiple arrays or no arrays, just use the whole restBody
                theData = restBody;
             }
          } else if (Object.keys(restBody).length > 0) {
             // If innerData or items existed but we still have restBody
             if (Array.isArray(theData)) {
                theData = { items: theData, ...restBody };
             } else if (typeof theData === 'object') {
                theData = { ...theData, ...restBody };
             }
          }

          const responsePayload: any = {
             success: true,
             message: 'Success',
             data: theData,
             meta: metaFields
          };
          return originalJson.call(this, responsePayload);
       }
    }

    return originalJson.call(this, {
      success: true,
      message: 'Success',
      data: body,
    });
  };

  next();
};
