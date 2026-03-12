class Fuse {
  constructor(list, options = {}) {
    this.list = list || [];
    this.keys = options.keys || [];
    this.threshold = options.threshold || 0.4;
  }

  search(pattern) {
    if (!pattern) return [];

    const query = pattern.toLowerCase();
    const results = [];

    for (const item of this.list) {
      let text = "";

      if (typeof item === "string") {
        text = item.toLowerCase();
      } else if (typeof item === "object") {
        for (const key of this.keys) {
          if (item[key]) {
            text += " " + String(item[key]).toLowerCase();
          }
        }
      }

      if (text.includes(query)) {
        results.push({
          item,
          score: 0
        });
      }
    }

    return results;
  }
}

module.exports = Fuse;
