#!/usr/bin/env python3
# -*- coding:utf-8 -*-

from flask import Flask, render_template, request, Response, jsonify
from functools import wraps
import fct
import yaml

import logging


app = Flask(__name__)
app.debug = True


with open('config.yml', 'r') as stream:
    try:
        param = yaml.load(stream)
    except yaml.YAMLError as e:
        print(e)


def check_auth(username, password):
    password = fct.gethash(password)
    return username == param['user']['login'] and password == param['user']['pwd']


def authenticate():
    return Response(
    'Could not verify your access level for that URL.\n'
    'You have to login with proper credentials', 401,
    {'WWW-Authenticate': 'Basic realm="Login Required"'})


def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        else:
            pass # maybe log something ?
        return f(*args, **kwargs)
    return decorated


@app.route("/")
@requires_auth
def init():
    return render_template('index.html')


@app.route("/getconfig/")
@requires_auth
def getconfig():
    data = fct.getconfig()
    return jsonify(result=data)


@app.route('/get_data/')
@requires_auth
def get_data():
    allData = fct.get_energy_data()
    print(allData)
    return jsonify(result=allData)


@app.route('/hash/<word>')
def hashword(word):
    hashword = fct.gethash(word)
    return hashword

if __name__ == "__main__":
    

    logging.basicConfig(level=logging.DEBUG)


    logging.debug("entering main")
    app.run()
