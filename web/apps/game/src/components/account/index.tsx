import React from 'react';
import styles from './account.module.less';
import { ReactComponent as TowerIcon } from './tower.svg';

export interface AccountProps {
    isConnected: boolean
    address: string,
    balance: number,
}

export class Account extends React.Component<AccountProps> {
    render() {
        let address = "..."
        if (this.props.isConnected) {
            address = this.props.address.substring(4, 12) + "..."
        }
        return (
            <div className={styles.container}>
                <TowerIcon width={40} />
                <span className={styles.address}>{ address }</span>
                <span className={styles.balance}>{ this.props.balance } ROOK</span>
            </div>
        )
    }
}