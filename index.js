const assert = require('assert');
const path = require('path');
const fs = require('fs');

function assertBundleTree(bundle, tree) {
  if (tree.name) {
    assert.equal(
      path.basename(bundle.name),
      tree.name,
      'bundle names mismatched'
    );
  }

  if (tree.type) {
    assert.equal(
      bundle.type.toLowerCase(),
      tree.type.toLowerCase(),
      'bundle types mismatched'
    );
  }

  if (tree.assets) {
    assert.deepEqual(
      Array.from(bundle.assets)
        .map(a => a.basename)
        .sort(),
      tree.assets.sort()
    );
  }

  let childBundles = Array.isArray(tree) ? tree : tree.childBundles;
  if (childBundles) {
    let children = Array.from(bundle.childBundles).sort(
      (a, b) =>
        Array.from(a.assets).sort()[0].basename <
        Array.from(b.assets).sort()[0].basename
          ? -1
          : 1
    );
    assert.equal(
      bundle.childBundles.size,
      childBundles.length,
      'expected number of child bundles mismatched'
    );
    childBundles.forEach((b, i) => assertBundleTree(children[i], b));
  }

  if (/js|css/.test(bundle.type)) {
    assert(fs.existsSync(bundle.name), 'expected file does not exist');
  }
}

module.exports = assertBundleTree;