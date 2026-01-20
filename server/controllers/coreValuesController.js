const { CoreValue, Media } = require("../models");
const status = require("../helpers/response");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => 
    status.responseStatus(res, 500, "Internal error", { error: e.message })
  );
}

exports.getAll = asyncHandler(async (req, res) => {
  const values = await CoreValue.findAll({
    where: { isActive: true },
    include: [{ model: Media, as: 'icon', required: false }],
    order: [['orderIndex', 'ASC']]
  });
  return status.responseStatus(res, 200, "OK", values);
});

exports.getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const value = await CoreValue.findByPk(id, {
    include: [{ model: Media, as: 'icon', required: false }]
  });
  
  if (!value) {
    return status.responseStatus(res, 404, "Value not found");
  }
  
  return status.responseStatus(res, 200, "OK", value);
});

exports.create = asyncHandler(async (req, res) => {
  const value = await CoreValue.create(req.body);
  return status.responseStatus(res, 201, "Created", value);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const value = await CoreValue.findByPk(id);
  if (!value) {
    return status.responseStatus(res, 404, "Not found");
  }
  await value.update(req.body);
  return status.responseStatus(res, 200, "Updated", value);
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const value = await CoreValue.findByPk(id);
  if (!value) {
    return status.responseStatus(res, 404, "Not found");
  }
  await value.destroy();
  return status.responseStatus(res, 200, "Deleted");
});

