const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000;

var app = express(); //make a new express app.

//You have your code. You want to inject it everywere on all the pages of your web site.
//Solution => crei Partials. e iniettaci quello che vuoi.
hbs.registerPartials(__dirname + '/views/partials/');
//app.set => tell to express whict  h view we wan na use
app.set('view engine', 'hbs'); //HANDLEBARS
app.use(express.static(__dirname + '/public')); //middlewere function

app.use((req, res, next ) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log',log + '\n', (err) => {
    if(err) {
      console.log('Unable to append to server .log');
    }
  });
  next(); // senza next() non si caricherà mai la pagina.
})

//middlewear di mantenimento del sito. Il client che si collega al server non potrà visualizzare solo quello che è definito nella
//pagina maintenance.hbs
/*app.use((req,res,next) => {
  res.render('maintenance.hbs');
});*/


hbs.registerHelper('getCurrentYear', () => { //Evito di riscrivere una variabile 3 mila volte.
  return new Date().getFullYear(); //La memorizzo in registerHelper e poi ci accedo
})                                 // tramite "getCurrentYear"

hbs.registerHelper('getScreamIt', (textToScream) => {
  return textToScream.toUpperCase();
});
//Vediamo come si usano le HANDLEBARS (cosiddetti "baffi").
app.get('/about',(req,res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/',(req,res) => {
  res.render('MyPage.hbs', {
    pageTitle: 'Ciao questa è la mia pagina Web. Welcome!',
    welcomeMessage: 'Dottore in Ingegneria Informatica 100 e L. Congratulazioni Anton.',
  });
});

app.get('/bad',(req,res) => {
  res.send({
    errorMessage: 'Unable to sodisfy your request'
  });
});

//Ora qualcuno deve mettersi in ascolto.
app.listen(port, () => {
  console.log(`Server in ascolto sulla porta: ${port}`);
});
