const { Page, Section, HeroSlide } = require("../models");
const status = require("../helpers/response");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => 
    status.responseStatus(res, 500, "Internal error", { error: e.message })
  );
}

exports.getAll = asyncHandler(async (req, res) => {
  const pages = await Page.findAll({
    where: { status: 'published' },
    order: [['id', 'ASC']]
  });
  return status.responseStatus(res, 200, "OK", pages);
});

exports.getBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const page = await Page.findOne({
    where: { slug, status: 'published' },
    include: [
      {
        model: Section,
        as: 'sections',
        where: { isActive: true },
        required: false,
        include: [{ model: require("../models").SectionContent, as: 'content', required: false }]
      },
      {
        model: HeroSlide,
        as: 'heroSlides',
        where: { isActive: true },
        required: false,
        order: [['orderIndex', 'ASC']]
      }
    ]
  });
  
  if (!page) {
    return status.responseStatus(res, 404, "Page not found");
  }
  
  return status.responseStatus(res, 200, "OK", page);
});

exports.getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const page = await Page.findByPk(id, {
    include: [
      { model: Section, as: 'sections', required: false },
      { model: HeroSlide, as: 'heroSlides', required: false }
    ]
  });
  
  if (!page) {
    return status.responseStatus(res, 404, "Page not found");
  }
  
  return status.responseStatus(res, 200, "OK", page);
});

exports.create = asyncHandler(async (req, res) => {
  const page = await Page.create(req.body);
  return status.responseStatus(res, 201, "Created", page);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const page = await Page.findByPk(id);
  if (!page) {
    return status.responseStatus(res, 404, "Not found");
  }
  await page.update(req.body);
  return status.responseStatus(res, 200, "Updated", page);
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const page = await Page.findByPk(id);
  if (!page) {
    return status.responseStatus(res, 404, "Not found");
  }
  await page.destroy();
  return status.responseStatus(res, 200, "Deleted");
});

