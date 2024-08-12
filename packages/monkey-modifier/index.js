// ==UserScript==
// @name         MonkeyModifier
// @namespace    https://github.com/JiyuShao/greasyfork-scripts
// @version      2024-08-12
// @description  Change webpage content
// @author       Jiyu Shao <jiyu.shao@gmail.com>
// @license      MIT
// @match        *://*/*
// @run-at       document-start
// @grant        unsafeWindow
// ==/UserScript==

(function () {
  'use strict';
  // ################### common tools
  function replaceTextInNode(node, originalText, replaceText) {
    // 如果当前节点是文本节点并且包含 originalText
    if (node instanceof Text && node.textContent.includes(originalText)) {
      // 替换文本
      node.textContent = node.textContent.replace(originalText, replaceText);
    }

    // 如果当前节点有子节点，递归处理每个子节点
    if (node.hasChildNodes()) {
      node.childNodes.forEach((child) => {
        replaceTextInNode(child, originalText, replaceText);
      });
    }
  }

  function registerMutationObserver(node, config = {}, options = {}) {
    const finalConfig = {
      attributes: false,
      childList: true,
      subtree: true,
      ...config,
    };

    const finalOptions = {
      // 元素的属性发生了变化
      attributes: options.attributes || [],
      // 子节点列表发生了变化
      childList: {
        addedNodes:
          options.childList.addedNodes ||
          [
            // {
            //   filter: (node) => {},
            //   action: (node) => {},
            // }
          ],
        removedNodes: options.childList.removedNodes || [],
      },
      // 文本节点的内容发生了变化
      characterData: options.characterData || [],
    };

    const observer = new MutationObserver((mutationsList, _observer) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          finalOptions.attributes.forEach(({ filter, action }) => {
            try {
              if (filter(mutation.target, mutation)) {
                action(mutation.target, mutation);
              }
            } catch (error) {
              console.error(
                'MutationObserver attributes callback failed:',
                mutation.target,
                error
              );
            }
          });
        }
        if (mutation.type === 'childList') {
          // 检查是否有新增的元素
          mutation.addedNodes.forEach((node) => {
            finalOptions.childList.addedNodes.forEach(({ filter, action }) => {
              try {
                if (filter(node, mutation)) {
                  action(node, mutation);
                }
              } catch (error) {
                console.error(
                  'MutationObserver childList.addedNodes callback failed:',
                  node,
                  error
                );
              }
            });
          });

          // 检查是否有删除元素
          mutation.removedNodes.forEach((node) => {
            finalOptions.childList.removedNodes.forEach((filter, action) => {
              try {
                if (filter(node, mutation)) {
                  action(node, mutation);
                }
              } catch (error) {
                console.error(
                  'MutationObserver childList.removedNodes callback failed:',
                  node,
                  error
                );
              }
            });
          });
        }
        if (mutation.type === 'characterData') {
          finalOptions.characterData.forEach(({ filter, action }) => {
            try {
              if (filter(mutation.target, mutation)) {
                action(mutation.target, mutation);
              }
            } catch (error) {
              console.error(
                'MutationObserver characterData callback failed:',
                mutation.target,
                error
              );
            }
          });
        }
      });
    });
    observer.observe(node, finalConfig);
    return observer;
  }

  // ################### 加载前插入样式覆盖
  const style = document.createElement('style');
  const cssRules = `
    .dropdown-submenu--viewmode {
      display: none !important;
    }
    [field=modified] {
      display: none !important;
    }

    [data-value=modified] {
      display: none !important;
    }
    [data-value=lastmodify] {
      display: none !important;
    }

    [data-grid-field=modified] {
      display: none !important;
    }

    [data-field-key=modified] {
      display: none !important;
    }

    #Revisions {
      display: none !important;
    }

    #ContentModified {
      display: none !important;
    }

    [title="最后修改时间"] {
      display: none !important;
    }

    .left-tree-bottom__manager-company--wide {
      display: none !important;
    }

    .left-tree-narrow .left-tree-bottom__personal--icons > a:nth-child(1) {
      display: none !important;
    }
  `;
  style.appendChild(document.createTextNode(cssRules));
  unsafeWindow.document.head.appendChild(style);

  // ################### 网页内容加载完成立即执行脚本
  unsafeWindow.addEventListener('DOMContentLoaded', function () {
    // 监听任务右侧基本信息
    const taskRightInfoEles =
      unsafeWindow.document.querySelectorAll('#ContentModified');
    taskRightInfoEles.forEach((element) => {
      const parentDiv = element.closest('div.left_3_col');
      if (parentDiv) {
        parentDiv.style.display = 'none';
      }
    });
  });

  // ################### 加载完成动态监听
  unsafeWindow.addEventListener('load', function () {
    registerMutationObserver(
      unsafeWindow.document.body,
      {
        attributes: false,
        childList: true,
        subtree: true,
      },
      {
        childList: {
          addedNodes: [
            // 动态文本替换问题
            {
              filter: (node, _mutation) => {
                return node.textContent.includes('最后修改时间');
              },
              action: (node, _mutation) => {
                replaceTextInNode(node, '最后修改时间', '迭代修改时间');
              },
            },
            // 监听动态弹窗 隐藏设置列表字段-最后修改时间左侧
            {
              filter: (node, _mutation) => {
                return (
                  node.querySelectorAll &&
                  node.querySelectorAll('input[value=modified]').length > 0
                );
              },
              action: (node, _mutation) => {
                node
                  .querySelectorAll('input[value=modified]')
                  .forEach((ele) => {
                    const parentDiv = ele.closest('div.field');
                    if (parentDiv) {
                      parentDiv.style.display = 'none';
                    }
                  });
              },
            },
            // 监听动态弹窗 隐藏设置列表字段-最后修改时间右侧
            {
              filter: (node, _mutation) => {
                return (
                  node.querySelectorAll &&
                  node.querySelectorAll('span[title=最后修改时间]').length > 0
                );
              },
              action: (node, _mutation) => {
                node
                  .querySelectorAll('span[title=最后修改时间]')
                  .forEach((ele) => {
                    const parentDiv = ele.closest('div[role=treeitem]');
                    if (parentDiv) {
                      parentDiv.style.display = 'none';
                    }
                  });
              },
            },
          ],
        },
      }
    );
  });
})();
