import styles from './side-panel-bulk.module.css'
import update from 'immutability-helper'
import ReactCreatableSelect from 'react-select/creatable'

import { AssetContext, UserContext, FilterContext } from '../../../context'
import { useEffect, useState, useContext } from 'react'
import { format } from 'date-fns'
import { capitalCase } from 'change-case'
import filesize from 'filesize'
import { getAssociatedCampaigns, getAssociatedChannels, getParsedExtension } from '../../../utils/asset'
import tagApi from '../../../server-api/tag'
import assetApi from '../../../server-api/asset'
import projectApi from '../../../server-api/project'
import campaignApi from '../../../server-api/campaign'
import { Utilities } from '../../../assets'

import channelSocialOptions from '../../../resources/data/channels-social.json'
import {
  CALENDAR_ACCESS
} from '../../../constants/permissions'

// Components
import Button from '../buttons/button'
import ChannelSelector from '../items/channel-selector'

const SidePanelBulk = ({elementsSelected}) => {



  return (
    <div className={styles.container}>
      <h2>Apply Attributes to Selected Assets</h2>
      <section className={styles['first-section']}>
        <p>{`Editing (${elementsSelected.length}) files`}</p>
      </section>
      <section className={styles['field-wrapper']} >
        <div className={`secondary-text ${styles.field}`}>Channel</div>
        <ChannelSelector
          // channel={channel || undefined}
          // isShare={isShare}
          onLabelClick={() => { }}
          // handleChannelChange={(option) => updateChannel(option)}
        />
      </section>
      <Button text={'Save Changes'} type={'button'} styleType={'primary'} />
    </div >
  )
}

export default SidePanelBulk