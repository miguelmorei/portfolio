import $ from 'jquery'; // Could do without, couldn't be bothered
import Scrollbar from 'smooth-scrollbar'; //If you can find a better smooth scrollbar implementation feel free to change. I dare you.
import Utils from './utils/utils';
import Flickity from 'flickity';
import {TweenMax} from 'gsap/TweenMax';


const debounce = Utils().debounce;

$(document).ready(() => {

    const text = wrapCharacters($('h1, h2'));

    setTimeout(()=>{

        $('body').removeClass('loading');
        
        setTimeout(()=>{
            introAnimation();
        }, 1000)

    }, 1000);

    smoothScroll();
    gallery();
   
});



function wrapCharacters(element) {

    $(element).each(function(){

        const text = $(this)[0].textContent.split('').map(node=>{
            if(node==" ") {
                return `<span style="display:inline-block;position:relative;opacity:0;transform:translateY(40px);">&nbsp;</span>`
            }
            return `<span style="display:inline-block;position:relative;opacity:0;transform:translateY(40px);">${node}</span>`
        }).join('');
        
        $(this).html(text);

    });

}



function introAnimation() {

    const stagger = TweenMax.staggerTo($('h1 span'), 0.4, {
        opacity : 1,
        y : 0,
        onComplete : function () {
            TweenMax.staggerTo($('h2 span'), 0.4, {
                opacity : 1,
                y : 0,
                onComplete : ()=>{

                    $('body').addClass('page-loaded');

                }
            }, 0.02);
        }
    }, 0.02);
}

function gallery() {

    if(!$('.gallery').length) {
        return false;
    }

    const $gallery = $('.gallery__container'),
          $slides = $gallery.find('.gallery__slide');

    const customGallery = new Flickity('.gallery__container', {
        cellAlign: "left",
        contain: true,
        prevNextButtons : false
    });

    customGallery.on('dragMove', function (e, pointer, vector) {

        let vectorX = vector.x * 0.05;
        let threshold = 6;
        let normalisedX = Math.abs(vectorX) <= threshold ? vectorX : (vectorX > 0 ? threshold : -threshold);

        //bg.moveX(normalisedX);
        $slides.css('transform', `skewX(${normalisedX}deg)`);

    });

    customGallery.on('dragEnd', function () {
        $slides.css('transform', `skewX(0deg)`);
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


 }
