#!/bin/bash
#
git pull origin main

cp -r static/* ../dev-env/app/static/
cp -r templates/* ../dev-env/app/templates/
