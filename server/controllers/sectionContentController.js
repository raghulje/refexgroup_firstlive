const { SectionContent, Media } = require("../models");
const status = require("../helpers/response");

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((e) =>
      status.responseStatus(res, 500, "Internal error", { error: e.message })
    );
  };
}

exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const content = await SectionContent.findByPk(id);
  if (!content) {
    return status.responseStatus(res, 404, "Content not found");
  }
  await content.update(req.body);
  return status.responseStatus(res, 200, "Updated", content);
});

exports.bulkUpdate = asyncHandler(async (req, res) => {
  const { content } = req.body;
  
  if (!Array.isArray(content)) {
    return status.responseStatus(res, 400, "Content must be an array");
  }

  const results = [];
  
  for (const item of content) {
    if (item.id) {
      // Update existing content
      const existing = await SectionContent.findByPk(item.id);
      if (existing) {
        // Build update object - only include fields that are explicitly provided
        const updateData = {};
        
        if (item.contentValue !== undefined) {
          updateData.contentValue = item.contentValue;
        }
        if (item.contentType !== undefined) {
          updateData.contentType = item.contentType;
        }
        // Handle mediaId - allow explicit null to clear it
        if ('mediaId' in item) {
          updateData.mediaId = item.mediaId !== undefined ? item.mediaId : null;
        }
        
        // Update any additional fields that might be present (like backgroundPositionX, backgroundPositionY)
        // These are stored as separate content items, but we'll handle them if they're in the update
        await existing.update(updateData);
        
        // Reload to get updated data with media relationship
        await existing.reload({
          include: [{ model: Media, as: 'media', required: false }]
        });
        results.push(existing);
      }
    } else {
      // Create new content
      const newContent = await SectionContent.create({
        sectionId: item.sectionId,
        contentKey: item.contentKey,
        contentValue: item.contentValue,
        contentType: item.contentType || 'text',
        mediaId: item.mediaId !== undefined ? item.mediaId : null
      });
      results.push(newContent);
    }
  }
  
  return status.responseStatus(res, 200, "Bulk update successful", results);
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const content = await SectionContent.findByPk(id);
  if (!content) {
    return status.responseStatus(res, 404, "Content not found");
  }
  await content.destroy();
  return status.responseStatus(res, 200, "Deleted");
});

