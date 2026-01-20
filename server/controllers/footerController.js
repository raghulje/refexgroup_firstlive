const { FooterSection } = require("../models");
const status = require("../helpers/response");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => 
    status.responseStatus(res, 500, "Internal error", { error: e.message })
  );
}

exports.getAll = asyncHandler(async (req, res) => {
  const sections = await FooterSection.findAll({
    where: { isActive: true },
    order: [['orderIndex', 'ASC']]
  });
  return status.responseStatus(res, 200, "OK", sections);
});

exports.getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const section = await FooterSection.findByPk(id);
  
  if (!section) {
    return status.responseStatus(res, 404, "Section not found");
  }
  
  return status.responseStatus(res, 200, "OK", section);
});

exports.create = asyncHandler(async (req, res) => {
  const section = await FooterSection.create(req.body);
  return status.responseStatus(res, 201, "Created", section);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const section = await FooterSection.findByPk(id);
  if (!section) {
    return status.responseStatus(res, 404, "Not found");
  }
  await section.update(req.body);
  return status.responseStatus(res, 200, "Updated", section);
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const section = await FooterSection.findByPk(id);
  if (!section) {
    return status.responseStatus(res, 404, "Not found");
  }
  await section.destroy();
  return status.responseStatus(res, 200, "Deleted");
});

