const { BusinessCard, Media } = require("../models");
const status = require("../helpers/response");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => 
    status.responseStatus(res, 500, "Internal error", { error: e.message })
  );
}

exports.getAll = asyncHandler(async (req, res) => {
  // Don't filter by isActive for CMS - show all cards
  const cards = await BusinessCard.findAll({
    include: [{ model: Media, as: 'image', required: false }],
    order: [['orderIndex', 'ASC']]
  });
  return status.responseStatus(res, 200, "OK", cards);
});

exports.getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const card = await BusinessCard.findByPk(id, {
    include: [{ model: Media, as: 'image', required: false }]
  });
  
  if (!card) {
    return status.responseStatus(res, 404, "Card not found");
  }
  
  return status.responseStatus(res, 200, "OK", card);
});

exports.create = asyncHandler(async (req, res) => {
  const card = await BusinessCard.create(req.body);
  // Reload with media relationship
  const createdCard = await BusinessCard.findByPk(card.id, {
    include: [{ model: Media, as: 'image', required: false }]
  });
  return status.responseStatus(res, 201, "Created", createdCard);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const card = await BusinessCard.findByPk(id);
  if (!card) {
    return status.responseStatus(res, 404, "Not found");
  }
  await card.update(req.body);
  // Reload with media relationship
  const updatedCard = await BusinessCard.findByPk(id, {
    include: [{ model: Media, as: 'image', required: false }]
  });
  return status.responseStatus(res, 200, "Updated", updatedCard);
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const card = await BusinessCard.findByPk(id);
  if (!card) {
    return status.responseStatus(res, 404, "Not found");
  }
  await card.destroy();
  return status.responseStatus(res, 200, "Deleted");
});

