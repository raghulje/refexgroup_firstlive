const { NewsroomItem, Media } = require("../models");
const status = require("../helpers/response");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => 
    status.responseStatus(res, 500, "Internal error", { error: e.message })
  );
}

exports.getAll = asyncHandler(async (req, res) => {
  // Return ALL items (active + inactive). Frontend decides what to show.
  // This ensures CMS can always see and edit inactive items.
  const items = await NewsroomItem.findAll({
    include: [{ model: Media, as: 'featuredImage', required: false }],
    order: [
      ['orderIndex', 'ASC'],
      ['publishedAt', 'DESC'],
    ]
  });
  return status.responseStatus(res, 200, "OK", items);
});

exports.getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await NewsroomItem.findByPk(id, {
    include: [{ model: Media, as: 'featuredImage', required: false }]
  });
  
  if (!item) {
    return status.responseStatus(res, 404, "Item not found");
  }
  
  return status.responseStatus(res, 200, "OK", item);
});

// Helper to normalize payload from CMS (maps order field, etc.)
function buildNewsroomPayload(body, isUpdate = false) {
  const payload = {};

  if (body.type !== undefined || !isUpdate) {
    payload.type = body.type || 'press';
  }
  if (body.title !== undefined || !isUpdate) {
    payload.title = body.title;
  }
  if (body.excerpt !== undefined || !isUpdate) {
    payload.excerpt = body.excerpt || null;
  }
  if (body.content !== undefined || !isUpdate) {
    payload.content = body.content || null;
  }
  if (body.logo !== undefined || !isUpdate) {
    payload.logo = body.logo || null;
  }
  if (body.link !== undefined || !isUpdate) {
    payload.link = body.link || null;
  }
  if (body.badge !== undefined || !isUpdate) {
    payload.badge = body.badge || null;
  }
  if (body.featuredImageId !== undefined || !isUpdate) {
    payload.featuredImageId = body.featuredImageId || null;
  }
  if (body.publishedAt !== undefined || !isUpdate) {
    payload.publishedAt = body.publishedAt || null;
  }
  if (body.category !== undefined || !isUpdate) {
    payload.category = body.category || null;
  }
  if (body.isFeatured !== undefined || !isUpdate) {
    payload.isFeatured = !!body.isFeatured;
  }
  if (body.isActive !== undefined || !isUpdate) {
    payload.isActive = body.isActive !== false;
  }
  // Map order (from CMS) to orderIndex
  const orderIndex = body.orderIndex !== undefined ? body.orderIndex : body.order;
  if (orderIndex !== undefined || !isUpdate) {
    payload.orderIndex = parseInt(orderIndex, 10) || 0;
  }

  return payload;
}

exports.create = asyncHandler(async (req, res) => {
  const payload = buildNewsroomPayload(req.body, false);
  const item = await NewsroomItem.create(payload);
  return status.responseStatus(res, 201, "Created", item);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await NewsroomItem.findByPk(id);
  if (!item) {
    return status.responseStatus(res, 404, "Not found");
  }
  const payload = buildNewsroomPayload(req.body, true);
  await item.update(payload);
  return status.responseStatus(res, 200, "Updated", item);
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await NewsroomItem.findByPk(id);
  if (!item) {
    return status.responseStatus(res, 404, "Not found");
  }
  await item.destroy();
  return status.responseStatus(res, 200, "Deleted");
});

