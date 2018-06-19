var slider = {
  init: function(target, config) {
    $(target).slick(config);
  }
};

var menu = {
  init: function() {
    var btn = $(".header__icon");
    var menu = $(".header__nav");
    var languageBtn = $("#js-language");
    var solutionsBtn = $("#js-solutions");
    this.activeItem();
    this.toggleMenu(btn, menu);
    this.dropdown(languageBtn);
    this.dropdown(solutionsBtn);
  },

  activeItem: function () {
    var activeIndex = $('body').data('menu');
    var activeSubIndex = $('body').data('submenu');
    var mainItems = $('.header__nav > li');
    var subItems = $('.header__nav-subitem li');

    try {
      if (activeSubIndex || activeSubIndex === 0) {
        activeSubIndex = activeSubIndex.toString();
      }
    } catch(e) {
      console.log(e);
    }

    $(mainItems[activeIndex]).addClass('current');
    if (activeSubIndex && activeSubIndex.length > 0) {
      $(subItems[activeSubIndex]).addClass('is-active');
    }
  },

  toggleMenu: function(target, menu) {
    target.on("click", function() {
      menu.toggleClass("active");
    });
  },

  dropdown: function(btn) {

    btn.on("click", function() {
      $(this).toggleClass("is-active");
    });

    $("main").on("click", function() {
      btn.removeClass("is-active");
    });
  }
};

slider.init(".simple-slider", {
  dots: true,
  lazyLoad: 'ondemand',
  prevArrow:
    '<span class="slider__arrow slider__arrow--prev"><img src="./img/slider-arrow.svg" alt="Prev"/></span>',
  nextArrow:
    '<span class="slider__arrow slider__arrow--next"><img src="./img/slider-arrow.svg" alt="Next"/></span>',
    adaptiveHeight: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          adaptiveHeight: true
        }
      }
    ]
});

slider.init(".picture-slider", {
  dots: true,
  lazyLoad: 'ondemand',
  prevArrow:
    '<span class="slider__arrow slider__arrow--prev"><img src="./img/slider-arrow.svg" alt="Prev"/></span>',
  nextArrow:
    '<span class="slider__arrow slider__arrow--next"><img src="./img/slider-arrow.svg" alt="Next"/></span>'
});

menu.init();

var lazyLoadingImages = function () {
  [].forEach.call(document.querySelectorAll('img[data-src]'),    function(img) {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = function() {
      img.removeAttribute('data-src');
    };
  });
}

lazyLoadingImages();