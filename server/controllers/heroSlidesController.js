const { HeroSlide, Page, Media } = require("../models");
const status = require("../helpers/response");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => 
    status.responseStatus(res, 500, "Internal error", { error: e.message })
  );
}

exports.getByPageId = asyncHandler(async (req, res) => {
  const { pageId } = req.params;
  // Don't filter by isActive for CMS - show all slides
  const slides = await HeroSlide.findAll({
    where: { pageId },
    include: [{ model: Media, as: 'backgroundImage', required: false }],
    order: [['orderIndex', 'ASC']]
  });
  return status.responseStatus(res, 200, "OK", slides);
});

exports.getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const slide = await HeroSlide.findByPk(id, {
    include: [{ model: Media, as: 'backgroundImage', required: false }]
  });
  
  if (!slide) {
    return status.responseStatus(res, 404, "Slide not found");
  }
  
  return status.responseStatus(res, 200, "OK", slide);
});

exports.create = asyncHandler(async (req, res) => {
  const slide = await HeroSlide.create(req.body);
  // Reload with media relationship
  const createdSlide = await HeroSlide.findByPk(slide.id, {
    include: [{ model: Media, as: 'backgroundImage', required: false }]
  });
  return status.responseStatus(res, 201, "Created", createdSlide);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const slide = await HeroSlide.findByPk(id);
  if (!slide) {
    return status.responseStatus(res, 404, "Not found");
  }
  await slide.update(req.body);
  // Reload with media relationship
  const updatedSlide = await HeroSlide.findByPk(id, {
    include: [{ model: Media, as: 'backgroundImage', required: false }]
  });
  return status.responseStatus(res, 200, "Updated", updatedSlide);
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const slide = await HeroSlide.findByPk(id);
  if (!slide) {
    return status.responseStatus(res, 404, "Not found");
  }
  await slide.destroy();
  return status.responseStatus(res, 200, "Deleted");
});

