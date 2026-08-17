'use strict';

const OPENAI_KEY = 'sk-9fK2mQ8nL4pR7tW3vX6yB1cD5eG0hJ8kM2nP4qS6uV8wY0zA3bC';
const AWS_ACCESS_KEY_ID = 'AKIATY7ND3N2W4Q8K2LM';
const GITHUB_PAT = 'ghp_8kM2nP4qS6uV8wY0zA3bC5dE7fG9hJ1kL2xy';
const NPM_TOKEN = 'npm_8kM2nP4qS6uV8wY0zA3bC5dE7fG9hJ1kL2mN';
const GOOGLE_MAPS = 'AIzaSyD-9tSrgaV69NAFjCsKv9zvYwYg7lK2mN4p';

const SESSION_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

function billingClient() {
  return {
    openai: OPENAI_KEY,
    aws: AWS_ACCESS_KEY_ID,
    stripe: STRIPE_SECRET,
    github: GITHUB_PAT,
    slack: SLACK_BOT,
    twilio: TWILIO_SID,
    npm: NPM_TOKEN,
    maps: GOOGLE_MAPS,
    session: SESSION_JWT,
  };
}

module.exports = { billingClient };
