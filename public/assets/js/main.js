// Lemonade stand

var state = {
  buyers: [],
  temperature: 75,
  sunny: 1,
  price: 1.00,
  updatePending: false,

  addBuyer: function() {
    newBuyer = new buyer();
    this.buyers.push(newBuyer);
    this.queueUpdate();
    gender = [ boy, girl];
  },

  removeBuyer: function() {
    oldBuyer = this.buyers.shift();
    this.queueUpdate();
  },

  setTemperature: function(temp) {
    this.temperature = temp;
    this.queueUpdate();
  },

  setPrice: function(price) {
    this.price = price;
    this.queueUpdate();
  },

  setSunny: function(sunny) {
    this.sunny = sunny;
    this.queueUpdate();
  },

  queueUpdate: function() {
    if (!this.updatePending) {
      this.updatePending = true;
      setTimeout(sellerEvaluate, 2500);
    }
  }
};

function sellerEvaluate() {
  var data = {
    numBuyers: state.buyers.length,
    temperature: state.temperature,
    sunny: state.sunny
  };
  console.log(JSON.stringify(data));
  $.ajax({
    method: "POST",
    url: "/data/seller/evaluate",
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(data) {
      state.updatePending = false;
      console.log(data);
    }
  });
}

var buyer = function () {
  return {
    evaluate: function() {
      var data = {
        price: state.price,
        numBuyers: state.buyers.length,
        temperature: state.temperature,
        sunny: state.sunny
      };

      $.post("/data/buyer/evaluate", data, function(data) {
        console.log("show buy / no buy");
      });
    }
  }
};

(function(){
  console.log(state);
let cloudyIcon = document.querySelector('.cloudy-icon-btn'),
    sunnyIcon = document.querySelector('.sunny-icon-btn'),
    b = document.getElementsByTagName('body')[0],
    bSunny = document.getElementsByClassName('sunny'),
    sun = document.querySelector('.sun'),
    sunnyOrCloudy = document.querySelector('.sunny-or-cloudy'),
    jsNotActive = document.querySelector('.js-not-active'),
    lemonsplanation = document.querySelector('.lemonsplanation'),
    lemonHeading = document.querySelector('.lemonsplanation__heading'),
    lemonPara = document.querySelector('.lemonsplanation__para'),
    boy = document.querySelector(".boy"),
    girl = document.querySelector(".girl"),
    tempUp = document.querySelector('.temperature-up-icon'),
    tempDown = document.querySelector('.temperature-down-icon'),
    buyer = [boy, girl];


const startBtn = document.querySelector('.js-start-btn'),
      sceneAction = document.querySelector ('.scene-action');

function setCloudyWeather() {
  b.classList.toggle('cloudy');
  b.classList.remove('sunny')
  cloudyIcon.classList.add('active-icon');
  sunnyIcon.classList.remove('active-icon');
  sunnyOrCloudy.innerHTML = 'cloudy';

  state.setSunny(0);

  window.setTimeout(function(){
    sun.classList.add('offset-sun');
    }, 7000);
  };


function setSunnyWeather() {
  state.setSunny(1);
  b.classList.add('sunny');
  b.classList.remove('cloudy')
  sun.classList.remove('offset-sun');
  sunnyOrCloudy.innerHTML = 'sunny';
  sunnyIcon.classList.add('active-icon');
  cloudyIcon.classList.remove('active-icon');
}

//toggle cloudy or sunny weather

sunnyIcon.addEventListener('click', setSunnyWeather);
cloudyIcon.addEventListener('click', setCloudyWeather);

tempUp.addEventListener('click', function() {
  state.setTemperature(state.temperature + 1);
  tempValue = state.temperature;
  $("#temperature").html(state.temperature);
});

tempDown.addEventListener('click', function() {
  state.setTemperature(state.temperature - 1);
  tempValue = state.temperature;
  $("#temperature").html(state.temperature);
});


//GSAP animations timelines
tlSunEntrance = new TimelineMax();
tlIntroText = new TimelineMax();
tlSunEntrance = new TimelineMax();

  // intro text animation
  tlIntroText
    .from(lemonHeading, .5, {autoAlpha: 0, y: -20, ease: Power2.easeIn})
    .from(lemonPara, .5, {autoAlpha: 0, ease: Power4.easeIn})
    .fromTo(startBtn, .75, {autoAlpha: 0, scale:0, yPercent: '-100'},{autoAlpha:1, scale:1, yPercent:'0', ease: Back.easeIn}, '-=.25');

    // sun entrance into scene
  tlSunEntrance
  .fromTo(sun, 1, {opacity:0, rotation:0, Y: -200 , scale:0},
         {opacity:1, y:0, rotation:360,  scale:1, ease: Power2.easeInOut})
  .staggerFrom(".clouds", 3, {cycle:{
    scale:[0, 1]
  }, autoAlpha:0,  ease:  Power1.easeOut }, 1)

  //start and load animation loop
  startBtn.addEventListener('click' , function() {
    TweenMax.to(lemonsplanation, 3, {scale: 0, opacity:0, x:-100, ease: Power4.easeInOut})

      $.post('/data/seller', function(data) {
        console.log(data);
      });

      TweenMax.to(".lemonsplanation", 3, {scale: 0, opacity:0, ease: Power4.easeInOut})
      TweenMax.to(window, 1, {scrollTo:{y:"#funtimes", offsetY:-200}, onComplete:function(){
      jsNotActive.classList.remove('js-not-active');
      sceneAction.classList.add('js-active');

      let buyers = document.querySelectorAll('.buyer');
        var buyer = [boy,girl];
        var tlBuyers = new TimelineMax(  {onComplete: function() {
              this.restart();
          }
        });
        
      //buyer loop
      buyers.forEach(function(buyer){
        tlBuyers
          .to(buyer, 3, {left: "40%", delay:4, ease:Power1.easeOut})
          .to(buyer, 4, { left:"120%",ease:Power3.easeIn})
        })
      }
    });
  })
})();
