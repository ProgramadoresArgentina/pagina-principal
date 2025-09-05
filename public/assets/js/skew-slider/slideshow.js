/** Direction constants */
const NEXT = 1;
const PREV = -1;

/**
 * Slideshow Class
 * Manages slideshow functionality including navigation and animations.
 * @export
 */
export class Slideshow {

    /**
     * Holds references to relevant DOM elements.
     * @type {Object}
     */
    DOM = {
        el: null,            // Main slideshow container
        slides: null,        // Individual slides
        slidesInner: null,   // Inner content of slides (usually images)
        slideNumber: null    // Element to show the slide number
    };

    /**
     * Index of the current slide being displayed.
     * @type {number}
     */
    current = 0;

    /**
     * Total number of slides.
     * @type {number}
     */
    slidesTotal = 0;

    /**  
     * Flag to indicate if an animation is running.
     * @type {boolean}
     */
    isAnimating = false;

    /**
     * Slideshow constructor.
     * Initializes the slideshow and sets up the DOM elements.
     * @param {HTMLElement} DOM_el - The main element holding all the slides.
     */
    constructor(DOM_el) {
        // Initialize DOM elements
        this.DOM.el = DOM_el;
        this.DOM.slides = [...this.DOM.el.querySelectorAll('.slide')];
        this.DOM.slidesInner = this.DOM.slides.map(item => item.querySelector('.slide__img'));
        this.DOM.slideNumber = document.querySelector('.slides-numbers .active');
        
        gsap.set(this.DOM.el, {perspective: 1000});

        // Set initial slide as current
        this.DOM.slides[this.current].classList.add('slide--current');
        
        // Count total slides
        this.slidesTotal = this.DOM.slides.length;

        // Update the slide number
        this.updateSlideNumber();
    }

    /**
     * Navigate to the next slide.
     * @returns {void}
     */
    next() {
        this.navigate(NEXT);
    }

    /**
     * Navigate to the previous slide.
     * @returns {void}
     */
    prev() {
        this.navigate(PREV);
    }

    /**
     * Navigate through slides.
     * @param {number} direction - The direction to navigate. 1 for next and -1 for previous.
     * @returns {boolean} - Return false if the animation is currently running.
     */
    navigate(direction) {  
        // Check if animation is already running
        if (this.isAnimating) return false;
        this.isAnimating = true;
        
        // Update the current slide index based on direction
        const previous = this.current;
        this.current = direction === 1 ? 
        this.current < this.slidesTotal - 1 ? ++this.current : 0 :
        this.current > 0 ? --this.current : this.slidesTotal - 1;

        // Update the slide number after change
        this.updateSlideNumber();

        // Get the current and upcoming slides and their inner elements
        const currentSlide = this.DOM.slides[previous];
        const currentInner = this.DOM.slidesInner[previous];
        const upcomingSlide = this.DOM.slides[this.current];
        const upcomingInner = this.DOM.slidesInner[this.current];
        
        // Animation sequence using GSAP
        gsap
        .timeline({
            defaults: {
                duration: 1.2,
                ease: 'power3.inOut',
            },
            onStart: () => {
                // Add class to the upcoming slide to mark it as current
                this.DOM.slides[this.current].classList.add('slide--current');
                gsap.set(upcomingSlide, {zIndex: 99});
            },
            onComplete: () => {
                // Remove class from the previous slide to unmark it as current
                this.DOM.slides[previous].classList.remove('slide--current');
                gsap.set(upcomingSlide, {zIndex: 1})
                // Reset animation flag
                this.isAnimating = false;
            }
        })
        // Defining animation steps
        .addLabel('start', 0)
        .to(currentSlide, {
            yPercent: -direction * 100,
        }, 'start')
        .fromTo(upcomingSlide, {
            yPercent: 0,
            autoAlpha: 0,
            rotationX: 140,
            scale: 0.1,
            z: -1000
        }, {
            autoAlpha: 1,
            rotationX: 0,
            z: 0,
            scale: 1,
        }, 'start+=0.1')
        .fromTo(upcomingInner, {
            scale: 1.8
        }, {
            scale: 1,
        }, 'start+=0.17');
    }

    /**
     * Updates the slide number displayed in the DOM.
     * @returns {void}
     */
    updateSlideNumber() {
        if (this.DOM.slideNumber) {
            this.DOM.slideNumber.innerHTML = this.addLeadingZero(this.current + 1);
        }
    }

    /**
     * Adds a leading zero to single-digit numbers.
     * @param {number} num - The number to format.
     * @returns {string} - The formatted number.
     */
    addLeadingZero(num) {
        return num < 10 ? `${num}` : num.toString();
    }
}
