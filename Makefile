build:
	@rm -rf build
	@mkdir build
	zip -Z store build/yt-ad-skipper.xpi *.js *.md *.png *.json

version:
	@cat manifest.json | jq '.version'
