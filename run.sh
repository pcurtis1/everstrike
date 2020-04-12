#!/bin/bash

# change to workspace
mkdir -p ws && cd ws

# install linuxgsm
if [ ! -f linuxgsm.sh ]; then
    wget -O linuxgsm.sh https://linuxgsm.sh && chmod +x linuxgsm.sh 
fi

# install cssserver
if [ ! -f cssserver ]; then
    bash linuxgsm.sh cssserver
fi


# install counterstrike server
./cssserver details | grep 'Config file.*FILE MISSING'
if [ "$?" -ne "0" ]; then
    # auto-install
    ./cssserver auto-install
fi

./cssserver update

# start the server
./cssserver start

# start the console
tmux attach-session -t cssserver