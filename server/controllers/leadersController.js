const { Leader, Media } = require("../models");
const status = require("../helpers/response");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => 
    status.responseStatus(res, 500, "Internal error", { error: e.message })
  );
}

exports.getAll = asyncHandler(async (req, res) => {
  // Check if includeInactive query parameter is set to true (for CMS)
  const includeInactive = req.query.includeInactive === 'true';
  
  const whereClause = includeInactive ? {} : { isActive: true };
  
  const leaders = await Leader.findAll({
    where: whereClause,
    include: [{ model: Media, as: 'image', required: false }],
    order: [['orderIndex', 'ASC']]
  });
  return status.responseStatus(res, 200, "OK", leaders);
});

exports.getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const leader = await Leader.findByPk(id, {
    include: [{ model: Media, as: 'image', required: false }]
  });
  
  if (!leader) {
    return status.responseStatus(res, 404, "Leader not found");
  }
  
  return status.responseStatus(res, 200, "OK", leader);
});

exports.create = asyncHandler(async (req, res) => {
  const leader = await Leader.create(req.body);
  return status.responseStatus(res, 201, "Created", leader);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const leader = await Leader.findByPk(id);
  if (!leader) {
    return status.responseStatus(res, 404, "Not found");
  }
  await leader.update(req.body);
  return status.responseStatus(res, 200, "Updated", leader);
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const leader = await Leader.findByPk(id);
  if (!leader) {
    return status.responseStatus(res, 404, "Not found");
  }
  await leader.destroy();
  return status.responseStatus(res, 200, "Deleted");
});

