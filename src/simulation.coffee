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
  .default('r', 'https://api.fuzzy.ai')
  .alias('r', 'root')
  .describe('r', 'API root URL')
  .default('b', 100)
  .alias('b', 'buyers')
  .describe('b', 'number of buyers')
  .default('p', 8)
  .alias('p', 'parallel')
  .describe('p', 'number of buyers to run in parallel')
  .default('t', 0.5)
  .alias('t', 'threshold')
  .describe('t', 'buy threshold')
  .default('c', 0.50)
  .alias('c', 'cost')
  .describe('c', 'Total unit cost')
  .env('HOT_CHOCOLATE')
  .config()
  .default('config', path.join(process.env['HOME'], '.hotchocolate.json'))
  .alias('f', 'config')
  .help()
  .alias('h', 'help')
  .argv

{ seller, buyer } = require './agents'

main = (argv) ->

  # Explode these so we aren't depending on argv everywhere

  debug(argv)

  {key, root, buyers, threshold, cost, parallel} = argv
  cost = 0.50

  client = new APIClient {key: key, root: root}
  buyerID = null
  sellerID = null
  temperature = 32
  sunny = 0

  attemptSale = (i, callback) ->
    debug "Attempting sale #{i}"
    id = null
    price = null

    # randomly change up the environment
    if Math.round(Math.random())
      temperature = Math.round(Math.random() * 100)
      sunny = Math.round(Math.random())
      
    status =
      numBuyers: buyers - i
      temperature: temperature
      sunny: sunny
    debug status
    async.waterfall [
      (callback) ->
        inputs = _.clone(status)
        debug "Calling seller for attempt #{i}"
        client.evaluate sellerID, inputs, true, callback
      (results, callback) ->
        debug "Results for seller for attempt #{i}"
        debug results
        id = results.meta.reqID
        price = Math.round(results.price * 100) / 100
        inputs = _.extend({price: price}, status)
        debug "Calling buyer for attempt #{i}"
        client.evaluate buyerID, inputs, callback
      (results, callback) ->
        debug "Results for buyer for attempt #{i}"
        debug results
        if results.willBuy > threshold
          profit = Math.round((price - cost) * 100) / 100
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
      async.timesLimit buyers, parallel, attemptSale, callback
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
