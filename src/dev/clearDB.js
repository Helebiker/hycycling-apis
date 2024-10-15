const { Pool } = require("pg");
const { dbEnvironment } = require("../config/dbConfig");

async function emptyTables() {
  const config = {
    host: dbEnvironment.DB_HOST,
    user: dbEnvironment.DB_USER,
    password: dbEnvironment.DB_PASSWORD,
    database: dbEnvironment.DB_NAME,
  };

  const pool = new Pool(config);
  const client = await pool.connect();

  try {
    // Disable foreign key checks
    await client.query(`SET session_replication_role = 'replica'`);

    const showTablesQuery = `
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'`;
    const results = await client.query(showTablesQuery);

    // Sort tables in ascending order
    const tables = results.rows.map(row => row.tablename).sort();

    for (const tableName of tables) {
      const emptyQuery = `TRUNCATE TABLE ${client.escapeIdentifier(tableName)} RESTART IDENTITY CASCADE`;
      await client.query(emptyQuery);
      console.log(`Emptied table ${tableName}`);
    }

    // Re-enable foreign key checks
    await client.query(`SET session_replication_role = 'origin'`);
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
}

exports.emptyTablesRoute = async (req, res) => {
  try {
    await emptyTables();
    res.send("Tables emptied successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while emptying tables");
  }
};