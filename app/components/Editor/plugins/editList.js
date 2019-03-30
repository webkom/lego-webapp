/*  This plugin defines a set of commands and querys to edit lists
 *  as well as key handlers for running these commands.
 *
 *  Commands:
 *    increaeListDepth(editor) => void, increase the list depth of a selected list item
 *    decreaseListDepth(editor) => void, decrease the list depth of a selected list item
 *    setListType(editor, type: string) => void, sets the type of list or makes list TODO
 *
 *  Queries:
 *    isList(editor) => boolean, returns true if there is a list in the current selection
 *    getListDepth(editor, node) => integer, returns the list depth of a node
 *      (how many of the nodes ancestors are lists)
 *    getListItem(editor, node) => node, return the closest list item ancestor of a node
 *    getParentList(editor, node) => node, returns the closest list node ancestor of a node
 */

export default function editList(options) {
  return {
    onKeyDown(event, editor, next) {
      switch (event.key) {
        case 'Enter': {
          if (!isList(editor)) return next();
          event.preventDefault();
          handleEnter(editor, event);
          break;
        }

        case 'Backspace': {
          if (!isList(editor)) return next();
          handleBackspace(editor, event, next);
          break;
        }

        case 'Tab': {
          if (!isList(editor)) return next();
          event.preventDefault();
          handleTab(editor, event, next);
          break;
        }

        default:
          return next();
      }
    },
    commands: {
      increaseListDepth,
      decreaseListDepth,
      setListType
    },
    queries: {
      isList,
      getListDepth,
      getListItem,
      getParentList
    }
  };
}

function handleEnter(editor, event) {
  const currentBlock = getCurrentBlock(editor);
  // split the lowest level block on shift+enter
  if (event.shiftKey) {
    return editor.splitBlock();
  }
  // unwrap lowest level block from list_item and list if empty
  if (!currentBlock.text) {
    if (getListDepth(editor, currentBlock) == 1)
      editor.unwrapBlock('list_item');
    editor.unwrapBlock(getParentList(editor, currentBlock).type);
    // split the list_item block
  } else {
    editor.splitBlock(2);
  }
}

function handleBackspace(editor, event, next) {
  const currentBlock = getCurrentBlock(editor);

  // unwrap and remove the current node if its empty
  if (!currentBlock.text) {
    event.preventDefault();
    editor
      .unwrapBlock('list_item')
      .unwrapBlock(getParentList(editor, currentBlock).type)
      .removeNodeByKey(getCurrentBlock(editor).key);
  } else {
    return next();
  }
}

function handleTab(editor, event, next) {
  const currentBlock = getCurrentBlock(editor);
  const { document } = editor.value;

  // unwrap when holding shift
  if (event.shiftKey) {
    decreaseListDepth(editor);
  } else if (
    !document.getPreviousSibling(getListItem(editor, currentBlock).key)
  ) {
    // if the list is the only one of its level, do nothing
    return next();
  } else if (!currentBlock.text) {
    // If the list has no text, increse the depth
    increaseListDepth(editor, currentBlock);
  }
}

function getCurrentBlock(editor) {
  return editor.value.startBlock;
}

function getListItem(editor, node) {
  return editor.value.document.getClosest(node.key, a => a.type == 'list_item');
}

function getParentList(editor, node) {
  const { document } = editor.value;

  return document.getClosest(
    node.key,
    a => a.type == 'ul_list' || a.type == 'ol_list'
  );
}

function isList(editor) {
  return !!getListItem(editor, getCurrentBlock(editor));
}

function getListDepth(editor, node) {
  // Returns the amount of ancestor lists of a node
  const { document } = editor.value;
  return document
    .getAncestors(node.key)
    .filter(a => a.type == 'ol_list' || a.type == 'ul_list').size;
}

function increaseListDepth(editor) {
  /* Increases the depth of the current list item in the selection:
   * If the previous (sibling) node is an list (ol or ul), the current
   * list item is moved into that node. If its a list item, wrap the current
   * list item in the appropriate list type.
   */

  const { value } = editor;
  const { document } = value;

  const parentList = getParentList(editor, getCurrentBlock(editor));
  const listItem = getListItem(editor, getCurrentBlock(editor));
  const siblingList = document.getPreviousSibling(listItem.key);

  // If the siblinglist exists and is an ul or ol, move the list item into it.
  if (
    siblingList &&
    (siblingList.type == 'ol_list' || siblingList.type == 'ul_list')
  ) {
    editor.moveNodeByKey(listItem.key, siblingList.key, siblingList.nodes.size);
    // Else, wrap the item in a new list
  } else {
    editor.wrapBlockByKey(listItem.key, parentList.type);
  }
}

function decreaseListDepth(editor) {
  /* Decreases the depth of the current list item in the selection:
   * If the parent list is the top level list, unwrap the list item.
   * Always unwraps the list
   */

  const currentBlock = getCurrentBlock(editor);
  const parentList = getParentList(editor, currentBlock);

  //if the list is the top level, unwrap list_item also
  if (getListDepth(editor, currentBlock) == 1) {
    editor.unwrapBlock('list_item');
  }
  editor.unwrapBlock(parentList.type);
}

function setListType(editor, type) {
  /*  Sets the type of the list in the current selection.
   *  If there is no list, wraps the current block in a list of the specified type
   */

  const parentList = getParentList(editor, getCurrentBlock(editor));

  if (parentList) {
    if (parentList.type != type) editor.setNodeByKey(parentList.key, type);
    else editor.decreaseListDepth();
  } else {
    editor.wrapBlock(type).wrapBlock('list_item');
  }
}
