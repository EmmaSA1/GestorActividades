
const express = require('express');
const db = require('../config/db')
const Joi = require('joi');

const CategoriasController = {
    getAll: async (req, res) => {
        try {
            const categorias = await db('categorias').select('*');
            res.status(200).json(categorias);
        } catch (error) {
            res.status(400).json({ error: error.message });

        }
    },
    findOne: async (req, res) => {
        try {
            const categoria = await db('categorias').where({ id: req.params.id }).first()
            if (!categoria) {
                return res.status(404).json({ error: 'Categoria no encontrada' });
            }
            res.status(200).json(categoria);
        } catch (error) {
            res.status(500).json({ error: 'Error al buscar al usuario', detalles: error.message });
        }
    },
    getByUser: async (req, res) => {
        try {
            const { usuarioId } = req.params;

            const categorias = await db('categorias')
                .leftJoin('tareas', 'categorias.id', 'tareas.categoria_id')
                .where('categorias.usuario_id', usuarioId)
                .select(
                    'categorias.*',
                    db.raw('COUNT(tareas.id) as count')
                )
                .groupBy('categorias.id');

            if (categorias.length === 0) {
                return res.status(404).json({ mensaje: 'No se encontraron categorías para este usuario' });
            }

            res.status(200).json(categorias);
        } catch (error) {
            res.status(500).json({
                error: 'Error al obtener las categorías por usuario',
                detalles: error.message
            });
        }
    },


    save: async (req, res) => {
        const schemaCategoria = Joi.object({
            nombre: Joi.string().max(100).required(),
            descripcion: Joi.string().max(255).required(),
            color: Joi.string().max(10).required(),
            usuarioId: Joi.number().required()
        })

        const { error, value } = schemaCategoria.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: 'Datos invalidos',
                detalles: error.details.map(d => d.message)
            })
        }

        try {
            const existe = await db('categorias').where({ nombre: value.nombre }).first()
            if (existe) {
                return res.status(409).json({ error: 'La categoría ya está registrada' })
            }

            const [id] = await db('categorias').insert({
                nombre: value.nombre,
                descripcion: value.descripcion,
                color: value.color,
                usuario_id: value.usuarioId,
            })

            const nuevaCategoria = await db('categorias').where({ id }).first();
            res.status(201).json({
                detalles: "Categoría creada correctamente",
                categoria: nuevaCategoria
            })

        } catch (error) {
            res.status(400).json({
                error: "Error al crear la categoria",
                detalles: error.message
            })
        }

    },
    update: async (req, res) => {
        const schemaCategoria = Joi.object({
            nombre: Joi.string().max(100).required(),
            descripcion: Joi.string().max(255).required(),
            color: Joi.string().max(10).required(),
            usuarioId: Joi.number().required()
        });

        const { error, value } = schemaCategoria.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: 'Datos inválidos',
                detalles: error.details.map(d => d.message)
            });
        }

        try {
            const { id } = req.params;
            const existe = await db('categorias').where({ id }).first();
            if (!existe) {
                return res.status(404).json({ error: 'Categoría no encontrada' });
            }

            await db('categorias').where({ id }).update({
                nombre: value.nombre,
                descripcion: value.descripcion,
                color: value.color,
                usuarioId: value.usuarioId
            });

            const actualizada = await db('categorias').where({ id }).first();

            res.status(200).json({
                mensaje: 'Categoría actualizada correctamente',
                categoria: actualizada
            });

        } catch (error) {
            res.status(500).json({
                error: 'Error al actualizar la categoría',
                detalles: error.message
            });
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const existe = await db('categorias').where({ id }).first();

            if (!existe) {
                return res.status(404).json({ error: 'Categoría no encontrada' });
            }

            await db('categorias').where({ id }).del();

            res.status(200).json({ mensaje: 'Categoría eliminada correctamente' });
        } catch (error) {
            res.status(500).json({
                error: 'Error al eliminar la categoría',
                detalles: error.message
            });
        }
    }


}

module.exports = CategoriasController;