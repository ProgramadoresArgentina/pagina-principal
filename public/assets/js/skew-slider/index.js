import { preloadImages } from './utils.js';
import { Slideshow } from './slideshow.js';




if ($('.skew-slider-wrap').length) {
    document.addEventListener("DOMContentLoaded", () => {
        const slides = document.querySelector('.skew-slider-wrap');
    
        if (!slides) {
            console.error("Slides container not found!");
            return;
        }
    
        const slideshow = new Slideshow(slides);
    
        const prevBtn = document.querySelector('.skew-slider-prev');
        const nextBtn = document.querySelector('.skew-slider-next');
        const slideNumbers = document.querySelector('.slides-numbers .active');
    
        if (prevBtn) prevBtn.addEventListener('click', () => slideshow.prev());
        else console.error("Previous button not found!");
    
        if (nextBtn) nextBtn.addEventListener('click', () => slideshow.next());
        else console.error("Next button not found!");
    
        // Initialize the GSAP Observer plugin
        Observer.create({
            type: 'wheel,touch,pointer',
            onDown: () => slideshow.prev(),
            onUp: () => slideshow.next(),
            wheelSpeed: -1,
            tolerance: 10
        });
    
        // Preload images, then remove 'loading' class
        preloadImages('.slide__img').then(() => document.body.classList.remove('loading'));

        // Show slide number when multiple navigation items are present
        if ($(this).find('.slides-numbers-wrap').length > 1) {
            $(this).siblings('.slides-numbers').show();
        }

        // Update slide number after change
        $(this).on('afterChange', function (event, slick, currentSlide) {
            if (slideNumbers) {
                slideNumbers.innerHTML = helpers.addZeros(currentSlide + 1);
            }
        });
    });
}

