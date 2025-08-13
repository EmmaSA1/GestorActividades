const db = require('../config/db');
const bcrypt = require('bcryptjs');

const AuthController = {
    login: async (req, res) => {
        const { email, contraseña } = req.body;

        if (!email || !contraseña) {
            return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
        }

        try {
            const usuario = await db('usuarios').where({ email }).first();
            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            

            const match = await bcrypt.compare(contraseña, usuario.contraseña_hash);
            if (!match) {
                return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
            }
            res.status(200).json({ mensaje: 'Login exitoso', data: usuario, success: true });
        } catch (error) {
            res.status(500).json({ error: 'Error en el login', detalles: error.message });
        }
    }
};

module.exports = AuthController;
