var mongoose = require("mongoose");
var User = require("../models/user");
var Emission = require("../models/emission");

//update Emission with an uploaded document along with its type
module.exports.uploadDocs = function(req, res) {
  var files = req.files;
  var docs = [];
  console.log("======");
  files.forEach(file => {
    console.log(file.filename);
    console.log(file.originalname);
    docs.push({
      doc_type: req.params.doc_type,
      original_name: file.originalname,
      new_name: file.filename
    });
  });

  Emission.findById(req.params.id, function(err, emission) {
    if (!emission) return next(new Error("Could not load Document Emission"));
    else {
      emission.docs.push(docs[0]);
      emission.save(function(err) {
        if (err) res.json(err);
        else res.json(emission);
      });
    }
  });
};

module.exports.addEmission = function(req, res) {
  var new_emission = new Emission(req.body);
  new_emission.save(function(err, emission) {
    if (err) res.send(err);
    else {
      res.json(emission);
    }
  });
};

module.exports.getEmissionsByUser = function(req, res) {
  var user_id = req.params.emetteur_id;
  Emission.find({ emetteur_id: user_id }).then(emission => {
    if (emission != null) res.json(emission);
    else res.json({ msg: "notfound" });
  });
};

//update emission with emprunt object
module.exports.updateEmissionEmprunt = function(req, res) {
  var emprunt = req.body;
  Emission.findById(req.params.id, function(err, emission) {
    if (!emission) return next(new Error("Could not load Document Emission"));
    else {
      emission.emprunt = emprunt;
      emission.save(function(err) {
        if (err) res.send({ msg: "error" });
        else res.send(emission);
      });
    }
  });
};

//update emission with societe_id
module.exports.updateEmissionSociete = function(req, res) {
  var societe = req.body.societe_id;
  Emission.findById(req.params.id, function(err, emission) {
    if (!emission) return next(new Error("Could not load Document Emission"));
    else {
      emission.societe_id = societe;
      emission.save(function(err) {
        if (err) res.send({ msg: "error" });
        else res.send(emission);
      });
    }
  });
};

//update Emission final step with all props
module.exports.updateEmissionFinal = function(req, res) {
  var newEmission = req.body;
  //newEmission._id = req.params.id
  Emission.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true },
    function(err, emission) {
      if (!emission) res.send("Could not load Document Emission");
      else {
        res.send(emission);
      }
    }
  );
};

module.exports.getPublicEmissions = function(req, res) {
  Emission.find({ ispublic: true })
    .populate("societe_id")
    .exec(function(err, data) {
      if (!data) res.json("no public emissions");
      else res.json(data);
    });
};

module.exports.getEmissionById = function(req, res) {
  Emission.findById(req.params.id)
    .populate("societe_id")
    .exec(function(err, data) {
      if (!data) res.json("no emission with the given ID");
      else {
        User.populate(data.souscriptions, { path: "investisseur_id" }, function(
          err,
          user
        ) {
          //console.log(user)
          res.json(data);
        });
      }
    });
};

//update emission with invest infos
module.exports.invest = function(req, res) {
  //var emprunt = req.body;
  console.log(req.body);
  Emission.findById(req.body.id, function(err, emission) {
    if (!emission) return next(new Error("Could not load Document Emission"));
    else {
      emission.souscriptions.push({
        investisseur_id: req.body.investisseur_id,
        montant: req.body.montant
      });
      emission.montant_souscrit = emission.montant_souscrit + req.body.montant;

      emission.save(function(err) {
        if (err) res.send({ msg: "error" });
        else res.send(emission);
      });
    }
  });
};

// filter by societe

module.exports.filterBySociete = function(req, res) {
  var sort = req.body.sort;
  Emission.find({ispublic:true})
    .populate("societe_id")
    .exec(function(err, data) {
      data.sort(function(a, b) {
        var nameA = a.societe_id.raison_sociale.toLowerCase(),
          nameB = b.societe_id.raison_sociale.toLowerCase();
        if (sort) {
          if (nameA < nameB)
     
            return 1;
          if (nameA > nameB) return -1;
        } else {
          if (nameA < nameB)


            return -1;
          if (nameA > nameB) return 1;
        }

        return 0;
      });
      if (!data) res.json("no public emissions");
      else res.json(data);
    });
};


// filter by montantEmis

module.exports.filterByMontantEmis = function(req, res) {
  var sort = req.body.sort;
  Emission.find({ispublic:true})
    .populate("societe_id")
    .exec(function(err, data) {
      data.sort(function(a, b) {
        var nameA = a.emprunt.montant,
          nameB = b.emprunt.montant;
        if (sort) {
          if (nameA < nameB)
     
            return 1;
          if (nameA > nameB) return -1;
        } else {
          if (nameA < nameB)

            return -1;
          if (nameA > nameB) return 1;
        }

        return 0;
      });
      if (!data) res.json("no public emissions");
      else res.json(data);
    });
};

// filter by souscrit

module.exports.filterBySouscrit = function(req, res) {
  var sort = req.body.sort;
  Emission.find({ispublic:true})
    .populate("societe_id")
    .exec(function(err, data) {
      data.sort(function(a, b) {
        var nameA = a.montant_souscrit / a.emprunt.montant,
          nameB = b.montant_souscrit / b.emprunt.montant;
        if (sort) {
          if (nameA < nameB)
     
            return 1;
          if (nameA > nameB) return -1;
        } else {
          if (nameA < nameB)

            return -1;
          if (nameA > nameB) return 1;
        }

        return 0;
      });
      if (!data) res.json("no public emissions");
      else res.json(data);
    });
};

module.exports.getEmissionEnCours = function (req, res) {
  Emission.find({status_cloture:req.params.status,ispublic:true})
  .populate('societe_id')
  .exec(
    function(err, data){
      if(!data)
        res.json('no emissions en cours')
      else
        res.json(data)
    })
  
}

module.exports.sortByDateEcheance = function (req, res) {
  let ord='desc'
  if(req.params.order=='true')
      ord='desc'
    else
      ord='asc'
  Emission.find({ispublic:true})
  .populate('societe_id')
  .sort({'emprunt.dateEcheance': ord})
  .exec(
    function(err, data){
      if(!data)
        res.json('no emissions')
      else
        res.json(data)
    })
  
}

