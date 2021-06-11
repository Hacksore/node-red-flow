build:
	docker build -t hacksore/node-red-flow:local .
test:
	docker run hacksore/node-red-flow:local node-red-contrib-bluelinky