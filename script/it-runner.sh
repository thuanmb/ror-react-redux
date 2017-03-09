#!/bin/bash

readonly IT_RELEASE="\[it release\]"
readonly IT_SMOKE="\[it smoke\]"
readonly IT_SKIP="\[it skip\]"
readonly COMMIT=$(git log --format=oneline -n 1 ${CIRCLE_SHA1})
readonly REPORT="${CIRCLE_TEST_REPORTS}/cucumber/tests.cucumber"
readonly LOG_TO_CONSOLE="error"

## Id want to use circle-ci files split, just do features=$@ (the file list is passed as argument to the script)
#features=$@
features=$(find ./features -name '*.feature' | sort | awk "NR % ${CIRCLE_NODE_TOTAL} == ${CIRCLE_NODE_INDEX}")

cucumber() {
  echo "-- Running integration $1 on --"
  echo $features
  echo "-------------------------------"
  export LOG_TO_CONSOLE
  bundle exec cucumber --format pretty --format json --out $REPORT --profile $1 $features
}

# -------
# Actions
# -------

skip_it () {
  exit 0
}

all_it () {
  mkdir -p "${CIRCLE_TEST_REPORTS}/cucumber"
  cucumber 'release' && cucumber 'engage_flaky' && cucumber 'perform_flaky'
}

smoke_it() {
  mkdir -p "${CIRCLE_TEST_REPORTS}/cucumber"
  cucumber 'smoke' && cucumber 'perform_flaky'
}

# ------
# States
# ------

pr? () {
  [[ -n $CI_PULL_REQUEST ]]
}

feat? () {
  [[ $CIRCLE_BRANCH =~ ^feature ]]
}

hotfix? () {
  [[ $CIRCLE_BRANCH =~ ^hotfix ]]
}

master? () {
 [ $CIRCLE_BRANCH == 'master' ] || [ $CIRCLE_BRANCH == '69-watch' ]
}

production? () {
 [ $CIRCLE_BRANCH == 'production' ]
}

skip? () {
  [[ $COMMIT =~ $IT_SKIP ]]
}

smoke? () {
  [[ $COMMIT =~ $IT_SMOKE ]]
}

all? () {
  [[ $COMMIT =~ $IT_RELEASE ]]
}

# -------
# The flow.
#

if skip?;           then skip_it
elif smoke?;        then smoke_it
elif all?;          then all_it
elif master?;       then all_it    # on master ( for exemple, if we pr master to prod, all test run )
elif production?;   then smoke_it  # on prod, we run all on master, and when pr from master
elif pr?;           then smoke_it  # on pr, that is not from master or feature
fi
