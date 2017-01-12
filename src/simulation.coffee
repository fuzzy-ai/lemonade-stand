# simulation.coffee
# Copyright 2016 9165584 Canada Corporation <legal@fuzzy.ai>

path = require 'path'
async = require 'async'
_ = require 'lodash'
APIClient = require 'fuzzy.ai'
debug = require('debug')('simulation')

argv = require('yargs')
  .demand('k')
  .alias('k', 'key')
  .describe('k', 'API key')
  .default('b', 100)
  .alias('b', 'buyers')
  .describe('b', 'number of buyers')
  .default('t', 0.5)
  .alias('t', 'threshold')
  .describe('t', 'buy threshold')
  .default('c', 0.50)
  .alias('c', 'cost')
  .describe('c', 'Total unit cost')
  .env('HOT_CHOCOLATE')
  .config()
  .default('config', path.join(process.env['HOME'], '.hotchocolate.json'))
  .argv

{ seller, buyer } = require './agents'

main = (argv) ->

  # Explode these so we aren't depending on argv everywhere

  debug(argv)

  {key, buyers, threshold, cost} = argv
  cost = 0.50

  client = new APIClient {key: key}
  buyerID = null
  sellerID = null

  attemptSale = (i, callback) ->
    debug "Attempting sale #{i}"
    id = null
    price = null
    status =
      numBuyers: 5
      temperature: 50
      sunny: 0
    async.waterfall [
      (callback) ->
        inputs = _.clone(status)
        debug "Calling seller for attempt #{i}"
        client.evaluate sellerID, inputs, true, callback
      (results, callback) ->
        debug "Results for seller for attempt #{i}"
        debug results
        id = results.meta.reqID
        price = results.price
        inputs = _.extend({price: price}, status)
        debug "Calling buyer for attempt #{i}"
        client.evaluate buyerID, inputs, callback
      (results, callback) ->
        debug "Results for buyer for attempt #{i}"
        debug results
        if results.willBuy > threshold
          profit = price - cost
        else
          profit = 0
        debug "profit for attempt #{i} = #{profit}"
        client.feedback id, {profit: profit}, (err, fb) ->
          if err
            callback err
          else
            callback null, profit
    ], callback

  profits = null

  async.waterfall [
    (callback) ->
      debug "Creating new buyer agent"
      client.newAgent buyer, callback
    (saved, callback) ->
      buyerID = saved.id
      debug saved
      debug "Buyer ID = #{buyerID}"
      debug "Creating new seller agent"
      client.newAgent seller, callback
    (saved, callback) ->
      sellerID = saved.id
      debug saved
      debug "Seller ID = #{sellerID}"
      async.timesLimit 8, buyers, attemptSale, callback
    (results, callback) ->
      profits = results
      debug "Deleting buyer agent #{buyerID}"
      client.deleteAgent buyerID, callback
    (callback) ->
      debug "Deleting seller agent #{sellerID}"
      client.deleteAgent sellerID, callback
  ], (err) ->
    if err
      console.error err
    else
      console.dir profits
  false

main argv
