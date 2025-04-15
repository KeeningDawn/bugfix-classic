class bugfix {
  constructor(mod) {
    const fs = require('fs'),
      path = require('path'),
      submoduleRoot = path.join(mod.info.path, 'lib');

    this.submodules = fs.readdirSync(submoduleRoot).map(submodule => {
      const submoduleConstructor = require(path.join(submoduleRoot, submodule));
      return new submoduleConstructor(mod);
    });
  }

  destructor() {
    this.submodules.forEach(submodule => {
      try {
        if (typeof submodule.destructor === 'function') submodule.destructor();
      } catch (err) {
        console.log(err);
      }
    });

    delete this.submodules;
  }
}

exports.NetworkMod = bugfix;
