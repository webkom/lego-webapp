
#
# Executables and paths
#

STYLUS     = node_modules/.bin/stylus
UGLIFY     = node_modules/.bin/uglifyjs
BROWSERIFY = node_modules/.bin/browserify
WATCHIFY   = node_modules/.bin/watchify
JEST       = node_modules/.bin/jest
LINT       = node_modules/.bin/jsxhint
NIB        = node_modules/nib/lib

#
# The main CSS and JS files
#

CSS_MAIN   = assets/stylesheets/style.styl
JS_MAIN    = src/index.js

#
# All CSS and JS files (used for file watching)
#

CSS        = $(shell find assets/stylesheets -name "*.styl")
JS         = $(shell find src -name "*.js")

#
# Compiled CSS and JS Files
#

BUILD_CSS  = public/app.css
BUILD_JS   = public/app.js

#
# Browserify Transforms
# See https://github.com/substack/node-browserify/wiki/list-of-transforms
#

TRANSFORMS = -t [ reactify --harmony ]

#
# Default task
#

all: $(BUILD_CSS) $(BUILD_JS)

#
# Run tests
#

test:
	$(JEST) src/

#
# Build CSS files
#

$(BUILD_CSS): $(CSS)
ifneq ($(NODE_ENV), development)
	$(STYLUS) --include $(NIB) --include assets/stylesheets --include-css --compress < $(CSS_MAIN) > $(BUILD_CSS)
else
	$(STYLUS) --include $(NIB) --include assets/stylesheets --include-css < $(CSS_MAIN) > $(BUILD_CSS)
endif

#
# Build JavaScript files
#

$(BUILD_JS): $(JS)
ifneq ($(NODE_ENV), development)
	$(BROWSERIFY) $(TRANSFORMS) $(JS_MAIN) | $(UGLIFY) > $(BUILD_JS)
else
	$(BROWSERIFY) $(TRANSFORMS) $(JS_MAIN) > $(BUILD_JS)
endif

#
# Watchify is extremely fast compared to running browserify on file changes.
#

watch-js:
	$(WATCHIFY) $(TRANSFORMS) $(JS_MAIN) -v -o $(BUILD_JS)

#
# A avoid to avoid «Nothing to be done for all messages»
#

watch-css: $(BUILD_CSS)
	@true

#
# Live Reloading <3
#

LIVERELOAD_SRC = $(BUILD_CSS) $(BUILD_JS)

tiny-lr.pid: $(LIVERELOAD_SRC)
	@touch $@
	@curl --ipv4 --silent http://localhost:35729/changed?files=$(shell node -pe '"$?".split(" ").join(",")')

reload: tiny-lr.pid
	@true

#
#
#

lint:
	$(LINT) src/* --verbose

#
#
#

watch:
	@foreman start

#
#
#

server:
	@nodemon server.js

#
# Remove build files
#

clean:
	rm -f $(BUILD_CSS) $(BUILD_JS)

#
# Non-files are PHONY targets
#

.PHONY: clean server install test lint watch reload-all watch-css watch-js
