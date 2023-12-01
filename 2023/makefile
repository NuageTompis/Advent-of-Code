# If the first argument is "run"...
ifeq (run,$(firstword $(MAKECMDGOALS)))
    # use the rest as arguments for "run"
    ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
    # ...and turn them into do-nothing targets
    $(eval $(ARGS):;@:)
endif

filename=$(word 1,$(ARGS))

.PHONY:
run: filename
	@rustc $(word 1, $(ARGS)).rs -o a.exe
	@./a.exe

filename:

.PHONY:
clear:
	@rm a*