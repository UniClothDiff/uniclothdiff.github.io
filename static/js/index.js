window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

    // Custom Carousel Class
    class CustomCarousel {
        constructor(carouselId, totalSlides, slidesVisible = 3) {
            this.currentSlide = 0;
            this.totalSlides = totalSlides;
            this.slidesVisible = slidesVisible;
            this.slideWidth = 100 / slidesVisible; // Calculate slide width based on visible slides
            this.track = document.querySelector(`#${carouselId} .carousel-track`);
            this.indicators = document.querySelectorAll(`#${carouselId} .indicator`);
            this.prevBtn = document.getElementById(`${carouselId.replace('-carousel', '')}-prev`);
            this.nextBtn = document.getElementById(`${carouselId.replace('-carousel', '')}-next`);

            this.init();
        }

        init() {
            // Event listeners
            if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());
            if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());

            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => this.goToSlide(index));
                indicator.setAttribute('data-slide', index);
            });

            // Auto-play
            setInterval(() => this.nextSlide(), 5000);
        }

        updateCarousel(instant = false) {
            if (this.track) {
                // Temporarily disable transition for instant resets
                this.track.style.transition = instant ? 'none' : 'transform 0.3s ease';

                // Move by slideWidth for each slide
                this.track.style.transform = `translateX(-${this.currentSlide * this.slideWidth}%)`;

                // Update indicators based on logical position
                const logicalPosition = this.currentSlide >= this.totalSlides ? this.currentSlide - this.totalSlides : this.currentSlide;
                this.indicators.forEach((indicator, index) => {
                    const groupStart = index * this.slidesVisible;
                    const groupEnd = Math.min(groupStart + this.slidesVisible - 1, this.totalSlides - 1);
                    const isActive = logicalPosition >= groupStart && logicalPosition <= groupEnd;
                    indicator.style.background = isActive ? '#3498db' : '#ddd';
                    indicator.classList.toggle('active', isActive);
                });

                // Force reflow if transition was disabled
                if (instant) {
                    this.track.offsetHeight;
                }
            }
        }

        nextSlide() {
            this.currentSlide++;

            if (this.currentSlide >= this.totalSlides) {
                // We're now showing duplicates, let the animation play out then reset
                this.updateCarousel(false);

                // After the animation completes, jump back to the equivalent real position
                setTimeout(() => {
                    this.currentSlide = this.currentSlide - this.totalSlides; // Convert 10->0, 11->1
                    this.updateCarousel(true); // No animation for the reset
                }, 300);
            } else {
                this.updateCarousel(false);
            }
        }

        prevSlide() {
            if (this.currentSlide <= 0) {
                this.currentSlide = this.totalSlides - 1; // Go to last slide
            } else {
                this.currentSlide--;
            }
            this.updateCarousel(false);
        }

        goToSlide(slideIndex) {
            this.currentSlide = slideIndex * this.slidesVisible; // Jump to start of group
            if (this.currentSlide >= this.totalSlides) {
                this.currentSlide = this.totalSlides - 1;
            }
            this.updateCarousel(false);
        }
    }

    // Initialize all carousels
    const clothCarousel = new CustomCarousel('dynamics-carousel', 10, 3);        // 3 gifs visible
    const tshirtCarousel = new CustomCarousel('tshirt-carousel', 10, 3);         // 3 gifs visible
    const handCarousel = new CustomCarousel('hand-carousel', 4, 2);              // 2 videos visible
    const singleStepCarousel = new CustomCarousel('single-step-carousel', 6, 2); // 2 videos visible
    const multiStepCarousel = new CustomCarousel('multi-step-carousel', 5, 2);   // 2 videos visible

})
