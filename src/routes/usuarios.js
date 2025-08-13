const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');

// Rutas 
router.get('/', UsuarioController.getAll);
router.get('/:id', UsuarioController.findOne);
router.post('/', UsuarioController.save);
router.put('/update/:id', UsuarioController.update);
router.delete('/delete/:id', UsuarioController.delete);

module.exports = router;
