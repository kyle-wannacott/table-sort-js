cp src/table-sort.js public/table-sort.js
cp src/table-sort.js npm/table-sort.js
cp src/table-sort.js browser-extensions/firefox/table-sort.js
cp src/table-sort.js browser-extensions/chrome/table-sort.js
cp README.md npm/README.md
cp LICENSE npm/LICENSE
cp Contributors.md npm/Contributors.md

# Copy icons to browser extensions
rm -rf browser-extensions/chrome/icons
rm -rf browser-extensions/firefox/icons
cp -r icons browser-extensions/chrome/icons
cp -r icons browser-extensions/firefox/icons

# Copy icons to public/docs/assets
cp icons/table-sort-icon-48.png public/docs/assets/table-sort-icon-48.png

# browser extensions need to change manifest version manually:
rm -f browser-extensions/firefox/table-sort-js.zip
rm -f browser-extensions/chrome/table-sort-js.zip
cd browser-extensions
echo "zipping browser extensions..."
cd chrome
zip -r -FS ./table-sort-js.zip * --exclude '*.git*'
cd ..
cd firefox
zip -r -FS ./table-sort-js.zip * --exclude '*.git*'
cd ..
cd ..
# Back in table-sort directory
echo "running prettier..."
npx prettier --write .
echo "deploying..."
# Set OpenSSL legacy provider for Node.js 17+ compatibility with older webpack
export NODE_OPTIONS=--openssl-legacy-provider
npm run deploy
echo "running tests..."
npm run test
echo "Reminder: Update npm package to new version in npm/package.json and npm publish."
echo "Reminder: Update firefox browser extension manifest."
