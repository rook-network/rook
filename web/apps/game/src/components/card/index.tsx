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
