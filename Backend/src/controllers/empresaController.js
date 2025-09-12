const { prisma } = require('../config/database');

exports.crearEmpresa = async (req, res) => {
  try {
    const nuevaEmpresa = await prisma.empresa.create({
      data: req.body
    });
    res.status(201).json({ mensaje: 'Empresa creada', empresa: nuevaEmpresa });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear empresa', detalle: error.message });
  }
};

exports.obtenerEmpresas = async (req, res) => {
  try {
    const empresas = await prisma.empresa.findMany();
    res.json(empresas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener empresas' });
  }
};

exports.obtenerEmpresaPorId = async (req, res) => {
  try {
    const empresa = await prisma.empresa.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!empresa) return res.status(404).json({ error: 'Empresa no encontrada' });
    res.json(empresa);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar empresa' });
  }
};

exports.actualizarEmpresa = async (req, res) => {
  try {
    const empresa = await prisma.empresa.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!empresa) return res.status(404).json({ error: 'Empresa no encontrada' });

    const empresaActualizada = await prisma.empresa.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json({ mensaje: 'Empresa actualizada', empresa: empresaActualizada });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar empresa' });
  }
};

exports.eliminarEmpresa = async (req, res) => {
  try {
    const empresa = await prisma.empresa.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!empresa) return res.status(404).json({ error: 'Empresa no encontrada' });

    await prisma.empresa.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ mensaje: 'Empresa eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar empresa' });
  }
};
