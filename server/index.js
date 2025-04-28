const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');
const Artifact = require('../models/Artifact');

// Home page - List all collections
router.get('/', async (req, res) => {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 });
    res.render('index', { collections });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Collection page - Show artifacts in a collection
router.get('/collection/:id', async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    const artifacts = await Artifact.find({ collectionId: req.params.id });
    
    res.render('collection', { 
      collection,
      artifacts
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Artifact detail page
router.get('/artifact/:id', async (req, res) => {
  try {
    const artifact = await Artifact.findById(req.params.id)
      .populate('collectionId');
    
    res.render('artifact', { 
      artifact
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// VR View page
router.get('/artifact/vr/:id', async (req, res) => {
  try {
    const artifact = await Artifact.findById(req.params.id)
      .populate('collectionId');
    
    res.render('vr-view', { 
      artifact
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;