import { NextResponse } from 'next/server';
import { testMySQLConnection, isMySQLEnabled } from '@/lib/mysql';

export async function GET() {
  const mysqlEnabled = isMySQLEnabled();
  
  if (!mysqlEnabled) {
    return NextResponse.json({
      status: 'disabled',
      useMySQL: false,
      message: 'MySQL mode is disabled (USE_MYSQL=false). Using JSON / Cloud KV mode.',
    });
  }

  const result = await testMySQLConnection();
  
  return NextResponse.json({
    status: result.connected ? 'connected' : 'error',
    useMySQL: true,
    connection: {
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      database: process.env.MYSQL_DATABASE || 'pizza_house_quetta',
    },
    diagnostic: result,
  });
}
