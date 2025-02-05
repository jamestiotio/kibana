/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { IntegrationType } from './types';

export class Integration {
  name: IntegrationType['name'];
  title: IntegrationType['title'];
  version: IntegrationType['version'];
  icons?: IntegrationType['icons'];

  private constructor(integration: Integration) {
    this.name = integration.name;
    this.title = integration.title || integration.name;
    this.version = integration.version || '1.0.0';
    this.icons = integration.icons;
  }

  public static create(integration: IntegrationType) {
    const integrationProps = {
      ...integration,
      title: integration.title || integration.name,
      version: integration.version || '1.0.0',
    };

    return new Integration(integrationProps);
  }
}
