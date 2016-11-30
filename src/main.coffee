# main.coffee
# Copyright 2016 9165584 Canada Corporation <legal@fuzzy.ai>

LemonadeStand = require './lemonade-stand'

server = new LemonadeStand process.env

server.start (err) ->
  if err
    console.error(err)
  else
    console.log("Server listening on #{server.config.port}")
