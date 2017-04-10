#!/usr/bin/env python3
# -*- coding:utf-8 -*-

import hashlib
import json
import requests
import time
import yaml


with open('config.yml', 'r') as stream:
    try:
        param = yaml.load(stream)
    except yaml.YAMLError as e:
        print(e)


# Hash
# -------------------------
def gethash(word):
    hashword = hashlib.sha256(word.encode('utf-8')).hexdigest()
    return hashword


# Config
# -------------------------
def getconfig():

    config = {'contract': param['contract']['address'],
              'name': param['user']['name'],
              'coinbase': param['user']['coinbase'],
              'typ': param['user']['typ']}

    return config


# Data
# -------------------------
def get_sensor_data(url, data, headers, sensorId, kwh, t0, t1):
    try:
        result=requests.post(
            url + '/api/' + str(sensorId) + '/get/' + kwh + '/by_time/' + str(t0) + '/' + str(t1),
            headers=headers,
            data=data)
    except json.JSONDecodeError as e:
        print("get_sensor_data() - ERROR : requests.post \n-> %s" % e)
    else:
        parsed_json=json.loads(result.text)
        print("parsed_json = " + str(parsed_json))
        try:
            energyData = {'value': parsed_json['data'][0]['value'], 'timestamp': parsed_json['data'][0]['timestamp']}
        except Exception as e:
            energyData = {}
            print("get_sensor_data() - ERROR : json.loads(result.text) \n-> %s" % e)
    print("getsensordata() : " + str(energyData))
    return energyData


def get_energy_data():
    # this function collects data from all sensors (connected to each piece of work (=item))

    # definition of the time interval, in order to collect data
    time0 = time.time()
    delay = 8 # time in sec
    time.sleep(delay)
    time1 = time.time()

    # getting energy produced or consumed for each item
    headers = {'Content-Type': 'application/json', }

    itemUrl = param['user']['url']
    itemSensorId = param['user']['sensorId']
    itemLogin = param['user']['sensorLogin']
    itemPswd = param['user']['sensorPassword']
    itemSource = param['user']['sensorSource']

    try:
        if itemSource == 'CW':
            data = 'login=' + itemLogin + '&password=' + itemPswd
            value = get_sensor_data(itemUrl, data, headers, itemSensorId, 'watts', time0, time1)
        else:
            value = {}
            print('get_energy_data() - ERROR : OEM connexion - not available')
    except Exception as e:
        value = {}
        print("get_energy_data() - ERROR : api call (%s) \n-> %s" % (itemSource, e))

    print('get_energy_data(): time : ' + time.strftime("%D %H:%M:%S", time.localtime(int(time1))) + ', allData = '
          + str(value))
    return value
