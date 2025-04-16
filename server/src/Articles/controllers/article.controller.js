import fs from 'fs';
import Faculty from '../models/faculty.model.js';
import Department from '../models/department.model.js';
import mongoose from 'mongoose';
import Article from '../models/article.model.js';
import { NotFoundError } from './utils/customErrors.js';
import logger from './utils/logger.js';

class ArticleController {
  getArticles = async (req, res) => {
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

  getArticleById = async (req, res) => {
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

  createArticle = async (req, res) => {
    const { title, category, content, faculty, department, contributors } =
      req.body;

    try {
      // Check if faculty exists
      const facultyExists = await Faculty.findOne({ code: faculty });
      if (!facultyExists) {
        return res.status(404).json({ msg: 'Faculty not found' });
      }

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

        validContributors = await User.find({
          _id: { $in: contributorIds },
          role: 'researcher',
          isActive: true,
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
        faculty,
        department,
        owner: req.user.id,
      });

      // Handle file upload
      article.cover_photo = req.file
        ? `http://localhost:3000/uploads/cover_pic/${req.file.filename}`
        : null;

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

  getDashboardData = async (req, res) => {
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

  // Update article
  updateArticle = async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        logger.warn(`Invalid article ID format: ${req.params.id}`);
        return res.status(404).json({ msg: 'Article not found' });
      }

      const article = await Article.findById(req.params.id);
      if (!article) {
        logger.warn(`Article not found with ID: ${req.params.id}`);
        return res.status(404).json({ msg: 'Article not found' });
      }

      // Check ownership or admin status
      if (
        article.owner.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        logger.warn(
          `Unauthorized article update attempt by user: ${req.user.id}`
        );
        return res.status(401).json({ msg: 'Not authorized' });
      }

      const { title, category, content, faculty, department, contributors } =
        req.body;

      // Check if faculty exists if provided
      if (faculty) {
        const facultyExists = await Faculty.findOne({ code: faculty });
        if (!facultyExists) {
          logger.warn(`Invalid faculty code in update: ${faculty}`);
          return res.status(404).json({ msg: 'faculty not found' });
        }
      }

      // Check if department exists if provided
      if (department) {
        const departmentExists = await Department.findOne({ code: department });
        if (!departmentExists) {
          logger.warn(`Invalid department code in update: ${department}`);
          return res.status(404).json({ msg: 'Department not found' });
        }
      }

      // Verify contributors if provided
      if (contributors && contributors.length > 0) {
        // Convert string IDs to ObjectIds
        const contributorIds = contributors
          .map((id) =>
            mongoose.Types.ObjectId.isValid(id)
              ? mongoose.Types.ObjectId(id)
              : null
          )
          .filter((id) => id !== null);

        const validContributors = await User.find({
          _id: { $in: contributorIds },
          role: 'researcher',
          isActive: true,
        });

        if (contributorIds.length !== validContributors.length) {
          logger.warn('One or more contributors are invalid in article update');
          return res
            .status(400)
            .json({ msg: 'One or more contributors are invalid' });
        }

        article.contributors = validContributors.map(
          (contributor) => contributor._id
        );
      }

      // Update article fields
      if (title) article.title = title;
      if (category) article.category = category;
      if (content) article.content = content;
      if (faculty) article.faculty = faculty;
      if (department) article.department = department;

      // Handle file upload
      if (req.file) {
        // Delete previous cover photo if exists
        if (article.cover_photo) {
          const oldFilePath = path.join(
            __dirname,
            '../../',
            article.cover_photo
          );
          try {
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
            }
          } catch (err) {
            logger.error(`Error deleting old cover photo: ${err.message}`);
          }
        }
        article.cover_photo = req.file
          ? `http://localhost:3000/uploads/cover_pic/${req.file.filename}`
          : null;
      }

      await article.save();
      logger.info(`Article updated successfully: ${article._id}`);

      res.json(article);
    } catch (err) {
      logger.error(`Error updating article: ${err.message}`);
      res.status(500).send('Server Error');
    }
  };

  // Delete article
  deleteArticle = async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        logger.warn(`Invalid article ID format: ${req.params.id}`);
        return res.status(404).json({ msg: 'Article not found' });
      }

      const article = await Article.findById(req.params.id);

      if (!article) {
        logger.warn(`Article not found with ID: ${req.params.id}`);
        return res.status(404).json({ msg: 'Article not found' });
      }

      // Check ownership or admin status
      if (
        article.owner.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        logger.warn(
          `Unauthorized article deletion attempt by user: ${req.user.id}`
        );
        return res.status(401).json({ msg: 'Not authorized' });
      }

      // Delete cover photo file if exists
      if (article.cover_photo) {
        const filePath = path.join(__dirname, '../../', article.cover_photo);
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (err) {
          logger.error(`Error deleting cover photo: ${err.message}`);
        }
      }

      await Article.findByIdAndRemove(req.params.id);
      logger.info(`Article deleted successfully: ${article._id}`);

      res.json({ msg: 'Article removed' });
    } catch (err) {
      logger.error(`Error deleting article: ${err.message}`);
      res.status(500).send('Server Error');
    }
  };
}

export default new ArticleController();
