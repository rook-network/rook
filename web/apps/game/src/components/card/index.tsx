import { Component } from 'react';

import styles from  './card.module.less';

/* eslint-disable-next-line */
export interface CardProps {
}

export class Card extends Component<CardProps> {
  render() {
    return (
      <div className={ styles.centeredCard }>
        {this.props.children}
      </div>
    );
  }
}

export default Card;

export interface NotConnectedCardProps {
  connectFn: () => void;
}

export class NotConnectedCard extends Component<NotConnectedCardProps> {
  render() {
    return (
      <Card>
        <h3>No Account Connected</h3>
        <p>Please install the Keplr extension and login to an account to continue</p>
        <button className={styles.button} onClick={this.props.connectFn}>Retry</button>
      </Card>
    )
  }
}