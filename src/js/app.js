import $ from 'jquery'; // Could do without, couldn't be bothered
import Scrollbar from 'smooth-scrollbar'; //If you can find a better smooth scrollbar implementation feel free to change. I dare you.
import CustomForm from './components/custom-form';
import Utils from './utils/utils';
import CookiePopup from './components/cookie-popup';

const debounce = Utils().debounce;

$(document).ready(() => {

    const cookies = new CookiePopup({
        cookieBanner: "This site uses cookies to improve your experience. By using the site you accept our <a href=\"/privacy-policy/\">privacy policy</a>.",
        accept: "Accept"
    });

    smoothScroll();
    loadResponsiveMedia();
    
});



function loadResponsiveMedia() {

    $('.media-src').each(function(){
    
        let src = $(this).data('hd');

        if(window.innerWidth <= 1024) {

            src = $(this).data('sd');

        }
        
        if($(this).is('img')) {
            $(this).attr('src', src);
        } else {
            $(this).css('background-image', `url(${src})`);
        }

    }); 

}



/**
 * Smooth scrolling implementation
 */

function smoothScroll() {

    let scrollbar;


    if($('body').hasClass('touchevents')) {


        return false;

    }

    /**
     * We're using Scrollbar from https://idiotwu.github.io/smooth-scrollbar/
     */
    scrollbar = Scrollbar.init($('.container-wrapper')[0], {
        alwaysShowTracks : false
    });


    /**
     * Whenever scrollbar updates we run our own parallax script for the heroe's
     */
    scrollbar.addListener(function() {
        parallax(scrollbar);
    });


    /**
     * This gives us the offset of any given element in relation to its position in 
     * the viewport
     */
    function offset(el, scrollbar) {
        
        const { bounding } = scrollbar; 
        const targetBounding = el.getBoundingClientRect(); 
        
        // check overlapping 
        const top = Math.max(bounding.top, targetBounding.top); 
        const left = Math.max(bounding.left, targetBounding.left); 
        const right = Math.min(bounding.right, targetBounding.right); 
        const bottom = Math.min(bounding.bottom, targetBounding.bottom); 
        
        return {
            isVisible :  top < bottom && left < right,
            top : targetBounding.top,
            bottom : targetBounding.bottom
        }
    
    }

 
    function parallax(scrollbarObj) {
        
        var $el = $('.image-full-bleed__background');
        $el.each(function () {
            
            const inView = offset($(this)[0], scrollbarObj);

            /**
             * We check if the element is in view before applying any transforms,
             * this increases performance and prevents elements from transforming to ridiculous
             * distances that are dependent on the overall page height
             */
            if (inView.isVisible) {
                $(this).css('transform', `scale(1.3) translateY(-${inView.bottom * 0.1}px)`);
               // $(this).css('transform', `scale(1.3) translateY(-${inView.bottom * 0.1}px)`); //The value is sauced up

            }
        })

    }

 }
