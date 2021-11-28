import styles from './gui.module.less';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Card } from '../card'

export interface EndGameProps {
  winningFaction: string[]
  quit: () => void
}

export const EndGameDisplay = (props: EndGameProps) => {
  if (props.winningFaction.length === 0) {
    return (
      <Card>
        <Close quit={props.quit} />
        <div className={styles.endGameText}>
          Game ended without a winner
        </div>
      </Card>
    )
  }
  const winningPlayer = props.winningFaction[0]
  return (
    <Card>
      <Close quit={props.quit} />
      <div className={styles.endGameText}>
        Congratulations {winningPlayer}
      </div>
    </Card>
    // <div onClick={props.quit} className={styles.endGame}>
    // </div>
  )
}

const Close = (props: { quit: ()=> void }) => {
  return (
      <CloseCircleOutlined onClick={props.quit} className={styles.closeButton} />
  )
}