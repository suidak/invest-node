var mongoose = require('mongoose');

var SocieteSchema = new mongoose.Schema({
  raison_sociale: { type: String },
  secteur: { type: String },
  registre_commerce: { type: String , default: "none"},
  adresse: { type: String },
  telephone: { type: String },
  telecopie: { type: String },
  email: { type: String },
  capital: { type: Number , default : 0},
  nbre_emoloyes : { type: Number , default: 0 },
  site : { type: String },
  responsable: {
    civilite : {type : String },
    prenom: { type: String },
    nom: { type: String },    
    fonction : {type : String },
  },
  forme_juridique: { type: String, default: 'SA' },
  logo :  {
    original_name: { type: String },
    new_name: { type: String }
  }

})

module.exports = mongoose.model('Societes', SocieteSchema);