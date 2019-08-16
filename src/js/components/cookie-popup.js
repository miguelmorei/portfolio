import $ from 'jquery';

export default class CookiePopup {

    constructor(textStrings) {

        //Cookie name to be saved in user's machine
        this.cookieName = 'kresidences-accepted-cookies';
        //Privacy policy page url
        this.privacyPolicyUrl = '/privacy-policy/'

        // Template
        this.template = '<div class="cookie-popup"><p>' + textStrings.cookieBanner + '<button class="cookie-popup-accept btn"><span class="btn__arrow"></span><span>' + textStrings.accept + '</span> </button></p></div>';
        //initialise immediately on instancing
        this.init();
    }

    init() {

        //If user hasn't accepted, append cookie message and register DOM events
        if(!this.hasAccepted() && window.localStorage.getItem(this.cookieName) != "true") {
            $('body').append(this.template);

        }

        this.registerEvents();
    }

    hasAccepted() {
        var hasAccepted = false;

        //If it was saved in localstorage in the past, then returns true
        if(window.localStorage.getItem(this.cookieName) == "true") {
            hasAccepted = true;
        }
    
        return hasAccepted;
    }

    registerEvents() {
        $('.cookie-popup-accept').on('click', ()=> {
    
            //Accept the cookies
           this.acceptCookies();
    
        });
    }

    acceptCookies() {
        window.localStorage.setItem(this.cookieName, 'true');
    
        $('.cookie-popup').remove();
    }
}

