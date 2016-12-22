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
    lemonHeading = document.querySelector('.lemonsplanation__heading'),
    lemonPara = document.querySelector('.lemonsplanation__para'),
    tempUp = document.querySelector('.temperature-up-icon'),
    tempDown = document.querySelector('.temperature-down-icon');

const startBtn = document.querySelector('.js-start-btn'),
      sceneAction = document.querySelector ('.scene-action');


//toggle cloudy or sunny weather
cloudyIcon.addEventListener('click', function(){
  console.log('clicked')
  b.classList.toggle('cloudy');
  b.classList.remove('sunny')
  cloudyIcon.classList.add('active-icon');
  sunnyIcon.classList.remove('active-icon');
  sunnyOrCloudy.innerHTML = 'cloudy';

  state.setSunny(0);
  window.setTimeout(function(){
    sun.classList.add('offset-sun');
  }, 7000);
});

sunnyIcon.addEventListener('click', function(){
  console.log('clicked')
  state.setSunny(1);
  b.classList.add('sunny');
  b.classList.remove('cloudy')
  sun.classList.remove('offset-sun');
  sunnyOrCloudy.innerHTML = 'sunny';
  sunnyIcon.classList.add('active-icon');
  cloudyIcon.classList.remove('active-icon');
});

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


//GSAP animations

tlIntroText = new TimelineMax();

  tlIntroText
  .from(lemonHeading, .5, {autoAlpha: 0, y: -20, ease: Power2.easeIn})
  .from(lemonPara, .5, {autoAlpha: 0, ease: Power4.easeIn})
  .fromTo(startBtn, 2, {autoAlpha: 0, scale:0, yPercent: '-100'},{autoAlpha:1, scale:1, ease: Back.easeIn}, '-=.25');


TweenMax.from(".sun", 1, {opacity:0, rotation:360,  scale:0, ease: Power4.easeInOut})
TweenMax.to(".sun", 2, {opacity:1, y:0,   scale:1.1, ease: Power2.easeInOut})
TweenMax.staggerFrom(".clouds", 3, {cycle:{
  scale:[0, 1.1]
}, autoAlpha:0,  ease:  Power1.easeOut }, 1)

startBtn.onclick = function() {

  TweenMax.to(".lemonsplanation", 3, {scale: 0, opacity:0, x:-100, ease: Power4.easeInOut})

  $.post('/data/seller', function(data) {
    console.log(data);
  });
  TweenMax.to(".lemonsplanation", 3, {scale: 0, opacity:0, ease: Power4.easeInOut})
  TweenMax.to(window, 1, {scrollTo:{y:"#funtimes", offsetY:-100}, onComplete:function(){
    jsNotActive.classList.remove('js-not-active');
    sceneAction.classList.add('js-active');
    // TweenMax.staggerFrom(".buyer" , 1, {opacity: 0,  x:-200})
    // TweenMax.staggerTo(".buyer" , 3, {opacity:1, x:0, ease:  Power0.easeIn }, 4.5)

    let tl = new TimelineLite();
      tl.to(".buyer", 3, {left:"30%"})
        .add("purchasing", '+=2')
        .to(".buyer", 9, {x:2000}, "purchasing");
      }
    });
  }
})();
