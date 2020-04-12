FROM ubuntu:16.04


ENV DEBIAN_FRONTEND noninteractive
ENV TERM linux
RUN dpkg --add-architecture i386; apt-get update; apt-get -y install mailutils postfix curl wget file tar bzip2 gzip unzip bsdmainutils python util-linux ca-certificates binutils bc jq tmux lib32gcc1 libstdc++6 lib32stdc++6 libtinfo5:i386 netcat

# do a trick to make everyone believe they are noot root
COPY whoami.sh /usr/bin/whoami
RUN chmod a+x /usr/bin/whoami

# install steamcmd
RUN echo steam steam/question select "I AGREE" | debconf-set-selections && echo steam steam/license note '' | debconf-set-selections
RUN apt-get install -y steamcmd

# install node 10.16.3 symlink at /node
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash && export NVM_DIR="$HOME/.nvm"  && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm install 10.16.3 && ln -s $(which node) /node

# install socat
RUN apt-get install -y socat

# place in our own scripts
RUN mv /usr/bin/tmux /usr/bin/tmux.orig
COPY run.sh /run.sh
COPY tmuxintercept.js /usr/bin/tmux
COPY chatbotproxy.js /chatbotproxy.js
RUN chmod a+x /chatbotproxy.js /usr/bin/tmux /run.sh

ENTRYPOINT [ "/run.sh" ]

# config help:
# - https://docs.linuxgsm.com/configuration/linuxgsm-config
# - https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Dedicated_Servers

# recommended to store installation locally by mounting a volume at /ws/
# set server password with ENV:PASSWORD