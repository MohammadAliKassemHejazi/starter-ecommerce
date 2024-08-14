import config from "../config";
import fs from 'fs';
import path from 'path';

const loadSchemas = async (schemaPath: string): Promise<Schemas> => {
  const schemas: Schemas = {};
  const files = fs.readdirSync(schemaPath);

  await Promise.all(
    files.map(async (file) => {
      if (file.endsWith('.ts')) {
        const schema = (await import(path.join(schemaPath, file))).default;
        Object.assign(schemas, schema);
      }
    })
  );

  return schemas;
};

export const createSwaggerFile = async () => {
  const schemasPath = path.resolve(__dirname, '../../routes/swaggerSchema/');
  const schemas: Schemas = await loadSchemas(schemasPath);

  const paths: Record<string, any> = {}; // Explicitly type the paths as a record with string keys and any values

  Object.keys(schemas).forEach(key => {
    paths[`/api/${key.replace('RouteSchema', '').toLowerCase()}`] = schemas[key];
  });

  const swaggerOptions = {
    openapi: '3.0.0',
    info: {
      title: "Node Express App - Swagger",
      description: "Testing the express swagger API",
      version: "1.0.0",
    },
    servers: [
      { url: `http://localhost:${config.port}` },
    ],
    components: {
      schemas,
    },
    paths,
  };

  const outputPath = path.resolve(__dirname, '../../routes/swaggerSchema/swagger.json');
  fs.writeFileSync(outputPath, JSON.stringify(swaggerOptions, null, 2));

  console.log(`Swagger options have been written to ${outputPath}`);
};

type Schema = {
  tags: string[];
  security?: object[];
  body?: object;
  querystring?: object;
  params?: object;
  response?: object;
};

type Schemas = {
  [key: string]: Schema;
};
