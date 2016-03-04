import React, { Component } from 'react';

import { connect } from 'react-redux';

import PublicTopBar from '../components/PublicTopBar';
import PublicFooter from '../components/PublicFooter';
import Currency from '../components/Currency';
import TransactionItem from '../components/TransactionItem';
import Notification from '../components/Notification';
import SubscriptionEmailForm from '../components/SubscriptionEmailForm';

import validate from '../actions/form/validate_schema';
import decodeJWT from '../actions/session/decode_jwt';
import logout from '../actions/session/logout';
import refreshSubscriptionsToken from '../actions/users/refresh_subscriptions_token';
import sendNewSubscriptionsToken from '../actions/users/send_new_subscriptions_token';
import resetNotifications from '../actions/notification/reset';
import notify from '../actions/notification/notify';

// To put as standalone component when the design is final
const SubscriptionNewTokenForm = ({sendToken}) => {
  return (
    <div>
      <h2>Your link has expired</h2>
        <p>Click here to get an email with the new link</p>
        <div
          className='Button Button--green'
          onClick={() => sendToken()}>
          Send
        </div>
      </div>
  );
};


export class Subscriptions extends Component {
  render() {
    const {
      subscriptions,
      session
    } = this.props
    return (
      <div className='PublicGroup'>

        <PublicTopBar {...this.props} />
        <Notification {...this.props} />
        <div className='PublicContent'>

          {session.jwtExpired && <SubscriptionNewTokenForm sendToken={refreshToken.bind(this)}/>}
          {session.jwtInvalid && <SubscriptionEmailForm onClick={sendNewToken.bind(this)} {...this.props}/>}
          {subscriptions.map(subscription => {
            return (
              <div key={subscription.id}>
                <h3>
                  Subscription #{subscription.id} (
                    <Currency value={subscription.amount} currency={subscription.currency} colorify={false} />
                    /{subscription.interval}
                  )
                </h3>
                {subscription.Transactions.map(transaction => {
                  return <TransactionItem key={transaction.id} transaction={transaction}/>;
                })}
              </div>
            );
          })}
        </div>
        <PublicFooter />
      </div>
    );
  }

}

export function refreshToken() {
  const {
    token,
    refreshSubscriptionsToken,
    notify
  } = this.props;

  return refreshSubscriptionsToken(token)
  .then(() => notify('success', 'Email sent'))
  .catch(({message}) => notify('error', message));
}

export function sendNewToken(email) {
  const {
    sendNewSubscriptionsToken,
    notify
  } = this.props;

  return sendNewSubscriptionsToken(email)
  .then(() => notify('success', 'Email sent'))
  .catch(({message}) => notify('error', message));
}

export default connect(mapStateToProps, {
  logout,
  decodeJWT,
  refreshSubscriptionsToken,
  sendNewSubscriptionsToken,
  resetNotifications,
  notify,
  validate
})(Subscriptions);

function mapStateToProps({
  session,
  router,
  subscriptions,
  notification,
  users
}) {
  return {
    notification,
    session,
    subscriptions: subscriptions.list,
    token: router.params.token,
    inProgress: users.sendingEmailInProgress
  };
}
