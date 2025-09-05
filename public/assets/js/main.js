/***************************************************
==================== JS INDEX ======================
****************************************************

01. PreLoader Js
02. mobile menu Js
03. header dropdown static Js
04. Common Js
05. Nice Select Js
06. Masonary Js
07. magnificPopup img view
08. magnificPopup video view
09. Counter Js
10. Counter Js
11. Smooth Scroll Js
12. Sticky Header Js
13. Open Handlers
14. Close Handlers
15. overlay not working js
16. search border style
17. scroll wrapper
18. webgl images hover animation
19. service panel animation
20. panel pin section
21. stack panel pin section
22. hero animation
23. pp-top-wrap
24. tp-funfact-panel
25. hover reveal for image
26. button bounce animation
27. carachter Animation
28. fade-class-active
29. text animation paragraph
30. text bounce animation
31. scale animation
32. portfolio panel
33. addClass removeClass
34. ScrollMagic Controller
35. scroll with moving text
36. text-scale-anim
37. tp-text-right-scroll
38. tp-text-invert
39. tp-text-invert-2
40. tp-text-invert-3
41. Fade Effect With Scroll
42. project anim
43. choose anim
44. work anim
45. award anim
46. studio-project animation
47. team animation
48. price tab
49. move animation
50. Active Class
51. zoom in
52. scale animation
53. tp-text-perspective
54. tp-text-revel-anim
55. eye animation width mouse move
56. st-award-wrapper
57. it-faq-accordion
58. tp-porfolio-10-title-wrap
58. tp-project-5-2-area anim
59. shaders slider
60. atropos slider
61. tp-gsap-bg
62. cta section animation
63. img animation slider
64. Function to hide the parent section
65. tp-split-text
66. Rendom text genarator in hover
67. lowercase character
68. Hero bg Animation
69. Section to title zoom and item uper
70. portfolio bg change
71. Image Reveal Animation
72. career animation
73. service animation
74. contact-category animation
75. portfolio-slicer animation
76. perspective-slider animation
77. showcase-portfolio-panel
78. scroll animation
79. project details anim js
80. progress anim
81. portfolio item pin js 
82. overlay animation
83. E-commerce plus minus js
84. Tab line change js
85. Custom Select Js
86. product banner js
87. Password Toggle Js
89. Language toggle js
90. popup subscribe js
91. brand img animation
92. social section img show

/***************************************************
==================== JS INDEX ======================
****************************************************/

(function ($) {
	"use strict";

	var windowOn = $(window);
	
	// 01. PreLoader Js//
	$(window).on('load', function () {
		$("#preloader").fadeOut(500);
	});
	$(window).on('load', function () {
		$("#loading").fadeOut(500);
	});
  

    // 02. mobile menu Js//
	let tpMenuWrap = $('.tp-mobile-menu-active > ul').clone();
	let tpSideMenu = $('.tp-offcanvas-menu nav');
	tpSideMenu.append(tpMenuWrap);
	if ($(tpSideMenu).find('.submenu, .mega-menu').length != 0) {
	   $(tpSideMenu).find('.submenu, .mega-menu').parent().append
	   ('<button class="tp-menu-close"><i class="fa-solid fa-plus"></i></button>');
	}
	let sideMenuList = $('.tp-offcanvas-menu nav > ul > li button.tp-menu-close, .tp-offcanvas-menu nav > ul li.has-dropdown > a, .tp-offcanvas-menu nav > ul li.has-dropdown > ul > li.menu-item-has-children > a');
	$(sideMenuList).on('click', function (e) {
		e.preventDefault();
		$(this).parent().toggleClass('active');
		$(this).siblings('.submenu, .mega-menu').slideToggle();
	});

	// 03. header dropdown static Js//
	$(function() {
		$('.tp-header-dropdown nav ul li').each(function() {
			if ($(this).find('.mega-menu').length > 0) {
				$(this).addClass('p-static');
			}
		});
	});


	// 04. Common Js//
	$("[data-bg-color]").each(function () {
		$(this).css("background-color", $(this).attr("data-bg-color"));
	});

	$("[data-background").each(function () {
		$(this).css("background-image", "url( " + $(this).attr("data-background") + "  )");
	});

	$("[data-width]").each(function () {
		$(this).css("width", $(this).attr("data-width"));
	});

	$("[data-text-color]").each(function () {
		$(this).css("color", $(this).attr("data-text-color"));
	});


	// 05. Nice Select Js//
	$('.tp-select select').niceSelect();


	// 06. Masonary Js//
	$('.grid').imagesLoaded(function () {
		let $grid = $('.grid').isotope({
			itemSelector: '.grid-item',
			percentPosition: true,
			masonry: {
				columnWidth: '.grid-item',
			},
		});

		// filter items on button click
		$('.masonary-menu').on('click', 'button', function () {
			let filterValue = $(this).attr('data-filter');
			$grid.isotope({ filter: filterValue });
		});

		//for menu active class
		$('.masonary-menu button').on('click', function (event) {
			$(this).siblings('.active').removeClass('active');
			$(this).addClass('active');
			event.preventDefault();
		});

	});


	// 07. magnificPopup img view //
	$('.popup-image').magnificPopup({
		type: 'image',
		gallery: {
			enabled: true
		}
	});

	// 08. magnificPopup video view //
	$(".popup-video").magnificPopup({
		type: "iframe",
	});

	// 09. Counter Js //
	new PureCounter();
	new PureCounter({
		filesizing: true,
		selector: ".filesizecount",
		pulse: 2,
	});

	// 10. back-to-top //
	function back_to_top() {
		
		let btn = $('#back_to_top');
		let btn_wrapper = $('.back-to-top-wrapper');

		$(window).on('scroll',function () {
			if ($(window).scrollTop() > 300) {
				btn_wrapper.addClass('back-to-top-btn-show');
			} else {
				btn_wrapper.removeClass('back-to-top-btn-show');
			}
		});

		$(btn).on('click', function (e) {
			e.preventDefault();
			$('html, body').animate({ scrollTop: 0 }, '300');
		});
	}
	back_to_top();
	

	// 11. Smooth Scroll Js //
	function smoothSctoll() {
		$('.smooth a').on('click', function (event) {
			let target = $(this.getAttribute('href'));
			if (target.length) {
				event.preventDefault();
				$('html, body').stop().animate({
					scrollTop: target.offset().top - 60
				}, 1500);
			}
		});
	}
	smoothSctoll();


	// 12. Sticky Header Js //
	$(window).on('scroll', function () {
		let scroll = $(window).scrollTop();
		if (scroll < 20) {
			$("#header-sticky").removeClass("header-sticky");
		} else {
			$("#header-sticky").addClass("header-sticky");
		}
	});

	// 13. Open Handlers //
	$(".tp-offcanvas-open-btn").on("click", function () {
		$(".tp-offcanvas-area, .tp-offcanvas-2-area, .body-overlay").addClass("opened");
	});
	
	$(".tp-search-open-btn").on("click", function () {
		$(".tp-search-area, .body-overlay").addClass("opened");
	});
	
	$(".cartmini-open-btn").on("click", function () {
		$(".cartmini__area").addClass("cartmini-opened");
		$(".body-overlay").addClass("opened");
	});
  
	// 14. Close Handlers //
	$(".tp-offcanvas-close-btn, .tp-offcanvas-2-close-btn, .tp-search-close-btn, .cartmini-close-btn, .body-overlay").on("click", function () {
		$(".tp-offcanvas-area, .tp-offcanvas-2-area, .tp-search-area, .cartmini__area").removeClass("opened cartmini-opened");
		$(".body-overlay").removeClass("opened");
	});

	// 15. overlay not working js //
	$('.tp-offcanvas-open-btn').on('click', function () {
		const hasOffcanvas2 = $('.tp-offcanvas-2-area').length;
		$('.body-overlay').toggleClass('opened', !hasOffcanvas2);
	});
	  

	// 16. search border style //
	if ($('.search-input').length > 0) {
		const tpInput = document.querySelector('.search-input');
		const searchWrapper = document.querySelector('.search');
	
		tpInput.addEventListener('focus', () => {
		searchWrapper.classList.add('focused');
		});
		tpInput.addEventListener('blur', () => {
			searchWrapper.classList.remove('focused');
		});
	}

	// 17. scroll wrapper //
	gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);
	if($('#smooth-wrapper').length && $('#smooth-content').length){
		ScrollSmoother.create({
			smooth: 1.35,
			effects: true,
			smoothTouch: .1,
			ignoreMobileResize: true
		})
	}

	// 18. webgl images hover animation //
	if ($('.tp--hover-item').length) {
		let hoverAnimation__do = function (t, n) {
			let a = new hoverEffect({
				parent: t.get(0),
				intensity: t.data("intensity") || void 0,
				speedIn: t.data("speedin") || void 0,
				speedOut: t.data("speedout") || void 0,
				easing: t.data("easing") || void 0,
				hover: t.data("hover") || void 0,
				image1: n.eq(0).attr("src"),
				image2: n.eq(0).attr("src"),
				displacementImage: t.data("displacement"),
				imagesRatio: n[0].height / n[0].width,
				hover: !1
			});
			t.closest(".tp--hover-item").on("mouseenter", function () {
				a.next()
			}).on("mouseleave", function () {
				a.previous()
			})
		}
		let hoverAnimation = function () {
			$(".tp--hover-img").each(function () {
				let n = $(this);
				let e = n.find("img");
				let i = e.eq(0);
				i[0].complete ? hoverAnimation__do(n, e) : i.on("load", function () {
					hoverAnimation__do(n, e)
				})
			})
		}
		hoverAnimation();
	}


	// 19 .service panel animation //
	let sv = gsap.matchMedia();
	sv.add("(min-width: 1199px)", () => {
		let tl = gsap.timeline();
		let projectpanels = document.querySelectorAll('.tp-service-panel');
		let baseOffset = 150;
		let offsetIncrement = 120;

		projectpanels.forEach((section, index) => {
			let topOffset = baseOffset + (index * offsetIncrement);
			tl.to(section, {
				scrollTrigger: {
					trigger: section,
					pin: section,
					scrub: 1,
					start: `top ${topOffset}px`,
					end: "bottom 120%",
					endTrigger: '.tp-service-pin',
					pinSpacing: false,
					markers: false,
				},
			});
		});
	});


	// 20. panel pin section //
	let pr = gsap.matchMedia();
	pr.add("(min-width: 1199px)", () => {
		let tl = gsap.timeline();
		let panels = document.querySelectorAll('.tp-panel-pin')
		panels.forEach((section, index) => {
			tl.to(section, {
				scrollTrigger: {
					trigger: section,
					pin: section,
					scrub: 1,
					start: 'top 10%',
					end: "bottom 99%",
					endTrigger: '.tp-panel-pin-area',
					pinSpacing: false,
					markers: false,
				},
			})
		})
	});

	// 21. stack panel pin section //
	let st = gsap.matchMedia();
	st.add("(min-width: 1199px)", () => {
		let tl = gsap.timeline();
		let panels = document.querySelectorAll('.stack-panel-pin')
		panels.forEach((section, index) => {
			tl.to(section, {
				scrollTrigger: {
					trigger: section,
					pin: section,
					scrub: 1,
					start: 'top 0%',
					end: "bottom 100%",
					endTrigger: '.stack-panel-pin-area',
					pinSpacing: false,
					markers: false,
				},
			})
		})
	});

	// 22. hero animation //
	let tl = gsap.timeline();
	let hr = gsap.matchMedia();
	hr.add("(min-width: 768px)", () => {
		let panels = document.querySelectorAll('.tp-hero-2-area')
		panels.forEach((section, index) => {
			tl.to(section, {
				scrollTrigger: {
					trigger: '.tp-hero-2-wrapper',
					pin: '.tp-hero-2-area',
					scrub: 1,
					start: 'top 0',
					end: "bottom 0%",
					endTrigger: '.tp-hero-2-wrapper',
					pinSpacing: false,
					markers: false,
				},
			})
		})
	});

	// 23. pp-top-wrap //
	let t = gsap.timeline();
	let p = gsap.matchMedia();
	hr.add("(min-width: 992px)", () => {
		let panels = document.querySelectorAll('.pp-top-wrap')
		panels.forEach((section, index) => {
			tl.to(section, {
				scrollTrigger: {
					trigger: '.pp-top-wrap',
					pin: '.pp-about-me-area',
					scrub: 1,
					start: 'top 0',
					end: "bottom 0%",
					endTrigger: '.pp-top-wrap',
					pinSpacing: false,
					markers: false,
				},
			})
		})
	});

	// 24. tp-funfact-panel //
	let pp = gsap.matchMedia();
	pp.add("(min-width: 1200px)", () => {
		if ($('.tp-funfact-panel-wrap').length) {
			let sections = gsap.utils.toArray(".tp-funfact-panel");
				gsap.to(sections, {
				xPercent: -100 * (sections.length - 1),
				ease: "none",
				scrollTrigger: {
					start: "top 70px",
					trigger: ".tp-funfact-panel-wrap",
					pin: true,
					scrub: 1,
					end: () => "+=" + document.querySelector(".tp-funfact-panel-wrap").offsetWidth
				}
			});
		}
	});


	// 24. video-hover //
	let vd = gsap.matchMedia();
	vd.add("(min-width: 1199px)", () => {
		if ($('.tp-video-area').length) {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: ".tp-video-area",
					scrub: 1,
					pin: true,
					start: "top 40px",
					end: "+=100%"
				}
			})
			.to(".tp-video-thumb-wrap", {
				scale: 3.2,
				ease: "none"
			})
		}
	});

	// 25. hover reveal for image //
	const hoverItem = document.querySelectorAll(".hover-reveal-item");
	function moveImage(e, hoverItem) {
		const item = hoverItem.getBoundingClientRect();
		const x = e.clientX - item.x;
		const y = e.clientY - item.y;
		if (hoverItem.children[1]) {
			hoverItem.children[1].style.transform = `translate(${x}px, ${y}px)`;
		}
	}
	hoverItem.forEach((item, i) => {
		item.addEventListener("mousemove", (e) => {
			setInterval(moveImage(e, item), 100);
		});
	});


	// 26. button bounce animation //
	if ($('.tp-bounce-trigger').length > 0) {
		gsap.set(".tp-bounce", { y: -80, opacity: 0 });
		let mybtn = gsap.utils.toArray(".tp-bounce");
		mybtn.forEach((btn) => {
			let $this = $(btn);
			let tp_delay_value = $this[0].getAttribute("data-delay") || 1;
			gsap.to(btn, {
				scrollTrigger: {
					trigger: $this.closest('.tp-bounce-trigger'),
					start: "top center",
					markers: false
				},
				duration: 1.5,
				delay: tp_delay_value,
				ease: "bounce.out",
				y: 0,
				opacity: 1,
			});
		});
	}

	// 27. carachter Animation //
	if ($('.tp-char-animation').length > 0) {
		let char_come = gsap.utils.toArray(".tp-char-animation");
		char_come.forEach(splitTextLine => {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: splitTextLine,
					start: 'top 90%',
					end: 'bottom 60%',
					scrub: false,
					markers: false,
					toggleActions: 'play none none none'
				}
			});
			const itemSplitted = new SplitText(splitTextLine, { type: "chars, words" });
			gsap.set(splitTextLine, { perspective: 300 });
			itemSplitted.split({ type: "chars, words" })
			tl.from(itemSplitted.chars,
				{
					duration: 1,
					delay: 0.5,
					x: 100,
					autoAlpha: 0,
					stagger: 0.05
				});
		});
	}

	// 28. fade-class-active //
	if ($(".tp_fade_anim").length > 0) {
		gsap.utils.toArray(".tp_fade_anim").forEach((item) => {
			let tp_fade_offset = item.getAttribute("data-fade-offset") || 40,
				tp_duration_value = item.getAttribute("data-duration") || 0.75,
				tp_fade_direction = item.getAttribute("data-fade-from") || "bottom",
				tp_onscroll_value = item.getAttribute("data-on-scroll") || 1,
				tp_delay_value = item.getAttribute("data-delay") || 0.15,
				tp_ease_value = item.getAttribute("data-ease") || "power2.out",
				tp_anim_setting = {
					opacity: 0,
					ease: tp_ease_value,
					duration: tp_duration_value,
					delay: tp_delay_value,
					x: (tp_fade_direction == "left" ? -tp_fade_offset : (tp_fade_direction == "right" ? tp_fade_offset : 0)),
					y: (tp_fade_direction == "top" ? -tp_fade_offset : (tp_fade_direction == "bottom" ? tp_fade_offset : 0)),
			    };
			if (tp_onscroll_value == 1) {
				tp_anim_setting.scrollTrigger = {
					trigger: item,
					start: 'top 85%',
				};
			}
			gsap.from(item, tp_anim_setting);
		});
	}


	// 29. text animation paragraph //
	if ($('.tp_text_anim p').length > 0) {
		let splitTextLines = gsap.utils.toArray(".tp_text_anim p");
		splitTextLines.forEach(splitTextLine => {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: splitTextLine,
					start: 'top 90%',
					duration: 2,
					end: 'bottom 60%',
					scrub: false,
					markers: false,
					toggleActions: 'play none none none'
				}
			});
			const itemSplitted = new SplitText(splitTextLine, { type: "lines" });
			gsap.set(splitTextLine, { perspective: 400 });
			itemSplitted.split({ type: "lines" })
			tl.from(itemSplitted.lines, {
				duration: 1,
				delay: 0.2,
				opacity: 0,
				rotationX: -80,
				force3D: true,
				transformOrigin: "top center -50",
				stagger: 0.1
			});
		});
	}

	// 30. text bounce animation //
	if ($('.tp-text-bounce-trigger').length > 0) {
		gsap.set(".tp-text-bounce", { y: 100, opacity: 0 });
		let mybtn = gsap.utils.toArray(".tp-text-bounce");
		mybtn.forEach((btn) => {
			let $this = $(btn);
			let tp_delay_value = $this[0].getAttribute("data-delay") || 0.15;
			gsap.to(btn, {
				scrollTrigger: {
					trigger: $this.closest('.tp-text-bounce-trigger'),
					start: "top center",
					markers: false
				},
				duration: 1,
				delay: parseFloat(tp_delay_value),
				ease: "back.out(1.7)",
				y: 0,
				opacity: 1,
			});
		});
	}

	// 31. scale animation //
	const scaleImage = document.querySelectorAll(".tp-scale-anim");
	scaleImage.forEach((section) => {
		let value1 = section.getAttribute("data-value-1");
		let value2 = section.getAttribute("data-value-2");
		if (window.innerWidth < 1200) {
			value1 = Math.max(.95, value1);
		}
		gsap.fromTo(section, {
			ease: 'sine',
			scale: value1,
		}, {
			scale: value2,
			scrollTrigger: {
				trigger: section,
				scrub: true,
				toggleActions: 'play none none reverse',
			}
		});
	});

	// 32. portfolio panel //
	pr.add("(min-width: 767px)", () => {
		let otherSections = document.querySelectorAll('.des-portfolio-panel')
		otherSections.forEach((section, index) => {
			gsap.set(otherSections, {
				scale: 1,
			});
			tl.to(section, {
				scale: .8,
				scrollTrigger: {
					trigger: section,
					pin: section,
					scrub: 1,
					start: 'top 0',
					end: "bottom 60%",
					endTrigger: '.des-portfolio-wrap',
					pinSpacing: false,
					markers: false,
				},
			})
		})
	});

	
	// 33. addClass removeClass //
	$('.des-text-moving-wrap .des-text-moving-top, .des-team-wrap .des-team-item-box').on("mouseenter", function () {
		$(this).addClass('active').siblings().removeClass('active');
	});
	$('.des-text-moving-wrap .des-text-moving-top, .des-team-wrap .des-team-item-box').on("mouseleave", function () {
		$(this).siblings().addClass('active');
	});
	$('.tp-offcanvas-2-area .tp-offcanvas-menu > nav > ul > li').on("mouseenter", function () {
		$(this).addClass('is-active').siblings().removeClass('is-active');
	}).on("mouseleave", function () {
		$(this).siblings().addClass('is-active');
	});
	$('.design-award-wrap .design-award-item').on('mouseenter', function(){
		$(this).addClass('active').parent().siblings().find('.design-award-item').removeClass('active')
	}).on('mouseleave', function(){
		$(this).addClass('active').parent().siblings().find('.design-award-item').addClass('active')
	})

	// 34. ScrollMagic Controller //s
	let controller = new ScrollMagic.Controller();
	let $elheight = window.innerHeight;
	$('.des-text-item, .des-brand-item-inner, .creative-text-wrap').each(function () {
		let $this = $(this);
		let $thisHeight = $(this).height();
		let scene = new ScrollMagic.Scene({
			triggerElement: $this[0], duration: $thisHeight
		}).addTo(controller);
		scene.triggerHook(0.9)
		scene.on('enter', function () {
			$this.addClass('active');
		});
		if ($("body").hasClass("smooth-scroll")) {
			scrollbar.addListener(() => {
				scene.refresh()
			});
		}
	})
	
	// 35. scroll with moving text //
	function moving_text() {
		if ($('.moving-text').length > 0) {
			gsap.utils.toArray('.moving-text').forEach((section, index) => {
				const w = section.querySelector('.wrapper-text');
				const [x, xEnd] = (index % 2) ? [(section.offsetWidth - w.scrollWidth), 0] : [0, section.offsetWidth - w.scrollWidth];
				gsap.fromTo(w, { x }, {
					x: xEnd,
					scrollTrigger: {
						trigger: section,
						scrub: 0.1,
					}
				});
			});
		}
	}
	$(window).on('load', function() {
		moving_text();
	});

	// 36. text-scale-anim //
	const headings = document.querySelectorAll('.text-scale-anim');
	headings.forEach(heading => {
		const textNodes = [];
		heading.childNodes.forEach(node => {
			if (node.nodeType === Node.TEXT_NODE) {
				node.textContent.split(' ').forEach((word, index, array) => {
					const wordSpan = document.createElement('span');
					wordSpan.classList.add('tp-word-span');
					word.split('').forEach(letter => {
						const letterSpan = document.createElement('span');
						letterSpan.classList.add('tp-letter-span');
						letterSpan.textContent = letter;
						wordSpan.appendChild(letterSpan);
					});
					textNodes.push(wordSpan);
					if (index < array.length - 1) {
						textNodes.push(document.createTextNode(' '));
					}
				});
			} else if (node.nodeType === Node.ELEMENT_NODE) {
				textNodes.push(node.cloneNode(true));
			}
		});
		heading.innerHTML = '';
		textNodes.forEach(node => heading.appendChild(node));
		const letters = heading.querySelectorAll('.tp-letter-span');
		letters.forEach(letter => {
			letter.addEventListener('mouseenter', () => {
				gsap.to(letter, {
					scaleY: 1.3,
					y: '10%',
					duration: 0.2,
					ease: 'sine'
				});
			});

			letter.addEventListener('mouseleave', () => {
				gsap.to(letter, {
					scaleY: 1,
					y: '0%',
					duration: 0.2,
					ease: 'sine'
				});
			});
		});
	});

	// 37. tp-text-right-scroll //
	gsap.matchMedia().add("(min-width: 991px)", () => {
		document.querySelectorAll(".title-box").forEach((box) => {
			const rightElements = box.querySelectorAll('.tp-text-right-scroll');
			const tl = gsap.timeline({
				scrollTrigger: {
				trigger: box,
				start: "top 100%",
				end: "bottom top",
				scrub: true,
				markers: false,
				}
			});
			if (rightElements.length) {
				tl.fromTo(rightElements, { xPercent: 50 }, { xPercent: -20, ease: "power1.out" }, 0);
			}
		});
	});
	  
	    
	// 38. tp-text-invert //
	function tp_text_invert(){
		const split = new SplitText(".tp_text_invert", { type: "lines" });
		split.lines.forEach((target) => {
			gsap.to(target, {
				backgroundPositionX: 0,
				ease: "none",
				scrollTrigger: {
					trigger: target,
					scrub: 1,
					start: 'top 85%',
					end: "bottom center"
				}
			});
		});	
	}
	


	// 39. tp-text-invert-2 //
	function tp_text_invert_2(){
		const split_2 = new SplitText(".tp_text_invert_2", { type: "lines" });
		split_2.lines.forEach((target) => {
			gsap.to(target, {
				backgroundPositionX: 0,
				ease: "none",
				scrollTrigger: {
					trigger: target,
					scrub: 1,
					start: 'top 85%',
					end: "bottom center"
				}
			});
		});	
	}

	

	// 40. tp-text-invert-3 //
	function tp_text_invert_3(){
		const split_3 = new SplitText(".tp_text_invert_3", { type: "lines" });
		split_3.lines.forEach((target) => {
			gsap.to(target, {
				backgroundPositionX: 0,
				ease: "none",
				scrollTrigger: {
					trigger: target,
					scrub: 1,
					start: 'top 85%',
					end: "bottom center"
				}
			});
		});	
	}

	$(function(){
		tp_text_invert();
		tp_text_invert_2();
		tp_text_invert_3();
	});

	// 41. Fade Effect With Scroll //
	document.querySelectorAll(".tp_reveal_anim").forEach(areveal => {
		const duration = areveal.getAttribute("data-duration") || 1.5;
		const onScroll = areveal.getAttribute("data-on-scroll") || 1;
		const stagger = areveal.getAttribute("data-stagger") || 0.02;
		const delay = areveal.getAttribute("data-delay") || 0.05;
		areveal.split = new SplitText(areveal, {
			type: "lines,words,chars",
			linesClass: "tp-reveal-line"
		});
		const animConfig = {
			duration,
			delay,
			ease: "circ.out",
			y: 80,
			stagger,
			opacity: 0,
		};
		if (onScroll == 1) {
			animConfig.scrollTrigger = {
				trigger: areveal,
				start: 'top 85%',
			};   
		}
		areveal.anim = gsap.from(areveal.split.chars, animConfig);
	});


	// 42. project anim //
	if (document.querySelector('.design-project-item')) {
		const pw = gsap.matchMedia();
		pw.add("(min-width: 991px)", () => {
			gsap.set('.design-project-thumb.item-1', { x: 400, rotate: 10,});
			gsap.set('.design-project-thumb.item-2', { x: -400, rotate: -10, });
			document.querySelectorAll('.design-project-item').forEach(item => {
				let tl = gsap.timeline({
					scrollTrigger: {
						trigger: item,
						start: 'top 100%',
						end: 'bottom center',
						scrub: 1,
					}
				});
				tl.to(item.querySelector('.design-project-thumb.item-1'), { x: 0, rotate: 0 })
				.to(item.querySelector('.design-project-thumb.item-2'), { x: 0, rotate: 0 }, 0);
			});
		});
	}

	// 43. choose anim //
	if (document.querySelectorAll('.design-choose-item-wrap')) {
		const pw = gsap.matchMedia();
		pw.add("(min-width: 1200px)", () => {
			document.querySelectorAll('.design-choose-item-wrap').forEach(item => {
				gsap.set(item.querySelector('.design-choose-item-1'), { x: -400, rotate: -40 });
				gsap.set(item.querySelector('.design-choose-item-2'), { x: 400, rotate: 40 });
				let tl = gsap.timeline({
					scrollTrigger: {
						trigger: item,
						start: 'top 120%',
						end: 'top 20%',
						scrub: 1,
					}
				});
				tl.to(item.querySelector('.design-choose-item-1'), { x: 0, rotate: 0 })
				.to(item.querySelector('.design-choose-item-2'), { x: 0, rotate: 0 }, 0);
			});
		});
	}

	// 44. work anim //
	if (document.querySelectorAll('.design-work-wrapper')) {
		const pw = gsap.matchMedia();
		pw.add("(min-width: 1200px)", () => {
			document.querySelectorAll('.design-work-wrapper').forEach(item => {
				gsap.set(item.querySelector('.design-work-item-1'), { x: 0, rotate: 0 });
				gsap.set(item.querySelector('.design-work-item-2'), { x: 0, rotate: 0 });
				let tl = gsap.timeline({
					scrollTrigger: {
						trigger: item,
						start: 'top 90%',
						end: 'bottom center',
						scrub: 1,
					}
				});
				tl.to(item.querySelector('.design-work-item-1'), { x: -400, rotate: -40 })
				.to(item.querySelector('.design-work-item-2'), { x: 400, rotate: 40 }, 0);
			});
		});
	}

	// 45. award anim //
	const aw = gsap.matchMedia();
	aw.add("(min-width: 991px)", () => {
		const awardItems = document.querySelectorAll('.design-award-item');
		awardItems.forEach(function(div){
			div.addEventListener('mouseenter', function() {
				gsap.to(div, {
					width: '100%',
					duration: 2,
					ease: 'expo.out'
				});
			});
			div.addEventListener('mouseleave', function() {
				gsap.to(div, {
					width: '70%',
					duration: 2,
					ease: 'expo.out'
				});
			});
		})
	});

	// 46. studio-project animation //
	const perspective_1 = gsap.matchMedia();
	perspective_1.add("(min-width: 767px)", () => {
		function perspective() {
			if ($('.studio-project-wrap').length) {
				gsap.set('.studio-project-thumb', { perspective: 60,});
				$('.studio-project-thumb img').each(function () {
					var slide = $(this);
					gsap.fromTo(this, {
						rotationX: 1.8,
						z: '0vh'
					}, {
						rotationX: -.5,
						z: '-2vh',
						scrollTrigger: {
							trigger: slide,
							start: "top+=150px bottom",
							end: "bottom top",
							immediateRender: false,
							scrub: 0.1,
						}
					});
				});
			}
		}
		perspective()
	});

	// 47. team animation //
	const tm = gsap.matchMedia();
	tm.add("(min-width: 991px)", () => {
		let tl_team = gsap.timeline();
		let panels = document.querySelectorAll('.studio-team-area')
		panels.forEach((section, index) => {
			tl_team.to(section, {
				scrollTrigger: {
					trigger: '.studio-team-area',
					pin: '.studio-team-title-box',
					scrub: 1,
					start: 'top 17%',
					end: "bottom 90%",
					endTrigger: '.studio-team-area',
					pinSpacing: false,
					markers: false,
				},
			})
		})
	});


	// 48. price tab //
	if ($('#lineMarker').length > 0) {

		function tp_tab_bg() {
			let marker = document.querySelector('#lineMarker');
			let item = document.querySelectorAll('.tp-marker-tab ul li button');
			let itemActive = document.querySelector('.tp-marker-tab ul li .nav-links.active');
			function indicator(e) {
				marker.style.left = e.offsetLeft + "px";
				marker.style.width = e.offsetWidth + "px";
			}
			item.forEach(link => {
				link.addEventListener('click', (e) => {
					indicator(e.target);
				});
			});

			let activeNav = $('.tp-marker-tab ul li .nav-links.active');
			let activewidth = $(activeNav).width();
			let activePadLeft = parseFloat($(activeNav).css('padding-left'));
			let activePadRight = parseFloat($(activeNav).css('padding-right'));
			let totalWidth = activewidth + activePadLeft + activePadRight;

			let precedingAnchorWidth = anchorWidthCounter();


			$(marker).css('display', 'block');

			$(marker).css('width', totalWidth);

			function anchorWidthCounter() {
				let anchorWidths = 0;
				let a;
				let aWidth;
				let aPadLeft;
				let aPadRight;
				let aTotalWidth;
				$('.tp-marker-tab ul li button').each(function (index, elem) {
					let activeTest = $(elem).hasClass('active');
					marker.style.left = elem.offsetLeft + "px";
					if (activeTest) {
						return false;
					}
					a = $(elem).find('button');
					aWidth = a.width();
					aPadLeft = parseFloat(a.css('padding-left'));
					aPadRight = parseFloat(a.css('padding-right'));
					aTotalWidth = aWidth + aPadLeft + aPadRight;
					anchorWidths = anchorWidths + aTotalWidth;

				});

				return anchorWidths;
			}
		}
		tp_tab_bg();
	}

	
	// 49. move animation //
	if ($('.ar-scroll-image').length > 0) {
		gsap.to(".ar-scroll-image", {
			xPercent: -10,
			scrollTrigger: {
				trigger: ".ar-banner-shape",
				start: "top bottom",
				end: "bottom top",
				scrub: true, 
			}
		});
	}

	// 50. Active Class //
	$('.ar-service-item').on('mouseenter', function () {
		$(this).addClass('active').siblings('.ar-service-item').removeClass('active');
	});

	// 51. zoom in //
	$(".anim-zoomin").each(function() {

		// Add wrap <div>.
		$(this).wrap('<div class="anim-zoomin-wrap"></div>');

		// Add overflow hidden.
		$(".anim-zoomin-wrap").css({ "overflow": "hidden" })

		let $this = $(this);
		let $asiWrap = $this.parents(".anim-zoomin-wrap");

		let tp_ZoomIn = gsap.timeline({
			scrollTrigger: {
				trigger: $asiWrap,
				start: "top 100%",
				markers: false,
			}
		});
		tp_ZoomIn.from($this, { duration: 2, autoAlpha: 0, scale: 1.2, ease: Power2.easeOut, clearProps:"all" });

	});


   // 52. scale animation //
    const zoom_img = document.querySelectorAll(".tp-scale-img");
    zoom_img.forEach((section) => {
        let value1 = section.getAttribute("data-value-1");
        let value2 = section.getAttribute("data-value-2");
        if (window.innerWidth < 1200) {
            value1 = Math.max(.95, value1);
        }
        gsap.fromTo(section, {
            ease: 'sine',
            scale: value1,
        }, {
            scale: value2,
            scrollTrigger: {
                trigger: section,
                scrub: true,
                toggleActions: 'play none none reverse',
            }
        });
    });

	// 53. tp-text-perspective //
	gsap.utils.toArray(".tp-text-perspective").forEach(splitTextLine => {
		const delay_value = parseFloat(splitTextLine.getAttribute("data-delay") || 0.5);
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: splitTextLine,
				start: 'top 85%',
				duration: 1.5,
				scrub: false,
				markers: false,
				toggleActions: 'play none none none'
			}
		});
		const itemSplitted = new SplitText(splitTextLine, { type: "lines" });
		gsap.set(splitTextLine, { perspective: 400 });
		itemSplitted.split({ type: "lines" });

		tl.from(itemSplitted.lines, {
			duration: 1,
			delay: delay_value,
			opacity: 0,
			rotationX: -80,
			force3D: true,
			transformOrigin: "top center -50",
			stagger: 0.1
		});
	});

	// 54. tp-text-revel-anim //
	const tp_anim_reveal = document.querySelectorAll(".tp-text-revel-anim");
	tp_anim_reveal.forEach(areveal => {
		const getAttributeValue = (attr, defaultValue) => areveal.getAttribute(attr) || defaultValue;
		const duration_value = parseFloat(getAttributeValue("data-duration", 1));
		const onscroll_value = parseInt(getAttributeValue("data-on-scroll", 1));
		const stagger_value = parseFloat(getAttributeValue("data-stagger", 0.02));
		const data_delay = parseFloat(getAttributeValue("data-delay", 0.05));
		const ease_value = getAttributeValue("data-ease", "circ.out");

		areveal.split = new SplitText(areveal, { type: "lines,words,chars", linesClass: "tp-revel-line" });
		const animationProps = {
			duration: duration_value,
			delay: data_delay,
			ease: ease_value,
			y: 80,
			stagger: stagger_value,
			opacity: 0,
		};

		if (onscroll_value === 1) {
			areveal.anim = gsap.from(areveal.split.chars, {
				scrollTrigger: {
					trigger: areveal,
					start: 'top 85%',
				},
				...animationProps,
			});
		} else {
			areveal.anim = gsap.from(areveal.split.chars, animationProps);
		}
	});


    // 55. eye animation width mouse move //
	document.querySelector('body').addEventListener('mousemove', eyeball);
    function eyeball() {
      const eye = document.querySelectorAll('.eye');
      eye.forEach(function(eye) {
        let x = (eye.getBoundingClientRect().left) + (eye.clientWidth / 3);
        
        let y = (eye.getBoundingClientRect().top) + (eye.clientHeight / 3);
        
        let radian = Math.atan2(event.pageX - x, event.pageY - y);
        let rotation = (radian * (180 / Math.PI) * -1) + 270;
        eye.style.transform = "rotate("+rotation+"deg)"
      })
    }


   // 56. st-award-wrapper //
	$(function () {
		if ($('.st-award-wrapper').length > 0) {
			$('.st-award-wrapper .ar-award-item').on("mouseenter", function () {
				let thumbClass = $(this).attr('rel');
				$('#st-award-thumb').removeClass().addClass(thumbClass);
				$(this).addClass('active').siblings().removeClass('active');
	
				$('.st-award-thumb-shape').removeClass('current');
	
				let shapeNumber = thumbClass.split('-').pop();
				$('.st-award-thumb-shape.shape-' + shapeNumber).addClass('current');
			});
		}
	});	
	
   // 57. it-faq-accordion //
	$('.it-faq-accordion, .accordion-items').on("click", function(){
		$(this).addClass('faq-active').siblings().removeClass('faq-active');
	});

   // 58. tp-porfolio-10-title-wrap //
	$('.tp-porfolio-10-title-wrap > ul > li').on('mouseenter', function(){
		$(this).siblings().removeClass('active');
		const rel = $(this).attr('rel');
		$(this).addClass('active');
		$('#tp-porfolio-10-bg-box').removeClass().addClass(rel);
	})

    // 58. tp-project-5-2-area anim //
	if ($('.tp-project-5-2-area').length > 0) {
		let project_text = gsap.timeline({
			scrollTrigger: {
				trigger: ".tp-project-5-2-area",
				start: 'top center-=350',
				end: "bottom 150%",
				pin: ".tp-project-5-2-title",
				markers: false,
				pinSpacing: false,
				scrub: 1,
			}
		})
		project_text.set(".tp-project-5-2-title", {
			scale: .6,
			duration: 2
		})
		project_text.to(".tp-project-5-2-title", {
			scale: 1,
			duration: 2
		})
		project_text.to(".tp-project-5-2-title", {
			scale: 1,
			duration: 2
		}, "+=2")
	}
	
	$('.tp-port-slider-title').on("mouseenter", function () {
		$('#tp-port-slider-wrap').removeClass().addClass($(this).attr('rel'));
		$(this).addClass('active').siblings().removeClass('active');
	});


    // 59. shaders slider//
	if ($('#port-showcase-slider-main').length > 0) {
		const showcaseSwiper = new Swiper('#showcase-slider', {
			loop: true,
			slidesPerView: 1,
			touchStartPreventDefault: false,
			speed: 1000,
			mousewheel: true,
			simulateTouch: true,
			autoplay: {

				delay: 5000

			},
			navigation: {

				clickable: true,
				nextEl: '.swiper-next',
				prevEl: '.swiper-prev',

			},
			pagination: {
				el: '.tp-slider-dot',
				clickable: true,
				renderBullet: function (index, className) {
					return '<div class="' + className + '"></div>';
				},
			},
			on: {
				slidePrevTransitionStart: function () {

					$('.tp-slider-dot').find('.swiper-pagination-bullet').each(function () {
						if (!$(this).hasClass("swiper-pagination-bullet-active")) {
							$('#trigger-slides .swiper-slide-active').find('div').first().each(function () {
								if (!$(this).hasClass("active")) {
									$(this).trigger('click');
								}
							});

							$('#trigger-slides .swiper-slide-duplicate-active').find('div').first().each(function () {
								if (!$(this).hasClass("active")) {
									$(this).trigger('click');
								}
							});
						}
					});

				},
				slideNextTransitionStart: function () {

					$('.tp-slider-dot').find('.swiper-pagination-bullet').each(function () {
						if (!$(this).hasClass("swiper-pagination-bullet-active")) {
							$('#trigger-slides .swiper-slide-active').find('div').first().each(function () {
								if (!$(this).hasClass("active")) {
									$(this).trigger('click');
								}
							});

							$('#trigger-slides .swiper-slide-duplicate-active').find('div').first().each(function () {
								if (!$(this).hasClass("active")) {
									$(this).trigger('click');
								}
							});
						}
					});

				}
			},
		});
		var vertex = 'varying vec2 vUv; void main() {  vUv = uv;  gl_Position = projectionMatrix  modelViewMatrix  vec4( position, 1.0 );	}';
		var fragment = `
		varying vec2 vUv;
	
		uniform sampler2D currentImage;
		uniform sampler2D nextImage;
		uniform sampler2D disp;
		uniform float dispFactor;
		uniform float effectFactor;
		uniform vec4 resolution;
	
		void main() {
	
			vec2 uv = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
	
			vec4 disp = texture2D(disp, uv);
			vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r*effectFactor), uv.y);
			vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r*effectFactor), uv.y);
			vec4 _currentImage = texture2D(currentImage, distortedPosition);
			vec4 _nextImage = texture2D(nextImage, distortedPosition2);
			vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);
	
			gl_FragColor = finalTexture; }
	
		`;
		var gl_canvas = new WebGL({
			vertex: vertex,
			fragment: fragment,
		});
		var addEvents = function () {

			var triggerSlide = Array.from(document.getElementById('trigger-slides').querySelectorAll('.slide-wrap'));
			gl_canvas.isRunning = false;

			triggerSlide.forEach((el) => {

				el.addEventListener('click', function () {

					if (!gl_canvas.isRunning) {

						gl_canvas.isRunning = true;

						document.getElementById('trigger-slides').querySelectorAll('.active')[0].className = '';
						this.className = 'active';

						var slideId = parseInt(this.dataset.slide, 10);

						gl_canvas.material.uniforms.nextImage.value = gl_canvas.textures[slideId];
						gl_canvas.material.uniforms.nextImage.needsUpdate = true;

						gsap.to(gl_canvas.material.uniforms.dispFactor, {
							duration: 1,
							value: 1,
							ease: 'Sine.easeInOut',
							onComplete: function () {
								gl_canvas.material.uniforms.currentImage.value = gl_canvas.textures[slideId];
								gl_canvas.material.uniforms.currentImage.needsUpdate = true;
								gl_canvas.material.uniforms.dispFactor.value = 0.0;
								gl_canvas.isRunning = false;
							}
						});
					}
				});
			});
		};
		addEvents();
	}


   // 60. atropos slider//
	class AtroposComponent extends HTMLElement {
		constructor() {
		  super();
		}
		connectedCallback() {
		  this.atropos = new Atropos({
			el: this.querySelector('.my-atropos'),
			onEnter() {},
			onLeave() {},
			onRotate(x, y) {}
		  });
		}
		disconnectedCallback() {
		  this.atropos.destroy();
		}
	}
	customElements.define('atropos-component', AtroposComponent);


   // 61. tp-gsap-bg //
	if ($('.tp-gsap-bg').length > 0) {
		gsap.set(".tp-gsap-bg", { scaleX: 1 });
		let mm = gsap.matchMedia();
		mm.add("(min-width:1400px)", () => {
			gsap.to(".tp-gsap-bg", {
				scrollTrigger: {
					trigger: ".tp-gsap-bg",
					scrub: 0.2, 
					start: "top 90%", 
					end: "bottom 100%",
				},
				scaleX: 0.85,
				borderRadius: "60px",
				transformOrigin: "center center",
				ease: "none",
			});
		});
	}

   // 62. cta section animation //
	if ($('.st-cta-area').length > 0) {
		gsap.set(".st-cta-bg-circle", { scaleX: 1 });
		let mm = gsap.matchMedia();
		mm.add("(min-width:1400px)", () => {
			gsap.to(".st-cta-bg-circle", {
				scrollTrigger: {
					trigger: ".st-cta-area",
					scrub: 0.2, 
					start: "top 70%", 
					end: "bottom 100%",
				},
				duration: 2,
				scaleX: 1,
				borderRadius: "1100px 1100px 0 0",
				transformOrigin: "top center",
				ease: "none",
			});
		});
	}

	// 63. img animation slider//
	if ($('.tp-hero-img-wrap').length > 0) {
		let t2 = gsap.timeline({
			scrollTrigger: {
			trigger: ".tp-hero-img-wrap",
			start: "top 100%",
			}
		})
		t2.from(".img3", {
			y: 100,
			opacity: 0,
			duration: 1
		})
		t2.from(".img2", {
			x: 100,
			opacity: 0,
			duration: 1
		}, "-=0.5")
		t2.from(".img4", {
			x: -100,
			opacity: 0,
			duration: 1
		}, "-=1")
		t2.from(".img1", {
			x: 100,
			opacity: 0,
			duration: 1
		}, "-=0.6")
		t2.from(".img5", {
			x: -100,
			opacity: 0,
			duration: 1
		}, "-=1")
	}

	// 64. Function to hide the parent section //
	$('.hide-button').on('click', function(){
		$('.tp-header-10-announcement-area').slideUp(200);
	});

	// 65. tp-split-text //
	$(function () {
		let st = $(".tp-split-text");
		if (st.length === 0) return;

		gsap.registerPlugin(SplitText);
		st.each(function (index, el) {
			el.split = new SplitText(el, {
				type: "lines,words,chars",
				linesClass: "tp-split-line"
			});

			gsap.set(el, { perspective: 400 });
			let animationProps = { opacity: 0 };

			if ($(el).hasClass('tp-split-right')) animationProps.x = "50";
			if ($(el).hasClass('tp-split-left')) animationProps.x = "-50";
			if ($(el).hasClass('tp-split-up')) animationProps.y = "80";
			if ($(el).hasClass('tp-split-down')) animationProps.y = "-80";

			gsap.set(el.split.chars, animationProps);

			el.anim = gsap.to(el.split.chars, {
				scrollTrigger: { trigger: el, start: "top 90%" },
				x: "0",
				y: "0",
				rotateX: "0",
				scale: 1,
				opacity: 1,
				duration: 0.4,
				stagger: 0.02,
			});
		});
	});


	// 66. Rendom text genarator in hover //
	document.querySelectorAll('.codetext').forEach((t) => {
		const arr1 = t.innerHTML.split('');
		const arr2 = arr1.map(() => randChar()); 
	  
		t.onpointerover = () => {
		  const tl = gsap.timeline();
		  let step = 0;
	  
		  tl.fromTo(
			t,
			{ innerHTML: arr2.join('') },
			{
			  duration: arr1.length / 20, 
			  ease: 'power4.in',
			  delay: 0.1,
			  onUpdate: () => {
				const progress = Math.floor(tl.progress() * arr1.length);
				if (step !== progress) { 

					step = progress;
					arr1.forEach((_, i) => (arr2[i] = randChar()));
		
					let start = arr1.slice(0, progress).join('');
					let end = arr2.slice(progress).join('');
		
					if (t.classList.contains('fromRight')) {
						start = arr2.slice(0, progress).join('');
						end = arr1.slice(progress).join('');
					}

					t.innerHTML = start + end; 
				}
			  },
			}
		  );
		};
	});
	  
	// 67. lowercase character //
	function randChar() {
		const chars = "abcdefghijklmnopqrstuvwxyz";
		return chars[Math.floor(Math.random() * chars.length)];
	}


	// 68. Hero bg Animation //
	if ($('.cr-hero-bottom-wrap, .cr-footer-bg').length > 0) {
		let t2 = gsap.timeline({
			scrollTrigger: {
			trigger: ".cr-hero-bottom-wrap, .cr-footer-bg",
			start: "top 110%",
			}
		})
		t2.from(".bg-b", {
			y: 100,
			opacity: 0,
			duration: 1
		})
		t2.from(".bg-l", {
			x: 100,
			opacity: 0,
			duration: 1
		}, "-=0.5")
		
		t2.from(".bg-r", {
			x: -100,
			opacity: 0,
			duration: 1
		}, "-=1")
	}


	// 69. Section to title zoom and item uper //
	const pm = gsap.matchMedia();
	pm.add("(min-width: 1200px)", () => {
	if ($('.st-portfolio-area').length > 0) {
		let project_text = gsap.timeline({
			scrollTrigger: {
				trigger: ".st-portfolio-area",
				start: 'top 5%',
				end: "bottom 55%",
				pin: ".st-portfolio-heading",
				markers: false,
				pinSpacing: false,
				scrub: 1,
			}
		})
		project_text.set(".st-portfolio-title", {
			scale: .9,
			duration: 2
		})
		project_text.to(".st-portfolio-title", {
			scale: 1.2,
			duration: 2
		})
		project_text.to(".st-portfolio-title", {
			scale: 1.2,
			duration: 2
		}, "+=2")
		}
	})

	// 70. portfolio bg change //
	$('.tp-project-5-title-wrap .tp-project-5-title-box').on("mouseenter", function () {
		$('#tp-project-5-thumb-wrap').removeClass().addClass($(this).attr('rel'));
		$(this).addClass('active').siblings().removeClass('active');
	});

	// 71. Image Reveal Animation //
	let tp_img_reveal = document.querySelectorAll(".tp_img_reveal");
	tp_img_reveal.forEach((img_reveal) => {
		let image = img_reveal.querySelector("img");
		let tl = gsap.timeline({
			scrollTrigger: {
				trigger: img_reveal,
				start: "top 70%",
			}
		});

		tl.set(img_reveal, { autoAlpha: 1 });
		tl.from(img_reveal, 1.5, {
			xPercent: -100,
			ease: Power2.out
		});
		tl.from(image, 1.5, {
			xPercent: 100,
			scale: 1.5,
			delay: -1.5,
			ease: Power2.out
		});
	});
	
	
	// 72. career animation //
	const cr = gsap.matchMedia();
	tm.add("(min-width: 1200px)", () => {
		let tl_ser = gsap.timeline();
		let panels = document.querySelectorAll('.tp-career-details-ptb')
		panels.forEach((section, index) => {
			tl_ser.to(section, {
				scrollTrigger: {
					trigger: '.tp-career-details-wrapper',
					pin: '.tp-career-details-sidebar',
					scrub: 1,
					start: 'top 80px',
					end: "bottom 100%",
					endTrigger: '.tp-career-details-ptb',
					pinSpacing: false,
					markers: false,
				},
			})
		})
	});


	// 73. service animation //
	const sr = gsap.matchMedia();
	tm.add("(min-width: 992px)", () => {
		let tl_ser = gsap.timeline();
		let panels = document.querySelectorAll('.tp-inner-service-area')
		panels.forEach((section, index) => {
			tl_ser.to(section, {
				scrollTrigger: {
					trigger: '.tp-inner-service-area',
					pin: '.inner-service-1-left',
					scrub: 1,
					start: 'top 80px',
					end: "bottom 100%",
					endTrigger: '.tp-inner-service-area',
					pinSpacing: false,
					markers: false,
				},
			})
		})
	});

	// 74. contact-category animation //

	$('.tp-contact-category-btn').each(function (e) {
		var $this = $(this);

		$this.on('click', function () {
			$this.toggleClass('active');
		});
	})

   // 75. portfolio-slicer animation //
	if ($('.tp-portfolio-slicer-wrap').length > 0) {

        let pw = gsap.matchMedia();
        pw.add("(min-width: 1200px)", () => {
            gsap.set('.tp-portfolio-slicer-wrap .pro-img-1 img', {
                x: '500',
            })
            gsap.set('.tp-portfolio-slicer-wrap .pro-img-2 img', {
                x: '-500',
            })
            let projects = gsap.utils.toArray(".tp-portfolio-slicer-wrap");
            projects.forEach((item) => {
                var $this = $(item);
    
                gsap.to($this.find('.pro-img-1 img'), {
                    x: '0',
                    scrollTrigger: {
                        trigger: $this,
                        start: 'top 22%',
                        end: 'bottom 10%',
                        scrub: 1,
                        pin: true,
                        transformOrigin: "50% 50%"
                    },
                })
    
                gsap.to($this.find('.pro-img-2 img'), {
                    x: '0',
                    scrollTrigger: {
                        trigger: $this,
                        start: 'top 22%',
                        end: 'bottom 10%',
                        scrub: 1,
                        pin: false,
                        transformOrigin: "50% 50%"
                    },
                })
            });
    
        });
    }

   // 76. perspective-slider animation //
	function perspective() {

        if ($('.tp-perspective-slider').length) {

            gsap.set('.tp-perspective-slider .tp-perspective-main .tp-perspective-inner', { perspective: 60 });

            $('.tp-perspective-slider .tp-perspective-main .tp-perspective-inner .tp-perspective-image').each(function () {
                var slide = $(this);

                gsap.fromTo(this, {
                    rotationX: 1.8,
                    scaleX: 1,
                    z: '0vh'
                }, {
                    rotationX: -.5,
                    scaleX: 1,
                    z: '-2vh',
                    scrollTrigger: {
                        trigger: slide,
                        start: "top+=150px bottom",
                        end: "bottom top",
                        immediateRender: false,
                        scrub: 0.1,
                    }
                });
            });

        }
    }
    perspective()


	// 77. showcase-portfolio-panel //
	pr.add("(min-width: 767px)", () => {
		let otherSections = document.querySelectorAll('.showcase-portfolio-panel')
		otherSections.forEach((section, index) => {
			gsap.set(otherSections, {
				scale: 1,
			});
			tl.to(section, {
				scale: .8,
				scrollTrigger: {
					trigger: section,
					pin: section,
					scrub: 1,
					start: 'top 5%',
					end: "bottom 100%",
					endTrigger: '.showcase-portfolio-wrap',
					pinSpacing: false,
					markers: false,
				},
			})
		})
	});


	// 78. scroll animation //
	gsap.matchMedia().add("(min-width: 991px)", () => {
		document.querySelectorAll(".img-box").forEach((box) => {
			gsap.fromTo(
				box.querySelectorAll('.tp-top-bottom-scroll'),
				{ yPercent: 20 },
				{ yPercent: -26, ease: "power1.out", scrollTrigger: {
					trigger: box,
					start: "top 100%",
					end: "bottom top",
					scrub: true,
					markers: false,
				}}
			);
		});
	});
	
	
	// 79. project details anim js //
	let vs = gsap.matchMedia();
	vd.add("(min-width: 1200px)", () => {
		if ($('.project-details-2-area').length > 0) {
			ScrollTrigger.create({
				trigger: ".project-details-2-area",
				start: "top top",
				end: "bottom -100%",
				pin: ".project-details-video",
				pinSpacing: false,
			});
		}
	});

	// 80. progress anim //
	const progress = document.getElementById("progress");
	const timer = document.getElementById("timer");
	const video_progress_btn = document.getElementById("play");
	function progressLoop() {
		setInterval(function () {
			progress.value = Math.round((video.currentTime / video.duration) * 100);
			timer.innerHTML = Math.round(video.currentTime) + " seconds";
		});
	}
	function playPause() {
		if (video.paused) {
			video.play();
			video_progress_btn.innerHTML = "&#10073;&#10073;";
		} else {
			video.pause();
			video_progress_btn.innerHTML = "►";
		}
	}
	if (video_progress_btn) {
		video_progress_btn.addEventListener("click", playPause);
		video.addEventListener("play", progressLoop);
	}


	// 81. portfolio item pin js //
	let pi = gsap.matchMedia();
	pi.add("(min-width: 1200px)", () => {
		document.querySelectorAll('.tp-pd-3-portfolio-item-wrap').forEach((group) => {
			const panels = group.querySelectorAll('.tp-pd-3-portfolio-item');
			const pinTarget = group.querySelector('.tp-pd-3-content-pin');
			panels.forEach((section) => {
				ScrollTrigger.create({
					trigger: section,
					pin: pinTarget,
					start: 'top 20%',
					end: 'bottom center',
					scrub: 1,
					pinSpacing: false,
					markers: false,
				});
			});
		});
	});

	
	// 82. overlay animation //
	if ($('.tp-pd-5-hero-black-overlay').length > 0) {
		gsap.to(".tp-pd-5-hero-black-overlay", {
			opacity: 0,
			scrollTrigger: {
			  trigger: ".tp-pd-5-hero-black-anim",
			  start: "top -40%",
			  end: "bottom 100%",
			  scrub: true,
			}
		});
	}
	if ($('.tp-pd-5-hero-white-overlay').length > 0) {
		gsap.to(".tp-pd-5-hero-white-overlay", {
			opacity: 0,
			scrollTrigger: {
			  trigger: ".tp-pd-5-hero-white-anim",
			  start: "top -5%",
			  end: "bottom 100%",
			  scrub: true,
			}
		});
	}

	// 83. E-commerce plus minus js //
	function tp_ecommerce() {
		$('.tp-cart-minus').on('click', function () {
		  const $input = $(this).siblings('input');
		  let count = Number($input.val()) - 1;
		  $input.val(count < 1 ? 1 : count).change();
		});
	  
		$('.tp-cart-plus').on('click', function () {
		  const $input = $(this).siblings('input');
		  $input.val(Number($input.val()) + 1).change();
		});
	  
		$('.tp-color-variation-btn').on('click', function () {
		  $(this).addClass('active').siblings().removeClass('active');
		});

		//  tpReturnCustomerLoginForm //
		$('.tp-checkout-login-form-reveal-btn').on('click', function () {
			$('#tpReturnCustomerLoginForm').slideToggle(400);
		  });
		
		//  Show Coupon Toggle Js //
		$('.tp-checkout-coupon-form-reveal-btn').on('click', function () {
		$('#tpCheckoutCouponForm').slideToggle(400);
		});
	
		// Create An Account Toggle Js //
		$('#cbox').on('click', function () {
			$('#cbox_info').slideToggle(900);
		});
	
		// Shipping Box Toggle Js //
		$('#ship-box').on('click', function () {
			$('#ship-box-info').slideToggle(1000);
		});
	}
	tp_ecommerce();
	
	// 84. Tab line change js //
	if ($('#productTabMarker').length > 0) {
	function tp_tab_line_2() {
		const marker = document.querySelector('#productTabMarker');
		const tabs = document.querySelectorAll('.tp-product-tab button');
		const activeTab = document.querySelector('.tp-product-tab .nav-link.active');
	
		// RTL Support
		const rtl = localStorage.getItem('tp_dir') === 'rtl';
		const markerPosition = rtl ? 'right' : 'left';
	
		// Move the marker to the clicked tab
		function moveMarkerTo(elem) {
		marker.style.left = elem.offsetLeft + 'px';
		marker.style.width = elem.offsetWidth + 'px';
		}
	
		// Initial position
		moveMarkerTo(activeTab);
		marker.style.display = 'block';
	
		// Add click events to all tabs
		tabs.forEach(tab => {
		tab.addEventListener('click', () => {
			moveMarkerTo(tab);
		});
		});
	}
	
	tp_tab_line_2();
	}

	// 85. Custom Select Js //
	document.addEventListener("DOMContentLoaded", () => {
		const customSelect = document.getElementById("customSelect");
		if (!customSelect) {
			return;
		}
		const selected = customSelect.querySelector(".selected");
		const options = customSelect.querySelector(".options");
		selected.addEventListener("click", (event) => {
			event.stopPropagation();
			selected.classList.toggle("open");
		});
		options.addEventListener("click", (event) => {
			if (event.target.tagName === "LI") {
			const selectedText = event.target.textContent;
			selected.firstChild.textContent = selectedText;
			selected.classList.remove("open");
			}
		});
		document.addEventListener("click", () => {
			selected.classList.remove("open");
		});
	});

	// 86. product banner js //
	let shop_thumb = gsap.matchMedia();
	shop_thumb.add("(min-width: 1200px)", () => {
		if ($('.tp-shop-product-area').length > 0) {
			ScrollTrigger.create({
				trigger: ".tp-shop-product-area",
				start: "top 15px",
				end: "bottom 103%",
				pin: ".tp-shop-product-banner",
				pinSpacing: true,
			});
		}
	});

	// 87. Password Toggle Js //
	if ($('#password-show-toggle').length > 0) {
		var btn = document.getElementById('password-show-toggle');
		btn.addEventListener('click', function (e) {
			var inputType = document.getElementById('tp_password');
			var openEye = document.getElementById('open-eye');
			var closeEye = document.getElementById('close-eye');

			if (inputType.type === "password") {
				inputType.type = "text";
				openEye.style.display = 'block';
				closeEye.style.display = 'none';
			} else {
				inputType.type = "password";
				openEye.style.display = 'none';
				closeEye.style.display = 'block';
			}
		});
	}


	// 89. Language toggle js //
	if ($("#header-lang-toggle").length > 0) {
		window.addEventListener('click', function(e){
			if (document.getElementById('header-lang-toggle').contains(e.target)){
				$(".header-lang-submenu").toggleClass("open");
			}
			else{
				$(".header-lang-submenu").removeClass("open");
			}
		});
	}

	// 90. popup subscribe js //
	if ($('.subscribe-popup').length) {
	const loginPopup = document.querySelector(".subscribe-popup");
	const close = document.querySelector(".close");
	window.addEventListener("load", function () {
		if (!sessionStorage.getItem('subscribePopupClosed')) {
			showPopup();
		}
	});
	function showPopup() {
		const timeLimit = 5;
		let i = 0;
		const timer = setInterval(function () {
			i++;
			if (i === timeLimit) {
				clearInterval(timer);
				loginPopup.classList.add("show");
			}
		}, 500);
	}
		close.addEventListener("click", function () {
			loginPopup.classList.remove("show");
			sessionStorage.setItem('subscribePopupClosed', 'true');
		});
	}

	// 91. brand img animation //
	if ($('.tp-brand-inner-area').length) {
	gsap.set(".tp-brand-inner-item img", { scale: 1.3, opacity: 0 });
	gsap.to(".tp-brand-inner-item img", {
		scale: 1,
		opacity: 1,
		duration: 1.5,
		ease: "bounce.out",
		stagger: {
			each: 0.1
		},
		scrollTrigger: {
			trigger: '.tp-brand-inner-area',
			start: "top 100%"
		}
	})
	}

	// 92. social section img show //
	$('.pp-social-item').on('mouseenter', function () {
		$('.pp-social-item').removeClass('active');
		$(this).addClass('active');
	});


})(jQuery);