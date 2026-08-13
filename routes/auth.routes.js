import { Router } from 'express';
import { register, login, getMe, updateProfile} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';


const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/me", protect, getMe);
router.post("/profile", protect, updateProfile);

export default router;