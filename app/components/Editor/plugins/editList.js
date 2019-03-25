import { Editor, Document, Range, Point } from 'slate';

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
    }
  };
}

function isList(editor) {
  return !!getListItem(editor, getCurrentBlock(editor));
}

function getListDepth(editor, node) {
  const { document } = editor.value;
  return document
    .getAncestors(node.key)
    .filter(a => a.type == 'ol_list' || a.type == 'ul_list').size;
}

function increaseListDepth(editor) {
  const { value } = editor;
  const { document } = value;

  const parentList = getParentList(editor, getCurrentBlock(editor));
  const listItem = getListItem(editor, getCurrentBlock(editor));

  const selectedTexts = value.texts;

  const deepestList = document
    .getFurthest(
      getCurrentBlock(editor).key,
      a => a.type == 'ul_list' || a.type == 'ol_list'
    )
    .getTexts()
    .max((a, b) => getListDepth(editor, a) - getListDepth(editor, b));

  const maxListDepth = getListDepth(
    editor,
    document
      .getFurthest(
        getCurrentBlock(editor).key,
        a => a.type == 'ul_list' || a.type == 'ol_list'
      )
      .getTexts()
      .max((a, b) => getListDepth(editor, a) - getListDepth(editor, b))
  );
  const currentListDepth = getListDepth(editor, getCurrentBlock(editor));

  const newParentList = getParentList(editor, getCurrentBlock(editor));
  const siblingList =
    document.getPreviousSibling(newParentList.key) ||
    document.getNextSibling(newParentList.key);

  console.log(maxListDepth);
  console.log(currentListDepth);
  console.log(selectedTexts);
  if (maxListDepth > currentListDepth) {
    const deepList = getParentList(editor, deepestList);
    editor.moveNodeByKey(listItem.key, deepList.key, deepList.nodes.size);
  } else {
    editor.wrapBlockByKey(listItem.key, parentList.type);
  }
}

function decreaseListItem(editor) {}

function parentBlockType(editor) {
  const { document } = editor.value;
  const currentBlock = getCurrentBlock(editor);
  return document.getParent(currentBlock.key).type;
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
    //if the selection is in the first level, unwrap list_item also
    if (getListDepth(editor, currentBlock) == 1) {
      editor.unwrapBlock('list_item');
    }
    editor.unwrapBlock(getParentList(editor, currentBlock).type);

    // if the list is the only one of its level, do nothing
  } else if (
    !document.getPreviousSibling(getListItem(editor, currentBlock).key)
  ) {
    return next();
    // wrap the block in a new list
  } else if (!currentBlock.text) {
    increaseListDepth(editor, currentBlock);
    //editor
    //.unwrapBlock('list_item')
    //.wrapBlock(getParentList(editor, currentBlock).type)
    //.wrapBlock('list_item');
    //console.log(getParentList(editor, getCurrentBlock(editor)));
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
