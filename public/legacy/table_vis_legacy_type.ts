/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { i18n } from '@kbn/i18n';
import random from '@fortawesome/fontawesome-free/svgs/solid/random.svg';
import { AggGroupNames } from '../../../../src/plugins/data/public';

import { SankeyOptions } from '../components/sankey_vis_options_lazy';
import { VIS_EVENT_TO_TRIGGER } from '@kbn/visualizations-plugin/public';
import { toExpressionAstLegacy } from './to_ast_legacy';

export function tableVisLegacyTypeDefinition(core) {
return {
  requiresSearch: true,
  name: 'sankey',
  title: i18n.translate('visTypeTable.tableVisTitle', {
    defaultMessage: 'Sankey Diagram',
  }),
  icon: random,
  description: i18n.translate('visTypeTable.tableVisDescription', {
    defaultMessage: 'A sankey diagram is a type of flow diagram where flow quantities are depicted by proportional arrow magnitutes..',
  }),
  getSupportedTriggers: () => {
    return [VIS_EVENT_TO_TRIGGER.filter];
  },
  visConfig: {
    defaults: {
      perPage: 10,
      showPartialRows: false,
      showMetricsAtAllLevels: false,
      sort: {
        columnIndex: null,
        direction: null,
      },
      showTotal: false,
      totalFunc: 'sum',
      percentageCol: '',
    },
  },
  editorConfig: {
    optionsTemplate: SankeyOptions,
    enableDataViewChange: true, // Allows to change data view on existing Sankey
    schemas: [
      {
        group: AggGroupNames.Metrics,
        name: 'metric',
        title: i18n.translate('visTypeTable.tableVisEditorConfig.schemas.metricTitle', {
          defaultMessage: 'Metric',
        }),
        aggFilter: ['!geo_centroid', '!geo_bounds', '!filtered_metric', '!single_percentile'],
        aggSettings: {
          top_hits: {
            allowStrings: true,
          },
        },
        min: 1,
        defaults: [{ type: 'count', schema: 'metric' }],
      },
      {
        group: AggGroupNames.Buckets,
        name: 'bucket',
        title: i18n.translate('visTypeTable.tableVisEditorConfig.schemas.bucketTitle', {
          defaultMessage: 'Split rows',
        }),
        aggFilter: ['!filter'],
      },
    ],
  },
  toExpressionAst: toExpressionAstLegacy,
  hierarchicalData: (vis) => vis.params.showPartialRows || vis.params.showMetricsAtAllLevels,
};
}
