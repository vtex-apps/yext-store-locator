import React from 'react'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useStoreGroup } from './StoreGroup'

const CSS_HANDLES = [
  'socialLinksBlock',
  'socialLinksHeader',
  'socialLinksTitle',
  'socialLinksSubtitle',
  'socialLinksContainer',
  'socialLinkTag',
] as const

interface StoreSocialProps {
  title: string
  subtitle: string
  facebookLabel: string
  twitterLabel: string
  youTubeLabel: string
  instagramLabel: string
  youTubeHandle: string
}

const StoreSocialLinks: StorefrontFunctionComponent<StoreSocialProps> = ({
  title,
  subtitle,
  facebookLabel,
  twitterLabel,
  youTubeLabel,
  instagramLabel,
  youTubeHandle,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const group = useStoreGroup()

  if (!group) {
    return null
  }

  const { facebookPageUrl, twitterHandle, instagramHandle } = group

  return (
    <div
      className={`${handles.socialLinksBlock} flex flex-column justify-center items-center ma6`}
    >
      {(title || subtitle) && (
        <div
          className={`${handles.socialLinksHeader} flex flex-column justify-center items-center`}
        >
          <div className={handles.socialLinksTitle}>{title}</div>
          <div className={handles.socialLinksSubtitle}>{subtitle}</div>
        </div>
      )}
      <div className={`${handles.socialLinksContainer} flex`}>
        {facebookPageUrl && (
          <a className={handles.socialLinkTag} href={facebookPageUrl}>
            {facebookLabel}
          </a>
        )}
        {twitterHandle && (
          <a
            className={`${handles.socialLinkTag} ml5`}
            href={`https://twitter.com/${twitterHandle}`}
          >
            <div>{twitterLabel}</div>
          </a>
        )}
        {youTubeHandle && (
          <a
            className={`${handles.socialLinkTag} ml5`}
            href={`https://www.youtube.com/user/${youTubeHandle}`}
          >
            <div>{youTubeLabel}</div>
          </a>
        )}
        {instagramHandle && (
          <a
            className={`${handles.socialLinkTag} ml5`}
            href={`https://www.instagram.com/${instagramHandle}`}
          >
            <div>{instagramLabel}</div>
          </a>
        )}
      </div>
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.StoreSocialLinks.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.StoreSocialLinks.description',
  },
  titleTitle: {
    defaultMessage: '',
    id: 'admin/editor.StoreSocialLinksTitle.title',
  },
  titleDescription: {
    defaultMessage: '',
    id: 'admin/editor.StoreSocialLinksTitle.description',
  },
  subtitleTitle: {
    defaultMessage: '',
    id: 'admin/editor.StoreSocialLinksSubtitle.title',
  },
  subtitleDescription: {
    defaultMessage: '',
    id: 'admin/editor.StoreSocialLinksSubtitle.description',
  },
  facebookLabelTitle: {
    defaultMessage: '',
    id: 'admin/editor.StoreSocialLinksFacebookLabel.title',
  },
  facebookLabelDescription: {
    defaultMessage: '',
    id: 'admin/editor.StoreSocialLinksFacebookLabel.description',
  },
  twitterLabelTitle: {
    defaultMessage: '',
    id: 'admin/editor.StoreSocialLinksTwitterLabel.title',
  },
  twitterLabelDescription: {
    defaultMessage: '',
    id: 'admin/editor.StoreSocialLinksTwitterLabel.description',
  },
  youTubeLabelTitle: {
    defaultMessage: '',
    id: 'admin/editor.StoreSocialLinksYouTubeLabel.title',
  },
  youTubeLabelDescription: {
    defaultMessage: '',
    id: 'admin/editor.StoreSocialLinksYouTubeLabel.description',
  },
  instagramLabelTitle: {
    defaultMessage: '',
    id: 'admin/editor.StoreSocialLinksInstagramLabel.title',
  },
  instagramLabelDescription: {
    defaultMessage: '',
    id: 'admin/editor.StoreSocialLinksInstagramLabel.description',
  },
  youTubeHandleTitle: {
    defaultMessage: '',
    id: 'admin/editor.StoreSocialLinksYouTubeHandle.title',
  },
  youTubeHandleDescription: {
    defaultMessage: '',
    id: 'admin/editor.StoreSocialLinksYouTubeHandle.description',
  },
})

StoreSocialLinks.defaultProps = {
  facebookLabel: 'Facebook',
  twitterLabel: 'Twitter',
  youTubeLabel: 'YouTube',
  instagramLabel: 'Instagram',
  youTubeHandle: '',
}

StoreSocialLinks.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {
    title: {
      title: messages.titleTitle.id,
      description: messages.titleDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
    subtitle: {
      title: messages.subtitleTitle.id,
      description: messages.subtitleDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
    facebookLabel: {
      title: messages.facebookLabelTitle.id,
      description: messages.facebookLabelDescription.id,
      type: 'string',
      isLayout: false,
      default: 'Facebook',
    },
    twitterLabel: {
      title: messages.twitterLabelTitle.id,
      description: messages.twitterLabelDescription.id,
      type: 'string',
      isLayout: false,
      default: 'Twitter',
    },
    youTubeLabel: {
      title: messages.youTubeLabelTitle.id,
      description: messages.youTubeLabelDescription.id,
      type: 'string',
      isLayout: false,
      default: 'YouTube',
    },
    instagramLabel: {
      title: messages.instagramLabelTitle.id,
      description: messages.instagramLabelDescription.id,
      type: 'string',
      isLayout: false,
      default: 'Instagram',
    },
    youTubeHandle: {
      title: messages.youTubeHandleTitle.id,
      description: messages.youTubeHandleDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
  },
}

export default StoreSocialLinks
