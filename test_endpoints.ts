import { responseStandardizer } from './server/src/middlewares/responseStandardizer.middleware';
import { Request, Response } from 'express';

const testCases = [
  {
    name: 'Standard wrapper paginated array format',
    input: { success: true, data: [{id: 1}], meta: { page: 1, total: 1 } },
    expectedDataIsArray: true,
    expectedMeta: { page: 1, total: 1 }
  },
  {
    name: 'Raw array with meta',
    input: { success: true, items: [{id: 1}], meta: { page: 1, total: 1 } },
    expectedDataIsArray: true,
    expectedMeta: { page: 1, total: 1 }
  },
  {
    name: 'Raw controller array',
    input: { success: true, stores: [{id: 1}], total: 1, page: 1, totalPages: 1 },
    expectedDataIsArray: true,
    expectedMeta: { page: 1, total: 1, totalPages: 1 }
  },
  {
    name: 'Raw controller object',
    input: { success: true, store: {id: 1} },
    expectedDataIsArray: false,
    expectedMeta: undefined
  },
  {
    name: 'No wrapper array',
    input: { stores: [{id: 1}], total: 1, page: 1, totalPages: 1 },
    expectedDataIsArray: true,
    expectedMeta: { page: 1, total: 1, totalPages: 1 }
  },
  {
    name: 'No wrapper, array with other data (should NOT be array)',
    input: { stores: [{id: 1}], someOtherProp: 'test', total: 1, page: 1, totalPages: 1 },
    expectedDataIsArray: false,
    expectedMeta: { page: 1, total: 1, totalPages: 1 }
  }
];

let allPassed = true;

for (const testCase of testCases) {
  const mockReq = { path: '/api/something' } as Request;

  let resOutput: any;
  const mockRes = {
    json: function(body: any) {
      resOutput = body;
      return this as Response;
    }
  } as Response;

  const next = () => {};

  responseStandardizer(mockReq, mockRes, next);

  mockRes.json(testCase.input);

  const isArray = Array.isArray(resOutput.data);
  const hasMeta = !!resOutput.meta;

  if (isArray === testCase.expectedDataIsArray && (hasMeta === !!testCase.expectedMeta)) {
    //
  } else {
    allPassed = false;
    console.log(`Failed: ${testCase.name}`);
    console.log(`Expected array: ${testCase.expectedDataIsArray}, Got: ${isArray}`);
    console.log(`Expected meta: ${!!testCase.expectedMeta}, Got: ${hasMeta}`);
    console.log(`Output: ${JSON.stringify(resOutput)}`);
  }
}

if (allPassed) {
  console.log("All Standardizer checks passed.");
}
