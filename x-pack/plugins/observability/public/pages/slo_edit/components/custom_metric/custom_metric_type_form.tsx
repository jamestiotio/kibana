/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiIconTip,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { FormattedMessage } from '@kbn/i18n-react';
import { ALL_VALUE } from '@kbn/slo-schema/src/schema/common';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useFetchGroupByCardinality } from '../../../../hooks/slo/use_fetch_group_by_cardinality';
import { useFetchIndexPatternFields } from '../../../../hooks/slo/use_fetch_index_pattern_fields';
import { CreateSLOForm } from '../../types';
import { DataPreviewChart } from '../common/data_preview_chart';
import { IndexFieldSelector } from '../common/index_field_selector';
import { QueryBuilder } from '../common/query_builder';
import { IndexSelection } from '../custom_common/index_selection';
import { MetricIndicator } from './metric_indicator';

export { NEW_CUSTOM_METRIC } from './metric_indicator';

const SUPPORTED_METRIC_FIELD_TYPES = ['number', 'histogram'];

export function CustomMetricIndicatorTypeForm() {
  const { watch } = useFormContext<CreateSLOForm>();
  const index = watch('indicator.params.index');
  const timestampField = watch('indicator.params.timestampField');
  const groupByField = watch('groupBy');

  const { isLoading: isIndexFieldsLoading, data: indexFields = [] } =
    useFetchIndexPatternFields(index);
  const { isLoading: isGroupByCardinalityLoading, data: groupByCardinality } =
    useFetchGroupByCardinality(index, timestampField, groupByField);

  const timestampFields = indexFields.filter((field) => field.type === 'date');
  const groupByFields = indexFields.filter((field) => field.aggregatable);
  const metricFields = indexFields.filter((field) =>
    SUPPORTED_METRIC_FIELD_TYPES.includes(field.type)
  );

  return (
    <>
      <EuiTitle size="xs">
        <h3>
          <FormattedMessage
            id="xpack.observability.slo.sloEdit.sliType.histogram.sourceTitle"
            defaultMessage="Source"
          />
        </h3>
      </EuiTitle>
      <EuiSpacer size="s" />
      <EuiFlexGroup direction="column" gutterSize="l">
        <EuiFlexGroup direction="row" gutterSize="l">
          <EuiFlexItem>
            <IndexSelection />
          </EuiFlexItem>
          <EuiFlexItem>
            <IndexFieldSelector
              indexFields={timestampFields}
              name="indicator.params.timestampField"
              label={i18n.translate('xpack.observability.slo.sloEdit.timestampField.label', {
                defaultMessage: 'Timestamp field',
              })}
              placeholder={i18n.translate(
                'xpack.observability.slo.sloEdit.timestampField.placeholder',
                { defaultMessage: 'Select a timestamp field' }
              )}
              isLoading={!!index && isIndexFieldsLoading}
              isDisabled={!index}
              isRequired
            />
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiFlexItem>
          <QueryBuilder
            dataTestSubj="customMetricIndicatorFormQueryFilterInput"
            indexPatternString={watch('indicator.params.index')}
            label={i18n.translate(
              'xpack.observability.slo.sloEdit.sliType.customMetric.queryFilter',
              {
                defaultMessage: 'Query filter',
              }
            )}
            name="indicator.params.filter"
            placeholder={i18n.translate(
              'xpack.observability.slo.sloEdit.sliType.customMetric.customFilter',
              { defaultMessage: 'Custom filter to apply on the index' }
            )}
            tooltip={
              <EuiIconTip
                content={i18n.translate(
                  'xpack.observability.slo.sloEdit.sliType.customMetric.customFilter.tooltip',
                  {
                    defaultMessage:
                      'This KQL query can be used to filter the documents with some relevant criteria.',
                  }
                )}
                position="top"
              />
            }
          />
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiHorizontalRule margin="none" />
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiTitle size="xs">
            <h3>
              <FormattedMessage
                id="xpack.observability.slo.sloEdit.sliType.customMetric.goodTitle"
                defaultMessage="Good events"
              />
            </h3>
          </EuiTitle>
          <EuiSpacer size="s" />
          <MetricIndicator
            type="good"
            metricFields={metricFields}
            isLoadingIndex={isIndexFieldsLoading}
          />
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiHorizontalRule margin="none" />
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiTitle size="xs">
            <h3>
              <FormattedMessage
                id="xpack.observability.slo.sloEdit.sliType.customMetric.totalTitle"
                defaultMessage="Total events"
              />
            </h3>
          </EuiTitle>
          <EuiSpacer size="s" />
          <MetricIndicator
            type="total"
            metricFields={metricFields}
            isLoadingIndex={isIndexFieldsLoading}
          />
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiHorizontalRule margin="none" />
        </EuiFlexItem>

        <IndexFieldSelector
          indexFields={groupByFields}
          name="groupBy"
          defaultValue={ALL_VALUE}
          label={
            <span>
              {i18n.translate('xpack.observability.slo.sloEdit.groupBy.label', {
                defaultMessage: 'Group by',
              })}{' '}
              <EuiIconTip
                content={i18n.translate('xpack.observability.slo.sloEdit.groupBy.tooltip', {
                  defaultMessage: 'Create individual SLOs for each value of the selected field.',
                })}
                position="top"
              />
            </span>
          }
          placeholder={i18n.translate('xpack.observability.slo.sloEdit.groupBy.placeholder', {
            defaultMessage: 'Select an optional field to group by',
          })}
          isLoading={!!index && isIndexFieldsLoading}
          isDisabled={!index}
        />

        {!isGroupByCardinalityLoading && !!groupByCardinality && (
          <EuiCallOut
            size="s"
            iconType={groupByCardinality.isHighCardinality ? 'warning' : ''}
            color={groupByCardinality.isHighCardinality ? 'warning' : 'primary'}
            title={i18n.translate('xpack.observability.slo.sloEdit.groupBy.cardinalityInfo', {
              defaultMessage:
                "Selected group by field '{groupBy}' will generate at least {card} SLO instances based on the last 24h sample data.",
              values: { card: groupByCardinality.cardinality, groupBy: groupByField },
            })}
          />
        )}

        <DataPreviewChart />
      </EuiFlexGroup>
    </>
  );
}
