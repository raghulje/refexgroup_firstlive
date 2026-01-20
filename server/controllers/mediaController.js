const { Media } = require("../models");
const status = require("../helpers/response");
const downloadImageFromUrl = require("../middlewares/downloadImageFromUrl");
const path = require("path");

function asyncHandler(fn) {
  return (req, res) => fn(req, res).catch((e) => 
    status.responseStatus(res, 500, "Internal error", { error: e.message })
  );
}

exports.getAll = asyncHandler(async (req, res) => {
  const { fileType, page = 1, limit = 50, search } = req.query;
  const { Op } = require('sequelize');
  const where = {
    // Only show media from /uploads/images/general/general/
    filePath: {
      [Op.like]: '/uploads/images/general/general/%'
    }
  };
  
  if (fileType) {
    // If filtering by 'icon' or 'logo', also include 'svg' files
    if (fileType === 'icon' || fileType === 'logo') {
      where[Op.and] = [
        { filePath: { [Op.like]: '/uploads/images/general/general/%' } },
        {
          [Op.or]: [
            { fileType: fileType },
            { fileType: 'svg' }
          ]
        }
      ];
    } else {
      where.fileType = fileType;
    }
  }

  // Add search filter if provided
  if (search && search.trim()) {
    where[Op.or] = [
      { fileName: { [Op.like]: `%${search.trim()}%` } },
      { altText: { [Op.like]: `%${search.trim()}%` } },
      { filePath: { [Op.like]: `%${search.trim()}%` } }
    ];
  }
  
  // Note: pageName and sectionName filters are ignored since all media is in general/general
  // All media is stored in /uploads/images/general/general/ regardless of page/section
  
  // Parse pagination parameters
  const pageNum = parseInt(page) || 1;
  const limitNum = Math.min(parseInt(limit) || 50, 100); // Max 100 items per page
  const offset = (pageNum - 1) * limitNum;

  // Get total count and paginated results
  const { count, rows: media } = await Media.findAndCountAll({
    where,
    order: [
      ['id', 'DESC']
    ],
    limit: limitNum,
    offset: offset
  });

  return status.responseStatus(res, 200, "OK", {
    media,
    pagination: {
      total: count,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(count / limitNum)
    }
  });
});

exports.getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const media = await Media.findByPk(id);
  
  if (!media) {
    return status.responseStatus(res, 404, "Media not found");
  }
  
  return status.responseStatus(res, 200, "OK", media);
});

exports.create = asyncHandler(async (req, res) => {
  const media = await Media.create(req.body);
  return status.responseStatus(res, 201, "Created", media);
});

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const media = await Media.findByPk(id);
  if (!media) {
    return status.responseStatus(res, 404, "Not found");
  }
  await media.update(req.body);
  return status.responseStatus(res, 200, "Updated", media);
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const media = await Media.findByPk(id);
  if (!media) {
    return status.responseStatus(res, 404, "Not found");
  }
  await media.destroy();
  return status.responseStatus(res, 200, "Deleted");
});

// Download image from URL and create media record
exports.downloadFromUrl = asyncHandler(async (req, res) => {
  const { url, pageName, sectionName, fileName, fileType } = req.body;
  
  if (!url) {
    return status.responseStatus(res, 400, "URL is required");
  }
  
  try {
    // Download the image
    const downloadResult = await downloadImageFromUrl(
      url,
      pageName || 'general',
      sectionName || 'general'
    );
    
    // Check if media already exists with this path
    const existing = await Media.findOne({
      where: { filePath: downloadResult.filePath }
    });
    
    if (existing) {
      return status.responseStatus(res, 200, "OK", existing);
    }
    
    // Create media record
    const media = await Media.create({
      fileName: fileName || downloadResult.fileName,
      filePath: downloadResult.filePath,
      fileType: fileType || 'image',
      altText: fileName ? fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : ''
    });
    
    return status.responseStatus(res, 201, "Created", media);
  } catch (error) {
    console.error('Error downloading image from URL:', error);
    return status.responseStatus(res, 500, "Failed to download image", { error: error.message });
  }
});

