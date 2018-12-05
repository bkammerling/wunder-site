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
    var eventsBtn = $("#js-events");
    var appBtn = $("#js-app");
    this.activeItem();
    this.toggleMenu(btn, menu);
    this.dropdown(languageBtn);
    this.dropdown(solutionsBtn);
    this.dropdown(eventsBtn);
    this.dropdown(appBtn);
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
      $(this).siblings().removeClass("is-active");
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
      const name = $("input#name").val();
      const email = $("input#email").val();
      const formSubject = $("select#subject").val();
      var body = "This message was sent from a contact form on wunder.org." + '\n\n',
          subject = formSubject + " - Message from Wunder.org";
      $("form#main-contact").find("input[name], select[name], textarea[name]").each(function (index, node) {
        body += node.name.toUpperCase() + '\n' + node.value + '\n\n';
      });

      form.submit(subject, body, name, email, subject);
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
        "name": name,
        "fromEmail": email
      })
    }).done(function (data) {
      $(".form-feedback").removeClass('invisible');
      $('form#main-contact').trigger("reset");
      console.log(data);
      submitBtn.attr("disabled", false);
    }).fail(function (error) {
      $(".form-feedback").removeClass('invisible').text('There was a problem sending your message, please try again or send an email to support@wunder.org.');
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
      currentJobsHtml = '<p>Could not connect with job board. Find our open positions <a href="https://boards.greenhouse.io/wunder/" target="_blank">here</a>.</p>';
    }).always(function() {
      $(".job-list__listing").append(currentJobsHtml);
      $(".job-list__listing > div").first().remove();
    });
  },

  build: function(data) {
    if(data.length < 1) return '<p>No positions currently available.</p>';
    var sortedJobs = data;
    console.log(sortedJobs);
    var singleHTML = $(".job-list__item").clone();
    var jobListHTML = "";
    for(var i = 0; i < sortedJobs.length; i++) {
      var job = sortedJobs[i];
      singleHTML.find(".job-title").text(job.title);
      singleHTML.find(".job-category").text(job.departments[0].name);
      singleHTML.find(".job-title").attr('href', job.absolute_url);
      var location = job.location.name.indexOf("Wunder") == -1 ? job.location.name : job.location.name.replace("Wunder ", "");

      singleHTML.find(".job-location").text(location);
      var content = $('<textarea />').html(job.content).text();
      singleHTML.find(".job-excerpt").text(this.strip(content).substring(0, 300)+"...");
      jobListHTML += singleHTML.wrap('<p/>').parent().html()

    } // end of for loop
    return jobListHTML;
  },

  sortByDepartment: function(array) {
    array.sort(function(a,b) {
      var depA = a.departments[0].name;
      var depB = b.departments[0].name;
      if (depA < depB) return -1;
      if (depA > depB) return 1;
      return 0;
    });
    return array;
  },

  strip: function(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
};

if($("body").data("menu") == 0 && $("body").hasClass('careers')) jobs.init();


var accordion = {
  init: function() {
    $('.accordion-title').click(function() {
      $(this).parent().find('.accordion-content').slideToggle()
      $(this).toggleClass('active');
      if($(this).text() == 'Show more') {
        $(this).text('Show less')
      } else if($(this).text() == 'Show less') {
        $(this).text('Show more');
      }
    });
  }
}

if($("body").data("menu") == 6) accordion.init();


var maxItems = {
  init: function() {
    var classes = $('.max-items').attr('class').split(" ");
    console.log(classes);
    var ourClass = classes.filter((aClass)=>{
      if(aClass.indexOf('max--') != -1) return aClass;
    });
    var lastItem = ourClass[0].split('max--')[1];
    $('.max-items').children().slice(lastItem).wrapAll("<div class='accordion-content'></div>");
    $('.accordion-content').after("<a class='text-center accordion-title max-showmore'>Show more</a><hr class='light'>")
    accordion.init();
  }
}

if($(".max-items").length>0) maxItems.init();
