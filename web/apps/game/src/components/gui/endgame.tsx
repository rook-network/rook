import styles from './gui.module.less';

export interface EndGameProps {
  winningFaction: string[]
  quit: () => void
}

export const EndGameDisplay = (props: EndGameProps) => {
  if (props.winningFaction.length === 0) {
    return (
      <div onClick={props.quit} className={styles.endGame}>
        Game ended without a winner
      </div>
    )
  }
  const winningPlayer = props.winningFaction[0]
  return (
    <div onClick={props.quit} className={styles.endGame}>
      Congratulations {winningPlayer}
    </div>
  )
}