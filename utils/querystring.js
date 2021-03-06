const qs = require("querystring");

const makeError = require("./makeError");
const { queryRequirements } = require("../config");

class QueryString {
  static build() {
    const customQS = new QueryString(queryRequirements);

    return new Proxy(customQS, {
      get(target, prop) {
        return target[prop] || qs[prop];
      }
    });
  }

  constructor(queryReqs) {
    this.queryReqs = queryReqs;
  }

  injectParam(param, defaultVal = "") {
    // This method needs to be curried
    return query => {
      // Work with an actual JS object
      const q = { ...query };

      if (query[param]) return q;

      q[param] = q.user.map(() => defaultVal);
      return q;
    };
  }

  parse(str) {
    const q = qs.parse(str);

    // Make sure all required params are there in the first place
    this.checkParams(q);

    const processedQuery = this.injectParam(
      "branch",
      "master"
    )(
      Object.keys(q).reduce((acc, param) => {
        if (param === "id") {
          return { ...acc, [param]: q[param] };
        } else if (!Array.isArray(q[param])) {
          return { ...acc, [param]: [q[param]] };
        }
        return { ...acc, [param]: [...q[param]] };
      }, {})
    );

    // Make sure we have the same number of values per param
    this.checkValueLengths(processedQuery);

    return processedQuery;
  }

  checkParams(query) {
    const missing = [];
    for (const qReq of this.queryReqs) {
      if (qReq !== "branch" && !query[qReq]) {
        missing.push(`'${qReq}'`);
      }
    }

    if (missing.length) {
      const missingQs = missing.join(", ");
      throw makeError(400, `Missing ${missingQs} query parameter(s).`);
    }
  }

  checkValueLengths(query) {
    let len;
    const missing = [];
    for (const qReq of this.queryReqs) {
      const qLen = query[qReq].length;
      if (len && len !== qLen) {
        missing.push(`'${qReq}'`);
      } else {
        len = qLen;
      }
    }

    if (missing.length) {
      const missingQs = missing.join(", ");
      throw makeError(
        400,
        `Missing ${missingQs}. Each query parameter must have the same number of values.`
      );
    }
  }
}

module.exports = QueryString.build();
