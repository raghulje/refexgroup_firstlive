const db = require("../models");
const GlobalSetting = db.GlobalSettings;
const status = require("../helpers/response");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => 
    status.responseStatus(res, 500, "Internal error", { error: e.message })
  );
}

exports.getAll = asyncHandler(async (req, res) => {
  const settings = await GlobalSetting.findAll();
  const settingsObj = {};
  settings.forEach(setting => {
    let value = setting.value;
    if (setting.valueType === 'json') {
      try {
        value = JSON.parse(value);
      } catch (e) {
        value = setting.value;
      }
    } else if (setting.valueType === 'number') {
      value = Number(value);
    } else if (setting.valueType === 'boolean') {
      value = value === 'true';
    }
    settingsObj[setting.key] = value;
  });
  return status.responseStatus(res, 200, "OK", settingsObj);
});

exports.getByKey = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const setting = await GlobalSetting.findOne({ where: { key } });
  
  if (!setting) {
    return status.responseStatus(res, 404, "Setting not found");
  }
  
  let value = setting.value;
  if (setting.valueType === 'json') {
    try {
      value = JSON.parse(value);
    } catch (e) {
      value = setting.value;
    }
  } else if (setting.valueType === 'number') {
    value = Number(value);
  } else if (setting.valueType === 'boolean') {
    value = value === 'true';
  }
  
  return status.responseStatus(res, 200, "OK", { key: setting.key, value });
});

exports.create = asyncHandler(async (req, res) => {
  const { key, value, valueType } = req.body;
  let stringValue = value;
  if (valueType === 'json') {
    stringValue = JSON.stringify(value);
  } else {
    stringValue = String(value);
  }
  
  const setting = await GlobalSetting.create({ key, value: stringValue, valueType });
  return status.responseStatus(res, 201, "Created", setting);
});

exports.update = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const { value, valueType } = req.body;
  
  let setting = await GlobalSetting.findOne({ where: { key } });
  if (!setting) {
    return status.responseStatus(res, 404, "Not found");
  }
  
  let stringValue = value;
  if (valueType === 'json' || setting.valueType === 'json') {
    stringValue = JSON.stringify(value);
  } else {
    stringValue = String(value);
  }
  
  await setting.update({ value: stringValue, valueType: valueType || setting.valueType });
  return status.responseStatus(res, 200, "Updated", setting);
});

exports.delete = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const setting = await GlobalSetting.findOne({ where: { key } });
  if (!setting) {
    return status.responseStatus(res, 404, "Not found");
  }
  await setting.destroy();
  return status.responseStatus(res, 200, "Deleted");
});

