set -e

rm -rf static/_examples
mkdir -p static/_examples

rm -rf static/_tech-demos
mkdir -p static/_tech-demos

# Tic-tac-toe
cp -r ../examples/tic-tac-toe ./static/_examples/tic-tac-toe

# Sudoku
cd ../examples/sudoku
yarn
../../scripts/copy-assets.sh sudoku && yarn build
cp -r build/. ../../docs/static/_examples/sudoku

# Outmatched
cd ../outmatched
yarn
../../scripts/copy-assets.sh outmatched && yarn build
cp -r dist/. ../../docs/static/_examples/outmatched
perl -pe 's/multiplayer\.js/multiplayer-dev\.js/' dist/index.html > ../../docs/static/_examples/outmatched/index.html

# Pinpoint
cd ../pinpoint
yarn
../../scripts/copy-assets.sh pinpoint && yarn build
cp -r build/. ../../docs/static/_examples/pinpoint

# OinkOink
cd ../oink-oink
yarn
../../scripts/copy-assets.sh oink-oink && yarn build
cp -r build/. ../../docs/static/_examples/oink-oink

# Paddle
cd ../paddle
yarn
../../scripts/copy-assets.sh paddle && yarn build
cp -r dist/. ../../docs/static/_examples/paddle
perl -pe 's/multiplayer\.js/multiplayer-dev\.js/' dist/index.html > ../../docs/static/_examples/paddle/index.html

# Cube Rush
cd ../cube-rush
yarn
yarn build
cp -r dist/. ../../docs/static/_examples/cube-rush
perl -pe 's/multiplayer\.js/multiplayer-dev\.js/' dist/index.html > ../../docs/static/_examples/cube-rush/index.html

# Neon Snake
cd ../neon-snake
yarn
../../scripts/copy-assets.sh neon-snake && yarn build
cp -r dist/. ../../docs/static/_examples/neon-snake
perl -pe 's/multiplayer\.js/multiplayer-dev\.js/' dist/index.html > ../../docs/static/_examples/neon-snake/index.html


### Tech Demos

cd ../../tech-demos

# Top Down Synchronization
cd top-down-synchronization
yarn 
yarn build
cp -r dist/. ../../docs/static/_tech-demos/top-down-synchronization
perl -pe 's/multiplayer\.js/multiplayer-dev\.js/' dist/index.html > ../../docs/static/_tech-demos/top-down-synchronization/index.html
cd ..

# Platformer
cd platformer
yarn 
yarn build
cp -r dist/. ../../docs/static/_tech-demos/platformer
perl -pe 's/multiplayer\.js/multiplayer-dev\.js/' dist/index.html > ../../docs/static/_tech-demos/platformer/index.html
cd ..

# Phaser
cd phaser
yarn 
yarn build
cp -r dist/. ../../docs/static/_tech-demos/phaser
perl -pe 's/multiplayer\.js/multiplayer-dev\.js/' dist/index.html > ../../docs/static/_tech-demos/phaser/index.html
cd ..

# World time
cd world-time
yarn
yarn build
cp -r dist/. ../../docs/static/_tech-demos/world-time
perl -pe 's/multiplayer\.js/multiplayer-dev\.js/' dist/index.html > ../../docs/static/_tech-demos/world-time/index.html
cd ..