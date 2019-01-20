var mongoose = require('mongoose');
var Societe = require('../models/societe');

module.exports.addSociete = function (req, res) {
    var new_societe = new Societe();
    new_societe.raison_sociale=req.body.raison_sociale;
    new_societe.adresse=req.body.adresse
    new_societe.secteur=req.body.secteur
    new_societe.site=req.body.site
    new_societe.save(function (err, societe) {
        if (err)
          res.send({err:err});
        else {
          res.json(societe._id);
        }

      });

}

module.exports.findByRaisonSociale = function (req, res) {
    Societe.findOne({raison_sociale:req.params.raison})
    .then(societe => {
        if(societe!=null)
            res.json(societe);
        else
            res.json({"msg":"notfound"})
    })

  };

  module.exports.getAllRaisons = function (req, res) {
    raisons_sociales = [];
    Societe.find({}, function(err, data){
        data.forEach(s => 
            raisons_sociales.push(s.raison_sociale)
        )
        res.json(raisons_sociales)
    })

  }

