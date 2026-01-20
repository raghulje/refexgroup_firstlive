const { Award, Media } = require("../models");
const status = require("../helpers/response");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => 
    status.responseStatus(res, 500, "Internal error", { error: e.message })
  );
}

exports.getAll = asyncHandler(async (req, res) => {
  // Don't filter by isActive for CMS - show all awards
  const awards = await Award.findAll({
    include: [{ model: Media, as: 'image', required: false }],
    order: [['orderIndex', 'ASC']]
  });
  return status.responseStatus(res, 200, "OK", awards);
});

exports.getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const award = await Award.findByPk(id, {
    include: [{ model: Media, as: 'image', required: false }]
  });
  
  if (!award) {
    return status.responseStatus(res, 404, "Award not found");
  }
  
  return status.responseStatus(res, 200, "OK", award);
});

// Helper to normalize incoming payload from CMS/frontend
function buildAwardPayload(body, isUpdate = false) {
  const payload = {};

  // Award type - backend field is awardType, CMS sends `type`
  if (body.awardType !== undefined || body.type !== undefined || !isUpdate) {
    payload.awardType = body.awardType || body.type || 'standard';
  }

  // Title
  if (body.title !== undefined || !isUpdate) {
    payload.title = body.title;
  }

  // Description (optional)
  if (body.description !== undefined || !isUpdate) {
    payload.description = body.description || null;
  }

  // Image relation - backend uses imageId, CMS sends `image` (media id)
  const imageId = body.imageId !== undefined ? body.imageId : body.image;
  if (imageId !== undefined || !isUpdate) {
    payload.imageId = imageId || null;
  }

  // Year (optional, numeric)
  if (body.year !== undefined || !isUpdate) {
    payload.year = body.year ? parseInt(body.year, 10) || null : null;
  }

  // Recipient (optional)
  if (body.recipient !== undefined || !isUpdate) {
    payload.recipient = body.recipient || null;
  }

  // Order index - backend uses orderIndex, CMS sends `order`
  const orderIndex = body.orderIndex !== undefined ? body.orderIndex : body.order;
  if (orderIndex !== undefined || !isUpdate) {
    payload.orderIndex = orderIndex !== undefined ? parseInt(orderIndex, 10) || 0 : 0;
  }

  // Active flag
  if (body.isActive !== undefined || !isUpdate) {
    payload.isActive = typeof body.isActive === 'boolean' ? body.isActive : true;
  }

  return payload;
}

exports.create = asyncHandler(async (req, res) => {
  const awardData = buildAwardPayload(req.body, false);
  const award = await Award.create(awardData);
  // Reload with media relationship
  const createdAward = await Award.findByPk(award.id, {
    include: [{ model: Media, as: 'image', required: false }]
  });
  return status.responseStatus(res, 201, "Created", createdAward);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const award = await Award.findByPk(id);
  if (!award) {
    return status.responseStatus(res, 404, "Not found");
  }
  const awardData = buildAwardPayload(req.body, true);
  await award.update(awardData);
  // Reload with media relationship
  const updatedAward = await Award.findByPk(id, {
    include: [{ model: Media, as: 'image', required: false }]
  });
  return status.responseStatus(res, 200, "Updated", updatedAward);
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const award = await Award.findByPk(id);
  if (!award) {
    return status.responseStatus(res, 404, "Not found");
  }
  await award.destroy();
  return status.responseStatus(res, 200, "Deleted");
});

