const { Section, SectionContent, Media } = require("../models");
const status = require("../helpers/response");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => 
    status.responseStatus(res, 500, "Internal error", { error: e.message })
  );
}

exports.getByPageId = asyncHandler(async (req, res) => {
  const { pageId } = req.params;
  const sections = await Section.findAll({
    where: { pageId, isActive: true },
    include: [
      {
        model: SectionContent,
        as: 'content',
        required: false,
        include: [{ model: Media, as: 'media', required: false }]
      }
    ],
    order: [['orderIndex', 'ASC']]
  });
  return status.responseStatus(res, 200, "OK", sections);
});

exports.getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const section = await Section.findByPk(id, {
    include: [
      {
        model: SectionContent,
        as: 'content',
        required: false,
        include: [{ model: Media, as: 'media', required: false }]
      }
    ]
  });
  
  if (!section) {
    return status.responseStatus(res, 404, "Section not found");
  }
  
  return status.responseStatus(res, 200, "OK", section);
});

exports.create = asyncHandler(async (req, res) => {
  const section = await Section.create(req.body);
  return status.responseStatus(res, 201, "Created", section);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const section = await Section.findByPk(id);
  if (!section) {
    return status.responseStatus(res, 404, "Not found");
  }
  await section.update(req.body);
  return status.responseStatus(res, 200, "Updated", section);
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const section = await Section.findByPk(id);
  if (!section) {
    return status.responseStatus(res, 404, "Not found");
  }
  await section.destroy();
  return status.responseStatus(res, 200, "Deleted");
});

