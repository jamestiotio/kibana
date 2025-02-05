/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { apiPublishesParentApi } from '@kbn/presentation-publishing';

export interface PanelPackage {
  panelType: string;
  initialState: unknown;
}
export interface PresentationContainer {
  removePanel: (panelId: string) => void;
  canRemovePanels?: () => boolean;
  replacePanel: (idToRemove: string, newPanel: PanelPackage) => Promise<string>;
}

export const apiIsPresentationContainer = (
  unknownApi: unknown | null
): unknownApi is PresentationContainer => {
  return Boolean((unknownApi as PresentationContainer)?.removePanel !== undefined);
};

export const getContainerParentFromAPI = (
  api: null | unknown
): PresentationContainer | undefined => {
  const apiParent = apiPublishesParentApi(api) ? api.parentApi.value : null;
  if (!apiParent) return undefined;
  return apiIsPresentationContainer(apiParent) ? apiParent : undefined;
};
