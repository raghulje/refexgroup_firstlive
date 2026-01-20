const { NavigationMenu, Media } = require("../models");
const status = require("../helpers/response");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => 
    status.responseStatus(res, 500, "Internal error", { error: e.message })
  );
}

exports.getByLocation = asyncHandler(async (req, res) => {
  const { location } = req.params;
  const menus = await NavigationMenu.findAll({
    where: { menuLocation: location, isActive: true, parentId: null },
    include: [
      { model: Media, as: 'icon', required: false },
      {
        model: NavigationMenu,
        as: 'children',
        where: { isActive: true },
        required: false,
        include: [{ model: Media, as: 'icon', required: false }],
        order: [['orderIndex', 'ASC']]
      }
    ],
    order: [['orderIndex', 'ASC']]
  });
  return status.responseStatus(res, 200, "OK", menus);
});

exports.getAll = asyncHandler(async (req, res) => {
  const menus = await NavigationMenu.findAll({
    where: { isActive: true },
    include: [
      { model: Media, as: 'icon', required: false },
      {
        model: NavigationMenu,
        as: 'children',
        required: false
      }
    ],
    order: [['orderIndex', 'ASC']]
  });
  return status.responseStatus(res, 200, "OK", menus);
});

exports.create = asyncHandler(async (req, res) => {
  const menu = await NavigationMenu.create(req.body);
  return status.responseStatus(res, 201, "Created", menu);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const menu = await NavigationMenu.findByPk(id);
  if (!menu) {
    return status.responseStatus(res, 404, "Not found");
  }
  await menu.update(req.body);
  return status.responseStatus(res, 200, "Updated", menu);
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const menu = await NavigationMenu.findByPk(id);
  if (!menu) {
    return status.responseStatus(res, 404, "Not found");
  }
  await menu.destroy();
  return status.responseStatus(res, 200, "Deleted");
});

