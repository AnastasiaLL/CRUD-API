import { IncomingMessage, ServerResponse } from "http";
import { isValidUUID, validateUserData } from "../utils";
import { db } from "../db";



export const handleUsersRoute = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
     const { method, url } = req;
     const urlParts = url?.split('/') || [];
     const userId = urlParts[3]

     try {
        //get /api/users/
        if (method === 'GET' && url === '/api/users'){
            const users = await db.getAllUsers()
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(users))
            return
        }

        // GET /api/users/{userId}
        if (method === 'GET' && userId){
            if (!isValidUUID(userId)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid userId format' }));
                return;
            }
    
            const user = await db.getUserByID(userId)
             if (!user) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'User not found' }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user))
            return
        }

        // POST /api/users
        if (method === 'POST' && url === '/api/users'){

            let body = '';

            req.on('error', (err) => {
                console.error('Request error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Request processing error' }));
            });
            
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', async()=>{
                try{
                    const data = JSON.parse(body || '{}');
                    const validation = validateUserData(data)
                    if(!validation.isValid){
                        res.writeHead(400, { 'Content-Type': 'application/json' })
                        res.end(JSON.stringify({ error: validation.error }))
                        return
                    } else {
                        const newUser = await db.createUser(validation.userData!);
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(newUser));
                    }
                }catch (err) {
        if (err instanceof SyntaxError) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON format' }));
        } else {
            console.error('POST error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
    }
            })
            return
        }


        // PUT /api/users/{userId}
        if (method === 'PUT' && userId) {
        if (!isValidUUID(userId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid userId format' }));
            return;
        }

        let body = '';
        
        req.on('error', (err) => {
            console.error('Request error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Request processing error' }));
        });
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
            const data = JSON.parse(body || '{}');
            const validation = validateUserData(data);
            
            if (!validation.isValid) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: validation.error }));
                return;
            }

            const updatedUser = await db.updateUser(userId, validation.userData!);
            if (!updatedUser) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'User not found' }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(updatedUser));
            } catch (err) {
        if (err instanceof SyntaxError) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON format' }));
        } else {
            console.error('PUT error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
    }
        });


        return;
        }

        // DELETE /api/users/{userId}
        if (method === 'DELETE' && userId) {
            if (!isValidUUID(userId)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid userId format' }));
                return;
            }

            const deleted = await db.deleteUser(userId);
            if (!deleted) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'User not found' }));
                return;
            }

            res.writeHead(204);
            return;
        }

    }  catch (error) {
        console.error('Error in users route:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        }));
    }
}