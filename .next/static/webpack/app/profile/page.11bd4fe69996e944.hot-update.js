"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/profile/page",{

/***/ "(app-pages-browser)/./src/app/components/widgets/StoryThumbnail.tsx":
/*!*******************************************************!*\
  !*** ./src/app/components/widgets/StoryThumbnail.tsx ***!
  \*******************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ StoryThumbnail)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n\nfunction StoryThumbnail(param) {\n    let { story, variant = 'bubble', size = 'md', showPlayIcon = true, className = '', borderColor = '#000000' } = param;\n    // Size mappings for each variant\n    const sizes = {\n        bubble: {\n            sm: {\n                outer: 'w-[70px] h-[70px]',\n                inner: 'w-[60px] h-[60px]',\n                icon: 'w-6 h-6'\n            },\n            md: {\n                outer: 'w-[90px] h-[90px]',\n                inner: 'w-[80px] h-[80px]',\n                icon: 'w-8 h-8'\n            },\n            lg: {\n                outer: 'w-[110px] h-[110px]',\n                inner: 'w-[100px] h-[100px]',\n                icon: 'w-10 h-10'\n            }\n        },\n        'single-bubble': {\n            sm: {\n                outer: 'w-[70px] h-[70px]',\n                inner: 'w-[60px] h-[60px]',\n                icon: 'w-6 h-6'\n            },\n            md: {\n                outer: 'w-[90px] h-[90px]',\n                inner: 'w-[80px] h-[80px]',\n                icon: 'w-8 h-8'\n            },\n            lg: {\n                outer: 'w-[110px] h-[110px]',\n                inner: 'w-[100px] h-[100px]',\n                icon: 'w-10 h-10'\n            }\n        },\n        card: {\n            sm: {\n                outer: 'w-[96px] h-[128px]',\n                inner: 'w-[90px] h-[122px]',\n                icon: 'w-6 h-6'\n            },\n            md: {\n                outer: 'w-[106px] h-[138px]',\n                inner: 'w-[100px] h-[132px]',\n                icon: 'w-8 h-8'\n            },\n            lg: {\n                outer: 'w-[116px] h-[148px]',\n                inner: 'w-[110px] h-[142px]',\n                icon: 'w-10 h-10'\n            }\n        },\n        square: {\n            sm: {\n                outer: 'w-[80px] h-[80px]',\n                inner: 'w-[74px] h-[74px]',\n                icon: 'w-6 h-6'\n            },\n            md: {\n                outer: 'w-[90px] h-[90px]',\n                inner: 'w-[84px] h-[84px]',\n                icon: 'w-8 h-8'\n            },\n            lg: {\n                outer: 'w-[100px] h-[100px]',\n                inner: 'w-[94px] h-[94px]',\n                icon: 'w-10 h-10'\n            }\n        }\n    };\n    const variantClasses = {\n        bubble: 'rounded-full',\n        card: 'rounded-lg',\n        square: 'rounded-lg',\n        'single-bubble': 'rounded-full'\n    };\n    const innerVariantClasses = {\n        bubble: 'rounded-full',\n        card: 'rounded-md',\n        square: 'rounded-md',\n        'single-bubble': 'rounded-full'\n    };\n    const selectedSize = sizes[variant][size];\n    const roundedClass = variantClasses[variant];\n    const innerRoundedClass = innerVariantClasses[variant];\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"relative \".concat(className),\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            className: \"relative \".concat(selectedSize.outer, \" \").concat(roundedClass, \" border-2\"),\n            style: {\n                borderColor\n            },\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"absolute inset-0 \".concat(variant === 'card' || variant === 'square' ? 'm-[3px]' : 'm-[5px]', \" \").concat(innerRoundedClass, \" overflow-hidden\"),\n                children: (story === null || story === void 0 ? void 0 : story.thumbnail) ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"img\", {\n                            src: story.thumbnail,\n                            alt: story.title,\n                            className: \"w-full h-full object-cover\"\n                        }, void 0, false, {\n                            fileName: \"/Users/mezri/Desktop/HehoStory/src/app/components/widgets/StoryThumbnail.tsx\",\n                            lineNumber: 118,\n                            columnNumber: 15\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"absolute inset-0 \".concat(innerRoundedClass, \" bg-black/20\")\n                        }, void 0, false, {\n                            fileName: \"/Users/mezri/Desktop/HehoStory/src/app/components/widgets/StoryThumbnail.tsx\",\n                            lineNumber: 124,\n                            columnNumber: 15\n                        }, this),\n                        showPlayIcon && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"absolute inset-0 flex items-center justify-center\",\n                            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"svg\", {\n                                className: \"\".concat(selectedSize.icon, \" text-white relative z-10\"),\n                                viewBox: \"0 0 24 24\",\n                                fill: \"none\",\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"path\", {\n                                    d: \"M6 4v16l14-8L6 4z\",\n                                    fill: \"currentColor\",\n                                    strokeWidth: \"1.5\",\n                                    strokeLinecap: \"round\",\n                                    strokeLinejoin: \"round\"\n                                }, void 0, false, {\n                                    fileName: \"/Users/mezri/Desktop/HehoStory/src/app/components/widgets/StoryThumbnail.tsx\",\n                                    lineNumber: 130,\n                                    columnNumber: 21\n                                }, this)\n                            }, void 0, false, {\n                                fileName: \"/Users/mezri/Desktop/HehoStory/src/app/components/widgets/StoryThumbnail.tsx\",\n                                lineNumber: 129,\n                                columnNumber: 19\n                            }, this)\n                        }, void 0, false, {\n                            fileName: \"/Users/mezri/Desktop/HehoStory/src/app/components/widgets/StoryThumbnail.tsx\",\n                            lineNumber: 128,\n                            columnNumber: 17\n                        }, this)\n                    ]\n                }, void 0, true) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"w-full h-full bg-black/90 flex items-center justify-center\",\n                    children: showPlayIcon && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"svg\", {\n                        className: \"\".concat(selectedSize.icon, \" text-white\"),\n                        viewBox: \"0 0 24 24\",\n                        fill: \"none\",\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"path\", {\n                            d: \"M6 4v16l14-8L6 4z\",\n                            fill: \"currentColor\",\n                            strokeWidth: \"1.5\",\n                            strokeLinecap: \"round\",\n                            strokeLinejoin: \"round\"\n                        }, void 0, false, {\n                            fileName: \"/Users/mezri/Desktop/HehoStory/src/app/components/widgets/StoryThumbnail.tsx\",\n                            lineNumber: 145,\n                            columnNumber: 19\n                        }, this)\n                    }, void 0, false, {\n                        fileName: \"/Users/mezri/Desktop/HehoStory/src/app/components/widgets/StoryThumbnail.tsx\",\n                        lineNumber: 144,\n                        columnNumber: 17\n                    }, this)\n                }, void 0, false, {\n                    fileName: \"/Users/mezri/Desktop/HehoStory/src/app/components/widgets/StoryThumbnail.tsx\",\n                    lineNumber: 142,\n                    columnNumber: 13\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/mezri/Desktop/HehoStory/src/app/components/widgets/StoryThumbnail.tsx\",\n                lineNumber: 115,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/Users/mezri/Desktop/HehoStory/src/app/components/widgets/StoryThumbnail.tsx\",\n            lineNumber: 113,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/mezri/Desktop/HehoStory/src/app/components/widgets/StoryThumbnail.tsx\",\n        lineNumber: 111,\n        columnNumber: 5\n    }, this);\n}\n_c = StoryThumbnail;\nvar _c;\n$RefreshReg$(_c, \"StoryThumbnail\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9hcHAvY29tcG9uZW50cy93aWRnZXRzL1N0b3J5VGh1bWJuYWlsLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFXZSxTQUFTQSxlQUFlLEtBT2pCO1FBUGlCLEVBQ3JDQyxLQUFLLEVBQ0xDLFVBQVUsUUFBUSxFQUNsQkMsT0FBTyxJQUFJLEVBQ1hDLGVBQWUsSUFBSSxFQUNuQkMsWUFBWSxFQUFFLEVBQ2RDLGNBQWMsU0FBUyxFQUNILEdBUGlCO0lBUXJDLGlDQUFpQztJQUNqQyxNQUFNQyxRQUFRO1FBQ1pDLFFBQVE7WUFDTkMsSUFBSTtnQkFDRkMsT0FBTztnQkFDUEMsT0FBTztnQkFDUEMsTUFBTTtZQUNSO1lBQ0FDLElBQUk7Z0JBQ0ZILE9BQU87Z0JBQ1BDLE9BQU87Z0JBQ1BDLE1BQU07WUFDUjtZQUNBRSxJQUFJO2dCQUNGSixPQUFPO2dCQUNQQyxPQUFPO2dCQUNQQyxNQUFNO1lBQ1I7UUFDRjtRQUNBLGlCQUFpQjtZQUNmSCxJQUFJO2dCQUNGQyxPQUFPO2dCQUNQQyxPQUFPO2dCQUNQQyxNQUFNO1lBQ1I7WUFDQUMsSUFBSTtnQkFDRkgsT0FBTztnQkFDUEMsT0FBTztnQkFDUEMsTUFBTTtZQUNSO1lBQ0FFLElBQUk7Z0JBQ0ZKLE9BQU87Z0JBQ1BDLE9BQU87Z0JBQ1BDLE1BQU07WUFDUjtRQUNGO1FBQ0FHLE1BQU07WUFDSk4sSUFBSTtnQkFDRkMsT0FBTztnQkFDUEMsT0FBTztnQkFDUEMsTUFBTTtZQUNSO1lBQ0FDLElBQUk7Z0JBQ0ZILE9BQU87Z0JBQ1BDLE9BQU87Z0JBQ1BDLE1BQU07WUFDUjtZQUNBRSxJQUFJO2dCQUNGSixPQUFPO2dCQUNQQyxPQUFPO2dCQUNQQyxNQUFNO1lBQ1I7UUFDRjtRQUNBSSxRQUFRO1lBQ05QLElBQUk7Z0JBQ0ZDLE9BQU87Z0JBQ1BDLE9BQU87Z0JBQ1BDLE1BQU07WUFDUjtZQUNBQyxJQUFJO2dCQUNGSCxPQUFPO2dCQUNQQyxPQUFPO2dCQUNQQyxNQUFNO1lBQ1I7WUFDQUUsSUFBSTtnQkFDRkosT0FBTztnQkFDUEMsT0FBTztnQkFDUEMsTUFBTTtZQUNSO1FBQ0Y7SUFDRjtJQUVBLE1BQU1LLGlCQUFpQjtRQUNyQlQsUUFBUTtRQUNSTyxNQUFNO1FBQ05DLFFBQVE7UUFDUixpQkFBaUI7SUFDbkI7SUFFQSxNQUFNRSxzQkFBc0I7UUFDMUJWLFFBQVE7UUFDUk8sTUFBTTtRQUNOQyxRQUFRO1FBQ1IsaUJBQWlCO0lBQ25CO0lBRUEsTUFBTUcsZUFBZVosS0FBSyxDQUFDTCxRQUFRLENBQUNDLEtBQUs7SUFDekMsTUFBTWlCLGVBQWVILGNBQWMsQ0FBQ2YsUUFBUTtJQUM1QyxNQUFNbUIsb0JBQW9CSCxtQkFBbUIsQ0FBQ2hCLFFBQVE7SUFFdEQscUJBQ0UsOERBQUNvQjtRQUFJakIsV0FBVyxZQUFzQixPQUFWQTtrQkFFMUIsNEVBQUNpQjtZQUFJakIsV0FBVyxZQUFrQ2UsT0FBdEJELGFBQWFULEtBQUssRUFBQyxLQUFnQixPQUFiVSxjQUFhO1lBQVlHLE9BQU87Z0JBQUVqQjtZQUFZO3NCQUU5Riw0RUFBQ2dCO2dCQUFJakIsV0FBVyxvQkFBMEZnQixPQUF0RW5CLFlBQVksVUFBVUEsWUFBWSxXQUFXLFlBQVksV0FBVSxLQUFxQixPQUFsQm1CLG1CQUFrQjswQkFDekhwQixDQUFBQSxrQkFBQUEsNEJBQUFBLE1BQU91QixTQUFTLGtCQUNmOztzQ0FDRSw4REFBQ0M7NEJBQ0NDLEtBQUt6QixNQUFNdUIsU0FBUzs0QkFDcEJHLEtBQUsxQixNQUFNMkIsS0FBSzs0QkFDaEJ2QixXQUFVOzs7Ozs7c0NBR1osOERBQUNpQjs0QkFBSWpCLFdBQVcsb0JBQXNDLE9BQWxCZ0IsbUJBQWtCOzs7Ozs7d0JBR3JEakIsOEJBQ0MsOERBQUNrQjs0QkFBSWpCLFdBQVU7c0NBQ2IsNEVBQUN3QjtnQ0FBSXhCLFdBQVcsR0FBcUIsT0FBbEJjLGFBQWFQLElBQUksRUFBQztnQ0FBNEJrQixTQUFRO2dDQUFZQyxNQUFLOzBDQUN4Riw0RUFBQ0M7b0NBQ0NDLEdBQUU7b0NBQ0ZGLE1BQUs7b0NBQ0xHLGFBQVk7b0NBQ1pDLGVBQWM7b0NBQ2RDLGdCQUFlOzs7Ozs7Ozs7Ozs7Ozs7OztpREFPekIsOERBQUNkO29CQUFJakIsV0FBVTs4QkFDWkQsOEJBQ0MsOERBQUN5Qjt3QkFBSXhCLFdBQVcsR0FBcUIsT0FBbEJjLGFBQWFQLElBQUksRUFBQzt3QkFBY2tCLFNBQVE7d0JBQVlDLE1BQUs7a0NBQzFFLDRFQUFDQzs0QkFDQ0MsR0FBRTs0QkFDRkYsTUFBSzs0QkFDTEcsYUFBWTs0QkFDWkMsZUFBYzs0QkFDZEMsZ0JBQWU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFVbkM7S0FwSndCcEMiLCJzb3VyY2VzIjpbIi9Vc2Vycy9tZXpyaS9EZXNrdG9wL0hlaG9TdG9yeS9zcmMvYXBwL2NvbXBvbmVudHMvd2lkZ2V0cy9TdG9yeVRodW1ibmFpbC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RvcnkgfSBmcm9tICcuLi9TdG9yaWVzTGlzdCdcblxuaW50ZXJmYWNlIFN0b3J5VGh1bWJuYWlsUHJvcHMge1xuICBzdG9yeT86IFN0b3J5XG4gIHZhcmlhbnQ/OiAnYnViYmxlJyB8ICdjYXJkJyB8ICdzcXVhcmUnIHwgJ3NpbmdsZS1idWJibGUnXG4gIHNpemU/OiAnc20nIHwgJ21kJyB8ICdsZydcbiAgc2hvd1BsYXlJY29uPzogYm9vbGVhblxuICBjbGFzc05hbWU/OiBzdHJpbmdcbiAgYm9yZGVyQ29sb3I/OiBzdHJpbmdcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3RvcnlUaHVtYm5haWwoeyBcbiAgc3RvcnksXG4gIHZhcmlhbnQgPSAnYnViYmxlJyxcbiAgc2l6ZSA9ICdtZCcsXG4gIHNob3dQbGF5SWNvbiA9IHRydWUsXG4gIGNsYXNzTmFtZSA9ICcnLFxuICBib3JkZXJDb2xvciA9ICcjMDAwMDAwJ1xufTogU3RvcnlUaHVtYm5haWxQcm9wcykge1xuICAvLyBTaXplIG1hcHBpbmdzIGZvciBlYWNoIHZhcmlhbnRcbiAgY29uc3Qgc2l6ZXMgPSB7XG4gICAgYnViYmxlOiB7XG4gICAgICBzbToge1xuICAgICAgICBvdXRlcjogJ3ctWzcwcHhdIGgtWzcwcHhdJyxcbiAgICAgICAgaW5uZXI6ICd3LVs2MHB4XSBoLVs2MHB4XScsXG4gICAgICAgIGljb246ICd3LTYgaC02J1xuICAgICAgfSxcbiAgICAgIG1kOiB7XG4gICAgICAgIG91dGVyOiAndy1bOTBweF0gaC1bOTBweF0nLFxuICAgICAgICBpbm5lcjogJ3ctWzgwcHhdIGgtWzgwcHhdJyxcbiAgICAgICAgaWNvbjogJ3ctOCBoLTgnXG4gICAgICB9LFxuICAgICAgbGc6IHtcbiAgICAgICAgb3V0ZXI6ICd3LVsxMTBweF0gaC1bMTEwcHhdJyxcbiAgICAgICAgaW5uZXI6ICd3LVsxMDBweF0gaC1bMTAwcHhdJyxcbiAgICAgICAgaWNvbjogJ3ctMTAgaC0xMCdcbiAgICAgIH1cbiAgICB9LFxuICAgICdzaW5nbGUtYnViYmxlJzoge1xuICAgICAgc206IHtcbiAgICAgICAgb3V0ZXI6ICd3LVs3MHB4XSBoLVs3MHB4XScsXG4gICAgICAgIGlubmVyOiAndy1bNjBweF0gaC1bNjBweF0nLFxuICAgICAgICBpY29uOiAndy02IGgtNidcbiAgICAgIH0sXG4gICAgICBtZDoge1xuICAgICAgICBvdXRlcjogJ3ctWzkwcHhdIGgtWzkwcHhdJyxcbiAgICAgICAgaW5uZXI6ICd3LVs4MHB4XSBoLVs4MHB4XScsXG4gICAgICAgIGljb246ICd3LTggaC04J1xuICAgICAgfSxcbiAgICAgIGxnOiB7XG4gICAgICAgIG91dGVyOiAndy1bMTEwcHhdIGgtWzExMHB4XScsXG4gICAgICAgIGlubmVyOiAndy1bMTAwcHhdIGgtWzEwMHB4XScsXG4gICAgICAgIGljb246ICd3LTEwIGgtMTAnXG4gICAgICB9XG4gICAgfSxcbiAgICBjYXJkOiB7XG4gICAgICBzbToge1xuICAgICAgICBvdXRlcjogJ3ctWzk2cHhdIGgtWzEyOHB4XScsXG4gICAgICAgIGlubmVyOiAndy1bOTBweF0gaC1bMTIycHhdJyxcbiAgICAgICAgaWNvbjogJ3ctNiBoLTYnXG4gICAgICB9LFxuICAgICAgbWQ6IHtcbiAgICAgICAgb3V0ZXI6ICd3LVsxMDZweF0gaC1bMTM4cHhdJyxcbiAgICAgICAgaW5uZXI6ICd3LVsxMDBweF0gaC1bMTMycHhdJyxcbiAgICAgICAgaWNvbjogJ3ctOCBoLTgnXG4gICAgICB9LFxuICAgICAgbGc6IHtcbiAgICAgICAgb3V0ZXI6ICd3LVsxMTZweF0gaC1bMTQ4cHhdJyxcbiAgICAgICAgaW5uZXI6ICd3LVsxMTBweF0gaC1bMTQycHhdJyxcbiAgICAgICAgaWNvbjogJ3ctMTAgaC0xMCdcbiAgICAgIH1cbiAgICB9LFxuICAgIHNxdWFyZToge1xuICAgICAgc206IHtcbiAgICAgICAgb3V0ZXI6ICd3LVs4MHB4XSBoLVs4MHB4XScsXG4gICAgICAgIGlubmVyOiAndy1bNzRweF0gaC1bNzRweF0nLFxuICAgICAgICBpY29uOiAndy02IGgtNidcbiAgICAgIH0sXG4gICAgICBtZDoge1xuICAgICAgICBvdXRlcjogJ3ctWzkwcHhdIGgtWzkwcHhdJyxcbiAgICAgICAgaW5uZXI6ICd3LVs4NHB4XSBoLVs4NHB4XScsXG4gICAgICAgIGljb246ICd3LTggaC04J1xuICAgICAgfSxcbiAgICAgIGxnOiB7XG4gICAgICAgIG91dGVyOiAndy1bMTAwcHhdIGgtWzEwMHB4XScsXG4gICAgICAgIGlubmVyOiAndy1bOTRweF0gaC1bOTRweF0nLFxuICAgICAgICBpY29uOiAndy0xMCBoLTEwJ1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHZhcmlhbnRDbGFzc2VzID0ge1xuICAgIGJ1YmJsZTogJ3JvdW5kZWQtZnVsbCcsXG4gICAgY2FyZDogJ3JvdW5kZWQtbGcnLFxuICAgIHNxdWFyZTogJ3JvdW5kZWQtbGcnLFxuICAgICdzaW5nbGUtYnViYmxlJzogJ3JvdW5kZWQtZnVsbCdcbiAgfVxuXG4gIGNvbnN0IGlubmVyVmFyaWFudENsYXNzZXMgPSB7XG4gICAgYnViYmxlOiAncm91bmRlZC1mdWxsJyxcbiAgICBjYXJkOiAncm91bmRlZC1tZCcsXG4gICAgc3F1YXJlOiAncm91bmRlZC1tZCcsXG4gICAgJ3NpbmdsZS1idWJibGUnOiAncm91bmRlZC1mdWxsJ1xuICB9XG5cbiAgY29uc3Qgc2VsZWN0ZWRTaXplID0gc2l6ZXNbdmFyaWFudF1bc2l6ZV1cbiAgY29uc3Qgcm91bmRlZENsYXNzID0gdmFyaWFudENsYXNzZXNbdmFyaWFudF1cbiAgY29uc3QgaW5uZXJSb3VuZGVkQ2xhc3MgPSBpbm5lclZhcmlhbnRDbGFzc2VzW3ZhcmlhbnRdXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT17YHJlbGF0aXZlICR7Y2xhc3NOYW1lfWB9PlxuICAgICAgey8qIE91dGVyIGNvbnRhaW5lciAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgcmVsYXRpdmUgJHtzZWxlY3RlZFNpemUub3V0ZXJ9ICR7cm91bmRlZENsYXNzfSBib3JkZXItMmB9IHN0eWxlPXt7IGJvcmRlckNvbG9yIH19PlxuICAgICAgICB7LyogSW5uZXIgY29udGFpbmVyICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGFic29sdXRlIGluc2V0LTAgJHt2YXJpYW50ID09PSAnY2FyZCcgfHwgdmFyaWFudCA9PT0gJ3NxdWFyZScgPyAnbS1bM3B4XScgOiAnbS1bNXB4XSd9ICR7aW5uZXJSb3VuZGVkQ2xhc3N9IG92ZXJmbG93LWhpZGRlbmB9PlxuICAgICAgICAgIHtzdG9yeT8udGh1bWJuYWlsID8gKFxuICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgPGltZyBcbiAgICAgICAgICAgICAgICBzcmM9e3N0b3J5LnRodW1ibmFpbH0gXG4gICAgICAgICAgICAgICAgYWx0PXtzdG9yeS50aXRsZX0gXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGgtZnVsbCBvYmplY3QtY292ZXJcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICB7LyogT3ZlcmxheSAqL31cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BhYnNvbHV0ZSBpbnNldC0wICR7aW5uZXJSb3VuZGVkQ2xhc3N9IGJnLWJsYWNrLzIwYH0gLz5cbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIHsvKiBQbGF5IGljb24gKi99XG4gICAgICAgICAgICAgIHtzaG93UGxheUljb24gJiYgKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgPHN2ZyBjbGFzc05hbWU9e2Ake3NlbGVjdGVkU2l6ZS5pY29ufSB0ZXh0LXdoaXRlIHJlbGF0aXZlIHotMTBgfSB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIj5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggXG4gICAgICAgICAgICAgICAgICAgICAgZD1cIk02IDR2MTZsMTQtOEw2IDR6XCIgXG4gICAgICAgICAgICAgICAgICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiIFxuICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoPVwiMS41XCIgXG4gICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgXG4gICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctZnVsbCBoLWZ1bGwgYmctYmxhY2svOTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIj5cbiAgICAgICAgICAgICAge3Nob3dQbGF5SWNvbiAmJiAoXG4gICAgICAgICAgICAgICAgPHN2ZyBjbGFzc05hbWU9e2Ake3NlbGVjdGVkU2l6ZS5pY29ufSB0ZXh0LXdoaXRlYH0gdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCI+XG4gICAgICAgICAgICAgICAgICA8cGF0aCBcbiAgICAgICAgICAgICAgICAgICAgZD1cIk02IDR2MTZsMTQtOEw2IDR6XCIgXG4gICAgICAgICAgICAgICAgICAgIGZpbGw9XCJjdXJyZW50Q29sb3JcIiBcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg9XCIxLjVcIiBcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgXG4gICAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn0gIl0sIm5hbWVzIjpbIlN0b3J5VGh1bWJuYWlsIiwic3RvcnkiLCJ2YXJpYW50Iiwic2l6ZSIsInNob3dQbGF5SWNvbiIsImNsYXNzTmFtZSIsImJvcmRlckNvbG9yIiwic2l6ZXMiLCJidWJibGUiLCJzbSIsIm91dGVyIiwiaW5uZXIiLCJpY29uIiwibWQiLCJsZyIsImNhcmQiLCJzcXVhcmUiLCJ2YXJpYW50Q2xhc3NlcyIsImlubmVyVmFyaWFudENsYXNzZXMiLCJzZWxlY3RlZFNpemUiLCJyb3VuZGVkQ2xhc3MiLCJpbm5lclJvdW5kZWRDbGFzcyIsImRpdiIsInN0eWxlIiwidGh1bWJuYWlsIiwiaW1nIiwic3JjIiwiYWx0IiwidGl0bGUiLCJzdmciLCJ2aWV3Qm94IiwiZmlsbCIsInBhdGgiLCJkIiwic3Ryb2tlV2lkdGgiLCJzdHJva2VMaW5lY2FwIiwic3Ryb2tlTGluZWpvaW4iXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/app/components/widgets/StoryThumbnail.tsx\n"));

/***/ })

});