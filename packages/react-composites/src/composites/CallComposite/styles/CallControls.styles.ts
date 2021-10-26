// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultPalette as palette, IContextualMenuItemStyles, Theme } from '@fluentui/react';
import { ParticipantItemStylesProps } from '@internal/react-components';

const MINIMUM_TOUCH_TARGET_HEIGHT_REM = 3;

/**
 * @private
 */
export const groupCallLeaveButtonStyle = {
  root: {
    border: '0.125rem',
    borderRadius: 2,
    marginRight: '.75rem',
    height: '2.1875rem',
    width: '6.5625rem'
  },
  flexContainer: {
    flexFlow: 'row'
  }
};

/**
 * @private
 */
export const groupCallLeaveButtonCompressedStyle = {
  root: {
    border: '0',
    borderRadius: '0.5rem'
  },
  flexContainer: {
    flexFlow: 'row'
  }
};

/**
 * @private
 */
export const checkedButtonOverrideStyles = (theme: Theme, isChecked?: boolean) => ({
  rootChecked: {
    background: theme.palette.themePrimary,
    color: palette.white,
    ':focus::after': { outlineColor: `${palette.white} !important` }
  },
  label: isChecked ? { color: palette.white } : {}
});

/**
 * Styles that can be applied to ensure flyout items have the minimum touch target size.
 *
 * @private
 */
export const buttonFlyoutItemStylesWithIncreasedTouchTargets: IContextualMenuItemStyles = {
  root: {
    height: `${MINIMUM_TOUCH_TARGET_HEIGHT_REM}rem`,
    lineHeight: `${MINIMUM_TOUCH_TARGET_HEIGHT_REM}rem`,
    maxHeight: 'unset'
  },
  linkContent: {
    height: `${MINIMUM_TOUCH_TARGET_HEIGHT_REM}rem`,
    lineHeight: `${MINIMUM_TOUCH_TARGET_HEIGHT_REM}rem`,
    maxHeight: 'unset'
  }
};

/**
 * @private
 */
export const participantListItemStyleWithIncreasedTouchTargets: ParticipantItemStylesProps = {
  root: {
    paddingLeft: '1rem',
    paddingRight: '1rem',
    minHeight: `${MINIMUM_TOUCH_TARGET_HEIGHT_REM}rem`
  }
};
