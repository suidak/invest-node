var express = require('express');
var router = express.Router();
var societes = require('../controllers/societeController');
router.get('/:raison', societes.findByRaisonSociale);
router.post('/', societes.addSociete)
router.get('/', societes.getAllRaisons)

module.exports = router;