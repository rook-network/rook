import { Component } from 'react';
import Loader from "react-loader-spinner"

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

export const NotConnectedCard = (props: NotConnectedCardProps) => {
  return (
    <Card>
      <h3 style={{ marginTop: "30px" }}>No Account Connected</h3>
      <p>Please install the Keplr extension and login to an account to continue. If you have Keplr installed and are connected than press retry.</p>
      <button className={styles.button} onClick={props.connectFn}>Retry</button>
    </Card>
  )
}

export interface LoadingProps {
  message?: string
}

export const LoadingCard = (props: LoadingProps) => {
  return (
    <Card>
      <Loader
        type="Puff"
        color="#00BFFF"
        height={100}
        width={100}
        timeout={3000} //3 secs
      />
      { props.message ? "Loading..." : props.message }
    </Card>
  )
}
