const { SdgCard, Media } = require("../models");
const status = require("../helpers/response");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => 
    status.responseStatus(res, 500, "Internal error", { error: e.message })
  );
}

exports.getAll = asyncHandler(async (req, res) => {
  // Don't filter by isActive for CMS - show all cards
  const cards = await SdgCard.findAll({
    include: [
      { model: Media, as: 'icon', required: false },
      { model: Media, as: 'banner', required: false }
    ],
    order: [['orderIndex', 'ASC']]
  });
  return status.responseStatus(res, 200, "OK", cards);
});

exports.getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const card = await SdgCard.findByPk(id, {
    include: [
      { model: Media, as: 'icon', required: false },
      { model: Media, as: 'banner', required: false }
    ]
  });
  
  if (!card) {
    return status.responseStatus(res, 404, "Card not found");
  }
  
  return status.responseStatus(res, 200, "OK", card);
});

exports.create = asyncHandler(async (req, res) => {
  // Clean up the request body - remove undefined/null/empty string values for optional fields
  const cleanBody = { ...req.body };
  if (cleanBody.iconId === '' || cleanBody.iconId === null || cleanBody.iconId === undefined) {
    delete cleanBody.iconId;
  }
  if (cleanBody.bannerId === '' || cleanBody.bannerId === null || cleanBody.bannerId === undefined) {
    delete cleanBody.bannerId;
  }
  
  const card = await SdgCard.create(cleanBody);
  // Reload with media relationship
  const createdCard = await SdgCard.findByPk(card.id, {
    include: [
      { model: Media, as: 'icon', required: false },
      { model: Media, as: 'banner', required: false }
    ]
  });
  return status.responseStatus(res, 201, "Created", createdCard);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const card = await SdgCard.findByPk(id);
  if (!card) {
    return status.responseStatus(res, 404, "Not found");
  }
  
  // Clean up the request body - remove undefined/null/empty string values for optional fields
  const cleanBody = { ...req.body };
  if (cleanBody.iconId === '' || cleanBody.iconId === null || cleanBody.iconId === undefined) {
    delete cleanBody.iconId;
  }
  if (cleanBody.bannerId === '' || cleanBody.bannerId === null || cleanBody.bannerId === undefined) {
    delete cleanBody.bannerId;
  }
  
  await card.update(cleanBody);
  // Reload with media relationship
  const updatedCard = await SdgCard.findByPk(id, {
    include: [
      { model: Media, as: 'icon', required: false },
      { model: Media, as: 'banner', required: false }
    ]
  });
  return status.responseStatus(res, 200, "Updated", updatedCard);
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const card = await SdgCard.findByPk(id);
  if (!card) {
    return status.responseStatus(res, 404, "Not found");
  }
  await card.destroy();
  return status.responseStatus(res, 200, "Deleted");
});

