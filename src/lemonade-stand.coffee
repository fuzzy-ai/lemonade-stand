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
    # Develpment mode tweaks
    if process.env.NODE_ENV == 'development'
      webpack = require('webpack')
      webpackConfig = require '../webpack.config'
      webpackConfig.entry.unshift('webpack-hot-middleware/client?reload=true')
      webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
      compiler = webpack(webpackConfig)

      exp.use require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
      })
      exp.use(require('webpack-hot-middleware')(compiler))

    exp.use express.static path.join(__dirname, '..', 'public')

  startDatabase: (callback) ->
    callback null

  stopDatabase: (callback) ->
    callback null
module.exports = LemonadeStand
