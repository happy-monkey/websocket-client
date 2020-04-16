build:
	ng build web-socket-client

pack:
	cd dist/web-socket-client && npm pack

publish: pack
	cd dist/web-socket-client && npm publish --access=public
