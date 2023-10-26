build:
	@rm -rf build
	@mkdir build
	zip -Z store build/yt-ad-autoskipper.xpi *.js *.md *.png *.json

version:
	@cat manifest.json | jq '.version'
