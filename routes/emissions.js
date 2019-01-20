var multer = require('multer')
const auth = require('./auth')
var nodeMailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport')

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, __dirname+'./../public/uploads')
    },
	filename: function(req, file, callback) {
		console.log(file)
		let t = (new Date()).getTime()
		console.log(t)
		var str = file.originalname;
		var n = str.lastIndexOf('.');
		var result = str.substring(n + 1);
		callback(null, t+'.'+result)
	}
})
var upload = multer(({ storage: storage }));

var express = require('express');
var router = express.Router();
var emissions = require('../controllers/emissionsController');
router.post('/upload/:doc_type/:id', upload.any(),emissions.uploadDocs);
router.post('/',emissions.addEmission);
router.get('/byemtteur/:emetteur_id',emissions.getEmissionsByUser)
router.post('/updateEmissionEmprunt/:id',emissions.updateEmissionEmprunt);
router.post('/updateEmissionSociete/:id',emissions.updateEmissionSociete);
router.post('/updateEmissionFinal/:id',emissions.updateEmissionFinal);

router.get('/public',emissions.getPublicEmissions)

router.get('/sort/:status', emissions.getEmissionEnCours)
router.get('/filterbydate/:order', emissions.sortByDateEcheance)
router.get('/:id',emissions.getEmissionById)
router.post('/investir',emissions.invest)


router.post('/filerbysociete',emissions.filterBySociete);

router.post('/filterByMontantEmis',emissions.filterByMontantEmis);
router.post('/filterBySouscrit',emissions.filterBySouscrit);





router.post('/sendEmail', function (req, res) {
	let transporter = nodeMailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'inspinia.am@gmail.com',
			pass: 'inspinia2019'
		}
	})

	let mailOptions = {
		from: 'inspinia.am@gmail.com', // sender address
		to: req.body.to, // list of receivers
		subject: 'Invitation de INSPINIA', // Subject line
		text: req.body.body, // plain text body
		html: '<b>Invitation aux investisseurs</b>' // html body
	};



	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			res.send(error)
		}else{
			console.log('Message Sent!');
			res.send({msg:'email sent!'})
		}
		});
	});

module.exports = router;