const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/chuckDB', {useNewUrlParser: true, useUnifiedTopology: true});

const factSchema = {
    title: String,
    content: String
};

const Fact = mongoose.model('Fact', factSchema);

app.route('/facts')
.get((req, res) => {
    Fact.find((err, facts) => {
        if(!err) {
            console.log(facts);
            res.send(facts);
        } else {
            console.log(err);
        }
    })
})
.post((req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);
    const newFact = new Fact({
        title: req.body.title,
        content: req.body.content
    });
    newFact.save((error) => {
        if(!error) {
            res.send('Fakt lisatud');
        } else {
            res.send(error);
        }
    })
})
.delete((req, res) => {
    Fact.deleteMany((error) => {
        if(!error) {
            res.send('Kõik faktid kustutatud')
        } else {
            res.send(error);
        }
    });
});

app.route('/facts/:factTitle')
.get((req, res) => {
    Fact.findOne({
        title: req.params.factTitle
    },
    (error, fact) => {
        if(!error) {
            res.send(fact);
        } else {
            res.send(error);
        }
    });
})
.put((req, res) => {
    Fact.update({
        title: req.params.factTitle
    }, {
        title: req.body.title,
        content: req.body.content
    }, {
        overwrite: true
    }, (err) => {
        if(!err) {
            console.log(req.body.title);
            console.log(req.body.content);
            res.send('Fakt muudetud')
        } else {
            res.send(err);
        }
    });
})
.patch((req, res) => {
    Fact.update({
        title: req.params.factTitle
    }, {
        $set: req.body
    }, (err) => {
        if(!err) {
            res.send('Fakt parandatud');
        } else {
            res.send(err);
        }
    })
})
.delete((req, res) => {
    Fact.deleteOne({
        title: req.params.factTitle
    }, (err) => {
        if(!err) {
            res.send('Fakti kustutamine õnnestus');
        } else {
            res.send(err);
        }
    })
})
app.get('/', function(req, res) {
    console.log('päring');
})
app.listen(3005);
