import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
import express from 'express';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// TODO: Define route to serve index.html
router.use(express.static(path.join(__dirname, '../client')));


router.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'), (err) =>{
        if (err) {
            res.status(500).end();
        }
    });
});

export default router;
