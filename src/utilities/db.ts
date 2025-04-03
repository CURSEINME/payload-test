import mysql, { RowDataPacket } from 'mysql2/promise'

interface QueryOptions {
  query: string
  values?: any[]
}
interface TResult extends RowDataPacket {
  id: Buffer
  key: Buffer
  value: string
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  charset: 'utf8',
  waitForConnections: true,
  connectionLimit: 10,
})

export async function queryDatabase({ query, values }: QueryOptions) {
  try {
    const connection = await pool.getConnection()
    const [results] = await connection.execute<TResult[]>(query, values)
    connection.release()
    return results
  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
}
