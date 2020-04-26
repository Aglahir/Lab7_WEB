const TOKEN = "2abbf7c3-245b-404f-9473-ade729ed4653";

function validateAuthorization(req, res) {
  let token = req.headers.authorization;
  if (!token) return false;

  if (token !== `Bearer ${TOKEN}`) {
    res.statusMessage += "'Authorization token' is invalid; ";
    return false;
  }

  return true;
}

function validateBookAPIKey(req, res) {
  let token = req.headers["book-api-key"];
  if (!token) return false;

  if (token !== TOKEN) {
    res.statusMessage += "'book-api-key' is invalid; ";
    return false;
  }

  return true;
}

function validateParamAPIKey(req, res) {
  let token = req.query.apiKey;
  if (!token) return false;

  if (token !== TOKEN) {
    res.statusMessage += "'apiKey' is invalid; ";
    return false;
  }

  return true;
}

// Simple or operation. If one of the methods returns true,
// then autorization will be valid.
function validateToken(req, res, next) {
  if (
    validateAuthorization(req, res) ||
    validateBookAPIKey(req, res) ||
    validateParamAPIKey(req, res)
  ) {
    next();
  } else {
    if (!res.statusMessage) res.statusMessage = "Please send auth key";
    return res.status(401).end();
  }
}

module.exports = validateToken;
