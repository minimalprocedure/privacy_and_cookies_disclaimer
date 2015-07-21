/***********************************************************************************
 * Copyright (c) 2015 Pragmas s.n.c <contact.info@pragmas.org>
 * Copyright (c) 2015 Massimo Maria Ghisalberti <massimo.ghisalberti@gmail.com>
 * LICENCE: https://www.mozilla.org/MPL/2.0/
 ************************************************************************************/

var COOKIE_BUTTON_OK = 'Ho Capito';
var COOKIE_BUTTON_NO = 'Non accetto';
var COOKIE_MESSSAGE = 'In questo sito utilizziamo i cookies per rendere la navigazione più piacevole per i nostri clienti. Cliccando sul link sotto, puoi trovare le informazioni per cancellare e disattivare l’installazione dei cookies, ma in tal caso il sito potrebbe non funzionare correttamente. Continuando a navigare su questo sito acconsenti alla nostra Cookie Policy.';
var COOKIE_MESSAGE_NOTIFICATION = 'Non hai aderito';
var COOKIE_LINK_MESSAGE = '(informativa)';
var COOKIE_LINK_URL = '/privacy/informativa.html';


/***************************************************************** 
 * COOKIES MANAGEMENT
 * Code based from: http://www.quirksmode.org/js/cookies.html#doccookie
 *****************************************************************/

var Cookies = {
    
    init: function () {
	var allCookies = document.cookie.split('; ');
	for (var i=0;i<allCookies.length;i++) {
	    var cookiePair = allCookies[i].split('=');
	    this[cookiePair[0]] = cookiePair[1];
	}
    },
    
    create: function (name,value,days) {
	if (days) {
	    var date = new Date();
	    date.setTime(date.getTime()+(days*24*60*60*1000));
	    var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
	this[name] = value;
    },
    
    erase: function (name) {
	this.create(name,'',-1);
	this[name] = undefined;
    },
    
    eraseAll: function() {
	var allCookies = document.cookie.split('; ');
	for (var i=0;i<allCookies.length;i++) {
	    var cookiePair = allCookies[i].split('=');
	    this.erase(cookiePair[0]);
	}
    }
};
Cookies.init();

/***************************************************************** 
 * PrivacyDisclaimer
 *****************************************************************/

var PrivacyDisclaimer = {
    
    COOKIES_USE : 'cookiesuse',
    COOKIES_YES : 1,
    COOKIES_NO : 0,
    PREPARE_STYLESHEET : true,

    closeDisclaimer : function (response) {
	var disclaimer = document.getElementById('cookies-disclaimer');
	if (response == this.COOKIES_YES) {	
	    disclaimer.remove();
	    Cookies.create(this.COOKIES_USE, response, 2);
	} else {
	    if(!document.getElementById('privacy-no-note')){
		var note = document.createElement('div');
		note.setAttribute('class', 'privacy-no-note');
		note.setAttribute('id', 'privacy-no-note');
		note.innerHTML = "<p class='privacy-no-note'>" + COOKIE_MESSAGE_NOTIFICATION + "</p>";
		disclaimer.appendChild(note);
		Cookies.eraseAll();
	    }
	}
	return false;
    },

    setStylesheet : function () {
	var stylesheet = document.createElement('link');
	stylesheet.setAttribute('rel', 'stylesheet');
	stylesheet.setAttribute('type', 'text/css');
	stylesheet.setAttribute('href', './privacy-banner.css');
	document.getElementsByTagName('head')[0].appendChild(stylesheet);
    },

    setDisclaimer : function () {    
	if (Cookies[this.COOKIES_USE] != this.COOKIES_YES) {
	    var disclaimer = document.createElement('div');
	    disclaimer.setAttribute('style', 'display:none;');
	    disclaimer.setAttribute('class', 'cookies-disclaimer');
	    disclaimer.setAttribute('id', 'cookies-disclaimer');
	    disclaimer.innerHTML =
		"<div id='privacy-banner' class='privacy-banner'><span class='privacy-content'>" + COOKIE_MESSSAGE + "</span>" +
		"<a class='privacy-link' href='" + COOKIE_LINK_URL + "'>" + COOKIE_LINK_MESSAGE + "</a>" +
		"<a class='privacy-no' href='' onclick='PrivacyDisclaimer.closeDisclaimer("+this.COOKIES_NO+");return false;'>" + COOKIE_BUTTON_NO + "</a>" +
		"<a class='privacy-ok' href='' onclick='PrivacyDisclaimer.closeDisclaimer("+this.COOKIES_YES+");return false;'>" + COOKIE_BUTTON_OK + "</a>" +
		"<span class='clear'></span>" +
		"</div>";
	    document.body.appendChild(disclaimer);	
	}
    },

    showDisclaimer : function () {
	var disclaimer = document.getElementById('cookies-disclaimer');
	if(disclaimer)
	    disclaimer.setAttribute('style', 'display:block;');
    },

    init : function () {
	var initialization = function(o) {
	    if(o.PREPARE_STYLESHEET)
		o.setStylesheet();
	    o.setDisclaimer();
	    o.showDisclaimer();
	};
	if (window.addEventListener)
            window.addEventListener('load', initialization(this), false);
	else if (window.attachEvent) { 
            window.attachEvent('onload', initialization(this));
	}
	else console.log('Load chain impossible');
    }
};
PrivacyDisclaimer.init();

