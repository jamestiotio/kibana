/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { PublishingSubject, useStateFromPublishingSubject } from '../publishing_subject';

export type ViewMode = 'view' | 'edit' | 'print' | 'preview';

/**
 * This API publishes a universal view mode which can change compatibility of actions and the
 * visibility of components.
 */
export interface PublishesViewMode {
  viewMode: PublishingSubject<ViewMode>;
}

export type PublishesWritableViewMode = PublishesViewMode & {
  setViewMode: (viewMode: ViewMode) => void;
};

/**
 * A type guard which can be used to determine if a given API publishes a view mode.
 */
export const apiPublishesViewMode = (
  unknownApi: null | unknown
): unknownApi is PublishesViewMode => {
  return Boolean(unknownApi && (unknownApi as PublishesViewMode)?.viewMode !== undefined);
};

export const apiPublishesWritableViewMode = (
  unknownApi: null | unknown
): unknownApi is PublishesWritableViewMode => {
  return (
    apiPublishesViewMode(unknownApi) &&
    (unknownApi as PublishesWritableViewMode).setViewMode !== undefined &&
    typeof (unknownApi as PublishesWritableViewMode).setViewMode === 'function'
  );
};

/**
 * A hook that gets this API's view mode as a reactive variable which will cause re-renders on change.
 */
export const useViewMode = <
  ApiType extends Partial<PublishesViewMode> = Partial<PublishesViewMode>
>(
  api: ApiType | undefined
) => useStateFromPublishingSubject<ViewMode, ApiType['viewMode']>(api?.viewMode);
