import { useEffect } from "react"
import { Grid } from "@mui/material"
import {
  useGridSelector,
  GridRowModes,
  GridActionsCellItem,
  gridFilteredDescendantCountLookupSelector
} from "@mui/x-data-grid-pro"

import SaveIcon from "@mui/icons-material/Save"
import SettingsIcon from "@mui/icons-material/Settings"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import ShortTextIcon from "@mui/icons-material/ShortText"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"

import { useDrag } from "react-dnd"

import { getChildrenIds } from "../utils/datagrid"

const GridTreeDataGroupingCell = (props: any) => {
  const {
    id,
    field,
    apiRef,
    treeKey,
    rowNode,
    rowModesModel,
    handleSaveClick,
    handleEditClick
  } = props

  const row = apiRef.current.getRow(id)
  const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit
  const filteredDescendantCountLookup = useGridSelector(
    apiRef,
    gridFilteredDescendantCountLookupSelector
  )
  const filteredDescendantCount = filteredDescendantCountLookup[rowNode.id] ?? 0

  const handleExpandClick = (event: any) => {
    apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded)
    apiRef.current.setCellFocus(id, field)
    event.stopPropagation()
  }

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ROW",
    item: row,
    end: async (source, monitor) => {
      const target: any = monitor.getDropResult()
      if (source && target) {
        // await updateTree(source.id, target[treeKey])
        // apiRef.current.setRowChildrenExpansion(target.id, true)

        console.log(
          "onDrop, sourceId:",
          source.id,
          "targetId:",
          target.id,
          "as:",
          target.as
        )
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId()
    })
  }))

  return (
    <Grid
      container
      justifyContent={"flex-start"}
      sx={{ overflow: "hidden", flexWrap: "nowrap" }}
    >
      <GridActionsCellItem
        ref={drag}
        icon={<DragIndicatorIcon />}
        label="Drag"
        className="textPrimary"
      />
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        {[...Array(rowNode.depth)].map((_, key) => (
          <div key={key} style={{ width: 20 }} />
        ))}
      </div>
      {filteredDescendantCount > 0 ? (
        <GridActionsCellItem
          icon={
            rowNode.childrenExpanded ? (
              <KeyboardArrowDownIcon />
            ) : (
              <KeyboardArrowRightIcon />
            )
          }
          label="Expand"
          className="textPrimary"
          onClick={handleExpandClick}
        />
      ) : (
        <GridActionsCellItem
          icon={<ShortTextIcon />}
          label="NoExpand"
          className="textPrimary"
          disabled
        />
      )}
      <GridActionsCellItem
        icon={isInEditMode ? <SaveIcon /> : <SettingsIcon />}
        label="Edit"
        className="textPrimary"
        onClick={isInEditMode ? handleSaveClick(id) : handleEditClick(id)}
      />
    </Grid>
  )
}

export default GridTreeDataGroupingCell
