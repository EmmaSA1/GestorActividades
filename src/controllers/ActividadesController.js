const db = require('../config/db');
const Joi = require('joi');

const ActividadesController = {
    getAll: async (req, res) => {
        try {
            const tareas = await db('tareas').select('*');
            res.status(200).json(tareas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    findByUser: async (req, res) => {
        try {
            const { usuarioId } = req.params;
            const tareas = await db('tareas').where({ usuario_id: usuarioId });
    
            if (tareas.length === 0) {
                return res.status(404).json({ mensaje: 'No se encontraron tareas para este usuario' });
            }
    
            res.status(200).json(tareas);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener tareas por usuario', detalles: error.message });
        }
    },
    findByCategoria: async (req, res) => {
        try {
            const { categoriaId } = req.params;
            const tareas = await db('tareas').where({ categoria_id: categoriaId });
    
            if (tareas.length === 0) {
                return res.status(404).json({ mensaje: 'No se encontraron tareas para esta categoría' });
            }
    
            res.status(200).json(tareas);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener tareas por categoría', detalles: error.message });
        }
    },
    findToday: async (req, res) => {
        try {
            const hoy = new Date().toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
            
            const tareas = await db('tareas')
                .whereRaw('DATE(fecha_vencimiento) = ?', [hoy])
                .orWhereRaw('DATE(fecha_creacion) = ?', [hoy]);
    
            if (tareas.length === 0) {
                return res.status(404).json({ mensaje: 'No hay tareas para hoy' });
            }
    
            res.status(200).json(tareas);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener tareas de hoy', detalles: error.message });
        }
    },
    

    findOne: async (req, res) => {
        try {
            const tarea = await db('tareas').where({ id: req.params.id }).first();
            if (!tarea) {
                return res.status(404).json({ error: 'Tarea no encontrada' });
            }
            res.status(200).json(tarea);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    save: async (req, res) => {
        const schema = Joi.object({
            titulo: Joi.string().max(100).required(),
            descripcion: Joi.string().allow(''),
            fecha_creacion: Joi.date().required(),
            fecha_vencimiento: Joi.date().required(),
            prioridad: Joi.string().valid('baja', 'media', 'alta').required(),
            estado: Joi.string().valid('pendiente', 'completada').required(),
            usuario_id: Joi.number().required(),
            categoria_id: Joi.number().required(),
        });

        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: 'Datos inválidos',
                detalles: error.details.map(d => d.message)
            });
        }

        try {
            const [id] = await db('tareas').insert(value);
            const nuevaTarea = await db('tareas').where({ id }).first();
            res.status(201).json({
                mensaje: 'Tarea creada correctamente',
                tarea: nuevaTarea
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    update: async (req, res) => {
        const schema = Joi.object({
            titulo: Joi.string().max(100).required(),
            descripcion: Joi.string().allow('').required(),
            fecha_creacion: Joi.date().required(),
            fecha_vencimiento: Joi.date().required(),
            prioridad: Joi.string().valid('baja', 'media', 'alta').required(),
            estado: Joi.string().valid('pendiente', 'completada').required(),
            usuario_id: Joi.number().required(),
            categoria_id: Joi.number().required(),
        });

        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: 'Datos inválidos',
                detalles: error.details.map(d => d.message)
            });
        }

        try {
            const { id } = req.params;
            const existe = await db('tareas').where({ id }).first();
            if (!existe) {
                return res.status(404).json({ error: 'Tarea no encontrada' });
            }

            await db('tareas').where({ id }).update(value);
            const tareaActualizada = await db('tareas').where({ id }).first();
            res.status(200).json({
                mensaje: 'Tarea actualizada correctamente',
                tarea: tareaActualizada
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const existe = await db('tareas').where({ id }).first();
            if (!existe) {
                return res.status(404).json({ error: 'Tarea no encontrada' });
            }

            await db('tareas').where({ id }).del();
            res.status(200).json({ mensaje: 'Tarea eliminada correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    toggleTaskState: async (req, res) => {
        try {
            const { id } = req.params;
    
            const tarea = await db('tareas').where({ id }).first();
    
            if (!tarea) {
                return res.status(404).json({ error: 'Tarea no encontrada' });
            }
    
            const nuevoEstado = tarea.estado === 'completada' ? 'pendiente' : 'completada';
    
            await db('tareas').where({ id }).update({ estado: nuevoEstado });
    
            const tareaActualizada = await db('tareas').where({ id }).first();
    
            res.status(200).json({
                mensaje: `Tarea marcada como ${nuevoEstado}`,
                tarea: tareaActualizada
            });
        } catch (error) {
            res.status(500).json({ error: 'Error al alternar el estado de la tarea', detalles: error.message });
        }
    }
    
    
};

module.exports = ActividadesController;
