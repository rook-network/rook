import { Component } from 'react';
import Loader from "react-loader-spinner"
import { WarningOutlined } from '@ant-design/icons'

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
      <h3 style={{ marginTop: "20vh" }}>No Account Connected</h3>
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
      <div style={{marginTop: "15vh"}}> 
        <Loader
          type="Rings"
          color="black"
          height={100}
          width={100}
        />
        <p>
          { props.message ? props.message : "Loading..." }
        </p>
      </div>
    </Card>
  )
}

export interface ErrorProps {
  error: string 
}

export const ErrorCard = (props: ErrorProps) => {
  return (
    <Card>
      <div style={{marginTop: "20vh"}}>
        <WarningOutlined className={styles.errorIcon} />
        <p>
          {props.error}
        </p>
      </div>
    </Card>
  )
}