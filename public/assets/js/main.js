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
      console.log("current price is: $" + num.toFixed(2));
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
            console.log("BUY!", data.evaluation.willBuy);
          } else {
            console.log("Don't buy :-(", data.evaluation.willBuy);
            state.didPurchase = false;
          }
          // Send feedback to the seller
          $.ajax({
            method: "POST",
            url: "/data/seller/feedback",
            data: JSON.stringify({willBuy: data.evaluation.willBuy}),
            contentType: 'application/json',
            success: function(data) {
              console.log(data);
            }
          });

        }
      });
    }
  }
};

(function(){
  console.log(state);
  let cloudyIcon = document.querySelector('.cloudy-icon-btn'),
      addBuyerLink = document.querySelector("#add-buyer-link"),
      stand = document.querySelector('#stand'),
      snowMount = document.querySelector('#snow'),
      snowMid = document.querySelector("#snow-backer"),
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
      buyers = document.querySelectorAll('.buyer'),
      buyerPlus = document.querySelector("#buyer-plus"),
      buyerMinus = document.querySelector("#buyer-minus"),
      tempUp = document.querySelector('.temperature-up-icon'),
      tempDown = document.querySelector('.temperature-down-icon'),
      lTopArm = document.querySelector("#left-toparm"),
      lActionArm = document.querySelector("#left-action-arm"),
      lArm = document.querySelector("#left-forarm"),
      chocoCupTable = document.querySelector("#choco-cup")
      chocoCup = document.querySelector('#choco-cup-in-hand'),
      chocoSteam = document.querySelector("#choco-steam"),
      forgroundTrees = document.querySelector("#forgroundTrees")
      bigtree = document.querySelector("#bigtree"),
      secondtree = document.querySelector("#secondtree"),
      smallertree = document.querySelector("#smallertree"),
      buyerWidth = buyers[0].getBoundingClientRect().width,
      standWidth = stand.getBoundingClientRect().width,
      snowmanArm = document.querySelector("#snowmanarm"),
      snowmanLeftEye = document.querySelector("#lefteye"),
      snowmanRightEye = document.querySelector("#righteye"),
      star = document.querySelector("#star"),
      star2 = document.querySelector("#star-2")
      intFrameWidth = window.innerWidth;
      //buyer = [boy, girl];


  const startBtn = document.querySelector('.js-start-btn'),
        sceneAction = document.querySelector ('.scene-action'),
        walkingDist = (intFrameWidth - standWidth)  / 2 + buyerWidth * 3;


  // Main TL ///////////
  mainTl = new TimelineMax();

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
    .fromTo(sun, 1.25, {opacity:0, rotation:0, Y: -200 , scale:0},
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
    .from(lemonPara, .25, {autoAlpha: 0, ease: Power4.easeIn})
    .fromTo(startBtn, .5, {autoAlpha: 0, scale:0, yPercent: '-100'},{autoAlpha:1, scale:1, yPercent:'0', ease: Back.easeIn}, '-=1');

    return introTextTl
}

function animateBuyer(buyer) {
  console.log("called animate", buyer);
  let tlBuyers = new TimelineMax(  {onComplete: function() {
      console.log("buyer finished.");
      state.removeBuyer();
      if (state.buyers.length) {
        animateBuyer(state.buyers[0]);
      }
    }
  });

function purchase(){
  if (state.didPurchase == true){
    console.log("buying");
    tlBuyers.resume();
  } else {
    console.log("im out of here")
    tlBuyers.reverse();
  }
}
  let buyerEl = document.querySelector('.' + buyer.gender);
  tlBuyers
  .set(buyerEl, {x: -`${walkingDist}` * 4, force3D:true, y:20, scale:1.15})
  .set(stand, {y: 70})
  .set(snowMid, { x: 200})
  .set(chocoSteam, {autoAlpha:0.5, y: -2})
  .set(snow, {y: 42})
  .to(chocoSteam, 1, {y:-10, autoAlpha:0.65, repeat:3, delay: 0.25})
  .to(buyerEl, 2.5, {scale:1, x: `${walkingDist}`, delay:4, ease:Power1.easeInOut, onComplete: function() { console.log('evaluate now'); buyer.evaluate()}}, "-=2.5")
  .add("ThinkingAboutIt")
   tlBuyers
   .addPause("ThinkingAboutIt+=4", purchase)

  .fromTo(chocoCupTable, 2.25, {x:160, autoAlpha:0.9}, {x:6, autoAlpha:1, ease: Back.easeInOut}, "-=0.75")
  .add("chocoServed")
  .to(chocoSteam, 1, {y:-14, autoAlpha:0.8})// <= evaluate here
  .to(lActionArm , 0.8, {  rotation:-90, transformOrigin:"top top", ease: Power4.easeIn, onComplete:   function addCup(){
    chocoCup.classList.remove("choco-cup-noshow");
    chocoCup.classList.add("choco-cup-bought");
  }})
  .to(snowmanArm, 0.25, {rotation:2, y: '+=1px', x: "+=1px", transformOrigin: "top leftt", repeat: 3, yoyo: true}, "chocoServed+=.5")
  .fromTo(star, 0.2, {fill:'#E1D9CE'}, {fill: '#A36B92', repeat: 4, yoyo: true}, "-=.4")
  .fromTo(star2, 0.2, {fill:'#A36B92'}, {fill: '#E1D9CE', repeat: 4, yoyo: true}, "-=.4")
  // .to(snowmanLeftEye, .75, { x: 4, scale: 1.1 })
  // .to(snowmanRightEye, .75, { x: 4, scale: .95 })
  .to(chocoCupTable,0.5, {autoAlpha:0})
  .to(buyerEl, 4, { scale: .95,  x: `${walkingDist}` * 4, ease:Power4.easeIn})
  .to(chocoCup, 0.05, {autoAlpha:0});
}
function getStartSceneTl(){

let startScene = new TimelineMax();
  //start and load animation loop
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
      TweenMax.to(window, 1, {scrollTo:{y:"#funtimes", offsetY:-300}, onComplete:function(){
      jsNotActive.classList.remove('js-not-active');
      sceneAction.classList.add('js-active');
      TweenMax.to(sceneAction, 1.75, {autoAlpha:1})

      animateBuyer(state.buyers[0]);
// var buyer = state.buyers[0]; buyer.evaluate();

      //buyer loop
      /*
      buyers.forEach(function(buyer){
        console.log("hrm", state);


      })*/
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
