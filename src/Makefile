# Makefile to install project dependencies
#
# Author: Gustavo Pantuza
# Since: 29.03.2013
#

SRC := src
BUILD := build

NODE_URL := "http://nodejs.org/dist/v0.10.2/node-v0.10.2.tar.gz"

.PHONY := install

install: nodejs socketio clean | build
	@echo -e "\n--\nTry: make run"
	@echo -e "open your browser on file://$(shell pwd)/index.html"
build:	
	mkdir -pv build

clean:	
	sudo rm ${BUILD} -rf

nodejs:	build
	@echo -e "INSTALLING NODE JS...\n"
	wget -O ${BUILD}/nodejs.tgz ${NODE_URL}
	tar -xzvf ${BUILD}/nodejs.tgz -C ${BUILD}
	rm -fv ${BUILD}/nodejs.tgz
	$(eval nodesrc := $(shell ls ${BUILD}))
	./${BUILD}/${nodesrc}/configure
	sudo make -C ${BUILD}/${nodesrc}
	sudo make install -C ${BUILD}/${nodesrc}

socketio: 
	@echo -e "INSTALLING SOCKET IO...\n"
	$(eval installed := $(shell which npm 2> /dev/null))
ifeq (${installed},"")
	@echo "npm not installed. Try make nodejs to install npm"
else 
	npm install socket.io
endif

run: server.js
	node server.js

