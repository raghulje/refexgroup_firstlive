const { ContactInfo } = require("../models");
const status = require("../helpers/response");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => 
    status.responseStatus(res, 500, "Internal error", { error: e.message })
  );
}

exports.getAll = asyncHandler(async (req, res) => {
  const info = await ContactInfo.findAll({
    where: { isActive: true },
    order: [['orderIndex', 'ASC']]
  });
  return status.responseStatus(res, 200, "OK", info);
});

exports.getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const info = await ContactInfo.findByPk(id);
  
  if (!info) {
    return status.responseStatus(res, 404, "Contact info not found");
  }
  
  return status.responseStatus(res, 200, "OK", info);
});

exports.create = asyncHandler(async (req, res) => {
  const info = await ContactInfo.create(req.body);
  return status.responseStatus(res, 201, "Created", info);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const info = await ContactInfo.findByPk(id);
  if (!info) {
    return status.responseStatus(res, 404, "Not found");
  }
  await info.update(req.body);
  return status.responseStatus(res, 200, "Updated", info);
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const info = await ContactInfo.findByPk(id);
  if (!info) {
    return status.responseStatus(res, 404, "Not found");
  }
  await info.destroy();
  return status.responseStatus(res, 200, "Deleted");
});

