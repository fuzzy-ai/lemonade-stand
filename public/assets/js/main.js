// Lemonade stand
import Chart from 'chart.js'

var FIXED_COST = 0.50;

var state = {
  buyers: [],
  temperature: 32,
  sunny: 1,
  price: 1.00,
  updatePending: false,
  didPurchase: false,

  addBuyer: function() {
    var genders = ['boy', 'girl'];
    //var genders = ['boy'];
    var newBuyer = new buyer();
    newBuyer.gender = genders[Math.floor(Math.random() * genders.length)];
    this.buyers.push(newBuyer);
    var numBuyers = state.buyers.length;
    $("#buyer-num").html(numBuyers);
    this.queueUpdate();
  },

  removeBuyer: function() {
    var oldBuyer = this.buyers.shift();
    var numBuyers = state.buyers.length;
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
      state.setPrice(num);
      if (num) {
        $("#current-price").html("$" + num.toFixed(2));
      }
    }
  });
}

var buyer = function () {
  return {
    // gender: ['girl','boy'],
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
          var profit;
          if (data.evaluation.willBuy > 0.5) {
            state.didPurchase = true;
            profit = state.price - FIXED_COST;
          } else {
            state.didPurchase = false;
            profit = 0;
          }
          // Send feedback to the seller
          $.ajax({
            method: "POST",
            url: "/data/seller/feedback",
            data: JSON.stringify({profit: profit}),
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
  },
  bindEvents: function(){
    this.sunnyIcon.addEventListener('click', this.setSunnyWeather.bind(this));
    this.cloudyIcon.addEventListener('click', this.setCloudyWeather.bind(this));
  },

  setCloudyWeather:  function () {
    state.setSunny(0);
    this.cloudyIcon.classList.add('active-icon');
    this.sunnyIcon.classList.remove('active-icon');
    this.sunnyOrCloudy.innerHTML = 'cloudy';
  },
  setSunnyWeather: function() {
    state.setSunny(1);
    this.sunnyOrCloudy.innerHTML = 'sunny';
    this.sunnyIcon.classList.add('active-icon');
    this.cloudyIcon.classList.remove('active-icon');
  }
};
uiInteraction.init();

(function(){
  let settings = document.querySelector(".settings"),
      addBuyerLink = document.querySelector("#add-buyer-link"),
      jsNotActive = document.querySelector('.js-not-active'),
      lemonsplanation = document.querySelector('.lemonsplanation'),
      lemonHeading = document.querySelector('.lemonsplanation__heading'),
      lemonPara = document.querySelector('.lemonsplanation__para'),
      buyers = document.querySelectorAll('.buyer'),
      buyerPlus = document.querySelector("#buyer-plus"),
      buyerMinus = document.querySelector("#buyer-minus"),
      tempUp = document.querySelector('.temperature-up-icon'),
      tempDown = document.querySelector('.temperature-down-icon'),
      buying = document.querySelector("#buying"),
      noBuying = document.querySelector("#buying-no"),
      intFrameWidth = window.innerWidth;


  const startBtn = document.querySelector('.js-start-btn'),
        sceneAction = document.querySelector ('.scene-action')


// Main TL ///////////
let mainTl = new TimelineMax();

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

let cupSold = document.querySelector('.total-sales b');


function purchase(){
  if (state.didPurchase == true){
    tlBuyers.resume();
  } else {
    tlBuyers.reverse();
  }
}



  let buyerEl = document.querySelector('.buyer');
    tlBuyers
    .to(buyerEl, 2.5, {delay:2, ease:Power1.easeInOut, onComplete: function() {buyer.evaluate()}}, "-=2.5")
    .add("ThinkingAboutIt")
   tlBuyers
   .addPause("ThinkingAboutIt+=1", purchase)//pass the purchase function here

}

function getStartSceneTl(){

let startScene = new TimelineMax();
  //start and load animation loop
  TweenMax.set(settings, {autoAlpha:0, scale:0, height: 0})

  startBtn.addEventListener('click' , function() {
    TweenMax.to(startBtn, 3, {scale: 0, opacity:0, x:-100, ease: Power4.easeInOut})


      $.post('/data/seller', function(data) {
        for (var i = 0; i < 10; i++) {
          state.addBuyer();
        }
        state.setTemperature(32);

      });
      TweenMax.set(sceneAction, { autoAlpha:0})
      // TweenMax.to(".lemonsplanation", 3, {scale: 0, opacity:0, ease: Power4.easeInOut})
      TweenMax.to(window, 1, {scrollTo:{y:"#funtimes", offsetY:-340, ease:Back.easeInOut}, onComplete:function(){
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

    .add(getIntroText())
    .add(getStartSceneTl())
  }
  init();
})();

//chart JS
var ctx = document.getElementById("chart");

var chart = new Chart(ctx, {
    type: 'bar',
    //animationSteps: 60,
    data: {
        labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        datasets: [{
          label: 'some label',
          data: [34, 35, 38, 30, 39, 35, 31, 31, 30, 37, 35, 35],
          backgroundColor: '#2c223d' ,
          borderColor: '#221A2F',
          borderWidth: 1,
          hoverBackgroundColor: '#221A2F',
          hoverBorderColor: '#332944'
        }]
    } ,

    options: {
      animationEasing: "easeOutQuart",
      responsiveAnimationDuration: 5000,
      barStrokeWidth : 1,
      responsive: true,
      maintainAspectRatio: true,
      barShowStroke: false,
      tooltips: {
        enabled: true,
        backgroundColor: "rgba(52, 40, 65, 0.9)",
        titleFontSize: 11,
        titleFontColor: "#FFFDF2",
        titleFontStyle: "bold",
        titleSpacing: 2,
        titleMarginBottom: 8,
        bodyFontColor: "#DCE0E4",
        bodyFontSize: 12,
        xPadding: 14,
        yPadding: 14
      },

      scales: {
        yAxes: [{
          stacked: true,
          display: true,
            gridLines: {
              offsetGridLines: true,
              color: "#2d233f"
            },
            ticks: {
              beginAtZero:true,
              suggestedMin: 0,
              suggestedMax: 2
            }
        }],
        xAxes: [{
          gridLines: {
            offsetGridLines: true,
            color: "#2d233f"
          }
        }]
      },
        legend: {
          display: false
        }
    }
});
document.getElementById('custom-legend').innerHTML = chart.generateLegend();
