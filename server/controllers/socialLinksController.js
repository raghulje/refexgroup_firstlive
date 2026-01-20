const { SocialLink } = require("../models");
const status = require("../helpers/response");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => 
    status.responseStatus(res, 500, "Internal error", { error: e.message })
  );
}

exports.getAll = asyncHandler(async (req, res) => {
  const links = await SocialLink.findAll({
    where: { isActive: true },
    order: [['orderIndex', 'ASC']]
  });
  return status.responseStatus(res, 200, "OK", links);
});

exports.getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const link = await SocialLink.findByPk(id);
  
  if (!link) {
    return status.responseStatus(res, 404, "Link not found");
  }
  
  return status.responseStatus(res, 200, "OK", link);
});

exports.create = asyncHandler(async (req, res) => {
  const link = await SocialLink.create(req.body);
  return status.responseStatus(res, 201, "Created", link);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const link = await SocialLink.findByPk(id);
  if (!link) {
    return status.responseStatus(res, 404, "Not found");
  }
  await link.update(req.body);
  return status.responseStatus(res, 200, "Updated", link);
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const link = await SocialLink.findByPk(id);
  if (!link) {
    return status.responseStatus(res, 404, "Not found");
  }
  await link.destroy();
  return status.responseStatus(res, 200, "Deleted");
});

