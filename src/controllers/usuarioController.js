const express = require('express');
const Joi = require('joi');
const db = require('../config/db');
const bcrypt = require('bcryptjs');


const UsuarioController = {
  getAll: async (req, res) => {
    try {
      const usuarios = await db('usuarios').select('*');
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
    save: async (req, res) => {
      const schemaUsuario = Joi.object({
        nombre: Joi.string().max(100).required(),
        email: Joi.string().email().max(100).required(),
        contraseña: Joi.string().min(6).max(100).required(),
        rol: Joi.string().valid('admin', 'usuario').default('usuario')
      });

      const { error, value } = schemaUsuario.validate(req.body);

      if (error) {
        return res.status(400).json({
          error: 'Datos inválidos',
          detalles: error.details.map(d => d.message)
        });
      }

      try {
        const existe = await db('usuarios').where({ email: value.email }).first();
        if (existe) {
          return res.status(409).json({ error: 'El email ya está registrado' });
        }

        const contraseña_hash = await bcrypt.hash(value.contraseña, 10);

        const [id] = await db('usuarios').insert({
          nombre: value.nombre,
          email: value.email,
          contraseña_hash,
          rol: value.rol
        });

        const nuevoUsuario = await db('usuarios').where({ id }).first();

        delete nuevoUsuario.contraseña_hash;
        res.status(201).json({ detalles: 'Usuario creado correctamente', usuario: nuevoUsuario });

      } catch (err) {
        res.status(400).json({
          error: 'Error al crear usuario',
          detalles: err.message
        });
      }
    },
  findOne: async (req, res) => {
    try {
      const usuario = await db('usuarios').where({ id: req.params.id }).first();
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.status(200).json(usuario);

    } catch (error) {
      res.status(500).json({ error: 'Error al buscar usuario', detalles: error.message });
    }
  },
  update: async (req, res) => {
    const schema = Joi.object({
      nombre: Joi.string().max(100),
      email: Joi.string().email().max(100),
      rol: Joi.string().valid('admin', 'usuario')
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: error.details.map(d => d.message)
      });
    }

    try {
      const usuarioExistente = await db('usuarios').where({ id: req.params.id }).first();
      if (!usuarioExistente) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      await db('usuarios').where({ id: req.params.id }).update(value);

      const usuarioActualizado = await db('usuarios').where({ id: req.params.id }).first();

      res.status(200).json({ detalles: 'Usuario actualizado correctamente', usuario: usuarioActualizado });

    } catch (err) {
      res.status(500).json({ error: 'Error al actualizar usuario', detalles: err.message });
    }
  },
  delete: async (req, res) => {
    try {
      const usuario = await db('usuarios').where({ id: req.params.id }).first();
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      await db('usuarios').where({ id: req.params.id }).del();

      res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });

    } catch (err) {
      res.status(500).json({ error: 'Error al eliminar usuario', detalles: err.message });
    }
  }


}

module.exports = UsuarioController;