import Topic from '../models/Topic.js';

export const createTopic = async (req, res) => {
  try {
    const { title, content } = req.body;
    const coverImage = req.file?.path;
    const topic = new Topic({ title, content, coverImage });
    await topic.save();
    res.status(201).json(topic);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find().sort({ createdAt: -1 });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });
    res.json(topic);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTopic = async (req, res) => {
  try {
    const { title, content } = req.body;
    const update = { title, content };
    if (req.file?.path) update.coverImage = req.file.path;
    const topic = await Topic.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!topic) return res.status(404).json({ message: 'Topic not found' });
    res.json(topic);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });
    res.json({ message: 'Topic deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
