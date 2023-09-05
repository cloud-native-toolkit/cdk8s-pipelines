#!/bin/bash
set -e

if [ -f requirements.txt ];
then
  pip3 install --user \
  -r requirements.txt
fi

if [ -f  requirements.yml ];
then
  ansible-galaxy role install -vv \
    -r requirements.yml
  ansible-galaxy collection install -vv \
    -r requirements.yml
fi
