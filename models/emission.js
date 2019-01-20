var mongoose = require("mongoose");

var EmissionSchema = new mongoose.Schema({
  societe_id: { type: mongoose.Schema.Types.ObjectId, ref: "Societes" },
  emetteur_id: { type: String },
  emprunt: {
    emprunt_name: { type: String },
    montant: { type: Number },
    maturite: { type: Number },
    modalite: { type: String },
    frequence: { type: String },
    taux_fixe: { type: Number },
    taux_variable: { type: Number },
    dateJouissance: { type: String },
    dateCloture: { type: String },
    dateEcheance: { type: String },
    rating: { type: String }
  },
  docs: [
    {
      doc_type: { type: String },
      original_name: { type: String },
      new_name: { type: String }
    }
  ],
  question: { type: String },
  ispublic: { type: Boolean, default: true },
  souscriptions: [
    {
      investisseur_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
      montant: { type: Number }
    }
  ],
  montant_souscrit: { type: Number, default: 0 },
  status_cloture: { type: Boolean, default: true },
  representant: {
    nom: { type: String },
    prenom: { type: String },
    societe: { type: String },
    tel: { type: String },
    site: { type: String },
    email: { type: String }
  }
});

module.exports = mongoose.model("Emissions", EmissionSchema);
