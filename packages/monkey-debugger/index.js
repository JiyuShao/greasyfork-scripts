// ==UserScript==
// @name         MonkeyDebugger
// @namespace    https://github.com/JiyuShao/greasyfork-scripts
// @version      2024-05-23
// @description  Debug js using monkey patch
// @author       Jiyu Shao <jiyu.shao@gmail.com>
// @license      MIT
// @match        *://*/*
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @require https://update.greasyfork.org/scripts/496315/1384535/QuickMenu.js
// ==/UserScript==

/* eslint-disable no-eval */
(function () {
  'use strict';

  // 定义通用的补丁代码给 new Function 与 eval 使用
  const patchCode = `
    debugger;
  `;

  QuickMenu.add({
    name: '开启 new Function 调试',
    type: 'toggle',
    shouldInitRun: true,
    shouldAddMenu: () => {
      return unsafeWindow === unsafeWindow.top;
    },
    callback: (value) => {
      // 保存原始的 Function 构造器
      const originalFunction = Function.originalFunction
        ? Function.originalFunction
        : Function;
      Function.originalFunction = originalFunction;
      if (value === 'on') {
        // 定义一个新的 Function 构造器
        const patchedFunction = function (...args) {
          // 在构造的函数代码前插入 debugger 语句
          const codeWithDebugger = `${patchCode}; ${args[0]}`;
          return originalFunction.call(
            this,
            codeWithDebugger,
            ...args.slice(1)
          );
        };
        patchedFunction.prototype = originalFunction.prototype;
        // 替换全局的 Function
        unsafeWindow.Function = patchedFunction;
      } else if (value === 'off') {
        unsafeWindow.Function = originalFunction;
      }
    },
  });

  QuickMenu.add({
    name: '开启 eval 调试',
    type: 'toggle',
    shouldInitRun: true,
    shouldAddMenu: () => {
      return unsafeWindow === unsafeWindow.top;
    },
    callback: (value) => {
      // 保存原始的 eval 函数
      const originalEval = eval.originalEval ? eval.originalEval : eval;
      eval.originalEval = originalEval;
      if (value === 'on') {
        // 定义一个新的 eval 函数
        const patchedEval = function (code) {
          // 在 eval 的代码前插入 debugger 语句
          const codeWithDebugger = `${patchCode}; ${code}`;
          return originalEval(codeWithDebugger);
        };
        patchedEval.prototype = originalEval.prototype;
        // 替换全局的 eval 函数
        unsafeWindow.eval = patchedEval;
      } else if (value === 'off') {
        unsafeWindow.eval = originalEval;
      }
    },
  });

  QuickMenu.add({
    name: '清空缓存',
    type: 'button',
    shouldInitRun: false,
    shouldAddMenu: () => {
      return unsafeWindow === unsafeWindow.top;
    },
    callback: () => {
      QuickMenu.clearStore();
    },
  });
})();
