// Lemonade stand

var state = {
  buyers: [],
  temperature: 32,
  sunny: 1,
  price: 1.00,
  updatePending: false,
  didPurchase: false,

  addBuyer: function() {
    //var genders = ['boy', 'girl'];
    var genders = ['boy'];
    newBuyer = new buyer();
    newBuyer.gender = genders[Math.floor(Math.random() * genders.length)];
    this.buyers.push(newBuyer);
    numBuyers = state.buyers.length;
    $("#buyer-num").html(numBuyers);
    this.queueUpdate();
  },

  removeBuyer: function() {
    oldBuyer = this.buyers.shift();
    numBuyers = state.buyers.length;
    $("#buyer-num").html(numBuyers);
    this.queueUpdate();
  },

  setTemperature: function(temp) {
    this.temperature = temp;
    $("#temperature").html(this.temperature);
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
      setTimeout(sellerEvaluate, 1000);
    }
  }
};

function sellerEvaluate() {
  var data = {
    numBuyers: state.buyers.length,
    temperature: state.temperature,
    sunny: state.sunny
  };
  $.ajax({
    method: "POST",
    url: "/data/seller/evaluate",
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(data) {
      state.updatePending = false;
      var num = data.evaluation.price;
      if (num) {
        $("#current-price").html("$" + num.toFixed(2));
      }
    }
  });
}

var buyer = function () {
  return {
    gender: 'boy',
    evaluate: function() {
      var data = {
        price: state.price,
        numBuyers: state.buyers.length,
        temperature: state.temperature,
        sunny: state.sunny
      };

      $.ajax({
        method: "POST",
        url: "/data/buyer/evaluate",
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(data) {
          if (data.evaluation.willBuy > 0.5) {
            state.didPurchase = true;
          } else {
            state.didPurchase = false;
          }
          // Send feedback to the seller
          $.ajax({
            method: "POST",
            url: "/data/seller/feedback",
            data: JSON.stringify({willBuy: data.evaluation.willBuy}),
            contentType: 'application/json',
            success: function(data) {
            }
          });

        }
      });
    }
  }
};

var uiInteraction = {
  init: function(){
    this.cacheDom();
    this.bindEvents();
  },
  cacheDom: function(){
    this.el = document.querySelector(".settings");
    this.cloudyIcon =   this.el.querySelector('.cloudy-icon-btn');
    this.sunnyIcon =   this.el.querySelector('.sunny-icon-btn');
    this.sunnyOrCloudy =   this.el.querySelector('.sunny-or-cloudy');
    body = document.getElementsByTagName('body')[0];
    bSunny = document.getElementsByClassName('sunny');
    sun = document.querySelector('.sun');
  },
  bindEvents: function(){
    this.sunnyIcon.addEventListener('click', this.setSunnyWeather.bind(this));
    this.cloudyIcon.addEventListener('click', this.setCloudyWeather.bind(this));
  },

  setCloudyWeather:  function () {
      state.setSunny(0);
      body.classList.add('cloudy');
      body.classList.remove('sunny');
      this.cloudyIcon.classList.add('active-icon');
      this.sunnyIcon.classList.remove('active-icon');
      this.sunnyOrCloudy.innerHTML = 'cloudy';

      window.setTimeout(function(){
        sun.classList.add('offset-sun');
      }, 7000);
    },
    setSunnyWeather: function() {
      state.setSunny(1);
      body.classList.add('sunny');
      body.classList.remove('cloudy');
      sun.classList.remove('offset-sun');
      this.sunnyOrCloudy.innerHTML = 'sunny';
      this.sunnyIcon.classList.add('active-icon');
      this.cloudyIcon.classList.remove('active-icon');
    }
};
uiInteraction.init();

(function(){
  let settings = document.querySelector(".settings"),
      addBuyerLink = document.querySelector("#add-buyer-link"),
      stand = document.querySelector('#stand'),
      snowMount = document.querySelector('#snow'),
      snowMid = document.querySelector("#snow-backer"),
      jsNotActive = document.querySelector('.js-not-active'),
      lemonsplanation = document.querySelector('.lemonsplanation'),
      lemonHeading = document.querySelector('.lemonsplanation__heading'),
      lemonPara = document.querySelector('.lemonsplanation__para'),
      boy = document.querySelector(".boy"),
      girl = document.querySelector(".girl"),
      buyers = document.querySelectorAll('.buyer'),
      buyerPlus = document.querySelector("#buyer-plus"),
      buyerMinus = document.querySelector("#buyer-minus"),
      tempUp = document.querySelector('.temperature-up-icon'),
      tempDown = document.querySelector('.temperature-down-icon'),
      lTopArm = document.querySelector("#left-toparm"),
      lActionArm = document.querySelector("#left-action-arm"),
      lArm = document.querySelector("#left-forarm"),
      chocoCupTable = document.querySelector("#choco-cup"),
      chocoCup = document.querySelector('#choco-cup-in-hand'),
      chocoSteam = document.querySelector("#choco-steam"),
      forgroundTrees = document.querySelector("#forgroundTrees"),
      bigtree = document.querySelector("#bigtree"),
      secondtree = document.querySelector("#secondtree"),
      smallertree = document.querySelector("#smallertree"),
      buyerWidth = buyers[0].getBoundingClientRect().width,
      standWidth = stand.getBoundingClientRect().width,
      snowmanArm = document.querySelector("#snowmanarm"),
      snowmanLeftEye = document.querySelector("#lefteye"),
      snowmanRightEye = document.querySelector("#righteye"),
      star = document.querySelector("#star"),
      star2 = document.querySelector("#star-2"),
      buying = document.querySelector("#buying"),
      noBuying = document.querySelector("#buying-no"),
      intFrameWidth = window.innerWidth;
      //buyer = [boy, girl];


  const startBtn = document.querySelector('.js-start-btn'),
        sceneAction = document.querySelector ('.scene-action'),
        walkingDist = (intFrameWidth - standWidth)  / 2 + buyerWidth ;


// Main TL ///////////
mainTl = new TimelineMax();

tempUp.addEventListener('click', function() {
  state.setTemperature(state.temperature + 1);
});

tempDown.addEventListener('click', function() {
  state.setTemperature(state.temperature - 1);
});

buyerPlus.addEventListener("click", function(){
  state.addBuyer();
});

buyerMinus.addEventListener("click", function(){
  state.removeBuyer();
});

//add buyer inline btn
addBuyerLink.addEventListener('click', function(){
  state.addBuyer();
});

//GSAP animations timelines

function getPageIntro() {

  let tlSunEntrance = new TimelineMax()

  tlSunEntrance
    .fromTo(sun, 1.5, {opacity:0, rotation:0, Y: -200 , scale:0},
           {opacity:1, y:0, rotation:720,  scale:1, ease: Back.easeInOut})
           .add("sunLoaded")
    .staggerFrom(".clouds", 1.5,
    {cycle:{
      scale:[0, 1]
    }, autoAlpha:0,  ease:  Power1.easeOut }, "sunLoaded-=1.5");

    return tlSunEntrance;
  }


function getIntroText(){
  let introTextTl = new TimelineMax();

    introTextTl
    .from(lemonHeading, .5, {autoAlpha: 0, ease: Power4.easeIn})
    .from(lemonPara, .5, {autoAlpha: 0, ease: Power4.easeIn}, '-=.25')
    .fromTo(startBtn, .5, {autoAlpha: 0, scale:0, yPercent: '-100'},{autoAlpha:1, scale:1, yPercent:'0', ease: Back.easeIn});

    return introTextTl
}

function nextBuyer() {
  if (state.buyers.length) {
    animateBuyer(state.buyers[0]);
  } else {
    setTimeout(nextBuyer, 1000);
    buying.classList.remove("buying-active");//remove checkmark when no more buyers in queue
  }
}

function completeBuyer() {
  state.removeBuyer();
  nextBuyer();
}

function animateBuyer(buyer) {
  let tlBuyers = new TimelineMax({
    onComplete: function() {
      completeBuyer();
    },
    onReverseComplete: function () {
      completeBuyer();
    }
  });



function purchase(){
  if (state.didPurchase == true){
    buying.classList.add("buying-active");
    tlBuyers.resume();
  } else {
    noBuying.classList.add("no-buying-active");
    tlBuyers.reverse();
  }
}

  let buyerEl = document.querySelector('.' + buyer.gender);
  tlBuyers
  .set(buying, {className:"-=buying-active"})
  .set(noBuying, {className:"-=no-buying-active"})
  .set(chocoCup, {className:"-=choco-cup-bought"})
  .set(chocoCup, {className:"+=choco-cup-noshow"})
  .set(buyerEl, {x: -`${walkingDist}` * 4, force3D:true, y:24, scale:1.20})
  .set(stand, {y: 65})
  .set(snowMid, { x: 200})
  .set(chocoSteam, {autoAlpha:0.5, y: -2})
  .set(snow, {y: 42})
  .set(lActionArm, {rotation:0})
  .to(chocoSteam, 1, {y:-10, autoAlpha:0.65, repeat:3, delay: 0.25})
  .to(buyerEl, 2.5, {scale:1, x: `${walkingDist}`, delay:3, ease:Power1.easeInOut, onComplete: function() {buyer.evaluate()}}, "-=2.5")
  .add("ThinkingAboutIt")
   tlBuyers
   .addPause("ThinkingAboutIt+=4", purchase)//pass the purchase function here
   .set(buying, {className:"-=buying"})
   .set(noBuying, {className:"-=buying-no"})
  .fromTo(chocoCupTable, 2.25, {x:160, autoAlpha:0.9}, {x:0, autoAlpha:1, ease: Back.easeInOut}, "-=0.75")
  .add("chocoServed")
  .to(chocoSteam, 1, {y:-14, autoAlpha:0.8})
  .to(lActionArm , 0.8, {  rotation:-90, transformOrigin:"top top", ease: Power4.easeIn, onComplete: function addCup(){
    chocoCup.classList.toggle("choco-cup-noshow");
    chocoCup.classList.toggle("choco-cup-bought");
  }})
  .to(snowmanArm, 0.25, {rotation:2, y: '+=1px', x: "+=1px", transformOrigin: "top leftt", repeat: 3, yoyo: true}, "chocoServed+=.5")
  .fromTo(star, 0.2, {fill:'#E1D9CE'}, {fill: '#A36B92', repeat: 4, yoyo: true}, "-=.4")
  .fromTo(star2, 0.2, {fill:'#A36B92'}, {fill: '#E1D9CE', repeat: 4, yoyo: true}, "-=.4")
  .to(chocoCupTable,0.5, {autoAlpha:0})
  .to(buyerEl, 4, { scale: .95,  x: `${walkingDist}` * 4, ease:Power4.easeIn});
}

function getStartSceneTl(){

let startScene = new TimelineMax();
  //start and load animation loop
  TweenMax.set(settings, {autoAlpha:0, scale:0, height: 0})

  startBtn.addEventListener('click' , function() {
    TweenMax.to(lemonsplanation, 3, {scale: 0, opacity:0, x:-100, ease: Power4.easeInOut})


      $.post('/data/seller', function(data) {
        for (var i = 0; i < 10; i++) {
          state.addBuyer();
        }
        state.setTemperature(50);

      });
      TweenMax.set(sceneAction, { autoAlpha:0})
      TweenMax.to(".lemonsplanation", 3, {scale: 0, opacity:0, ease: Power4.easeInOut})
      TweenMax.to(window, 1, {scrollTo:{y:"#funtimes", offsetY:-260, ease:Back.easeInOut}, onComplete:function(){
      jsNotActive.classList.remove('js-not-active');
      sceneAction.classList.add('js-active');
      TweenMax.to(sceneAction, 1.75, {autoAlpha:1, ease:Power2.easeInOut})
      TweenMax.to(settings, .75, {autoAlpha:1, scale:1, height: "100%"})

      nextBuyer();
      }
    });
  });
  return startScene;
}

  function init(){
  //add timelines to the mainTl timeline
    mainTl
    .add(getPageIntro())
    .add(getIntroText())
    .add(getStartSceneTl())
  }
  init();
})();
