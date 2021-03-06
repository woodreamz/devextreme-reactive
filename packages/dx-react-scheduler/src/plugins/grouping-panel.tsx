import * as React from 'react';
import {
  Plugin,
  Template,
  TemplateConnector,
  PluginComponents,
} from '@devexpress/dx-react-core';
import { GroupingPanelProps } from '../types';
import {
  VERTICAL_VIEW_LEFT_OFFSET, HORIZONTAL_VIEW_LEFT_OFFSET,
  HORIZONTAL_GROUP_ORIENTATION, VIEW_TYPES,
} from '@devexpress/dx-scheduler-core';

const pluginDependencies = [
  { name: 'GroupingState' },
  { name: 'IntegratedGrouping' },
  { name: 'DayView', optional: true },
  { name: 'MonthView', optional: true },
  { name: 'WeekView', optional: true },
  { name: 'ViewState', optional: true },
];

class GroupingPanelBase extends React.PureComponent<GroupingPanelProps> {
  static components: PluginComponents = {
    horizontalLayoutComponent: 'HorizontalLayout',
    verticalLayoutComponent: 'VerticalLayout',
    rowComponent: 'Row',
    cellComponent: 'Cell',
  };

  render() {
    const {
      horizontalLayoutComponent: HorizontalLayout,
      verticalLayoutComponent: VerticalLayout,
      rowComponent,
      cellComponent,
    } = this.props;

    return (
      <Plugin
        name="GroupingPanel"
        dependencies={pluginDependencies}
      >
        <Template name="groupingPanel">
          <TemplateConnector>
            {({
              viewCellsData, currentView, scrollingStrategy, allDayPanelExists,
              groupByDate, groupOrientation: getGroupOrientation, groups,
            }) => {
              const groupOrientation = getGroupOrientation(currentView?.name);
              return groupOrientation === HORIZONTAL_GROUP_ORIENTATION ? (
                <HorizontalLayout
                  rowComponent={rowComponent}
                  cellComponent={cellComponent}
                  groups={groups}
                  colSpan={viewCellsData[0].length}
                  cellStyle={{
                    left: scrollingStrategy.fixedLeftWidth ? scrollingStrategy.fixedLeftWidth
                    : currentView?.type === VIEW_TYPES.MONTH
                      ? HORIZONTAL_VIEW_LEFT_OFFSET
                      : VERTICAL_VIEW_LEFT_OFFSET,
                  }}
                  showHeaderForEveryDate={groupByDate?.(currentView && currentView.name)}
                />
              ) : (
                <VerticalLayout
                  rowComponent={rowComponent}
                  cellComponent={cellComponent}
                  groups={groups}
                  rowSpan={viewCellsData.length}
                  viewType={currentView?.type}
                  cellTextTopOffset={scrollingStrategy?.fixedTopHeight}
                  alignWithAllDayRow={allDayPanelExists}
                />
              );
            }}
          </TemplateConnector>
        </Template>
      </Plugin>
    );
  }
}

/** A plugin that renders the grouping panel used to display group names. */
export const GroupingPanel: React.ComponentType<GroupingPanelProps> = GroupingPanelBase;
