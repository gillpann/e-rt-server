const authService = require("../services/authService");

const login = async (req, res, next) => {
  const { nik, password } = req.body;

  if (!nik || !password)
    return res.status(400).json({ message: "NIK dan password wajib diisi." });
  if (typeof nik !== "string" || nik.trim().length !== 16)
    return res.status(400).json({ message: "NIK harus 16 digit." });

  try {
    const result = await authService.login(nik.trim(), password);
    res.status(200).json({ message: "Login berhasil.", ...result });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, getMe };