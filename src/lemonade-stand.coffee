# lemonade-stand.coffee
# Copyright 2016 9165584 Canada Corporation <legal@fuzzy.ai>

express = require 'express'
path = require 'path'

Microservice = require 'fuzzy.ai-microservice'

class LemonadeStand extends Microservice

  getName: ->
    "lemonade-stand"

  environmentToConfig: (env) ->
    config = super env


    config

  setupMiddleware: (exp) ->
    exp.use express.static path.join(__dirname, '..', 'public')
    
  startDatabase: (callback) ->
    callback null

  stopDatabase: (callback) ->
    callback null
module.exports = LemonadeStand
