# agents.coffee
# Copyright 2016 9165584 Canada Corporation <legal@fuzzy.ai>

module.exports.buyer =
  name: "Buyer"
  inputs:
    price:
      veryLow: [0, 1.25]
      low: [0, 1.25, 2.5]
      medium: [1.25, 2.5, 3.75]
      high: [2.5, 3.75, 5]
      veryHigh: [3.75, 5]
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
      hellNo: [0, 0.25]
      no: [0, 0.25, 0.5]
      maybe: [0.25, 0.5, 0.75]
      yes: [0.5, 0.75, 1]
      omgYes: [0.75, 1]
  rules: [
    '''price DECREASES willBuy WITH 1.0'''
    '''numBuyers DECREASES willBuy WITH 0.10'''
    '''temperature DECREASES willBuy WITH 0.75'''
    '''IF sunny IS true THEN willBuy IS no WITH 0.5'''
    '''IF sunny IS false THEN willBuy IS yes WITH 0.5'''
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
      "very low": [0, 1.25]
      "low": [0, 1.25, 2.5]
      "medium": [1.25, 2.5, 3.75]
      "high": [2.5, 3.75, 5]
      "very high": [3.75, 5]
  performance:
    profit: "maximize"
  rules: [
    '''numBuyers DECREASES price WITH 0.10'''
    '''temperature DECREASES price WITH 1.0'''
    '''IF sunny IS true THEN price IS low WITH 0.50'''
    '''IF sunny IS false THEN price IS high  WITH 0.50'''
  ]
