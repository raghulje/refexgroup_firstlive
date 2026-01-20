const { Media } = require('../models');

const getOne = (Model, include = []) => async (req, res) => {
    try {
        const data = await Model.findOne({ include });
        if (!data) {
            // If singleton and auto-create is needed, or just return null
            return res.status(200).json(null);
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateOne = (Model) => async (req, res) => {
    try {
        const [data, created] = await Model.findOrCreate({
            where: {}, // Singleton: matches the first record or creates one
            defaults: req.body
        });

        if (!created) {
            await data.update(req.body);
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAll = (Model, include = [], sort = [['order', 'ASC']]) => async (req, res) => {
    try {
        const data = await Model.findAll({
            include,
            order: sort.length ? sort : undefined
        });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const create = (Model) => async (req, res) => {
    try {
        const data = await Model.create(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const update = (Model) => async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Model.update(req.body, { where: { id } });
        if (!updated) return res.status(404).json({ error: 'Not found' });
        const updatedData = await Model.findByPk(id);
        res.status(200).json(updatedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const remove = (Model) => async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Model.destroy({ where: { id } });
        if (!deleted) return res.status(404).json({ error: 'Not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = (Model, type = 'list', include = []) => {
    if (type === 'singleton') {
        return {
            get: getOne(Model, include),
            update: updateOne(Model)
        };
    } else {
        // List
        return {
            getAll: getAll(Model, include),
            create: create(Model),
            update: update(Model),
            delete: remove(Model)
        };
    }
};
