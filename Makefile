
#
# Executables and paths
#

STYLUS     = node_modules/.bin/stylus
UGLIFY     = node_modules/.bin/uglifyjs
BROWSERIFY = node_modules/.bin/browserify
WATCHIFY   = node_modules/.bin/watchify
JEST       = node_modules/.bin/jest
LINT       = node_modules/.bin/jsxhint
JSXCS      = node_modules/.bin/jsxcs
FOREMAN    = node_modules/.bin/nf
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

TRANSFORMS = -t [ 6to5ify --modules common ]

#
# Default task
#

all: $(BUILD_CSS) $(BUILD_JS)

#
# Run tests
#

test: lint jest

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
# A hack to avoid «Nothing to be done for all messages»
#

watch-css: $(BUILD_CSS)
	@true

lint:
	$(LINT) src/* --verbose
	$(JSXCS) src --esnext

jest:
	$(JEST) src/

watch:
	@$(FOREMAN) start

clean:
	rm -f $(BUILD_CSS) $(BUILD_JS)

.PHONY: clean server install test lint watch-css watch-js
