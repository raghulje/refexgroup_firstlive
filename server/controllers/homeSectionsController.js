const { HomeVideoSection, HomeAboutSection, HomeCareersSection, HomeCTASection, Media } = require('../models');
const status = require('../helpers/response');

// Helper to find the single instance (id: 1)
const findSingle = async (Model, include = []) => {
    return await Model.findOne({ where: { id: 1 }, include });
};

// --- VIDEO SECTION ---
exports.getVideoSection = async (req, res) => {
    try {
        const section = await findSingle(HomeVideoSection, [{ model: Media, as: 'thumbnailImage' }]);
        if (!section) return status.responseStatus(res, 404, "Video Section not found");
        status.responseStatus(res, 200, "Encoutered", section);
    } catch (error) {
        status.responseStatus(res, 500, error.message);
    }
};

exports.updateVideoSection = async (req, res) => {
    try {
        const section = await findSingle(HomeVideoSection);
        if (!section) return status.responseStatus(res, 404, "Video Section not found");

        // Convert empty string to null for thumbnailImageId to avoid database constraint issues
        const updateData = { ...req.body };
        // Only set to null if explicitly empty string (form clearing)
        // Do NOT set to null if undefined (partial update)
        if (updateData.thumbnailImageId === '') {
            updateData.thumbnailImageId = null;
        }

        await section.update(updateData);
        const updated = await findSingle(HomeVideoSection, [{ model: Media, as: 'thumbnailImage' }]);
        status.responseStatus(res, 200, "Video Section updated", updated);
    } catch (error) {
        console.error('Update Video Section Error:', error);
        status.responseStatus(res, 500, error.message);
    }
};

// --- ABOUT SECTION ---
exports.getAboutSection = async (req, res) => {
    try {
        const section = await findSingle(HomeAboutSection, [
            { model: Media, as: 'mainImage' },
            { model: Media, as: 'logoImage' }
        ]);
        if (!section) return status.responseStatus(res, 404, "About Section not found");
        status.responseStatus(res, 200, "Encoutered", section);
    } catch (error) {
        status.responseStatus(res, 500, error.message);
    }
};

exports.updateAboutSection = async (req, res) => {
    try {
        const section = await findSingle(HomeAboutSection);
        if (!section) return status.responseStatus(res, 404, "About Section not found");
        await section.update(req.body);
        const updated = await findSingle(HomeAboutSection, [
            { model: Media, as: 'mainImage' },
            { model: Media, as: 'logoImage' }
        ]);
        status.responseStatus(res, 200, "About Section updated", updated);
    } catch (error) {
        status.responseStatus(res, 500, error.message);
    }
};

// --- CAREERS SECTION ---
exports.getCareersSection = async (req, res) => {
    try {
        const section = await findSingle(HomeCareersSection, [{ model: Media, as: 'image' }]);
        if (!section) return status.responseStatus(res, 404, "Careers Section not found");
        status.responseStatus(res, 200, "Encoutered", section);
    } catch (error) {
        status.responseStatus(res, 500, error.message);
    }
};

exports.updateCareersSection = async (req, res) => {
    try {
        const section = await findSingle(HomeCareersSection);
        if (!section) return status.responseStatus(res, 404, "Careers Section not found");
        await section.update(req.body);
        const updated = await findSingle(HomeCareersSection, [{ model: Media, as: 'image' }]);
        status.responseStatus(res, 200, "Careers Section updated", updated);
    } catch (error) {
        status.responseStatus(res, 500, error.message);
    }
};

// --- CTA SECTION (Review: This is a LIST of cards if we follow seed, or SINGLE if we follow models/home_cta_section.js structure?)
// The model structure I checked earlier (Step 1526) had 'heading', 'subheading' etc.
// But I REPLACED it (Step 1528) with 'title', 'linkText', 'linkUrl', 'orderIndex'.
// So it is a LIST of items.
exports.getCTASections = async (req, res) => {
    try {
        const ctas = await HomeCTASection.findAll({ order: [['orderIndex', 'ASC']] });
        status.responseStatus(res, 200, "Fetched", ctas);
    } catch (error) {
        status.responseStatus(res, 500, error.message);
    }
};

exports.createCTASection = async (req, res) => {
    try {
        const cta = await HomeCTASection.create(req.body);
        status.responseStatus(res, 201, "Created", cta);
    } catch (error) {
        status.responseStatus(res, 500, error.message);
    }
};

exports.updateCTASection = async (req, res) => {
    try {
        const cta = await HomeCTASection.findByPk(req.params.id);
        if (!cta) return status.responseStatus(res, 404, "CTA not found");
        await cta.update(req.body);
        status.responseStatus(res, 200, "Updated", cta);
    } catch (error) {
        status.responseStatus(res, 500, error.message);
    }
};

exports.deleteCTASection = async (req, res) => {
    try {
        const cta = await HomeCTASection.findByPk(req.params.id);
        if (!cta) return status.responseStatus(res, 404, "CTA not found");
        await cta.destroy();
        status.responseStatus(res, 200, "Deleted");
    } catch (error) {
        status.responseStatus(res, 500, error.message);
    }
};
