const express = require('express');
const router = express.Router();
const SubtareasController = require('../controllers/SubtareasController');

router.get('/', SubtareasController.getAll);
router.get('/:id', SubtareasController.findOne);
router.post('/', SubtareasController.save);
router.put('/:id', SubtareasController.update);
router.delete('/:id', SubtareasController.delete);

module.exports = router;

