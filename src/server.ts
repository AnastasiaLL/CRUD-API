import http, { IncomingMessage, ServerResponse } from 'http';
import dotenv from 'dotenv';
import { handleUsersRoute } from './routes/userRoutes';

dotenv.config()
const PORT = process.env.PORT || 4000


const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {

  console.log(`Получен ${req.method} запрос на ${req.url}`);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

   handleRequest(req, res);

})

const handleRequest = (req: IncomingMessage, res: ServerResponse): void => {
  const { url, method } = req;

  if (url && url.startsWith('/api/users')) {
    handleUsersRoute(req, res);
  } else {
    sendResponse(res, 404, { error: 'Endpoint not found' });
  }
};

const sendResponse = (res: ServerResponse, statusCode: number, data: any): void => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

server.listen(PORT, ()=>{
  console.log(`Server listening on http://localhost:${PORT}`);
})

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} already in use`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});