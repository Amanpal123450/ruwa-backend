const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { auth, authorizeRole } = require('../middlewares/auth');

router.post('/',auth,authorizeRole("ADMIN"), jobController.createJob);
router.get('/',auth,authorizeRole("USER","ADMIN"), jobController.getJobs);
router.get('/:id', jobController.getJobById);
router.put('/:id',auth,authorizeRole("ADMIN"), jobController.updateJob);
router.delete('/:id',auth,authorizeRole("ADMIN"), jobController.deleteJob);

module.exports = router;
