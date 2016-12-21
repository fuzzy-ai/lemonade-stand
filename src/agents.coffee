# agents.coffee
# Copyright 2016 9165584 Canada Corporation <legal@fuzzy.ai>

module.exports.buyer =
  name: "Buyer"
  inputs:
    price:
      "very low": [0, 2.5]
      "low": [0, 2.5, 5]
      "medium": [2.5, 5, 7.5]
      "high": [5, 7.5, 10]
      "very high": [7.5, 10]
    numBuyers:
      "very low": [0, 5]
      "low": [0, 5, 10]
      "medium": [5, 10, 15]
      "high": [10, 15, 20]
      "very high": [15, 20]
    temperature:
      "very low": [0, 25]
      "low": [0, 25, 50]
      "medium": [25, 50, 75]
      "high": [50, 75, 100]
      "very high": [75, 100]
    sunny:
      false: [0, 0.5]
      true: [0.5, 1]
  outputs:
    willBuy:
      no: [0, 0.5]
      yes: [0.5, 1]
  rules: [
    '''price DECREASES willBuy WITH 1.0'''
    '''numBuyers DECREASES willBuy WITH 0.75'''
    '''temperature INCREASES willBuy WITH 0.75'''
    '''sunny INCREASES willBuy WITH 0.5'''
  ]

module.exports.seller =
  inputs:
    numBuyers:
      "very low": [0, 5]
      "low": [0, 5, 10]
      "medium": [5, 10, 15]
      "high": [10, 15, 20]
      "very high": [15, 20]
    temperature:
      "very low": [0, 25]
      "low": [0, 25, 50]
      "medium": [25, 50, 75]
      "high": [50, 75, 100]
      "very high": [75, 100]
    sunny:
      false: [0, 0.5]
      true: [0.5, 1]
  outputs:
    price:
      "very low": [0, 2.5]
      "low": [0, 2.5, 5]
      "medium": [2.5, 5, 7.5]
      "high": [5, 7.5, 10]
      "very high": [7.5, 10]
  rules: [
    '''numBuyers DECREASES price WITH 0.5'''
    '''temperature INCREASES price WITH 1.0'''
    '''IF sunny IS true THEN price IS high WITH 0.5'''
    '''IF sunny IS false THEN price IS low WITH 0.5'''
  ]
