const { Job } = require("../models");
const status = require("../helpers/response");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => 
    status.responseStatus(res, 500, "Internal error", { error: e.message })
  );
}

exports.getAll = asyncHandler(async (req, res) => {
  const jobs = await Job.findAll({
    where: { isActive: true },
    order: [['id', 'DESC']]
  });
  return status.responseStatus(res, 200, "OK", jobs);
});

exports.getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await Job.findByPk(id);
  
  if (!job) {
    return status.responseStatus(res, 404, "Job not found");
  }
  
  return status.responseStatus(res, 200, "OK", job);
});

exports.create = asyncHandler(async (req, res) => {
  const job = await Job.create(req.body);
  return status.responseStatus(res, 201, "Created", job);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await Job.findByPk(id);
  if (!job) {
    return status.responseStatus(res, 404, "Not found");
  }
  await job.update(req.body);
  return status.responseStatus(res, 200, "Updated", job);
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const job = await Job.findByPk(id);
  if (!job) {
    return status.responseStatus(res, 404, "Not found");
  }
  await job.destroy();
  return status.responseStatus(res, 200, "Deleted");
});

