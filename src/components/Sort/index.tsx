import React from 'react';
import ReactDragListView from "react-drag-listview"
export interface DragProps {
  onDragEnd: (fromIndex: number, toIndex: number) => void; //	拖拽结束回调
  nodeSelector?: string; //	可拖拽元素css选择器 默认 tr
  handleSelector: string; //	nodeSelector	get drag handle cssQuery
  ignoreSelector?: string; //	忽略的元素
  enableScroll?: boolean; //	true	是否使用自动滚动进行拖动 默认 true
  scrollSpeed?: number; //	滚动速度  默认 10
  lineClassName?: string; //	String
}

interface SortTableProps {
  dragProps: DragProps;
  children: React.ReactNode;
}

export const SortTable: React.FC<SortTableProps> = ({
  dragProps,
  children,
}) => {
  return <ReactDragListView {...dragProps}>{children}</ReactDragListView>;
};
