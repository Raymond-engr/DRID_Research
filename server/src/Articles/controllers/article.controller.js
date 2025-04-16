import Faculty from '../models/faculty.model.js';
import Department from '../models/department.model.js';
const mongoose = require('mongoose');

// Get all articles
exports.getArticles = async (req, res) => {
  try {
    const query = req.query.q
      ? { title: { $regex: req.query.q, $options: 'i' } }
      : {};

    const articles = await Article.find(query)
      .populate('department', 'code title')
      .populate('contributors', 'name email')
      .populate('owner', 'username email')
      .sort({ publish_date: -1 });

    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get article by id
exports.getArticleById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ msg: 'Article not found' });
    }

    const article = await Article.findById(req.params.id)
      .populate('department', 'code title')
      .populate('contributors', 'name email bio profile_image')
      .populate('owner', 'username email');

    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }

    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create article
exports.createArticle = async (req, res) => {
  const { title, category, content, department, contributors } = req.body;

  try {
    // Check if department exists
    const departmentExists = await Department.findOne({ code: department });
    if (!departmentExists) {
      return res.status(404).json({ msg: 'Department not found' });
    }

    // Verify contributors if provided
    let validContributors = [];
    if (contributors && contributors.length > 0) {
      // Convert string IDs to ObjectIds
      const contributorIds = contributors
        .map((id) =>
          mongoose.Types.ObjectId.isValid(id)
            ? mongoose.Types.ObjectId(id)
            : null
        )
        .filter((id) => id !== null);

      validContributors = await Contributor.find({
        _id: { $in: contributorIds },
      });

      if (contributorIds.length !== validContributors.length) {
        return res
          .status(400)
          .json({ msg: 'One or more contributors are invalid' });
      }
    }

    // Create article object
    const article = new Article({
      title,
      category,
      content,
      department,
      owner: req.user.id,
    });

    // Handle file upload
    if (req.file) {
      article.cover_photo = req.file.path;
    }

    // Save article first
    await article.save();

    // Add contributors if any
    if (validContributors.length > 0) {
      article.contributors = validContributors.map(
        (contributor) => contributor._id
      );
      await article.save();
    }

    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Dashboard data
exports.getDashboardData = async (req, res) => {
  try {
    const query = req.query.q || '';

    // Get category counts
    const categoryCounts = {
      Research: await Article.countDocuments({ category: 'Research' }),
      Innovation: await Article.countDocuments({ category: 'Innovation' }),
      Development: await Article.countDocuments({ category: 'Development' }),
    };

    // Get recent articles
    let articles = await Article.find()
      .populate('department', 'code title')
      .populate('contributors', 'name')
      .sort({ publish_date: -1 })
      .limit(5);

    if (query) {
      articles = await Article.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
        ],
      })
        .populate('department', 'code title')
        .populate('contributors', 'name')
        .sort({ publish_date: -1 })
        .limit(5);
    }

    res.json({
      category_counts: categoryCounts,
      recent_articles: articles,
      query,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
