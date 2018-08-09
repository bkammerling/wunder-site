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
    '<span class="slider__arrow slider__arrow--prev"><img src="/img/slider-arrow.svg" alt="Prev"/></span>',
  nextArrow:
    '<span class="slider__arrow slider__arrow--next"><img src="/img/slider-arrow.svg" alt="Next"/></span>',
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
    '<span class="slider__arrow slider__arrow--prev"><img src="/img/slider-arrow.svg" alt="Prev"/></span>',
  nextArrow:
    '<span class="slider__arrow slider__arrow--next"><img src="/img/slider-arrow.svg" alt="Next"/></span>'
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

var form = {
  init: function() {
    $("#form-submit").click(function(event)  {
      if(!$('form#main-contact')[0].reportValidity()) return false;
      var body = "This message was sent from a contact form on wunder.org." + '\n\n',
          subject = "Message from website contact form";
      $("form#main-contact").find("input[name], select[name], textarea[name]").each(function (index, node) {
        body += node.name.toUpperCase() + ": " + node.value + '\n\n';
      });
      const name = $("input#name").val();
      const email = $("input#email").val();
      form.submit(subject, body, name, email);
    });
  },

  submit: function(subject, body, name, email) {
    var submitBtn = $("#form-submit");
    submitBtn.attr("disabled", true);
    var awsURL = "https://1bnwg71zz1.execute-api.us-west-2.amazonaws.com/production/submit";

    $.ajax({
      method: "POST",
      url: awsURL,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        "subject":subject,
        "body":body,
        "toEmail": "benjamin@wunder.org",
        "name": name,
        "fromEmail": email
      })
    }).done(function (data) {
      $(".form-feedback").removeClass('invisible');
      $('form#main-contact').trigger("reset");
      console.log(data);
      submitBtn.attr("disabled", false);
    }).fail(function (error) {
      $(".form-feedback").removeClass('invisible').text('There was a problem sending your message, please try again or send us an email.');
    });
  }

};

form.init();

var jobs = {
  init: function() {
    var currentJobsHtml;
    $.ajax({
      method: "GET",
      url: "https://boards-api.greenhouse.io/v1/boards/wunder/jobs?content=true"
    }).done(function (data) {
      currentJobsHtml = jobs.build(data.jobs);
    }).fail(function(error) {
      currentJobsHtml = '<p>Could not  connect with job board. Find our open positions <a href="https://boards.greenhouse.io/wunder/" target="_blank">here</a>.</p>';
    }).always(function() {
      $(".career-jobs__wrapper").append(currentJobsHtml);
    });
  },

  build: function(data) {
    if(data.length < 1) return '<p>No positions currently available.</p>';
    var sortedJobs = jobs.sort(data);
    var jobsHtml = "";
    for(var i = 0; i < sortedJobs.length; i++) {
      var job = sortedJobs[i]
      if(i==0) {
        jobsHtml += "<ul class=career-jobs__list><li>" + job.departments[0].name + "</li>"
      } else if(job.departments[0].name !== sortedJobs[i-1].departments[0].name) {
        jobsHtml += "</ul><ul class=career-jobs__list><li>" + job.departments[0].name + "</li>"
      }
      jobsHtml += "<li><a href=" + job.absolute_url + ">" + job.title + "</a></li>"
      if(i==sortedJobs.length) {
        console.log('last');
        jobsHtml += "</ul>";
      }
    } // end of for loop
    return jobsHtml;
  },

  sort: function(array) {
    array.sort(function(a,b) {
      var depA = a.departments[0].name;
      var depB = b.departments[0].name;
      if (depA < depB) return -1;
      if (depA > depB) return 1;
      return 0;
    });
    return array;
  }
};

if($("body").data("menu") == 3) jobs.init();
