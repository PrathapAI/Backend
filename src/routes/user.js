
import express from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/userController.js';
const router = express.Router();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

export default router;

