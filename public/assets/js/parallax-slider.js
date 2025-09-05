(function ($) {
	"use strict";

    if (document.querySelectorAll('.parallax-sliders').length) {

        let images = [...document.querySelectorAll('.parallax-img')];
        let slider = document.querySelector('.parallax-sliders');
        let sliderWidth;
        let imageWidth;
        let current = 0;
        let target = 0;
        let ease = 0.05;

        window.addEventListener('resize', init);

        // Dynamically set background images from data-src
        images.forEach((img) => {
            let imgSrc = img.getAttribute('data-src');
            if (imgSrc) {
                img.style.backgroundImage = `url(${imgSrc})`;
                console.log(`Image loaded: ${imgSrc}`);
            } else {
                console.warn('Missing data-src attribute on:', img);
            }
        });

        function lerp(start, end, t) {
            return start * (1 - t) + end * t;
        }

        function setTransform(el, transform) {
            el.style.transform = transform;
        }

        function init() {
            sliderWidth = slider.getBoundingClientRect().width;
            imageWidth = sliderWidth / images.length;
            document.body.style.height = `${sliderWidth - (window.innerWidth - window.innerHeight)}px`;
        }

        function animate() {
            current = parseFloat(lerp(current, target, ease)).toFixed(2);
            target = window.scrollY;
            setTransform(slider, `translateX(-${current}px)`);
            animateImages();
            requestAnimationFrame(animate);
        }

        function animateImages() {
            let ratio = current / imageWidth;
            let intersectionRatioValue;

            images.forEach((image, idx) => {
                intersectionRatioValue = ratio - (idx * 0.7);
                setTransform(image, `translateX(${intersectionRatioValue * 100}px)`);
            });
        }

        init();
        animate();
    }

})(jQuery);
