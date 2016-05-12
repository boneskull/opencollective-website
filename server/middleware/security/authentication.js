import api from '../../lib/api';
import config from 'config';
import passport from 'passport';

export default {

  authenticateService: (req, res, next) => {
    const service = req.params.service;
    passport.authenticate(req.params.service, {
      callbackURL: `${config.host.website}/auth/${service}/callback/`,
      // TODO set proper scope
      scope: [ 'user:email' ]
    })(req, res, next);
  },

  authenticateServiceCallback: (req, res, next) => {
    const service = req.params.service;
    passport.authenticate(service, (err, accessToken, profile) => {
      if (err) {
        return next(err);
      }
      if (!accessToken) {
        return res.redirect(`/connect/${service}`);
      }
      api.post(`/connected-accounts/${service}`, JSON.stringify({ accessToken, clientId: profile.username }))
        .then(() => res.redirect(`/github/apply`))
        .catch(apiErr => next(apiErr));
    })(req, res, next);
  }
};
