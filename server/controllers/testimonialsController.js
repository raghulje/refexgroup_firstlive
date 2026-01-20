const { Testimonial, Media } = require("../models");
const status = require("../helpers/response");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => 
    status.responseStatus(res, 500, "Internal error", { error: e.message })
  );
}

exports.getAll = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.findAll({
    where: { isActive: true },
    include: [{ model: Media, as: 'authorImage', required: false }],
    order: [['orderIndex', 'ASC']]
  });
  return status.responseStatus(res, 200, "OK", testimonials);
});

exports.getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const testimonial = await Testimonial.findByPk(id, {
    include: [{ model: Media, as: 'authorImage', required: false }]
  });
  
  if (!testimonial) {
    return status.responseStatus(res, 404, "Testimonial not found");
  }
  
  return status.responseStatus(res, 200, "OK", testimonial);
});

exports.create = asyncHandler(async (req, res) => {
  const testimonial = await Testimonial.create(req.body);
  return status.responseStatus(res, 201, "Created", testimonial);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const testimonial = await Testimonial.findByPk(id);
  if (!testimonial) {
    return status.responseStatus(res, 404, "Not found");
  }
  await testimonial.update(req.body);
  return status.responseStatus(res, 200, "Updated", testimonial);
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const testimonial = await Testimonial.findByPk(id);
  if (!testimonial) {
    return status.responseStatus(res, 404, "Not found");
  }
  await testimonial.destroy();
  return status.responseStatus(res, 200, "Deleted");
});

