#!/bin/bash
# USAGE: bash install.sh

# Installs the required python modules by creating a virtualenv in /home/python
WORKING_DIR="/home/python"

# If virtualenv fails, install it with apt get and try again
# --system-site-packages lets us inherit numpy and such from the system python
# install
virtualenv --system-site-packages -p python2 $WORKING_DIR || {
  apt-get -y update;
  apt-get -y install python-virtualenv;
  virtualenv --system-site-packages -p python2 $WORKING_DIR;
}

source $WORKING_DIR/bin/activate

# if the initial install fails we attempt to use a relative path. this ensures
# it installs correctly on the production server.
pip2 install --ignore-installed -r /vagrant/script/python/requirements.txt ||
  pip2 install --ignore-installed -r ./script/python/requirements.txt
python2 -m spacy.en.download

deactivate  # this is added to the path when activate is sourced

chown -R vagrant:vagrant $WORKING_DIR
