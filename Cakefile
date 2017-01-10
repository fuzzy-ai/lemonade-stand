fs = require "fs"

{spawn} = require "child_process"

glob = require "glob"
_ = require 'lodash'

DOCKER = "fuzzyio/lemonade-stand"

cmd = (str, env, callback) ->
  process.stdout.write str + "\n"
  if _.isFunction(env)
    callback = env
    env = null
  env = _.defaults(env, process.env)
  parts = str.split(" ")
  main = parts[0]
  rest = parts.slice(1)
  proc = spawn main, rest, {env: env}
  proc.stderr.on "data", (data) ->
    process.stderr.write data.toString()
  proc.stdout.on "data", (data) ->
    process.stdout.write data.toString()
  proc.on "exit", (code) ->
    if code is 0
      callback?()
    else
      process.exit(code)

build = (callback) ->
  env =
    NODE_ENV: 'production'
  cmd './node_modules/.bin/coffee -c -o lib src', ->
    cmd './node_modules/.bin/webpack -p --bail', env, callback

buildDocker = (callback) ->
  cmd "docker build -t #{DOCKER} .", callback

buildTest = (callback) ->
  cmd "coffee -c test", callback

task "build", "Build lib/ from src/", ->
  build()

task "build-test", "Build for testing", ->
  invoke "clean"
  invoke "build"
  buildTest()

task "watch", "Watch src/ for changes", ->
  coffee = spawn "coffee", ["-w", "-c", "-o", "lib", "src"]
  coffee.stderr.on "data", (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on "data", (data) ->
    process.stdout.write data.toString()

task "clean", "Clean up extra files", ->
  patterns = ["lib/*.js", "test/*.js", "*~", "lib/*~", "src/*~", "test/*~"]
  for pattern in patterns
    glob pattern, (err, files) ->
      for file in files
        fs.unlinkSync file

task "test", "Test the auth", ->
  invoke "clean"
  invoke "build"
  buildTest ->
    glob "test/*-test.js", (err, files) ->
      cmd "./node_modules/.bin/perjury #{files.join(' ')}"

task "docker", "Build docker image", ->
  invoke "clean"
  build ->
    buildDocker()

task "push", "Push docker image", ->
  cmd "sudo docker push #{DOCKER}"
