#
#
# Makefile of Node Pong game
#
# Author: Gustavo Pantuza
# Since: 29.03.2013
#



# Source code directory
SRC := src

# The node_modules directory created by the npm installer
PKGS := node_modules



#
# TARGET RULES
#


help:
	@echo "Node Pong"
	@echo "Target rules:"
	@echo "    install - install all project dependencies using npm"
	@echo "    clean   - Remove node_modules"
	@echo "    run     - Runs a local server to play the game"
	
# Install all the game dependencies
install:
	@npm install

# Remove local installed files
clean:
	@rm -rvf $(PKGS)


# Run the game server
run: $(SRC)/server.js
	@node $^
