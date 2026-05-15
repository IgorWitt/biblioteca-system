const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

module.exports = {
  async login(email, password) {
    const user = userRepository.findByEmail(email);
    if (!user) return { error: 'Email ou senha invalidos' };

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return { error: 'Email ou senha invalidos' };

    return { user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  },

  async register({ name, email, password }) {
    const existing = userRepository.findByEmail(email);
    if (existing) return { error: 'Email ja cadastrado' };

    const hashed = bcrypt.hashSync(password, 10);
    const id = userRepository.create({ name, email, password: hashed });
    return { user: { id, name, email, role: 'leitor' } };
  },
};
