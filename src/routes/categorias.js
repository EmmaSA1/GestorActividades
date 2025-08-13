const express = require('express');
const router = express.Router();
const CategoriaController = require('../controllers/CategoriasController');

// Rutas 
router.get('/', CategoriaController.getAll);
router.get('/usuario/:usuarioId', CategoriaController.getByUser);
router.post('/', CategoriaController.save);
router.put('/:id', CategoriaController.update); 
router.delete('/:id', CategoriaController.delete);

module.exports = router;
