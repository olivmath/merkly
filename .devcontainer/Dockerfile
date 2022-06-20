FROM python
ENV PYTHONPATH=.

# install deps
RUN apt update -y && apt install curl zsh git -y
# poetry, ohMyZsh
RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"