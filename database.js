import pg from "pg";
import { Connector } from "@google-cloud/cloud-sql-connector";
const { Pool } = pg;

const connector = new Connector();
const clientOpts = await connector.getOptions({
  instanceConnectionName: "focus-447201:us-west2:focus-user-info",
  ipType: "PUBLIC",
});
const pool = new Pool({
  ...clientOpts,
  user: "postgres",
  password: "Zachandriko_789",
  database: "postgres",
  max: 5,
});

export { pool };
