FROM ubuntu


# Install Deps: Git, Curl, Zsh, OhMyZsh
RUN apt update -y && \
  apt install git curl zsh -y
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
