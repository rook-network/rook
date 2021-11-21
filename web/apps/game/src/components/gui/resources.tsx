import { ResourceSet } from '../../codec/rook/game/game'
import React from 'react'
import styles from  './gui.module.less';

export const ResourcesDisplay = (props: { resources: ResourceSet }) => {
  return (
    <div className={styles.resourceDisplay}>
      Food: { props.resources.food } Wood: { props.resources.wood } Stone: { props.resources.stone } Pop: { props.resources.population }
    </div>
  )
}